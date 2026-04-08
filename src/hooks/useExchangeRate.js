import { useState, useEffect } from 'react'
import { getExchangeRate } from '../libs/stockApi'

const PAIRS = [
  { from: 'USD', to: 'KRW' },
  { from: 'JPY', to: 'KRW' },
  { from: 'EUR', to: 'KRW' },
  { from: 'CNY', to: 'KRW' },
]

export function useExchangeRate() {
  const [rates, setRates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    let completed = 0

    setRates([])
    setLoading(true)

    for (const { from, to } of PAIRS) {
      getExchangeRate(from, to)
        .then(data => {
          if (cancelled) return
          const info = data['Realtime Currency Exchange Rate']
          if (info) {
            const entry = {
              from,
              to,
              rate: parseFloat(info['5. Exchange Rate']),
            }
            setRates(prev => {
              const next = [...prev.filter(r => r.from !== from), entry]
              return PAIRS.map(p => next.find(r => r.from === p.from)).filter(Boolean)
            })
          }
        })
        .catch(() => { /* ignore */ })
        .finally(() => {
          if (cancelled) return
          completed++
          if (completed === PAIRS.length) setLoading(false)
        })
    }

    return () => { cancelled = true }
  }, [])

  return { rates, loading }
}
