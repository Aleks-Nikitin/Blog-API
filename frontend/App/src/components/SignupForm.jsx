import { useState } from 'react'
import { useNavigate } from 'react-router'

function toUrlEncoded(body) {
  return new URLSearchParams(body).toString()
}

function SignupForm() {
  const navigate = useNavigate()

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confpassword, setConfpassword] = useState('')

  const [errorMsg, setErrorMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  const API_BASE_URL = 'https://blog-api-production-43f2.up.railway.app/'

  async function onSubmit(e) {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: toUrlEncoded({ firstname, lastname, email, password, confpassword }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(data?.msg ?? 'Signup failed')
      }

      // backend may return either {msg:"user created"} or validation errors object
      if (data?.msg) {
        navigate('/login')
      } else {
        throw new Error('Signup failed. Check the form fields and try again.')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg(err?.message ?? 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Sign up</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm">First name</span>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </label>

          <label className="block">
            <span className="text-sm">Last name</span>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </label>
        </div>

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

        <label className="block">
          <span className="text-sm">Confirm password</span>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            type="password"
            value={confpassword}
            onChange={(e) => setConfpassword(e.target.value)}
            required
          />
        </label>

        {errorMsg ? <p className="text-red-500 text-sm">{errorMsg}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white rounded px-3 py-2 disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
    </section>
  )
}

export default SignupForm