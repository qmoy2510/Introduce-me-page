import { motion } from 'framer-motion'
import TagBadge from '../common/TagBadge'

export default function ProjectCard({ project, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => onClick(project)}
      className="bg-surface border border-primary/30 rounded-xl overflow-hidden cursor-pointer group hover:border-accent/50 transition-colors"
    >
      {/* Thumbnail */}
      <div className="h-44 bg-bg flex items-center justify-center relative overflow-hidden">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">🖥️</span>
            <span className="text-xs text-text-sub">썸네일 준비 중</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <span className="text-xs text-accent font-medium">자세히 보기 →</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-text font-semibold">{project.title}</h3>
          <span className="text-xs text-text-sub bg-primary/40 px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
            {project.category}
          </span>
        </div>
        <p className="text-text-sub text-sm mb-4 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <TagBadge key={tag} label={tag} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
