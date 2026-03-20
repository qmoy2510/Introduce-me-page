import { motion, AnimatePresence } from 'framer-motion'
import TagBadge from '../common/TagBadge'

export default function ProjectModal({ project, onClose }) {
  if (!project) return null

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      >
        <motion.div
          key="modal"
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-surface border border-primary/50 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-primary/30 flex items-start justify-between sticky top-0 bg-surface z-10">
            <div>
              <h2 className="text-xl font-bold text-text">{project.title}</h2>
              <p className="text-text-sub text-sm mt-1">{project.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-text-sub hover:text-text transition-colors ml-4 text-xl leading-none mt-1"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-accent text-xs font-semibold uppercase tracking-wider mb-2">
                기술 스택
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <TagBadge key={tag} label={tag} />
                ))}
              </div>
            </div>

            {project.detail && (
              <>
                <div>
                  <h3 className="text-accent text-xs font-semibold uppercase tracking-wider mb-2">
                    프로젝트 배경
                  </h3>
                  <p className="text-text-sub text-sm leading-relaxed">{project.detail.background}</p>
                </div>
                <div>
                  <h3 className="text-accent text-xs font-semibold uppercase tracking-wider mb-2">
                    담당 역할
                  </h3>
                  <p className="text-text-sub text-sm leading-relaxed">{project.detail.role}</p>
                </div>
                <div>
                  <h3 className="text-accent text-xs font-semibold uppercase tracking-wider mb-2">
                    주요 기능
                  </h3>
                  <ul className="text-text-sub text-sm space-y-1">
                    {project.detail.features.map((f, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-accent flex-shrink-0">▹</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                {project.detail.troubleshooting && (
                  <div>
                    <h3 className="text-accent text-xs font-semibold uppercase tracking-wider mb-2">
                      트러블슈팅
                    </h3>
                    <p className="text-text-sub text-sm leading-relaxed">
                      {project.detail.troubleshooting}
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="flex gap-3 pt-2">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-primary/50 border border-primary text-text text-sm rounded-lg hover:border-accent transition-colors"
                >
                  GitHub →
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-accent text-bg text-sm font-medium rounded-lg hover:bg-mint transition-colors"
                >
                  Demo →
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
