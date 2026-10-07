import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { ApiError } from './ApiError.js'

/**
 * Issue a signed JWT for an authenticated user.
 * The token only carries identity + role; nothing sensitive.
 */
export function signToken(user) {
  return jwt.sign(
    { sub: String(user._id), email: user.email, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn, issuer: 'dr-salman-clinic' }
  )
}

/**
 * Verify a JWT and return its payload. Throws ApiError(401) when invalid,
 * expired, or malformed.
 */
export async function verifyToken(token) {
  try {
    return jwt.verify(token, env.jwtSecret, { issuer: 'dr-salman-clinic' })
  } catch {
    throw ApiError.unauthorized('Invalid or expired session token')
  }
}