import { BeforeAfter } from '../models/BeforeAfter.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { toClient, toClientList } from '../utils/toClient.js'
import { toBoolean } from '../utils/toBoolean.js'
import {
  cleanupStoredImages,
  isImageUpload,
  resolveImage,
} from '../services/image.service.js'

const WRITABLE_FIELDS = ['title', 'treatment', 'category', 'alt', 'description', 'published']

function pickWritable(body) {
  const payload = {}
  for (const field of WRITABLE_FIELDS) {
    if (body[field] !== undefined) payload[field] = body[field]
  }
  if (payload.published !== undefined) payload.published = toBoolean(payload.published)
  return payload
}

/** GET /api/before-after  (public — published entries only, never drafts) */
export const listCases = asyncHandler(async (req, res) => {
  const filter = { published: true }
  if (req.query.category) filter.category = req.query.category

  const cases = await BeforeAfter.find(filter).sort({ createdAt: -1 }).lean()
  res.json({ success: true, data: toClientList(cases) })
})

/** GET /api/admin/before-after  (protected — published entries and drafts) */
export const listAllCases = asyncHandler(async (req, res) => {
  const filter = {}
  if (req.query.category) filter.category = req.query.category

  const cases = await BeforeAfter.find(filter).sort({ createdAt: -1 }).lean()
  res.json({ success: true, data: toClientList(cases) })
})

/** GET /api/before-after/categories  (public — categories of published entries) */
export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await BeforeAfter.distinct('category', { published: true })
  res.json({ success: true, data: categories.filter(Boolean).sort() })
})

/** GET /api/admin/before-after/categories  (protected — all categories) */
export const listAllCategories = asyncHandler(async (_req, res) => {
  const categories = await BeforeAfter.distinct('category')
  res.json({ success: true, data: categories.filter(Boolean).sort() })
})

/** GET /api/before-after/:id  (public) */
export const getCase = asyncHandler(async (req, res) => {
  const item = await BeforeAfter.findById(req.params.id)
  if (!item) throw ApiError.notFound('That gallery entry could not be found.')
  if (!item.published && !req.user) {
    throw ApiError.notFound('That gallery entry could not be found.')
  }
  res.json({ success: true, data: toClient(item) })
})

/** POST /api/admin/before-after  (protected) */
export const createCase = asyncHandler(async (req, res) => {
  const payload = pickWritable(req.body)
  const uploadedImages = []
  let item

  try {
    // The admin form leaves `title` blank and falls back to the treatment name.
    payload.title = String(payload.title || '').trim() || payload.treatment
    payload.before = await resolveImage(req.body.before, 'before image')
    if (isImageUpload(req.body.before)) uploadedImages.push(payload.before)
    payload.after = await resolveImage(req.body.after, 'after image')
    if (isImageUpload(req.body.after)) uploadedImages.push(payload.after)

    item = await BeforeAfter.create(payload)
  } catch (error) {
    await cleanupStoredImages(uploadedImages)
    throw error
  }

  res.status(201).json({ success: true, data: toClient(item) })
})

/** PUT /api/admin/before-after/:id  (protected) */
export const updateCase = asyncHandler(async (req, res) => {
  const item = await BeforeAfter.findById(req.params.id)
  if (!item) throw ApiError.notFound('That gallery entry could not be found.')

  const payload = pickWritable(req.body)
  const previousImages = { before: item.before, after: item.after }
  const uploadedImages = []

  try {
    if (req.body.before !== undefined) {
      item.before = await resolveImage(req.body.before, 'before image')
      if (isImageUpload(req.body.before)) uploadedImages.push(item.before)
    }
    if (req.body.after !== undefined) {
      item.after = await resolveImage(req.body.after, 'after image')
      if (isImageUpload(req.body.after)) uploadedImages.push(item.after)
    }

    Object.entries(payload).forEach(([field, value]) => {
      item[field] = value
    })

    if (!String(item.title || '').trim()) item.title = item.treatment

    await item.save()
  } catch (error) {
    await cleanupStoredImages(uploadedImages)
    throw error
  }

  const replacedImages = []
  if (previousImages.before !== item.before) replacedImages.push(previousImages.before)
  if (previousImages.after !== item.after) replacedImages.push(previousImages.after)
  await cleanupStoredImages(replacedImages)
  res.json({ success: true, data: toClient(item) })
})

/** PATCH /api/admin/before-after/:id/publish  (protected) */
export const setPublished = asyncHandler(async (req, res) => {
  const item = await BeforeAfter.findById(req.params.id)
  if (!item) throw ApiError.notFound('That gallery entry could not be found.')

  item.published = toBoolean(req.body.published)
  await item.save()

  res.json({ success: true, data: toClient(item) })
})

/** DELETE /api/admin/before-after/:id  (protected) */
export const deleteCase = asyncHandler(async (req, res) => {
  const item = await BeforeAfter.findByIdAndDelete(req.params.id)
  if (!item) throw ApiError.notFound('That gallery entry could not be found.')
  await cleanupStoredImages([item.before, item.after])
  res.json({ success: true, data: { id: String(item._id), deleted: true } })
})
