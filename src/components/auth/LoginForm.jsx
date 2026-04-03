import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../libs/supabaseClient'

export default function LoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    else navigate('/study', { replace: true })
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-sm mx-auto"
    >
      <motion.div
        className="bg-surface border border-primary rounded-2xl p-8"
        initial={{ scale: 0.97 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* 로고 */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <span className="text-accent font-bold text-2xl tracking-tight">&lt;Dev Log /&gt;</span>
        </motion.div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {[
            { type: 'email', placeholder: '이메일', value: email, onChange: e => setEmail(e.target.value) },
            { type: 'password', placeholder: '비밀번호', value: password, onChange: e => setPassword(e.target.value) },
          ].map(({ type, placeholder, value, onChange }, i) => (
            <motion.input
              key={type}
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              required
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              className="w-full bg-bg text-text placeholder-text-sub border border-primary focus:border-accent rounded-lg px-4 py-3 text-sm outline-none transition-colors"
            />
          ))}

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="text-red-400 text-xs text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={loading}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-accent hover:bg-mint text-bg font-semibold py-3 rounded-lg text-sm transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? '로그인 중...' : '로그인'}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  )
}
