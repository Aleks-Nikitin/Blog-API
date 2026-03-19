function Post({ post }) {
  if (!post) return null

  return (
    <article className="rounded-lg border p-5">
      <h1 className="text-3xl font-semibold">{post.title}</h1>
      <p className="mt-2 text-sm opacity-70">
        By {post?.user?.firstname} {post?.user?.lastname} • {post.timestamp}
      </p>
      <div className="mt-4 whitespace-pre-wrap leading-relaxed">{post.msg}</div>
    </article>
  )
}

export default Post

