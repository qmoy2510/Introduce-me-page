import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getBatchQuotes } from '../libs/stockApi'
import IndexTickerBar, { INDEX_SYMBOLS } from '../components/stock/IndexTickerBar'
import WatchlistSection, { WATCHLIST_SYMBOLS } from '../components/stock/WatchlistSection'
import StockSearch from '../components/stock/StockSearch'
import FearGreedGauge from '../components/stock/FearGreedGauge'
import StockNewsSection from '../components/stock/StockNewsSection'

// 인덱스 + 관심종목 심볼 합치기 (중복 제거)
const ALL_SYMBOLS = [...new Set([...INDEX_SYMBOLS, ...WATCHLIST_SYMBOLS])]

export default function StockDashboardPage() {
  const [quotes, setQuotes] = useState({})
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    setQuotes({})
    setLoading(true)

    getBatchQuotes(ALL_SYMBOLS)
      .then(data => { setQuotes(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [refreshKey])

  function handleRefresh() {
    sessionStorage.clear()
    setRefreshKey(k => k + 1)
  }

  return (
    <div className="min-h-screen bg-bg pt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-text font-bold text-2xl"
          >
            📈 주식 대시보드
          </motion.h1>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-primary border border-primary rounded-xl text-text-sub hover:text-text transition-all text-sm disabled:opacity-50"
          >
            <span className={loading ? 'animate-spin' : ''}>🔄</span>
            {loading ? '로딩 중...' : '새로고침'}
          </button>
        </div>

        <IndexTickerBar quotes={quotes} loading={loading} />
        <StockSearch />
        <WatchlistSection quotes={quotes} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FearGreedGauge />
          <StockNewsSection />
        </div>
      </div>
    </div>
  )
}
