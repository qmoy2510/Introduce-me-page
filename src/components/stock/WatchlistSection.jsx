import { useState } from 'react'
import StockCard from './StockCard'
import StockChartSection from './StockChartSection'

export const WATCHLIST = [
  { name: 'Apple',     symbol: 'AAPL' },
  { name: 'Microsoft', symbol: 'MSFT' },
  { name: 'NVIDIA',    symbol: 'NVDA' },
  { name: 'Tesla',     symbol: 'TSLA' },
  { name: 'Amazon',    symbol: 'AMZN' },
  { name: 'Google',    symbol: 'GOOGL' },
  { name: 'Meta',      symbol: 'META' },
  { name: 'Netflix',   symbol: 'NFLX' },
  { name: 'AMD',       symbol: 'AMD' },
  { name: 'Palantir',  symbol: 'PLTR' },
]

export const WATCHLIST_SYMBOLS = WATCHLIST.map(w => w.symbol)

export default function WatchlistSection({ quotes, loading }) {
  const [selectedSymbol, setSelectedSymbol] = useState(null)

  return (
    <section>
      <h2 className="text-text font-bold text-lg mb-3">⭐ 관심 종목</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {WATCHLIST.map(({ name, symbol }) => (
          <StockCard
            key={symbol}
            name={name}
            symbol={symbol}
            quote={quotes?.[symbol]}
            loading={loading}
            onClick={setSelectedSymbol}
          />
        ))}
      </div>

      {selectedSymbol && (
        <div className="mt-6">
          <StockChartSection
            symbol={selectedSymbol}
            name={WATCHLIST.find(w => w.symbol === selectedSymbol)?.name}
            onClose={() => setSelectedSymbol(null)}
          />
        </div>
      )}
    </section>
  )
}
