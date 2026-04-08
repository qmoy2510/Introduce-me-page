const AV_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY
const FH_KEY = import.meta.env.VITE_FINNHUB_KEY
const AV_BASE = 'https://www.alphavantage.co/query'
const FH_BASE = 'https://finnhub.io/api/v1'

const CACHE_TTL = 5 * 60 * 1000 // 5분

// ── Alpha Vantage 전역 Rate Limiter (분당 5회 = 13초 간격) ──
const AV_INTERVAL = 13000
let avLastCall = 0
const avQueue = []
let avRunning = false

function runAvQueue() {
  if (avRunning || avQueue.length === 0) return
  avRunning = true

  function next() {
    if (avQueue.length === 0) { avRunning = false; return }
    const now = Date.now()
    const wait = Math.max(0, avLastCall + AV_INTERVAL - now)
    setTimeout(async () => {
      const { url, resolve, reject } = avQueue.shift()
      avLastCall = Date.now()
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        resolve(await res.json())
      } catch (e) {
        reject(e)
      }
      next()
    }, wait)
  }
  next()
}

function avFetch(url) {
  return new Promise((resolve, reject) => {
    avQueue.push({ url, resolve, reject })
    runAvQueue()
  })
}

// ── 캐시 ──
function getCached(key) {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp < CACHE_TTL) return data
  } catch { /* ignore */ }
  return null
}

function setCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }))
  } catch { /* ignore */ }
}

async function fetchAV(cacheKey, url) {
  const cached = getCached(cacheKey)
  if (cached) return cached
  const data = await avFetch(url)
  setCache(cacheKey, data)
  return data
}

// ── API 함수 ──
export const getQuote = (symbol) =>
  fetchAV(`quote_${symbol}`, `${AV_BASE}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${AV_KEY}`)

export const getDailyChart = (symbol) =>
  fetchAV(`daily_${symbol}`, `${AV_BASE}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${AV_KEY}`)

export const getExchangeRate = (from, to) =>
  fetchAV(`fx_${from}_${to}`, `${AV_BASE}?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${AV_KEY}`)

export const getSectorPerformance = () =>
  fetchAV('sector_perf', `${AV_BASE}?function=SECTOR&apikey=${AV_KEY}`)

export const getFearGreed = () => {
  const cached = getCached('fear_greed')
  if (cached) return Promise.resolve(cached)
  return fetch('https://api.alternative.me/fng/?limit=1')
    .then(r => r.json())
    .then(data => { setCache('fear_greed', data); return data })
}

export const getMarketNews = () => {
  const cached = getCached('market_news')
  if (cached) return Promise.resolve(cached)
  return fetch(`${FH_BASE}/news?category=general&token=${FH_KEY}`)
    .then(r => r.json())
    .then(data => { setCache('market_news', data); return data })
}

export const searchSymbol = (keyword) =>
  fetch(`${AV_BASE}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(keyword)}&apikey=${AV_KEY}`)
    .then(r => r.json())
