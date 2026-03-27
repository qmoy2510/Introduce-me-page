import { AnimatePresence } from 'framer-motion'
import PostItem from './PostItem'

export default function PostList({ posts, loading, onDeleted }) {
  if (loading) {
    return <p className="text-text-sub text-sm text-center py-8">불러오는 중...</p>
  }
  if (posts.length === 0) {
    return <p className="text-text-sub text-sm text-center py-8">아직 작성된 글이 없습니다. 첫 방명록을 남겨보세요!</p>
  }
  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence>
        {posts.map(post => (
          <PostItem key={post.id} post={post} onDeleted={onDeleted} />
        ))}
      </AnimatePresence>
    </div>
  )
}
