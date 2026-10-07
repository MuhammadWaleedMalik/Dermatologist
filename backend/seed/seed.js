
import { env } from '../config/env.js'
import { connectDB, disconnectDB } from '../config/db.js'
import { User } from '../models/User.js'

const fresh = process.argv.includes('--fresh')

async function seed() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME?.trim() || 'Administrator'

  if (!email || !password) {
    console.error('[seed] ADMIN_EMAIL and ADMIN_PASSWORD must be set in backend/.env')
    process.exit(1)
  }

  await connectDB()

  const existing = await User.findOne({ email })

  if (existing && fresh) {
    await User.deleteOne({ _id: existing._id })
    console.log(`[seed] Removed existing admin ${email}`)
  } else if (existing) {
    console.log(`[seed] Admin ${email} already exists — leaving it unchanged.`)
    await disconnectDB()
    return
  }

  const passwordHash = await User.hashPassword(password)
  await User.create({ name, email, passwordHash, role: 'admin' })

  console.log(`[seed] Created admin ${email}`)
  console.log(`[seed] Environment: ${env.nodeEnv}`)
}

seed()
  .catch((error) => {
    console.error('[seed] Failed:', error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await disconnectDB().catch(() => {})
  })