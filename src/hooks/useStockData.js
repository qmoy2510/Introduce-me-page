import { useState, useEffect } from 'react'
import { getBatchQuotes } from '../libs/stockApi'

export function useStockData(symbols) {
  const [quotes, setQuotes] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!symbols || symbols.length === 0) return
    let cancelled = false

    setQuotes({})
    setLoading(true)

    // 배치로 한 번에 요청 (1 API call)
    getBatchQuotes(symbols)
      .then(data => { if (!cancelled) { setQuotes(data); setLoading(false) } })
      .catch(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [symbols.join(',')])

  return { quotes, loading }
}
