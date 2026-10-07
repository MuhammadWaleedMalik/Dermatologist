// MongoDB GridFS image storage.
//
// Admin uploaders send base64 data URLs. The API decodes each upload and saves
// the bytes in MongoDB's GridFS collections (`<bucket>.files` and
// `<bucket>.chunks`). Content documents store only `/uploads/<ObjectId>`, and
// the public image route streams that immutable blob back to the browser.

import mongoose from 'mongoose'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'

const DATA_URL_PATTERN = /^data:image\/(png|jpe?g|gif|webp|avif|svg\+xml);base64,([\s\S]+)$/i
const GRIDFS_PATH_PATTERN = /^\/uploads\/([a-f\d]{24})$/i

const EXTENSION_BY_MIME = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
}

function getBucket() {
  if (!mongoose.connection.db) {
    throw ApiError.internal('Image storage is not connected.')
  }

  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: env.imageBucket,
  })
}

function isDataUrl(value) {
  return typeof value === 'string' && value.startsWith('data:image/')
}

export const isImageUpload = isDataUrl

function parseDataUrl(value, fieldName) {
  const match = value.match(DATA_URL_PATTERN)
  if (!match) {
    throw ApiError.badRequest(
      `${fieldName}: unsupported image format. Use a PNG, JPEG, GIF, WEBP or AVIF file.`,
    )
  }

  const subtype = match[1].toLowerCase()
  const contentType = subtype === 'jpg' ? 'image/jpeg' : `image/${subtype}`
  const extension = EXTENSION_BY_MIME[contentType]
  if (!extension) {
    throw ApiError.badRequest(`${fieldName}: unsupported image format.`)
  }

  const buffer = Buffer.from(match[2], 'base64')
  if (buffer.length === 0) {
    throw ApiError.badRequest(`${fieldName}: the uploaded file appears to be empty.`)
  }
  if (buffer.length > env.maxUploadBytes) {
    const limitMb = Math.round(env.maxUploadBytes / (1024 * 1024))
    throw ApiError.badRequest(`${fieldName}: image must be smaller than ${limitMb}MB.`)
  }

  return { buffer, contentType, extension }
}

function getStoredImageId(value) {
  if (typeof value !== 'string' || !value.trim()) return null

  let pathname = value.trim()
  if (/^https?:\/\//i.test(pathname)) {
    try {
      pathname = new URL(pathname).pathname
    } catch {
      return null
    }
  }

  const match = pathname.match(GRIDFS_PATH_PATTERN)
  return match ? new mongoose.Types.ObjectId(match[1]) : null
}

async function uploadBuffer({ buffer, contentType, extension }) {
  const id = new mongoose.Types.ObjectId()
  const filename = `image-${id}.${extension}`
  const stream = getBucket().openUploadStreamWithId(id, filename, {
    contentType,
    metadata: { contentType },
  })

  await new Promise((resolve, reject) => {
    stream.once('finish', resolve)
    stream.once('error', reject)
    stream.end(buffer)
  })

  console.log(`[image] Stored GridFS image ${id} (${(buffer.length / 1024).toFixed(1)} KB)`)
  return `/uploads/${id}`
}

/**
 * Resolve an image field coming from the client into a storable URL.
 *
 * @param {string|null|undefined} value  GridFS /uploads path or base64 data URL.
 * @param {string} fieldName             Used in error messages.
 * @returns {Promise<string>}            A GridFS path.
 */
export async function resolveImage(value, fieldName = 'image') {
  if (typeof value !== 'string') return ''
  const trimmed = value.trim()
  if (!trimmed) return ''

  if (GRIDFS_PATH_PATTERN.test(trimmed)) return trimmed
  if (!isDataUrl(trimmed)) {
    throw ApiError.badRequest(`${fieldName}: please upload an image file.`)
  }

  return uploadBuffer(parseDataUrl(trimmed, fieldName))
}

/** Delete a GridFS image referenced by `/uploads/<ObjectId>`. */
export async function deleteStoredImage(value) {
  const id = getStoredImageId(value)
  if (!id) return false

  try {
    await getBucket().delete(id)
    console.log(`[image] Deleted GridFS image ${id}`)
    return true
  } catch (error) {
    if (/FileNotFound/i.test(error?.name || '') || /not found/i.test(error?.message || '')) {
      return false
    }
    throw error
  }
}

/** Best-effort cleanup used after replacement, deletion, or a failed save. */
export async function cleanupStoredImages(values) {
  const uniqueValues = [...new Set(values.filter(Boolean))]
  const results = await Promise.allSettled(uniqueValues.map(deleteStoredImage))

  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('[image] GridFS cleanup failed:', result.reason?.message || result.reason)
    }
  }
}

/** Stream a GridFS image to the public `/uploads/:id` endpoint. */
export async function serveStoredImage(req, res, next) {
  try {
    if (!mongoose.isObjectIdOrHexString(req.params.id)) {
      throw ApiError.notFound('Image not found.')
    }

    const id = new mongoose.Types.ObjectId(req.params.id)
    const bucket = getBucket()
    const file = await bucket.find({ _id: id }).next()
    if (!file) throw ApiError.notFound('Image not found.')

    const contentType = file.metadata?.contentType || file.contentType || 'application/octet-stream'
    res.set({
      'Content-Type': contentType,
      'Content-Length': String(file.length),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Disposition': `inline; filename="${String(file.filename).replace(/["\r\n]/g, '')}"`,
    })

    const stream = bucket.openDownloadStream(id)
    stream.on('error', (error) => {
      if (res.headersSent) res.destroy(error)
      else next(error)
    })
    stream.pipe(res)
  } catch (error) {
    next(error)
  }
}
