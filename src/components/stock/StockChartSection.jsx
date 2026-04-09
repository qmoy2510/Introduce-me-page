import { useState, useEffect, useCallback } from 'react'
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import { getDailyChart } from '../../libs/stockApi'

const PERIODS = [
  { label: '1주',   days: 7 },
  { label: '1개월', days: 30 },
  { label: '3개월', days: 90 },
  { label: '6개월', days: 180 },
  { label: '1년',   days: 365 },
]

export default function StockChartSection({ symbol, name, onClose }) {
  const [allData, setAllData] = useState([])
  const [period, setPeriod] = useState(30)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [chartType, setChartType] = useState('line')

  const load = useCallback(() => {
    if (!symbol) return
    setLoading(true)
    setFailed(false)
    setAllData([])

    getDailyChart(symbol)
      .then(data => {
        if (data.length === 0) { setFailed(true) }
        else { setAllData(data) }
        setLoading(false)
      })
      .catch(() => { setFailed(true); setLoading(false) })
  }, [symbol])

  useEffect(() => { load() }, [load])

  const displayData = allData.slice(-period)

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    const fmt = v => (v != null && !isNaN(v)) ? v.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-'
    return (
      <div className="bg-surface border border-primary rounded-lg p-3 text-xs">
        <p className="text-text-sub mb-1">{label}</p>
        <p className="text-text">종가: <span className="text-accent font-bold">{fmt(d.close)}</span></p>
        <p className="text-text-sub">시가: {fmt(d.open)}</p>
        <p className="text-text-sub">고가: {fmt(d.high)}</p>
        <p className="text-text-sub">저가: {fmt(d.low)}</p>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-xl p-5 relative">
      {onClose && (
        <button onClick={onClose} className="absolute top-4 right-4 text-text-sub hover:text-text transition-colors">✕</button>
      )}

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <h2 className="text-text font-bold text-lg">
          📊 {name || symbol} <span className="text-text-sub text-sm font-normal">({symbol})</span>
        </h2>
        {!failed && (
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
        )}
      </div>

      {loading ? (
        <div className="h-64 bg-primary rounded-xl animate-pulse" />
      ) : failed ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3 text-text-sub">
          <p className="text-sm">API 한도 초과 — 잠시 후 다시 시도해주세요</p>
          <button
            onClick={load}
            className="px-4 py-2 bg-primary hover:bg-accent hover:text-bg rounded-lg text-sm transition-colors"
          >
            🔄 다시 시도
          </button>
        </div>
      ) : displayData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-text-sub">데이터 없음</div>
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
              tickFormatter={v => v.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            {chartType === 'line' ? (
              <Line type="monotone" dataKey="close" stroke="#95D5B2" strokeWidth={2} dot={false} />
            ) : (
              <Bar dataKey="close" fill="#52B788" opacity={0.8} />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
