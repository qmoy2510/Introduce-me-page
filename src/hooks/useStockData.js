import { useState, useEffect } from 'react'
import { getQuote } from '../libs/stockApi'

export function useStockData(symbols) {
  const [quotes, setQuotes] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!symbols || symbols.length === 0) return

    let cancelled = false

    async function fetchAll() {
      setLoading(true)
      setError(null)
      const results = {}
      for (const symbol of symbols) {
        try {
          const data = await getQuote(symbol)
          if (!cancelled) results[symbol] = data['Global Quote'] || null
        } catch (e) {
          if (!cancelled) results[symbol] = null
        }
      }
      if (!cancelled) {
        setQuotes(results)
        setLoading(false)
      }
    }

    fetchAll()
    return () => { cancelled = true }
  }, [symbols.join(',')])

  return { quotes, loading, error }
}
