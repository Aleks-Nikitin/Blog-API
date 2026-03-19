import { Link } from 'react-router'

function PostPreview({ post }) {
  if (!post) return null

  return (
    <article className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-xl text-white truncate hover:cursor-pointer hover:font-bold transition-all"><Link to={`/posts/${post.id}`}>{post.title}</Link></h3>
          <p className="text-sm opacity-70">
            By {post?.user?.firstname} {post?.user?.lastname} • {post.timestamp}
          </p>
        </div>
      </div>

      <p className="mt-2">
        {(post.msg ).slice(0, 150)}
        {(post.msg ).length > 150 ? '...' : ''}
      </p>
    </article>
  )
}

export default PostPreview