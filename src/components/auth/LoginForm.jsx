import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-surface border border-primary rounded-2xl p-8">
        {/* 로고 */}
        <div className="text-center mb-8">
          <span className="text-accent font-bold text-2xl tracking-tight">&lt;Dev Log /&gt;</span>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full bg-bg text-text placeholder-text-sub border border-primary focus:border-accent rounded-lg px-4 py-3 text-sm outline-none transition-colors"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full bg-bg text-text placeholder-text-sub border border-primary focus:border-accent rounded-lg px-4 py-3 text-sm outline-none transition-colors"
          />

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-mint text-bg font-semibold py-3 rounded-lg text-sm transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
