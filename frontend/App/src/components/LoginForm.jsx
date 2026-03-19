import { useState } from 'react'
import { useNavigate } from 'react-router'
import { setToken } from '../lib/auth.js'

function toUrlEncoded(body) {
  return new URLSearchParams(body).toString()
}

function LoginForm() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  async function onSubmit(e) {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: toUrlEncoded({ email, password }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.token) {
        throw new Error(data?.msg ?? 'Login failed')
      }

      setToken(data.token)
      navigate('/')
    } catch (err) {
      console.error(err)
      setErrorMsg(err?.message ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Log in</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm">Email</span>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="text-sm">Password</span>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {errorMsg ? <p className="text-red-500 text-sm">{errorMsg}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white rounded px-3 py-2 disabled:opacity-60"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </section>
  )
}

export default LoginForm