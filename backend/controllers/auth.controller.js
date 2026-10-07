import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { signToken } from '../utils/token.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// A throwaway hash of a random string. Comparing against it when the email is
// unknown keeps login response times similar whether or not the account exists,
// which stops this endpoint from being used to discover admin emails.
const DUMMY_HASH = '$2b$12$6sabagNEAlaEB9GNwD8mfetOQc1wfwWiLa1fVyeeXwA46cPknSMTu'

/**
 * POST /api/auth/login
 *
 * Returns `{ token, user }` — the exact shape the existing AdminLogin screen
 * already stores in localStorage (`admin_token` / `admin_user`).
 *
 * The same generic message is returned for an unknown email and a wrong
 * password so the endpoint cannot be used to enumerate admin accounts.
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash')

  const isValid = await bcrypt.compare(
    password,
    user?.passwordHash ?? DUMMY_HASH,
  )

  if (!user || !isValid) {
    throw ApiError.unauthorized('Invalid email or password')
  }

  const token = signToken(user)

  res.json({
    success: true,
    data: {
      token,
      user: user.toPublicJSON(),
    },
  })
})

/**
 * GET /api/auth/me
 * Validates the stored token on page load / session restore.
 */
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user.toPublicJSON(),
  })
})

/**
 * POST /api/auth/logout
 *
 * JWTs are stateless, so there is no server-side session to destroy. The
 * client removes its copy of the token; keeping this endpoint gives the
 * frontend one place to hook a future refresh-token blacklist.
 */
export const logout = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: { message: 'Signed out' } })
})