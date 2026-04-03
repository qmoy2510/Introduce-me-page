import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../libs/supabaseClient'
import { useAuth } from '../context/AuthContext'
import CategoryFilter from '../components/study/CategoryFilter'
import StudyPostCard from '../components/study/StudyPostCard'
import StudyPostDetail from '../components/study/StudyPostDetail'
import StudyPostForm from '../components/study/StudyPostForm'

export default function StudyLogPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedPost, setSelectedPost] = useState(null)
  const [editPost, setEditPost] = useState(null)
  const [showForm, setShowForm] = useState(false)

  async function fetchPosts() {
    setLoading(true)
    const { data } = await supabase
      .from('study_posts')
      .select('*')
      .order('created_at', { ascending: false })
    setPosts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchPosts() }, [])

  const filtered = selectedCategory === '전체'
    ? posts
    : posts.filter(p => p.category === selectedCategory)

  function handleEdit(post) {
    setSelectedPost(null)
    setEditPost(post)
    setShowForm(true)
  }

  function handleFormClose() {
    setShowForm(false)
    setEditPost(null)
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* 헤더 */}
          <div className="flex items-end justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-text">Study Log</h1>
              <p className="text-text-sub text-sm mt-1">공부한 내용을 기록합니다.</p>
            </div>
            {user && (
              <button
                onClick={() => { setEditPost(null); setShowForm(true) }}
                className="bg-accent hover:bg-mint text-bg font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
              >
                + 글쓰기
              </button>
            )}
          </div>

          <div className="w-12 h-1 bg-accent rounded-full mt-4 mb-8" />

          {/* 카테고리 필터 */}
          <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />

          {/* 글 목록 */}
          {loading ? (
            <p className="text-text-sub text-sm text-center py-16">불러오는 중...</p>
          ) : filtered.length === 0 ? (
            <p className="text-text-sub text-sm text-center py-16">아직 작성된 글이 없습니다.</p>
          ) : (
            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {filtered.map(post => (
                  <StudyPostCard key={post.id} post={post} onClick={() => setSelectedPost(post)} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      {/* 글 상세 모달 */}
      <AnimatePresence>
        {selectedPost && (
          <StudyPostDetail
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            onEdit={handleEdit}
            onDeleted={fetchPosts}
          />
        )}
      </AnimatePresence>

      {/* 작성/수정 폼 모달 */}
      <AnimatePresence>
        {showForm && (
          <StudyPostForm
            editPost={editPost}
            onClose={handleFormClose}
            onSaved={fetchPosts}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
