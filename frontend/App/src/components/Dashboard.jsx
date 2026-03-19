import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router'
import { getJwtPayload, getToken, subscribeAuth } from '../lib/auth.js'
import PostPreview from './PostPreview.jsx'

function Dashboard() {
  const { postsArr } = useOutletContext()
  const [welcomeName, setWelcomeName] = useState(null)
  const [authReady, setAuthReady] = useState(false)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  useEffect(() => {
    async function loadUser() {
      const token = getToken()
      if (!token) {
        setWelcomeName(null)
        setAuthReady(true)
        return
      }

      const payload = getJwtPayload(token)
      const userId = payload?.id
      if (!userId) {
        setWelcomeName(null)
        setAuthReady(true)
        return
      }

      try {
        const res = await fetch(`${API_BASE_URL}/users/${userId}`)
        const data = await res.json().catch(() => null)
        const user = data?.user
        if (user?.firstname || user?.lastname) {
          setWelcomeName(`${user.firstname ?? ''} ${user.lastname ?? ''}`.trim())
        } else {
          setWelcomeName('Author')
        }
      } catch {
        setWelcomeName(null)
      } finally {
        setAuthReady(true)
      }
    }

    loadUser()
    return subscribeAuth(loadUser)
  }, [API_BASE_URL])

  return (
    <section>
      {authReady && welcomeName ? (
        <p className="mb-3 text-sm opacity-80">Welcome, {welcomeName}.</p>
      ) : null}

      <h2 className="text-2xl font-semibold mb-4">Published Posts</h2>

      {postsArr?.length ? (
        <div className="space-y-4">
          {postsArr.map((post) => (
            <PostPreview key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p>No published posts found.</p>
      )}
    </section>
  )
}

export default Dashboard