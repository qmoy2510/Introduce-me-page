import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'

export default function StockCard({ name, symbol, quote, chartData, onClick }) {
  if (!quote) {
    return (
      <div className="bg-surface rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-primary rounded w-24 mb-2" />
        <div className="h-6 bg-primary rounded w-20 mb-3" />
        <div className="h-12 bg-primary rounded" />
      </div>
    )
  }

  const price = parseFloat(quote['05. price'])
  const change = parseFloat(quote['09. change'])
  const changePct = parseFloat(quote['10. change percent'])
  const isUp = change >= 0

  return (
    <div
      onClick={() => onClick && onClick(symbol)}
      className="bg-surface rounded-xl p-4 hover:bg-primary transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-text-sub text-xs mb-0.5">{symbol}</p>
          <p className="text-text font-semibold text-sm">{name}</p>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isUp ? 'bg-accent/20 text-accent' : 'bg-red-500/20 text-red-400'}`}>
          {isUp ? '▲' : '▼'} {Math.abs(changePct).toFixed(2)}%
        </span>
      </div>
      <p className="text-text font-bold text-lg mb-2">{price.toLocaleString()}</p>
      {chartData && chartData.length > 1 && (
        <div className="h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="close"
                stroke={isUp ? '#52B788' : '#E63946'}
                strokeWidth={1.5}
                dot={false}
              />
              <Tooltip
                contentStyle={{ background: '#1B4332', border: 'none', borderRadius: 8, fontSize: 11 }}
                formatter={(v) => [v.toLocaleString(), '종가']}
                labelFormatter={() => ''}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
