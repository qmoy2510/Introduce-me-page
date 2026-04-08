import { useState, useEffect } from 'react'
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { getDailyChart } from '../../libs/stockApi'

const PERIODS = [
  { label: '1주', days: 7 },
  { label: '1개월', days: 30 },
  { label: '3개월', days: 90 },
  { label: '6개월', days: 180 },
  { label: '1년', days: 365 },
]

export default function StockChartSection({ symbol, name, onClose }) {
  const [rawData, setRawData] = useState([])
  const [period, setPeriod] = useState(30)
  const [loading, setLoading] = useState(true)
  const [chartType, setChartType] = useState('line')

  useEffect(() => {
    if (!symbol) return
    let cancelled = false
    setLoading(true)

    getDailyChart(symbol)
      .then(data => {
        if (cancelled) return
        const series = data['Time Series (Daily)']
        if (!series) { setLoading(false); return }
        const points = Object.entries(series)
          .slice(0, 365)
          .reverse()
          .map(([date, v]) => ({
            date,
            open: parseFloat(v['1. open']),
            high: parseFloat(v['2. high']),
            low: parseFloat(v['3. low']),
            close: parseFloat(v['4. close']),
            volume: parseInt(v['5. volume']),
          }))
        setRawData(points)
        setLoading(false)
      })
      .catch(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [symbol])

  const displayData = rawData.slice(-period)

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div className="bg-surface border border-primary rounded-lg p-3 text-xs">
        <p className="text-text-sub mb-1">{label}</p>
        <p className="text-text">종가: <span className="text-accent font-bold">{d.close?.toLocaleString()}</span></p>
        {d.open && <p className="text-text-sub">시가: {d.open.toLocaleString()}</p>}
        {d.high && <p className="text-text-sub">고가: {d.high.toLocaleString()}</p>}
        {d.low && <p className="text-text-sub">저가: {d.low.toLocaleString()}</p>}
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-xl p-5 relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-sub hover:text-text transition-colors"
        >
          ✕
        </button>
      )}

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <h2 className="text-text font-bold text-lg">
          📊 {name || symbol} <span className="text-text-sub text-sm font-normal">({symbol})</span>
        </h2>
        <div className="flex gap-1 ml-auto flex-wrap">
          {PERIODS.map(({ label, days }) => (
            <button
              key={days}
              onClick={() => setPeriod(days)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                period === days ? 'bg-accent text-bg' : 'bg-primary text-text-sub hover:text-text'
              }`}
            >
              {label}
            </button>
          ))}
          <div className="w-px bg-primary mx-1" />
          <button
            onClick={() => setChartType(t => t === 'line' ? 'bar' : 'line')}
            className="px-3 py-1 rounded-full text-xs font-medium bg-primary text-text-sub hover:text-text transition-colors"
          >
            {chartType === 'line' ? '라인' : '바'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 bg-primary rounded-xl animate-pulse" />
      ) : displayData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-text-sub">데이터를 불러올 수 없습니다</div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={displayData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D6A4F" opacity={0.4} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#A8B9AF', fontSize: 10 }}
              tickFormatter={v => v.slice(5)}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#A8B9AF', fontSize: 10 }}
              domain={['auto', 'auto']}
              tickFormatter={v => v.toLocaleString()}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            {chartType === 'line' ? (
              <Line
                type="monotone"
                dataKey="close"
                stroke="#95D5B2"
                strokeWidth={2}
                dot={false}
                name="종가"
              />
            ) : (
              <Bar dataKey="close" fill="#52B788" opacity={0.8} name="종가" />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
