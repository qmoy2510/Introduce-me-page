import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../libs/supabaseClient'
import PostForm from '../components/board/PostForm'
import PostItem from '../components/board/PostItem'

export default function BoardPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchPosts() {
    setLoading(true)
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    setPosts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchPosts() }, [])

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-text mb-2">게시판</h1>
          <p className="text-text-sub text-sm mb-8">자유롭게 글을 남겨주세요 :)</p>

          <PostForm onPosted={fetchPosts} />

          {loading ? (
            <p className="text-text-sub text-sm text-center py-12">불러오는 중...</p>
          ) : posts.length === 0 ? (
            <p className="text-text-sub text-sm text-center py-12">아직 작성된 글이 없습니다. 첫 글을 남겨보세요!</p>
          ) : (
            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {posts.map(post => (
                  <PostItem key={post.id} post={post} onDeleted={fetchPosts} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
