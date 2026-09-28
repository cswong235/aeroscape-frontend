import { createContext, useContext, useState } from 'react'
import { ENDPOINTS } from '../App'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
  }

  async function apiFetch(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
    const body = await res.json().catch(() => ({}))

    if (res.status === 401 && token) logout()
    if (!res.ok) {
      const err = body.error?.message || body.error || body.message
      throw new Error(err || `Request failed (${res.status})`)
    }
    return body.data ?? body
  }

  async function login(email, password) {
    const data = await apiFetch(ENDPOINTS.login, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    const newToken = data.token || data.access_token || data.session?.access_token
    if (!newToken) throw new Error('No token returned from /login')
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  async function signup(email, password, username) {
    return apiFetch(ENDPOINTS.signup, {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    })
  }

  return (
    <AuthContext.Provider value={{ token, login, signup, logout, apiFetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
