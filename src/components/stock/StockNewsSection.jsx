import { useStockNews } from '../../hooks/useStockNews'

function timeAgo(timestamp) {
  const diff = Math.floor((Date.now() - timestamp * 1000) / 1000)
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
  return `${Math.floor(diff / 86400)}일 전`
}

export default function StockNewsSection() {
  const { news, loading } = useStockNews()

  return (
    <section>
      <h2 className="text-text font-bold text-lg mb-3">📰 주식 뉴스</h2>
      <div className="space-y-3">
        {loading
          ? [1, 2, 3, 4].map(i => (
              <div key={i} className="bg-surface rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-primary rounded w-3/4 mb-2" />
                <div className="h-3 bg-primary rounded w-1/3" />
              </div>
            ))
          : news.length === 0
          ? <p className="text-text-sub text-sm">뉴스를 불러올 수 없습니다.</p>
          : news.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-surface rounded-xl p-4 hover:bg-primary transition-colors"
              >
                <div className="flex items-start gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                      onError={e => { e.target.style.display = 'none' }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-text font-medium text-sm leading-snug line-clamp-2">{item.headline}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-accent text-xs font-medium">{item.source}</span>
                      <span className="text-text-sub text-xs">{timeAgo(item.datetime)}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
      </div>
    </section>
  )
}
