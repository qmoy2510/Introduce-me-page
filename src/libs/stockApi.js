const AV_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY
const FH_KEY = import.meta.env.VITE_FINNHUB_KEY
const AV_BASE = 'https://www.alphavantage.co/query'
const FH_BASE = 'https://finnhub.io/api/v1'

const CACHE_TTL = 5 * 60 * 1000 // 5분

function getCached(key) {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw)
    if (Date.now() - timestamp < CACHE_TTL) return data
  } catch {
    // ignore
  }
  return null
}

function setCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }))
  } catch {
    // ignore
  }
}

async function fetchWithCache(cacheKey, url) {
  const cached = getCached(cacheKey)
  if (cached) return cached
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  setCache(cacheKey, data)
  return data
}

export const getQuote = (symbol) =>
  fetchWithCache(
    `quote_${symbol}`,
    `${AV_BASE}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${AV_KEY}`
  )

export const getDailyChart = (symbol) =>
  fetchWithCache(
    `daily_${symbol}`,
    `${AV_BASE}?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${AV_KEY}`
  )

export const getExchangeRate = (from, to) =>
  fetchWithCache(
    `fx_${from}_${to}`,
    `${AV_BASE}?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${AV_KEY}`
  )

export const getSectorPerformance = () =>
  fetchWithCache(
    'sector_perf',
    `${AV_BASE}?function=SECTOR&apikey=${AV_KEY}`
  )

export const getFearGreed = () =>
  fetchWithCache(
    'fear_greed',
    'https://api.alternative.me/fng/?limit=1'
  )

export const getMarketNews = () =>
  fetchWithCache(
    'market_news',
    `${FH_BASE}/news?category=general&token=${FH_KEY}`
  )

export const searchSymbol = (keyword) =>
  fetch(`${AV_BASE}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(keyword)}&apikey=${AV_KEY}`)
    .then(r => r.json())
