import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

// 실제 경험/학력 데이터로 교체하세요
const timelineData = [
  {
    year: '2024',
    title: '항목을 입력해주세요',
    description: '설명을 입력해주세요.',
  },
  {
    year: '2023',
    title: '항목을 입력해주세요',
    description: '설명을 입력해주세요.',
  },
  {
    year: '2022',
    title: '항목을 입력해주세요',
    description: '설명을 입력해주세요.',
  },
]

function TimelineItem({ item, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex gap-6 mb-8"
    >
      {/* Dot + line */}
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-accent ring-4 ring-accent/20 mt-1.5 flex-shrink-0" />
        {index < timelineData.length - 1 && (
          <div className="w-px flex-1 bg-primary/40 mt-2" />
        )}
      </div>

      {/* Content */}
      <div className="pb-8">
        <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
          {item.year}
        </span>
        <h3 className="text-text font-semibold mt-2 mb-1">{item.title}</h3>
        <p className="text-text-sub text-sm">{item.description}</p>
      </div>
    </motion.div>
  )
}

export default function TimelineSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="timeline" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-text mb-2 text-center">Experience</h2>
          <div className="w-12 h-1 bg-accent mb-12 mx-auto" />
          <div>
            {timelineData.map((item, i) => (
              <TimelineItem key={i} item={item} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
