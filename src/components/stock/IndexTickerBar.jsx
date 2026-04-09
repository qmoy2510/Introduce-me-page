import { useStockData } from '../../hooks/useStockData'

// Twelve Data 심볼 형식 사용
const INDICES = [
  { label: 'KOSPI',     symbol: 'EWY' },       // iShares MSCI Korea ETF (KOSPI 대용)
  { label: 'S&P 500',   symbol: 'SPY' },
  { label: 'NASDAQ',    symbol: 'QQQ' },
  { label: '다우존스',  symbol: 'DIA' },
  { label: '닛케이 225',symbol: 'EWJ' },        // iShares MSCI Japan ETF
  { label: 'NVIDIA',    symbol: 'NVDA' },
]

const SYMBOLS = INDICES.map(i => i.symbol)

function TickerItem({ label, quote }) {
  if (!quote) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg min-w-[140px] animate-pulse">
        <div className="h-4 bg-primary rounded w-16" />
        <div className="h-4 bg-primary rounded w-12" />
      </div>
    )
  }

  const isUp = quote.change >= 0

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-surface rounded-lg min-w-[160px] shrink-0">
      <span className="text-text-sub text-xs font-medium">{label}</span>
      <span className="text-text text-sm font-semibold">{quote.price.toLocaleString()}</span>
      <span className={`text-xs font-medium ${isUp ? 'text-accent' : 'text-red-400'}`}>
        {isUp ? '▲' : '▼'} {Math.abs(quote.changePct).toFixed(2)}%
      </span>
    </div>
  )
}

export default function IndexTickerBar() {
  const { quotes, loading } = useStockData(SYMBOLS)

  return (
    <div className="w-full overflow-x-auto scrollbar-none pb-1">
      <div className="flex gap-3 min-w-max">
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
