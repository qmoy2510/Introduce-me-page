const TD_KEY = import.meta.env.VITE_TWELVE_DATA_KEY
const AV_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY
const FH_KEY = import.meta.env.VITE_FINNHUB_KEY
const TD_BASE = 'https://api.twelvedata.com'
const AV_BASE = 'https://www.alphavantage.co/query'
const FH_BASE = 'https://finnhub.io/api/v1'

const CACHE_TTL = 5 * 60 * 1000

// ── Twelve Data Rate Limiter (분당 8회 = 8초 간격) ──
const TD_INTERVAL = 8000
let tdLastCall = 0
const tdQueue = []
let tdRunning = false

function runTdQueue() {
  if (tdRunning || tdQueue.length === 0) return
  tdRunning = true
  function next() {
    if (tdQueue.length === 0) { tdRunning = false; return }
    const wait = Math.max(0, tdLastCall + TD_INTERVAL - Date.now())
    setTimeout(async () => {
      const { url, resolve, reject } = tdQueue.shift()
      tdLastCall = Date.now()
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

function tdFetch(url) {
  return new Promise((resolve, reject) => {
    tdQueue.push({ url, resolve, reject })
    runTdQueue()
  })
}

// ── 캐시 ──
function getCached(key) {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts < CACHE_TTL) return data
  } catch { /* ignore */ }
  return null
}

function setCache(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }))
  } catch { /* ignore */ }
}

// ── 응답 정규화 ──
// 모든 컴포넌트는 아래 포맷만 사용
// quote: { price, open, high, low, volume, change, changePct, prevClose }
// chart: [{ date, open, high, low, close, volume }]  (oldest → newest)

function normalizeTdQuote(raw) {
  if (!raw || raw.status === 'error') return null
  return {
    price:     parseFloat(raw.close),
    open:      parseFloat(raw.open),
    high:      parseFloat(raw.high),
    low:       parseFloat(raw.low),
    volume:    parseInt(raw.volume),
    change:    parseFloat(raw.change),
    changePct: parseFloat(raw.percent_change),
    prevClose: parseFloat(raw.previous_close),
  }
}

function normalizeTdChart(raw) {
  if (!raw || raw.status === 'error' || !raw.values) return []
  return [...raw.values]
    .reverse()
    .map(v => ({
      date:   v.datetime,
      open:   parseFloat(v.open),
      high:   parseFloat(v.high),
      low:    parseFloat(v.low),
      close:  parseFloat(v.close),
      volume: parseInt(v.volume),
    }))
}

// ── API 함수 ──

// 배치 시세 (여러 종목 한 번에)
export async function getBatchQuotes(symbols) {
  const cacheKey = `batch_${symbols.join(',')}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const url = `${TD_BASE}/quote?symbol=${symbols.join(',')}&apikey=${TD_KEY}`
  const raw = await tdFetch(url)

  // 단일 종목이면 raw가 quote 객체 직접, 여러 종목이면 { SYMBOL: quote, ... }
  const isBatch = symbols.length > 1
  const result = {}
  if (isBatch) {
    for (const sym of symbols) {
      result[sym] = normalizeTdQuote(raw[sym])
    }
  } else {
    result[symbols[0]] = normalizeTdQuote(raw)
  }

  setCache(cacheKey, result)
  return result
}

// 일봉 차트
export async function getDailyChart(symbol) {
  const cacheKey = `chart_${symbol}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const url = `${TD_BASE}/time_series?symbol=${symbol}&interval=1day&outputsize=365&apikey=${TD_KEY}`
  const raw = await tdFetch(url)
  const data = normalizeTdChart(raw)
  setCache(cacheKey, data)
  return data
}

// 환율
export async function getExchangeRate(from, to) {
  const cacheKey = `fx_${from}_${to}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  const url = `${TD_BASE}/exchange_rate?symbol=${from}/${to}&apikey=${TD_KEY}`
  const raw = await tdFetch(url)
  if (!raw || raw.status === 'error') return { from, to, rate: null }
  const data = { from, to, rate: parseFloat(raw.rate) }
  setCache(cacheKey, data)
  return data
}

// 섹터 성과 (Alpha Vantage 유지 — TD 무료 미지원)
export async function getSectorPerformance() {
  const cached = getCached('sector_perf')
  if (cached) return cached
  const res = await fetch(`${AV_BASE}?function=SECTOR&apikey=${AV_KEY}`)
  const data = await res.json()
  setCache('sector_perf', data)
  return data
}

// 공포탐욕지수 (Alternative.me)
export async function getFearGreed() {
  const cached = getCached('fear_greed')
  if (cached) return cached
  const data = await fetch('https://api.alternative.me/fng/?limit=1').then(r => r.json())
  setCache('fear_greed', data)
  return data
}

// 뉴스 (Finnhub)
export async function getMarketNews() {
  const cached = getCached('market_news')
  if (cached) return cached
  const data = await fetch(`${FH_BASE}/news?category=general&token=${FH_KEY}`).then(r => r.json())
  setCache('market_news', data)
  return data
}

// 종목 검색 (Twelve Data)
export const searchSymbol = (keyword) =>
  fetch(`${TD_BASE}/symbol_search?symbol=${encodeURIComponent(keyword)}&apikey=${TD_KEY}`)
    .then(r => r.json())
