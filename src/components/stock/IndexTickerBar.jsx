import { useEffect, useRef } from 'react'
import { useStockData } from '../../hooks/useStockData'

const INDICES = [
  { label: 'KOSPI', symbol: '399001.SHH' },
  { label: 'KOSDAQ', symbol: '399006.SHH' },
  { label: 'S&P 500', symbol: 'SPY' },
  { label: 'NASDAQ', symbol: 'QQQ' },
  { label: '다우존스', symbol: 'DIA' },
  { label: '닛케이 225', symbol: 'EWJ' },
]

function TickerItem({ label, quote }) {
  if (!quote) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg min-w-[140px] animate-pulse">
        <div className="h-4 bg-primary rounded w-16" />
        <div className="h-4 bg-primary rounded w-12" />
      </div>
    )
  }

  const price = parseFloat(quote['05. price'])
  const change = parseFloat(quote['09. change'])
  const changePct = parseFloat(quote['10. change percent'])
  const isUp = change >= 0

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-surface rounded-lg min-w-[160px] shrink-0">
      <span className="text-text-sub text-xs font-medium">{label}</span>
      <span className="text-text text-sm font-semibold">{price.toLocaleString()}</span>
      <span className={`text-xs font-medium ${isUp ? 'text-accent' : 'text-red-400'}`}>
        {isUp ? '▲' : '▼'} {Math.abs(changePct).toFixed(2)}%
      </span>
    </div>
  )
}

export default function IndexTickerBar({ onRefresh }) {
  const symbols = INDICES.map(i => i.symbol)
  const { quotes, loading } = useStockData(symbols)
  const scrollRef = useRef(null)

  return (
    <div className="w-full overflow-x-auto scrollbar-none pb-1">
      <div ref={scrollRef} className="flex gap-3 min-w-max">
        {INDICES.map(({ label, symbol }) => (
          <TickerItem
            key={symbol}
            label={label}
            quote={loading ? null : quotes[symbol]}
          />
        ))}
      </div>
    </div>
  )
}
