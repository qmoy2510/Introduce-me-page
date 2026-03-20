import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import profileImg from '../../assets/images/profile.jpg'

export default function AboutSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Profile Image */}
          <div className="flex justify-center">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
              <div
                className="w-56 h-56 rounded-full bg-surface border-2 border-accent flex items-center justify-center overflow-hidden"
                style={{ boxShadow: '0 0 30px rgba(149, 213, 178, 0.2)' }}
              >
                <img src={profileImg} alt="박현빈 프로필" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>

          {/* Text */}
          <div>
            <h2 className="text-3xl font-bold text-text mb-2">About Me</h2>
            <div className="w-12 h-1 bg-accent mb-6" />
            <p className="text-text-sub leading-relaxed mb-4">
              안녕하세요! 백엔드 개발자{' '}
              <span className="text-accent font-medium">박현빈</span>입니다.
            </p>
            <p className="text-text-sub leading-relaxed mb-4">
              Java와 Spring을 기반으로 안정적이고 확장 가능한 서버 애플리케이션 개발을 좋아합니다.
            </p>
            <p className="text-text-sub leading-relaxed">
              개발자가 된 계기와 가치관을 여기에 입력해주세요.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
