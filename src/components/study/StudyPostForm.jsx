import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { supabase } from '../../libs/supabaseClient'
import { CATEGORY_COLORS } from './CategoryFilter'

const CATEGORIES = ['Java', 'Spring', 'Database', 'CS', '기타']

export default function StudyPostForm({ onClose, onSaved, editPost = null }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('기타')
  const [content, setContent] = useState('')
  const [code, setCode] = useState('')
  const [preview, setPreview] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title)
      setCategory(editPost.category)
      setContent(editPost.content)
    }
  }, [editPost])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) { setError('제목과 본문을 입력해주세요.'); return }
    if (code !== 'myStudyLog2026') { setError('작성 코드가 틀렸습니다.'); return }

    setLoading(true)
    setError('')

    if (editPost) {
      const { error: err } = await supabase
        .from('study_posts')
        .update({ title: title.trim(), category, content: content.trim() })
        .eq('id', editPost.id)
      if (err) { setError('수정에 실패했습니다.'); setLoading(false); return }
    } else {
      const { error: err } = await supabase
        .from('study_posts')
        .insert({ title: title.trim(), category, content: content.trim() })
      if (err) { setError('작성에 실패했습니다.'); setLoading(false); return }
    }

    onSaved()
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
        className="bg-bg border border-surface rounded-2xl w-full max-w-4xl mb-8"
      >
        <div className="p-6 border-b border-surface flex items-center justify-between">
          <h2 className="text-text font-bold text-lg">{editPost ? '글 수정' : '새 글 작성'}</h2>
          <button onClick={onClose} className="text-text-sub hover:text-text text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* 제목 + 카테고리 */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="제목"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="flex-1 bg-surface text-text placeholder-text-sub rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent"
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="bg-surface text-text rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* 탭 */}
          <div className="flex gap-2">
            <button type="button" onClick={() => setPreview(false)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${!preview ? 'bg-accent text-bg' : 'bg-surface text-text-sub hover:text-text'}`}>
              편집
            </button>
            <button type="button" onClick={() => setPreview(true)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${preview ? 'bg-accent text-bg' : 'bg-surface text-text-sub hover:text-text'}`}>
              미리보기
            </button>
          </div>

          {/* 편집 / 미리보기 */}
          {!preview ? (
            <textarea
              placeholder="Markdown으로 본문을 작성하세요..."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={16}
              className="bg-surface text-text placeholder-text-sub rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent resize-none font-mono"
            />
          ) : (
            <div className="bg-surface rounded-lg p-4 min-h-[320px] prose prose-invert prose-sm max-w-none
              prose-headings:text-text prose-p:text-text-sub prose-strong:text-text
              prose-a:text-accent prose-li:text-text-sub prose-blockquote:border-accent
              prose-blockquote:text-text-sub prose-table:text-text-sub prose-th:text-text">
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
                      <code className="bg-primary px-1.5 py-0.5 rounded text-mint text-sm" {...props}>{children}</code>
                    )
                  }
                }}
              >
                {content || '_본문을 입력하면 여기에 미리보기가 표시됩니다._'}
              </ReactMarkdown>
            </div>
          )}

          {/* 작성 코드 + 제출 */}
          <div className="flex gap-3 items-center">
            <input
              type="password"
              placeholder="작성 코드"
              value={code}
              onChange={e => setCode(e.target.value)}
              className="flex-1 bg-surface text-text placeholder-text-sub rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-accent hover:bg-mint text-bg font-semibold text-sm px-6 py-2 rounded-lg transition-colors disabled:opacity-50 shrink-0"
            >
              {loading ? '저장 중...' : editPost ? '수정' : '등록'}
            </button>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
        </form>
      </motion.div>
    </motion.div>
  )
}
