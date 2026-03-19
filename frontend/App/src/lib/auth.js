const TOKEN_KEY = 'token'
const AUTH_CHANGED_EVENT = 'auth-changed'

function emitAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  emitAuthChanged()
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  emitAuthChanged()
}

export function getAuthHeader() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function subscribeAuth(callback) {
  function onStorage(e) {
    if (e?.key === TOKEN_KEY) callback()
  }

  window.addEventListener(AUTH_CHANGED_EVENT, callback)
  window.addEventListener('storage', onStorage)

  return () => {
    window.removeEventListener(AUTH_CHANGED_EVENT, callback)
    window.removeEventListener('storage', onStorage)
  }
}

export function getJwtPayload(token) {
  try {
    const payload = token?.split('.')?.[1]
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

