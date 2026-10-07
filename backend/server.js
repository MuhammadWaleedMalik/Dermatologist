// Local development / traditional-host entry point.
//
// On Vercel this file is safe too: Vercel sets VERCEL=1, so the listener is
// skipped and only the app is exported. This avoids any ambiguity with Vercel's
// zero-config Express detection (which treats app.js/server.js as the entry).

import app from './app.js'
import { env } from './config/env.js'
import { connectDB, disconnectDB } from './config/db.js'

// Export the app so importing this file (e.g. on Vercel) yields a valid handler.
export default app

// Start a long-running listener only outside the serverless environment.
if (!process.env.VERCEL) {
  // Fail fast and loudly: no database, no server.
  try {
    await connectDB()
  } catch (error) {
    console.error('[db] FATAL: could not connect to MongoDB — shutting down.')
    console.error(
      '[db] Check MONGODB_URI and that this machine/IP is allowed in MongoDB Atlas Network Access.',
    )
    process.exit(1)
  }

  const server = app.listen(env.port, () => {
    console.log(`[server] Dr Salman Clinic API listening on http://localhost:${env.port}`)
    console.log(`[server] Environment: ${env.nodeEnv}`)
    console.log(`[server] Accepting browser requests from: ${env.clientUrls.join(', ')}`)
  })

  /** Close the HTTP server and the database connection, then exit. */
  async function shutdown(signal) {
    console.log(`\n[server] ${signal} received, shutting down...`)
    server.close(async () => {
      await disconnectDB()
      process.exit(0)
    })
    // Do not hang forever if a connection refuses to close.
    setTimeout(() => process.exit(1), 10000).unref()
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))

  process.on('unhandledRejection', (reason) => {
    console.error('[server] Unhandled promise rejection:', reason)
    shutdown('unhandledRejection')
  })

  process.on('uncaughtException', (error) => {
    console.error('[server] Uncaught exception:', error)
    process.exit(1)
  })
}
