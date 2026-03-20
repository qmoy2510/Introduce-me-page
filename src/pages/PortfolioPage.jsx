import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FilterTabs from '../components/portfolio/FilterTabs'
import ProjectCard from '../components/portfolio/ProjectCard'
import ProjectModal from '../components/portfolio/ProjectModal'
import { projects, categories } from '../data/projects'

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState('전체')
  const [selectedProject, setSelectedProject] = useState(null)

  const filtered =
    activeFilter === '전체' ? projects : projects.filter((p) => p.category === activeFilter)

  return (
    <main className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-text mb-2"
          >
            My Projects
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-sub"
          >
            직접 만든 프로젝트들을 소개합니다.
          </motion.p>
          <div className="w-12 h-1 bg-accent mx-auto mt-4" />
        </div>

        <FilterTabs categories={categories} active={activeFilter} onChange={setActiveFilter} />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={setSelectedProject} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="text-center text-text-sub mt-20">해당 카테고리에 프로젝트가 없습니다.</p>
        )}
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </main>
  )
}
