export default function StockDetailCard({ symbol, quote, onClose }) {
  if (!quote) return null

  const price = parseFloat(quote['05. price'])
  const open = parseFloat(quote['02. open'])
  const high = parseFloat(quote['03. high'])
  const low = parseFloat(quote['04. low'])
  const volume = parseInt(quote['06. volume'])
  const change = parseFloat(quote['09. change'])
  const changePct = parseFloat(quote['10. change percent'])
  const isUp = change >= 0

  return (
    <div className="bg-surface border border-primary rounded-xl p-5 relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-text-sub hover:text-text transition-colors text-lg"
      >
        ✕
      </button>
      <div className="flex items-start gap-3 mb-4">
        <div>
          <h3 className="text-text font-bold text-xl">{symbol}</h3>
          <p className={`text-2xl font-bold mt-1 ${isUp ? 'text-accent' : 'text-red-400'}`}>
            {price.toLocaleString()}
            <span className="text-sm ml-2">
              {isUp ? '▲' : '▼'} {Math.abs(changePct).toFixed(2)}%
            </span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {[
          ['시가', open.toLocaleString()],
          ['고가', high.toLocaleString()],
          ['저가', low.toLocaleString()],
          ['거래량', volume.toLocaleString()],
        ].map(([label, val]) => (
          <div key={label} className="bg-primary rounded-lg px-3 py-2">
            <p className="text-text-sub text-xs">{label}</p>
            <p className="text-text font-semibold">{val}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
