import { useEffect, useState } from 'react'
import { getAuthHeader, getJwtPayload, getToken, subscribeAuth } from '../lib/auth.js'

function TrashButton({ onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="ml-2 inline-flex items-center rounded p-1 text-red-600 hover:bg-red-50 disabled:opacity-60"
      aria-label="Delete comment"
      title="Delete comment"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </svg>
    </button>
  )
}

function CommentSection({ postId, postAuthorId }) {
  const [comments, setComments] = useState([])
  const [msg, setMsg] = useState('')
  const [token, setToken] = useState(() => getToken())
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)
  const [posting, setPosting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const API_BASE_URL = 'https://blog-api-production-43f2.up.railway.app'

  useEffect(() => subscribeAuth(() => setToken(getToken())), [])

  useEffect(() => {
    async function load() {
      setLoading(true)
      setErrorMsg(null)
      try {
        const res = await fetch(`${API_BASE_URL}/comments/${postId}`)
        if (!res.ok) throw new Error('Failed to load comments')
        const data = await res.json()
        setComments(data?.comments ?? [])
      } catch (err) {
        console.error(err)
        setComments([])
        setErrorMsg(err?.message ?? 'Failed to load comments')
      } finally {
        setLoading(false)
      }
    }

    if (postId != null) load()
  }, [API_BASE_URL, postId])

  const currentUserId = getJwtPayload(token)?.id
  const canModerate = Boolean(token) && Number(currentUserId) === Number(postAuthorId)

  async function onSubmit(e) {
    e.preventDefault()
    setErrorMsg(null)
    setPosting(true)

    try {
      if (!token) throw new Error('Login required to comment.')
      if (!msg.trim()) throw new Error('Comment cannot be empty.')

      const res = await fetch(`${API_BASE_URL}/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...getAuthHeader(),
        },
        body: new URLSearchParams({ msg }).toString(),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.msg ?? 'Failed to post comment')

      setMsg('')
      // backend returns { msg: createdComment }
      const created = data?.msg
      if (created?.id) setComments((prev) => [created, ...prev])
      else {
        // fallback refresh
        const refresh = await fetch(`${API_BASE_URL}/comments/${postId}`)
        const refreshed = await refresh.json().catch(() => null)
        setComments(refreshed?.comments ?? [])
      }
    } catch (err) {
      console.error(err)
      setErrorMsg(err?.message ?? 'Failed to post comment')
    } finally {
      setPosting(false)
    }
  }

  async function onDelete(commentId) {
    setErrorMsg(null)
    setDeletingId(commentId)

    try {
      if (!canModerate) throw new Error('Only the post author can delete comments.')

      const res = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
        },
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.msg ?? 'Failed to delete comment')

      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch (err) {
      console.error(err)
      setErrorMsg(err?.message ?? 'Failed to delete comment')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="rounded-lg border p-5">
      <h3 className="text-xl font-semibold">Comments</h3>

      {loading ? <p className="mt-2 text-sm opacity-80">Loading comments...</p> : null}
      {!loading && errorMsg ? <p className="mt-2 text-sm text-red-500">{errorMsg}</p> : null}

      {!loading && !errorMsg ? (
        <div className="mt-4 space-y-3">
          {comments.length ? (
            comments.map((c) => (
              <div key={c.id} className="rounded border px-3 py-2">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm opacity-70">{c.timestamp}</p>
                  {canModerate ? (
                    <TrashButton
                      onClick={() => onDelete(c.id)}
                      disabled={deletingId === c.id}
                    />
                  ) : null}
                </div>
                <p className="whitespace-pre-wrap">{c.msg}</p>
              </div>
            ))
          ) : (
            <p className="text-sm opacity-80">No comments yet.</p>
          )}
        </div>
      ) : null}

      <div className="mt-6">
        {token ? (
          <form onSubmit={onSubmit} className="space-y-2">
            <textarea
              className="w-full min-h-28 border rounded px-3 py-2"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Write a comment..."
            />
            <button
              type="submit"
              disabled={posting}
              className="bg-indigo-600 text-white rounded px-4 py-2 disabled:opacity-60"
            >
              {posting ? 'Posting...' : 'Post comment'}
            </button>
          </form>
        ) : (
          <p className="text-sm opacity-80">Log in to write a comment.</p>
        )}
      </div>
    </section>
  )
}

export default CommentSection