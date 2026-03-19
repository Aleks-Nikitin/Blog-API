import { useState } from 'react'
import { useNavigate } from 'react-router'
import { getToken } from '../lib/auth.js'

function toUrlEncoded(body) {
  return new URLSearchParams(body).toString()
}

function CreatePost() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [msg, setMsg] = useState('')
  const [published, setPublished] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  async function onSubmit(e) {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)

    try {
      const token = getToken()
      if (!token) throw new Error('You must be logged in to create a post.')

      if (!title.trim()) throw new Error('Title is required.')
      if (!msg.trim()) throw new Error('Post content is required.')

      const res = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`,
        },
        body: toUrlEncoded({ title, msg, published }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(data?.msg ?? 'Failed to create post')
      }

      navigate('/')
    } catch (err) {
      console.error(err)
      setErrorMsg(err?.message ?? 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create post</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm">Title</span>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My new blog post"
            required
          />
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <span className="text-sm">Published</span>
        </label>

        <div>
          <span className="text-sm block mb-1">Content</span>
          <textarea
            className="w-full min-h-80 border rounded px-3 py-2 leading-relaxed"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Write your post..."
            required
          />
        </div>

        {errorMsg ? <p className="text-red-500 text-sm">{errorMsg}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white rounded px-4 py-2 disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Create post'}
        </button>
      </form>
    </section>
  )
}

export default CreatePost

