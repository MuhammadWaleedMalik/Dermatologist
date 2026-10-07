// HTTP client for the Express backend.
//
// Every response uses the same envelope:
//   success: { success: true,  data: ... }
//   failure: { success: false, message: "...", errors?: { field: message } }
//
// Service modules unwrap `.data` so the rest of the app never deals with the
// envelope. The admin JWT is attached automatically when one is stored.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const TOKEN_KEY = 'admin_token'

/** Read the admin JWT that authService stored after login. */
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Storage unavailable (private browsing) — the request simply goes out
    // unauthenticated and the API answers 401.
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getToken()

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  }

  let response
  try {
    response = await fetch(url, config)
  } catch {
    // Network-level failure: server down, wrong VITE_API_BASE_URL, CORS blocked.
    throw new Error(
      'Could not reach the server. Make sure the backend is running and VITE_API_BASE_URL is correct.',
    )
  }

  // 204/empty bodies should not break JSON parsing.
  const text = await response.text()
  let payload = null
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      payload = null
    }
  }

  if (!response.ok) {
    const fallback =
      response.status === 429
        ? 'Too many requests. Please wait a moment and try again.'
        : `Request failed with status ${response.status}`
    const error = new Error(payload?.message || fallback)
    error.status = response.status
    error.errors = payload?.errors
    throw error
  }

  return payload ?? { success: true, data: null }
}

const json = (method, body) => ({ method, body: JSON.stringify(body) })

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, body) => request(endpoint, json('POST', body)),
  put: (endpoint, body) => request(endpoint, json('PUT', body)),
  patch: (endpoint, body) => request(endpoint, json('PATCH', body)),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
}

export default api