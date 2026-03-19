import { useEffect, useState } from 'react'
import SiteNav from './SiteNav.jsx'
import { Outlet } from 'react-router'
function App() {

  const [loading, setLoading] = useState(true)
  const [postsArr, setPostsArr] = useState([])
  const [errorMsg, setErrorMsg] = useState(null)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
  useEffect(()=>{
      const dataFetch = async ()=>{
        setLoading(true)
        setErrorMsg(null)

        try {
          const res = await fetch(`${API_BASE_URL}/posts`)

          if (!res.ok) {
            const text = await res.text().catch(() => '')
            throw new Error(
              `Failed to fetch published posts (${res.status}): ${text || res.statusText}`,
            )
          }

          const data = await res.json()
          setPostsArr(data?.published ?? [])
        } catch (err) {
          console.error(err)
          setPostsArr([])
          setErrorMsg(err?.message ?? 'Failed to load posts')
        } finally {
          setLoading(false)
        }
      }
      dataFetch();

  }, [API_BASE_URL])
  return (
    <main className="p-7">
      <SiteNav />
      {loading ? <h1>Loading ....</h1> : null}
      {!loading && errorMsg ? <p className="mt-3 text-red-500">{errorMsg}</p> : null}
      <Outlet context={{ postsArr, setPostsArr }} />
    </main>
  )
}

export default App
