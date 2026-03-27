const CATEGORIES = ['전체', 'Java', 'Spring', 'Database', 'CS', '기타']

const CATEGORY_COLORS = {
  Java:     'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Spring:   'bg-green-500/20 text-green-300 border-green-500/30',
  Database: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  CS:       'bg-purple-500/20 text-purple-300 border-purple-500/30',
  기타:     'bg-gray-500/20 text-gray-300 border-gray-500/30',
}

export { CATEGORIES, CATEGORY_COLORS }

export default function CategoryFilter({ selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            selected === cat
              ? 'bg-accent text-bg border-accent'
              : 'bg-surface text-text-sub border-primary/30 hover:border-accent hover:text-text'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
