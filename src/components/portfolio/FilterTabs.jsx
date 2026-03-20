import { motion } from 'framer-motion'

export default function FilterTabs({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-10">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            active === cat ? 'text-bg' : 'text-text-sub hover:text-text'
          }`}
        >
          {active === cat && (
            <motion.div
              layoutId="filter-active"
              className="absolute inset-0 bg-accent rounded-full"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{cat}</span>
        </button>
      ))}
    </div>
  )
}
