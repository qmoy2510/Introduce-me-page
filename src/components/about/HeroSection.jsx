import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: 'easeOut' },
  }),
}

// 랜덤 파티클 위치를 컴포넌트 외부에서 생성 (리렌더링 시 재계산 방지)
const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 13) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  duration: 3 + (i % 3),
  delay: (i * 0.3) % 3,
}))

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(45,106,79,0.2) 0%, #0F2419 70%)',
        }}
      />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(({ id, left, top, duration, delay }) => (
          <motion.div
            key={id}
            className="absolute w-1 h-1 rounded-full bg-accent/40"
            style={{ left, top }}
            animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration, repeat: Infinity, delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-accent text-sm font-medium tracking-widest uppercase mb-4"
        >
          Hello, World! 👋
        </motion.p>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl font-bold text-text mb-4 leading-tight"
        >
          박현빈
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-2xl md:text-3xl font-semibold text-accent mb-6"
        >
          Backend Developer
        </motion.p>

        <motion.p
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-text-sub text-lg mb-10"
        >
          꼼꼼함이 곧 신뢰입니다. 한 줄도 허투루 넘기지 않는 Java & Spring 백엔드 개발자입니다.
        </motion.p>

        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex gap-4 justify-center flex-wrap"
        >
          <Link
            to="/portfolio"
            className="px-6 py-3 bg-accent text-bg font-semibold rounded-lg hover:bg-mint transition-colors"
          >
            포트폴리오 보기
          </Link>
          <a
            href="#contact"
            className="px-6 py-3 border border-accent text-accent font-semibold rounded-lg hover:bg-accent/10 transition-colors"
          >
            연락하기
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-5 h-8 border-2 border-accent/50 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-accent rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
