import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { skills } from '../../data/skills'

function SkillBar({ name, level, icon, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-sm text-text font-medium">
          {icon} {name}
        </span>
        <span className="text-xs text-text-sub">{level}%</span>
      </div>
      <div className="h-2 bg-bg rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 0.9, delay, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(to right, #2D6A4F, #52B788)' }}
        />
      </div>
    </div>
  )
}

export default function SkillsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="skills" className="py-24 px-6 bg-surface/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-text mb-2 text-center">Skills</h2>
          <div className="w-12 h-1 bg-accent mb-12 mx-auto" />
          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((group) => (
              <div
                key={group.category}
                className="bg-surface p-6 rounded-xl border border-primary/30"
              >
                <h3 className="text-accent font-semibold mb-4 text-sm uppercase tracking-wider">
                  {group.category}
                </h3>
                {group.items.map((skill, i) => (
                  <SkillBar key={skill.name} {...skill} delay={i * 0.1} />
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
