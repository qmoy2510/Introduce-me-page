import { useState, useRef } from 'react'
import { searchSymbol, getQuote } from '../../libs/stockApi'
import StockDetailCard from './StockDetailCard'

export default function StockSearch() {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [selectedSymbol, setSelectedSymbol] = useState(null)
  const [loadingQuote, setLoadingQuote] = useState(false)
  const debounceRef = useRef(null)

  function handleInput(e) {
    const val = e.target.value
    setKeyword(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!val.trim()) { setResults([]); return }
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const data = await searchSymbol(val)
        setResults(data.bestMatches || [])
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 600)
  }

  async function handleSelect(symbol) {
    setResults([])
    setKeyword(symbol)
    setLoadingQuote(true)
    try {
      const data = await getQuote(symbol)
      setSelectedSymbol(symbol)
      setSelectedQuote(data['Global Quote'] || null)
    } catch {
      setSelectedQuote(null)
    } finally {
      setLoadingQuote(false)
    }
  }

  return (
    <section>
      <h2 className="text-text font-bold text-lg mb-3">🔍 종목 검색</h2>
      <div className="relative">
        <input
          type="text"
          value={keyword}
          onChange={handleInput}
          placeholder="종목명 또는 티커 입력 (예: AAPL, Samsung)"
          className="w-full bg-surface border border-primary rounded-xl px-4 py-3 text-text placeholder-text-sub outline-none focus:border-accent transition-colors"
        />
        {searching && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-sub text-sm">검색 중...</span>
        )}
        {results.length > 0 && (
          <ul className="absolute z-20 w-full bg-surface border border-primary rounded-xl mt-1 max-h-60 overflow-y-auto shadow-xl">
            {results.map(r => (
              <li
                key={r['1. symbol']}
                onClick={() => handleSelect(r['1. symbol'])}
                className="px-4 py-3 hover:bg-primary cursor-pointer flex items-center justify-between"
              >
                <span className="text-text font-medium">{r['1. symbol']}</span>
                <span className="text-text-sub text-sm truncate max-w-[60%]">{r['2. name']}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {loadingQuote && (
        <div className="mt-4 bg-surface rounded-xl p-5 animate-pulse">
          <div className="h-6 bg-primary rounded w-32 mb-3" />
          <div className="h-9 bg-primary rounded w-48" />
        </div>
      )}

      {!loadingQuote && selectedQuote && (
        <div className="mt-4">
          <StockDetailCard
            symbol={selectedSymbol}
            quote={selectedQuote}
            onClose={() => { setSelectedQuote(null); setSelectedSymbol(null); setKeyword('') }}
          />
        </div>
      )}
    </section>
  )
}
