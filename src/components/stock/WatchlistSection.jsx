import { useState, useEffect } from 'react'
import { useStockData } from '../../hooks/useStockData'
import { getDailyChart } from '../../libs/stockApi'
import StockCard from './StockCard'
import StockChartSection from './StockChartSection'

const WATCHLIST = [
  { name: '삼성전자', symbol: '005930.KS' },
  { name: 'SK하이닉스', symbol: '000660.KS' },
  { name: 'NAVER', symbol: '035420.KS' },
  { name: '카카오', symbol: '035720.KS' },
  { name: '현대차', symbol: '005380.KS' },
  { name: 'Apple', symbol: 'AAPL' },
  { name: 'Microsoft', symbol: 'MSFT' },
  { name: 'NVIDIA', symbol: 'NVDA' },
  { name: 'Tesla', symbol: 'TSLA' },
  { name: 'Amazon', symbol: 'AMZN' },
]

const SYMBOLS = WATCHLIST.map(w => w.symbol)

export default function WatchlistSection() {
  const { quotes, loading } = useStockData(SYMBOLS)
  const [chartData, setChartData] = useState({})
  const [selectedSymbol, setSelectedSymbol] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function fetchCharts() {
      for (const { symbol } of WATCHLIST) {
        try {
          const data = await getDailyChart(symbol)
          const series = data['Time Series (Daily)']
          if (series && !cancelled) {
            const points = Object.entries(series)
              .slice(0, 30)
              .reverse()
              .map(([date, v]) => ({ date, close: parseFloat(v['4. close']) }))
            setChartData(prev => ({ ...prev, [symbol]: points }))
          }
        } catch {
          // ignore
        }
      }
    }
    fetchCharts()
    return () => { cancelled = true }
  }, [])

  return (
    <section>
      <h2 className="text-text font-bold text-lg mb-3">⭐ 관심 종목</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {WATCHLIST.map(({ name, symbol }) => (
          <StockCard
            key={symbol}
            name={name}
            symbol={symbol}
            quote={loading ? null : quotes[symbol]}
            chartData={chartData[symbol]}
            onClick={setSelectedSymbol}
          />
        ))}
      </div>

      {selectedSymbol && (
        <div className="mt-6">
          <StockChartSection
            symbol={selectedSymbol}
            name={WATCHLIST.find(w => w.symbol === selectedSymbol)?.name}
            onClose={() => setSelectedSymbol(null)}
          />
        </div>
      )}
    </section>
  )
}
