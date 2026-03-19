import { useMemo } from 'react'
import { useOutletContext, useParams } from 'react-router'
import Post from './Post.jsx'
import CommentSection from './CommentSection.jsx'

function PostPage() {
  const { postId } = useParams()
  const { postsArr } = useOutletContext()

  const post = useMemo(() => {
    const id = Number(postId)
    return (postsArr ?? []).find((p) => Number(p.id) === id) ?? null
  }, [postId, postsArr])

  if (!post) {
    return <p className="text-sm opacity-80">Post not found.</p>
  }

  return (
    <section className="max-w-3xl mx-auto space-y-6">
      <Post post={post} />
      <CommentSection postId={post.id} postAuthorId={post.userId} />
    </section>
  )
}

export default PostPage

