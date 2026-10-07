import { User } from '../models/User.js'
import { verifyToken } from '../utils/token.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

function extractBearerToken(req) {
  const header = req.headers.authorization || ''
  if (header.startsWith('Bearer ')) return header.slice(7).trim()
  return null
}

/**
 * Require a valid JWT. Verifies the signature *and* that the referenced user
 * still exists, so a deleted admin cannot keep using an old token.
 */
export const protect = asyncHandler(async (req, _res, next) => {
  const token = extractBearerToken(req)
  if (!token) {
    throw ApiError.unauthorized('Authentication required. Please sign in.')
  }

  const payload = await verifyToken(token)

  const user = await User.findById(payload.sub)
  if (!user) {
    throw ApiError.unauthorized('Your session is no longer valid. Please sign in again.')
  }

  req.user = user
  next()
})

/**
 * Attach `req.user` when a valid token is present, but never reject.
 * Used by public endpoints that return richer data to a signed-in admin
 * (e.g. viewing an unpublished blog by its direct slug).
 */
export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const token = extractBearerToken(req)
  if (token) {
    try {
      const payload = await verifyToken(token)
      req.user = await User.findById(payload.sub)
    } catch {
      // An invalid token on a public route is simply treated as anonymous.
      req.user = undefined
    }
  }
  next()
})

/**
 * Require a specific role. Must run after `protect`.
 * Usage: router.get('/x', protect, requireRole('admin'), handler)
 */
export function requireRole(...roles) {
  return function roleGuard(req, _res, next) {
    if (!req.user) {
      return next(ApiError.unauthorized())
    }
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to perform this action.'))
    }
    return next()
  }
}