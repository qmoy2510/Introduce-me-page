import { useState, useEffect } from 'react'
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'
import { getFearGreed } from '../../libs/stockApi'

function getLabel(value) {
  if (value <= 25) return { text: '극단적 공포', emoji: '😱', color: '#E63946' }
  if (value <= 45) return { text: '공포', emoji: '😰', color: '#FF7043' }
  if (value <= 55) return { text: '중립', emoji: '😐', color: '#A8B9AF' }
  if (value <= 75) return { text: '탐욕', emoji: '😏', color: '#52B788' }
  return { text: '극단적 탐욕', emoji: '🤑', color: '#95D5B2' }
}

export default function FearGreedGauge() {
  const [value, setValue] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFearGreed()
      .then(data => {
        const v = parseInt(data?.data?.[0]?.value)
        if (!isNaN(v)) setValue(v)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const info = value !== null ? getLabel(value) : null
  const chartData = value !== null ? [{ name: 'gauge', value, fill: info.color }] : []

  return (
    <section>
      <h2 className="text-text font-bold text-lg mb-3">😱 공포 & 탐욕 지수</h2>
      <div className="bg-surface rounded-xl p-5 flex flex-col items-center">
        {loading ? (
          <div className="h-48 w-full bg-primary rounded-xl animate-pulse" />
        ) : value === null ? (
          <p className="text-text-sub">데이터를 불러올 수 없습니다</p>
        ) : (
          <>
            <div className="relative w-48 h-28">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="70%"
                  outerRadius="100%"
                  data={chartData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    minAngle={5}
                    dataKey="value"
                    cornerRadius={6}
                    background={{ fill: '#2D6A4F' }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                <span className="text-3xl font-bold" style={{ color: info.color }}>{value}</span>
              </div>
            </div>
            <div className="mt-2 text-center">
              <p className="text-xl">{info.emoji}</p>
              <p className="font-bold text-lg mt-1" style={{ color: info.color }}>{info.text}</p>
              <p className="text-text-sub text-xs mt-1">0 = 극단적 공포 | 100 = 극단적 탐욕</p>
            </div>

            <div className="w-full mt-4 grid grid-cols-5 gap-1 text-center text-xs">
              {[
                { label: '극단 공포', range: '0~25', color: '#E63946' },
                { label: '공포', range: '25~45', color: '#FF7043' },
                { label: '중립', range: '45~55', color: '#A8B9AF' },
                { label: '탐욕', range: '55~75', color: '#52B788' },
                { label: '극단 탐욕', range: '75~100', color: '#95D5B2' },
              ].map(({ label, range, color }) => (
                <div key={label}>
                  <div className="h-1 rounded-full mb-1" style={{ backgroundColor: color }} />
                  <p style={{ color }} className="font-medium">{label}</p>
                  <p className="text-text-sub">{range}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
