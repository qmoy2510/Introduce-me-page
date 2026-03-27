import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../libs/supabaseClient'
import bcrypt from 'bcryptjs'

export default function PostItem({ post, onDeleted }) {
  const [modal, setModal] = useState(null) // null | 'delete' | 'editAuth' | 'edit'
  const [inputPassword, setInputPassword] = useState('')
  const [editContent, setEditContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const date = new Date(post.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'short', day: 'numeric',
  })

  function closeModal() {
    setModal(null)
    setInputPassword('')
    setEditContent('')
    setError('')
  }

  async function handleDelete() {
    setLoading(true)
    setError('')
    const match = await bcrypt.compare(inputPassword, post.password)
    if (!match) { setError('비밀번호가 틀렸습니다.'); setLoading(false); return }

    const { error: err } = await supabase.from('posts').delete().eq('id', post.id)
    if (err) { setError('삭제에 실패했습니다.'); setLoading(false); return }
    closeModal()
    onDeleted()
    setLoading(false)
  }

  async function handleEditAuth() {
    setLoading(true)
    setError('')
    const match = await bcrypt.compare(inputPassword, post.password)
    if (!match) { setError('비밀번호가 틀렸습니다.'); setLoading(false); return }
    setInputPassword('')
    setEditContent(post.content)
    setModal('edit')
    setLoading(false)
  }

  async function handleEditSave() {
    if (!editContent.trim()) { setError('내용을 입력해주세요.'); return }
    setLoading(true)
    setError('')
    const { error: err } = await supabase
      .from('posts')
      .update({ content: editContent.trim() })
      .eq('id', post.id)
    if (err) { setError('수정에 실패했습니다.'); setLoading(false); return }
    closeModal()
    onDeleted() // 목록 새로고침
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
              onClick={() => { setModal('editAuth') }}
              className="text-text-sub hover:text-accent text-xs transition-colors"
            >
              수정
            </button>
            <button
              onClick={() => setModal('delete')}
              className="text-text-sub hover:text-red-400 text-xs transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
        <p className="text-text text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </motion.div>

      {/* 삭제 모달 */}
      <AnimatePresence>
        {modal === 'delete' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="bg-surface rounded-xl p-6 w-80 flex flex-col gap-4"
            >
              <h3 className="text-text font-semibold">글 삭제</h3>
              <input
                type="password" placeholder="비밀번호 입력"
                value={inputPassword} onChange={e => setInputPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleDelete()}
                className="bg-primary text-text placeholder-text-sub rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent"
              />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <div className="flex justify-end gap-2">
                <button onClick={closeModal} className="text-text-sub text-sm px-4 py-2 rounded-lg hover:bg-primary transition-colors">취소</button>
                <button onClick={handleDelete} disabled={loading}
                  className="bg-red-500 hover:bg-red-400 text-white text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
                  {loading ? '확인 중...' : '삭제'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 수정 비밀번호 확인 모달 */}
      <AnimatePresence>
        {modal === 'editAuth' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="bg-surface rounded-xl p-6 w-80 flex flex-col gap-4"
            >
              <h3 className="text-text font-semibold">글 수정</h3>
              <input
                type="password" placeholder="비밀번호 입력"
                value={inputPassword} onChange={e => setInputPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleEditAuth()}
                className="bg-primary text-text placeholder-text-sub rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent"
              />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <div className="flex justify-end gap-2">
                <button onClick={closeModal} className="text-text-sub text-sm px-4 py-2 rounded-lg hover:bg-primary transition-colors">취소</button>
                <button onClick={handleEditAuth} disabled={loading}
                  className="bg-accent hover:bg-mint text-bg text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
                  {loading ? '확인 중...' : '다음'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 수정 편집 모달 */}
      <AnimatePresence>
        {modal === 'edit' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="bg-surface rounded-xl p-6 w-96 flex flex-col gap-4"
            >
              <h3 className="text-text font-semibold">글 수정</h3>
              <textarea
                value={editContent} onChange={e => setEditContent(e.target.value)}
                rows={5}
                className="bg-primary text-text placeholder-text-sub rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent resize-none"
              />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <div className="flex justify-end gap-2">
                <button onClick={closeModal} className="text-text-sub text-sm px-4 py-2 rounded-lg hover:bg-primary transition-colors">취소</button>
                <button onClick={handleEditSave} disabled={loading}
                  className="bg-accent hover:bg-mint text-bg text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
                  {loading ? '저장 중...' : '수정 완료'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
