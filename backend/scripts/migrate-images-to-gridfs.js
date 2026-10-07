import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { connectDB, disconnectDB } from '../config/db.js'
import { Blog } from '../models/Blog.js'
import { Review } from '../models/Review.js'
import { Treatment } from '../models/Treatment.js'
import { BeforeAfter } from '../models/BeforeAfter.js'
import {
  cleanupStoredImages,
  resolveImage,
} from '../services/image.service.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const legacyUploadRoot = path.resolve(__dirname, '..', 'uploads')
const GRIDFS_PATH = /^\/uploads\/[a-f\d]{24}$/i

const MIME_BY_EXTENSION = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
}

function resolveLegacyFile(value) {
  if (typeof value !== 'string' || GRIDFS_PATH.test(value)) return null
  const match = value.match(/^\/uploads\/([^/]+)$/)
  if (!match) return null

  const filename = path.basename(match[1])
  const absolutePath = path.resolve(legacyUploadRoot, filename)
  if (!absolutePath.startsWith(`${legacyUploadRoot}${path.sep}`)) return null

  const contentType = MIME_BY_EXTENSION[path.extname(filename).toLowerCase()]
  return contentType ? { absolutePath, contentType } : null
}

async function migrateField(document, field) {
  const legacy = resolveLegacyFile(document[field])
  if (!legacy) return false

  let buffer
  try {
    buffer = await fs.readFile(legacy.absolutePath)
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`[migrate:images] Missing legacy file for ${document[field]}`)
      return false
    }
    throw error
  }

  const dataUrl = `data:${legacy.contentType};base64,${buffer.toString('base64')}`
  const gridFsPath = await resolveImage(dataUrl, field)

  try {
    document[field] = gridFsPath
    await document.save()
  } catch (error) {
    await cleanupStoredImages([gridFsPath])
    throw error
  }

  // The database reference is safely committed before the legacy copy is removed.
  await fs.unlink(legacy.absolutePath)
  console.log(`[migrate:images] ${legacy.absolutePath} -> ${gridFsPath}`)
  return true
}

async function migrateModel(Model, fields) {
  let migrated = 0
  const documents = await Model.find({})

  for (const document of documents) {
    for (const field of fields) {
      if (await migrateField(document, field)) migrated += 1
    }
  }

  return migrated
}

async function main() {
  await connectDB()

  const counts = await Promise.all([
    migrateModel(Blog, ['image']),
    migrateModel(Review, ['image']),
    migrateModel(Treatment, ['image']),
    migrateModel(BeforeAfter, ['before', 'after']),
  ])

  console.log(`[migrate:images] Migrated ${counts.reduce((sum, count) => sum + count, 0)} image(s).`)
}

main()
  .catch((error) => {
    console.error('[migrate:images] Failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await disconnectDB().catch(() => {})
  })
