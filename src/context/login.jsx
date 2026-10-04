import { createContext, useContext, useRef, useState } from 'react'
import { ENDPOINTS } from '../App'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Store the token in local storage
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const refreshPromise = useRef(null)

  // When logging out, clear the tokens
  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    setToken(null)
  }

  // Swap the refresh token for a new access token, returns null if that fails
  async function refreshAccessToken() {
    // Attempt to get the currently stored refreshToken
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) return null;

    // If several requests get a 401 at once, they all wait on the same refresh
    if (!refreshPromise.current) {
      // Pass the refresh token to the backend to get a new access token
      refreshPromise.current = fetch(ENDPOINTS.refresh, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((body) => body?.accessToken ?? null)
        .catch(() => null)
        .finally(() => {
          refreshPromise.current = null
        });
    };

    const newToken = await refreshPromise.current;
    if (newToken) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
    };
    return newToken;
  }

  async function apiFetch(url, options = {}, retried = false) {
    // Read from localStorage so a token refreshed by another request is picked up
    const currentToken = localStorage.getItem('token')
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(currentToken ? { Authorization: `Bearer ${currentToken}` } : {}),
        ...options.headers,
      },
    })

    // Access token expired: refresh it once and retry the original request
    if (res.status === 401 && currentToken && !retried) {
      const newToken = await refreshAccessToken()
      if (newToken) return apiFetch(url, options, true)
    }

    const body = await res.json().catch(() => ({}))

    if (res.status === 401 && currentToken) logout()
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
    const newToken = data.accessToken
    if (!newToken) throw new Error('No token returned from /login')
    localStorage.setItem('token', newToken)
    localStorage.setItem('refreshToken', data.refreshToken)
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
