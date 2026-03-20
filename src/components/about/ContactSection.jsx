import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

// 실제 연락처 정보로 교체하세요
const contacts = [
  { label: 'Email', value: 'your@email.com', href: 'mailto:your@email.com', icon: '✉️' },
  { label: 'GitHub', value: 'github.com/username', href: 'https://github.com/username', icon: '🐙' },
  { label: 'LinkedIn', value: 'LinkedIn 프로필', href: '#', icon: '💼' },
]

export default function ContactSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="contact" className="py-24 px-6 bg-surface/30">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-text mb-2">Contact</h2>
          <div className="w-12 h-1 bg-accent mb-6 mx-auto" />
          <p className="text-text-sub mb-12">언제든지 연락 주세요!</p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {contacts.map(({ label, value, href, icon }) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 px-6 py-4 bg-surface border border-primary/30 rounded-xl text-left hover:border-accent transition-colors"
              >
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="text-xs text-text-sub">{label}</p>
                  <p className="text-sm text-text font-medium">{value}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
