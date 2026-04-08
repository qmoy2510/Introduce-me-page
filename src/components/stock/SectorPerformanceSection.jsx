import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getSectorPerformance } from '../../libs/stockApi'

const PERIOD_KEYS = {
  '당일': 'Rank A: Real-Time Performance',
  '1주': 'Rank B: 1 Day Performance',
  '1개월': 'Rank C: 5 Day Performance',
}

export default function SectorPerformanceSection() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('당일')

  useEffect(() => {
    getSectorPerformance()
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const chartData = data && data[PERIOD_KEYS[period]]
    ? Object.entries(data[PERIOD_KEYS[period]])
        .map(([name, val]) => ({
          name: name.replace(' Services', '').replace(' Consumer', ' Con.'),
          value: parseFloat(val) || 0,
        }))
        .sort((a, b) => b.value - a.value)
    : []

  return (
    <section>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-text font-bold text-lg">🏭 섹터별 성과</h2>
        <div className="flex gap-1">
          {Object.keys(PERIOD_KEYS).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                period === p ? 'bg-accent text-bg' : 'bg-surface text-text-sub hover:text-text'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface rounded-xl p-4">
        {loading ? (
          <div className="h-64 bg-primary rounded-xl animate-pulse" />
        ) : chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-text-sub">데이터를 불러올 수 없습니다</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D6A4F" opacity={0.4} horizontal={false} />
              <XAxis type="number" tick={{ fill: '#A8B9AF', fontSize: 10 }} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#A8B9AF', fontSize: 10 }} width={80} />
              <Tooltip
                contentStyle={{ background: '#1B4332', border: 'none', borderRadius: 8, fontSize: 11 }}
                formatter={v => [`${v.toFixed(2)}%`, '성과']}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.value >= 0 ? '#52B788' : '#E63946'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  )
}
