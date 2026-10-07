import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'

import { env } from './config/env.js'
import { ensureDb } from './config/db.js'
import { notFound, errorHandler } from './middleware/error.middleware.js'
import { sanitizeQuery } from './middleware/sanitize.middleware.js'
import { ApiError } from './utils/ApiError.js'
import { serveStoredImage } from './services/image.service.js'

import authRoutes from './routes/auth.routes.js'
import blogRoutes from './routes/blog.routes.js'
import reviewRoutes from './routes/review.routes.js'
import treatmentRoutes, { treatmentCategoryRouter } from './routes/treatment.routes.js'
import beforeAfterRoutes from './routes/beforeAfter.routes.js'
import adminRoutes from './routes/admin.routes.js'

const app = express()

// Trust the first proxy hop so express-rate-limit reads the real client IP when
// deployed behind a reverse proxy (Vercel, Render, Railway, Nginx, ...).
app.set('trust proxy', 1)

app.use(
  helmet({
    // Images are served to a separate frontend origin, so the default
    // same-origin resource policy would block them.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
)

app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin/non-browser callers (health checks, curl) which send
      // no Origin header, plus the explicitly configured frontend origins.
      if (!origin || env.clientUrls.includes(origin)) return callback(null, true)
      return callback(ApiError.forbidden(`Origin ${origin} is not allowed by CORS`))
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  }),
)

// Reject oversized bodies before they reach a route handler. base64 image
// uploads arrive here, so the cap is deliberately above the per-image limit but
// still under Vercel's request body ceiling.
app.use(express.json({ limit: '6mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// Strip MongoDB operators / nested objects from the query string (NoSQL
// injection protection) before any route reads it.
app.use(sanitizeQuery)

// Broad ceiling for the whole API; individual endpoints add tighter limits.
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 600,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  }),
)

// GridFS-backed images are streamed from MongoDB. This route stays outside
// `/api` so stored image references remain simple browser-ready paths.
app.get('/uploads/:id', ensureDb, serveStoredImage)

// ---- Health check -------------------------------------------------------
// Registered before the database guard so it always answers, and reports the
// live connection state instead of failing when MongoDB is unreachable.
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      environment: env.nodeEnv,
      uptime: Math.round(process.uptime()),
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    },
  })
})

// ---- Database guard -----------------------------------------------------
// Vercel/serverless: connect lazily (and reuse the cached connection) before
// any data-backed route runs. Locally the connection is already open, so this
// is a no-op.
app.use('/api', ensureDb)

// ---- API index ----------------------------------------------------------
app.get('/', (_req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Dr Salman Skin & Hair Clinic API',
      version: '1.0.0',
      docs: '/api/health',
    },
  })
})

// ---- Routes -------------------------------------------------------------
app.use('/api/auth', authRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/treatments', treatmentRoutes)
app.use('/api/treatment-categories', treatmentCategoryRouter)
app.use('/api/before-after', beforeAfterRoutes)
// All CRUD for admin-only resources lives here, protected inside the router.
app.use('/api/admin', adminRoutes)

// ---- Error handling -----------------------------------------------------
app.use(notFound)
app.use(errorHandler)

export default app
