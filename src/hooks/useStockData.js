import { useState, useEffect } from 'react'
import { getQuote } from '../libs/stockApi'

export function useStockData(symbols) {
  const [quotes, setQuotes] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!symbols || symbols.length === 0) return

    let cancelled = false
    let completed = 0

    setQuotes({})
    setLoading(true)

    for (const symbol of symbols) {
      getQuote(symbol)
        .then(data => {
          if (cancelled) return
          const quote = data['Global Quote']
          // 결과가 오는 즉시 해당 종목만 업데이트
          if (quote && Object.keys(quote).length > 0) {
            setQuotes(prev => ({ ...prev, [symbol]: quote }))
          }
        })
        .catch(() => { /* ignore */ })
        .finally(() => {
          if (cancelled) return
          completed++
          if (completed === symbols.length) setLoading(false)
        })
    }

    return () => { cancelled = true }
  }, [symbols.join(',')])

  return { quotes, loading }
}
