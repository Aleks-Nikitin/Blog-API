import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { clearToken, getToken, subscribeAuth } from '../lib/auth.js'

function SiteNav() {
  const navigate = useNavigate()
  const [token, setToken] = useState(() => getToken())

  useEffect(() => subscribeAuth(() => setToken(getToken())), [])

  function onLogout() {
    clearToken()
    navigate('/login')
  }

  return (
    <nav className="flex justify-between text-white [&_a]:hover:font-bold [&_a]:transition-all text-4xl font-sans mb-8">
      <h2>
        <Link to="/">Blog</Link>
      </h2>

      <div className="flex gap-7">
        {token ? <Link to="/create">New Post</Link> : <Link to="/signup">Sign up</Link>}

        {token ? (
          <button
            type="button"
            onClick={onLogout}
            className="text-white hover:font-bold transition-all"
          >
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  )
}

export default SiteNav

