// Centralised, validated access to environment variables.
//
// The server refuses to boot when a required secret is missing so that a
// misconfigured deployment fails loudly instead of silently running without a
// database or with an unsigned token.

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Locally this reads backend/.env regardless of the working directory. On
// Vercel there is no .env file and this is a no-op: the platform injects the
// variables into process.env.
dotenv.config({ path: path.join(__dirname, '..', '.env'), quiet: true })

const REQUIRED = ['MONGODB_URI', 'JWT_SECRET']

const missing = REQUIRED.filter((key) => !process.env[key]?.trim())

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variable(s): ${missing.join(', ')}. ` +
      'Copy backend/.env.example to backend/.env (or set them in Vercel project settings).',
  )
}

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value ?? '', 10)
  return Number.isNaN(parsed) ? fallback : parsed
}

// Accept either CLIENT_URL (existing name) or FRONTEND_URL (common Vercel
// name); both are comma-separated lists. Merged so a deployment can set either.
const clientUrls = [process.env.CLIENT_URL, process.env.FRONTEND_URL]
  .filter(Boolean)
  .join(',')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean)

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toInt(process.env.PORT, 5000),

  mongoUri: process.env.MONGODB_URI.trim(),
  // Kept configurable but defaults to the database name already in use, so the
  // existing Atlas data is untouched.
  mongoDbName: (process.env.MONGODB_DB_NAME || 'Derma-App').trim(),

  // Required and must be long enough to be usable as an HMAC key.
  jwtSecret: process.env.JWT_SECRET.trim(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // Comma-separated list of origins allowed to call the API.
  clientUrls: clientUrls.length > 0 ? clientUrls : ['http://localhost:5173'],

  // Optional bootstrap admin, created by `npm run seed` when no admin exists.
  adminEmail: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
  adminPassword: process.env.ADMIN_PASSWORD || '',
  adminName: process.env.ADMIN_NAME || 'Administrator',

  // GridFS bucket used for image binary data (`images.files` / `images.chunks`).
  imageBucket: (process.env.GRIDFS_BUCKET || 'images').trim(),
  // Base64 inflates a file by ~33%, so keep this comfortably below the request
  // body limit configured in app.js.
  maxUploadBytes: toInt(process.env.MAX_UPLOAD_MB, 3) * 1024 * 1024,
}

export const isProduction = env.nodeEnv === 'production'
