import mongoose from 'mongoose'
import { env } from './env.js'

// Mongoose is strict about queries we do not want: an unknown filter key is a
// bug, not something to silently drop.
mongoose.set('strictQuery', true)

// Connection options tuned for serverless (Vercel) as well as a long-running
// local process. `bufferCommands` stays on so a request that arrives while the
// first connection is still being established waits instead of failing.
const CONNECT_OPTIONS = {
  dbName: env.mongoDbName,
  serverSelectionTimeoutMS: 8000,
  maxPoolSize: 10,
  minPoolSize: 0,
}

// Cache the in-flight/settled connection on the Node global object. On Vercel a
// warm function instance reuses this, so we do not open a brand-new Atlas
// connection on every request (which is what exhausts a cluster's connection
// limit). The module-scope fallback keeps it working on platforms without a
// persisted global object.
const globalCache = globalThis
if (!globalCache.__mongooseCache) {
  globalCache.__mongooseCache = { conn: null, promise: null }
}
const cache = globalCache.__mongooseCache

/**
 * Connect to MongoDB. Safe to call many times: the first call opens the
 * connection and every later call reuses it.
 *
 * Throws on failure instead of calling `process.exit`, so the HTTP layer can
 * answer with a 503 rather than killing the whole (serverless) instance.
 */
export async function connectDB() {
  if (cache.conn) return cache.conn

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(env.mongoUri, CONNECT_OPTIONS)
      .then((m) => {
        console.log(`[db] Connected to MongoDB (${m.connection.host}/${m.connection.name})`)
        return m
      })
      .catch((error) => {
        // Reset so a later request can retry rather than reusing a rejected
        // promise forever.
        cache.promise = null
        console.error('[db] MongoDB connection failed.')
        console.error(`[db] ${error.message}`)
        throw error
      })
  }

  try {
    cache.conn = await cache.promise
  } catch (error) {
    cache.conn = null
    throw error
  }

  return cache.conn
}

/** True when the driver reports an open connection. */
export function isDbConnected() {
  return mongoose.connection.readyState === 1
}

/**
 * Express middleware: make sure a connection exists before running a route.
 * Applied only to /api routes, so the health check can still answer (and report
 * the failure) when the database is unreachable.
 */
export async function ensureDb(req, _res, next) {
  try {
    await connectDB()
    next()
  } catch (error) {
    next(error)
  }
}

export async function disconnectDB() {
  if (mongoose.connection.readyState === 0) return
  await mongoose.connection.close()
  cache.conn = null
  cache.promise = null
  console.log('[db] Connection closed')
}