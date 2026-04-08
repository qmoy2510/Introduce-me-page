import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import IndexTickerBar from '../components/stock/IndexTickerBar'
import ExchangeRateSection from '../components/stock/ExchangeRateSection'
import StockSearch from '../components/stock/StockSearch'
import WatchlistSection from '../components/stock/WatchlistSection'
import SectorPerformanceSection from '../components/stock/SectorPerformanceSection'
import FearGreedGauge from '../components/stock/FearGreedGauge'
import StockNewsSection from '../components/stock/StockNewsSection'

export default function StockDashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  function handleRefresh() {
    setRefreshing(true)
    sessionStorage.clear()
    setRefreshKey(k => k + 1)
    setTimeout(() => setRefreshing(false), 1000)
  }

  return (
    <div className="min-h-screen bg-bg pt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8" key={refreshKey}>
        {/* 헤더 */}
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
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-primary border border-primary rounded-xl text-text-sub hover:text-text transition-all text-sm disabled:opacity-50"
          >
            <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
            {refreshing ? '갱신 중...' : '새로고침'}
          </button>
        </div>

        {/* 지수 티커 바 */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
          <IndexTickerBar />
        </motion.div>

        {/* 환율 */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <ExchangeRateSection />
        </motion.div>

        {/* 종목 검색 */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <StockSearch />
        </motion.div>

        {/* 관심 종목 */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <WatchlistSection />
        </motion.div>

        {/* 섹터 성과 + 공포탐욕 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            <SectorPerformanceSection />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <FearGreedGauge />
          </motion.div>
        </div>

        {/* 뉴스 */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <StockNewsSection />
        </motion.div>
      </div>
    </div>
  )
}
