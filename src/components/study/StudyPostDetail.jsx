import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { supabase } from '../../libs/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { CATEGORY_COLORS } from './CategoryFilter'

export default function StudyPostDetail({ post, onClose, onEdit, onDeleted }) {
  const { user } = useAuth()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const date = new Date(post.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  async function handleDelete() {
    setLoading(true)
    const { error: err } = await supabase.from('study_posts').delete().eq('id', post.id)
    if (err) { setLoading(false); return }
    setShowDeleteModal(false)
    onDeleted()
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 pt-20 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-bg border border-surface rounded-2xl w-full max-w-3xl mb-8"
      >
        {/* 헤더 */}
        <div className="p-6 border-b border-surface">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className={`text-xs px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS['기타']}`}>
                {post.category}
              </span>
              <h2 className="text-xl font-bold text-text mt-3">{post.title}</h2>
              <p className="text-text-sub text-xs mt-1">{date}</p>
            </div>
            <button onClick={onClose} className="text-text-sub hover:text-text text-xl leading-none mt-1">✕</button>
          </div>
          {user && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => onEdit(post)}
                className="text-xs px-3 py-1.5 rounded-lg bg-primary text-text-sub hover:text-text transition-colors"
              >
                수정
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-xs px-3 py-1.5 rounded-lg bg-primary text-red-400 hover:text-red-300 transition-colors"
              >
                삭제
              </button>
            </div>
          )}
        </div>

        {/* 첨부 이미지 */}
        {post.image_url && (
          <div className="px-6 pt-4">
            <img
              src={post.image_url}
              alt="첨부 이미지"
              className="w-full rounded-xl object-contain max-h-96 bg-surface"
            />
          </div>
        )}

        {/* Markdown 본문 */}
        <div className="p-6 prose prose-invert prose-sm max-w-none
          prose-headings:text-text prose-p:text-text-sub prose-strong:text-text
          prose-code:text-mint prose-a:text-accent prose-li:text-text-sub
          prose-blockquote:border-accent prose-blockquote:text-text-sub
          prose-table:text-text-sub prose-th:text-text">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div">
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-primary px-1.5 py-0.5 rounded text-mint text-sm" {...props}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </motion.div>

      {/* 삭제 확인 모달 */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="bg-surface rounded-xl p-6 w-80 flex flex-col gap-4"
            >
              <h3 className="text-text font-semibold">글을 삭제하시겠습니까?</h3>
              <p className="text-text-sub text-sm">삭제된 글은 복구할 수 없습니다.</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-text-sub text-sm px-4 py-2 rounded-lg hover:bg-primary transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-400 text-white text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? '삭제 중...' : '삭제'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
