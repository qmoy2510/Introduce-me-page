import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../libs/supabaseClient'
import bcrypt from 'bcryptjs'

export default function PostItem({ post, onDeleted }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [inputPassword, setInputPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const date = new Date(post.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'short', day: 'numeric',
  })

  async function handleDelete() {
    setLoading(true)
    setError('')
    const match = await bcrypt.compare(inputPassword, post.password)
    if (!match) {
      setError('비밀번호가 틀렸습니다.')
      setLoading(false)
      return
    }
    const { error: supabaseError } = await supabase
      .from('posts')
      .delete()
      .eq('id', post.id)

    if (supabaseError) {
      setError('삭제에 실패했습니다.')
    } else {
      setShowDeleteModal(false)
      onDeleted()
    }
    setLoading(false)
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-surface rounded-xl p-4 flex flex-col gap-2"
      >
        <div className="flex justify-between items-center">
          <span className="text-accent font-semibold text-sm">{post.nickname}</span>
          <div className="flex items-center gap-3">
            <span className="text-text-sub text-xs">{date}</span>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-text-sub hover:text-red-400 text-xs transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
        <p className="text-text text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </motion.div>

      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={() => { setShowDeleteModal(false); setInputPassword(''); setError('') }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="bg-surface rounded-xl p-6 w-80 flex flex-col gap-4"
            >
              <h3 className="text-text font-semibold">글 삭제</h3>
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={inputPassword}
                onChange={e => setInputPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleDelete()}
                className="bg-primary text-text placeholder-text-sub rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent"
              />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { setShowDeleteModal(false); setInputPassword(''); setError('') }}
                  className="text-text-sub text-sm px-4 py-2 rounded-lg hover:bg-primary transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-400 text-white text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? '확인 중...' : '삭제'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
