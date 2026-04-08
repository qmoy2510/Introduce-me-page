import { useState, useEffect } from 'react'
import { getMarketNews } from '../libs/stockApi'

export function useStockNews() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    getMarketNews()
      .then(data => {
        if (!cancelled) {
          setNews(Array.isArray(data) ? data.slice(0, 10) : [])
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  return { news, loading }
}
