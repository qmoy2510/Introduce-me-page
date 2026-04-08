import { useExchangeRate } from '../../hooks/useExchangeRate'

const FLAG = { USD: '🇺🇸', JPY: '🇯🇵', EUR: '🇪🇺', CNY: '🇨🇳' }

function RateCard({ from, to, rate }) {
  if (rate === null) {
    return (
      <div className="bg-surface rounded-xl p-4 animate-pulse">
        <div className="h-5 bg-primary rounded w-20 mb-2" />
        <div className="h-7 bg-primary rounded w-28" />
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-xl p-4 hover:bg-primary transition-colors">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{FLAG[from]}</span>
        <span className="text-text-sub text-sm font-medium">{from} / {to}</span>
      </div>
      <p className="text-text font-bold text-lg">
        {from === 'JPY'
          ? `${(rate * 100).toFixed(2)} KRW / 100¥`
          : `${rate.toFixed(2)} KRW`}
      </p>
    </div>
  )
}

export default function ExchangeRateSection() {
  const { rates, loading } = useExchangeRate()

  return (
    <section>
      <h2 className="text-text font-bold text-lg mb-3">💱 환율</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {loading
          ? [1, 2, 3, 4].map(i => (
              <div key={i} className="bg-surface rounded-xl p-4 animate-pulse">
                <div className="h-5 bg-primary rounded w-20 mb-2" />
                <div className="h-7 bg-primary rounded w-28" />
              </div>
            ))
          : rates.map(({ from, to, rate }) => (
              <RateCard key={from} from={from} to={to} rate={rate} />
            ))}
      </div>
    </section>
  )
}
