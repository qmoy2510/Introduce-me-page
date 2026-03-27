import { useState } from 'react'
import { supabase } from '../../libs/supabaseClient'
import bcrypt from 'bcryptjs'

export default function PostForm({ onPosted }) {
  const [nickname, setNickname] = useState('')
  const [content, setContent] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nickname.trim() || !content.trim() || !password.trim()) {
      setError('모든 항목을 입력해주세요.')
      return
    }
    setLoading(true)
    setError('')

    const hashedPassword = await bcrypt.hash(password, 10)
    const { error: supabaseError } = await supabase
      .from('posts')
      .insert({ nickname: nickname.trim(), content: content.trim(), password: hashedPassword })

    if (supabaseError) {
      setError('글 작성에 실패했습니다.')
    } else {
      setNickname('')
      setContent('')
      setPassword('')
      onPosted()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-xl p-5 mb-6 flex flex-col gap-3">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          maxLength={20}
          className="w-1/3 bg-primary text-text placeholder-text-sub rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent"
        />
        <input
          type="password"
          placeholder="비밀번호 (삭제 시 필요)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          maxLength={20}
          className="w-2/3 bg-primary text-text placeholder-text-sub rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent"
        />
      </div>
      <textarea
        placeholder="방명록을 남겨주세요 :)"
        value={content}
        onChange={e => setContent(e.target.value)}
        maxLength={300}
        rows={3}
        className="bg-primary text-text placeholder-text-sub rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent resize-none"
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="self-end bg-accent hover:bg-mint text-bg font-semibold text-sm px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? '등록 중...' : '등록'}
      </button>
    </form>
  )
}
