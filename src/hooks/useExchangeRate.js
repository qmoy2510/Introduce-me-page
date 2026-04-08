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

    async function fetchAll() {
      setLoading(true)
      const results = []
      for (const { from, to } of PAIRS) {
        try {
          const data = await getExchangeRate(from, to)
          const info = data['Realtime Currency Exchange Rate']
          if (info) {
            results.push({
              from,
              to,
              rate: parseFloat(info['5. Exchange Rate']),
              bid: parseFloat(info['8. Bid Price']),
              ask: parseFloat(info['9. Ask Price']),
            })
          }
        } catch {
          results.push({ from, to, rate: null })
        }
      }
      if (!cancelled) {
        setRates(results)
        setLoading(false)
      }
    }

    fetchAll()
    return () => { cancelled = true }
  }, [])

  return { rates, loading }
}
