// Admin authentication, backed by the Express API.
//
// HOW IT WORKS NOW
//   - Credentials are verified server-side against a bcrypt hash in MongoDB.
//   - The server returns a short-lived JWT; this module keeps it in
//     localStorage under `admin_token` and the profile under `admin_user` —
//     the same two keys AdminLogin.jsx and Dashboard.jsx already read.
//   - No credential or hash is ever compiled into the frontend bundle.
//
// SECURITY NOTE
// A JWT in localStorage is readable by any script running on the page, so it
// is safe only because the API is same-site and CORS-locked to the frontend
// origin. For a production clinic site, move the token to an HttpOnly cookie.

import api, { setToken } from './api'

const USER_KEY = 'admin_user'

/**
 * POST /api/auth/login
 * @returns {{ token: string, user: { id, name, email, role } }}
 */
export async function loginAdmin(email, password) {
  const response = await api.post('/auth/login', { email, password })
  const { token, user } = response.data

  setToken(token)
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch {
    // Non-fatal: the token is what matters for authorization.
  }

  return { token, user }
}

/** POST /api/auth/logout — clears the local session. */
export async function logoutAdmin() {
  try {
    await api.post('/auth/logout')
  } catch {
    // The token may already be invalid; clearing locally is what matters.
  }
  setToken(null)
  try {
    localStorage.removeItem(USER_KEY)
  } catch {
    // ignore
  }
}

/**
 * GET /api/auth/me — validates the stored token against the server.
 * Returns the admin profile, or null when the token is missing/expired.
 */
export async function getCurrentAdmin() {
  if (!isAuthenticated()) return null

  try {
    const response = await api.get('/auth/me')
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(response.data))
    } catch {
      // ignore
    }
    return response.data
  } catch (error) {
    if (error.status === 401 || error.status === 403) {
      // Expired or revoked token — clear the stale session.
      setToken(null)
      try {
        localStorage.removeItem(USER_KEY)
      } catch {
        // ignore
      }
      return null
    }
    throw error
  }
}

/**
 * Synchronous token check used by ProtectedRoute.
 *
 * Deliberately synchronous: ProtectedRoute runs during the first render and
 * cannot await. The token's validity is confirmed server-side on the first
 * authenticated request, and getCurrentAdmin() re-validates it explicitly.
 */
export function isAuthenticated() {
  try {
    return Boolean(localStorage.getItem('admin_token'))
  } catch {
    return false
  }
}

/** Cached admin profile, or an empty object when signed out. */
export function getStoredAdmin() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
  } catch {
    return {}
  }
}
