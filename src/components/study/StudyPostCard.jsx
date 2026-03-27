import { motion } from 'framer-motion'
import { CATEGORY_COLORS } from './CategoryFilter'

export default function StudyPostCard({ post, onClick }) {
  const date = new Date(post.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
  const updated = post.updated_at !== post.created_at

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onClick={onClick}
      className="bg-surface rounded-xl p-5 cursor-pointer border border-transparent hover:border-accent transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-text font-semibold text-base leading-snug">{post.title}</h3>
        <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS['기타']}`}>
          {post.category}
        </span>
      </div>
      <p className="text-text-sub text-xs mt-2">
        {date}{updated && ' · 수정됨'}
      </p>
    </motion.div>
  )
}
