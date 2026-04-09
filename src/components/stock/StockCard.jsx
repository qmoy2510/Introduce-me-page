export default function StockCard({ name, symbol, quote, loading, onClick }) {
  if (loading) {
    return (
      <div className="bg-surface rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-primary rounded w-24 mb-2" />
        <div className="h-6 bg-primary rounded w-20 mb-1" />
        <div className="h-4 bg-primary rounded w-16" />
      </div>
    )
  }
  if (!quote) {
    return (
      <div className="bg-surface rounded-xl p-4 opacity-40">
        <p className="text-text-sub text-xs mb-1">{symbol}</p>
        <p className="text-text text-sm">{name}</p>
        <p className="text-text-sub text-xs mt-2">데이터 없음</p>
      </div>
    )
  }

  const isUp = quote.change >= 0

  return (
    <div
      onClick={() => onClick && onClick(symbol)}
      className="bg-surface rounded-xl p-4 hover:bg-primary transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between mb-1">
        <p className="text-text-sub text-xs">{symbol}</p>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isUp ? 'bg-accent/20 text-accent' : 'bg-red-500/20 text-red-400'}`}>
          {isUp ? '▲' : '▼'} {Math.abs(quote.changePct).toFixed(2)}%
        </span>
      </div>
      <p className="text-text font-semibold text-sm mb-1">{name}</p>
      <p className="text-text font-bold text-lg">{quote.price.toLocaleString()}</p>
      <p className="text-text-sub text-xs mt-1">전일 {quote.prevClose?.toLocaleString()}</p>
    </div>
  )
}
