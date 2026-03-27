import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../libs/supabaseClient'
import PostForm from './PostForm'
import PostList from './PostList'

export default function BoardSection() {
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
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-text mb-2">방명록</h2>
          <p className="text-text-sub text-sm mb-8">방문해주셔서 감사합니다. 한 마디 남겨주세요 :)</p>
          <PostForm onPosted={fetchPosts} />
          <PostList posts={posts} loading={loading} onDeleted={fetchPosts} />
        </motion.div>
      </div>
    </section>
  )
}
