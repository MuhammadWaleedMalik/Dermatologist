import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { getCurrentAdmin, isAuthenticated } from '../../services/authService'

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState(() =>
    isAuthenticated() ? 'checking' : 'unauthenticated',
  )

  useEffect(() => {
    if (status !== 'checking') return undefined

    let active = true
    getCurrentAdmin()
      .then((admin) => {
        if (active) setStatus(admin ? 'authenticated' : 'unauthenticated')
      })
      .catch(() => {
        if (active) setStatus('unavailable')
      })

    return () => {
      active = false
    }
  }, [status])

  if (status === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />
  }

  if (status === 'unavailable') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent-gray px-4">
        <div className="max-w-md rounded-2xl border border-accent bg-white p-8 text-center shadow-lg">
          <h1 className="text-xl font-bold text-primary">Admin server unavailable</h1>
          <p className="mt-2 text-sm text-primary/60">
            Your session could not be verified. Make sure the backend is running, then try again.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setStatus('checking')}
              className="rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-primary"
            >
              Try Again
            </button>
            <Link to="/admin/login" className="rounded-xl border border-accent px-4 py-2 text-sm font-semibold text-primary">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent-gray">
        <div className="w-12 h-12 border-4 border-gold border-t-primary rounded-full animate-spin" role="status" aria-label="Verifying session" />
      </div>
    )
  }

  return children
}
