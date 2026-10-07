import { Treatment } from '../models/Treatment.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { slugify } from '../utils/slugify.js'
import { toClient, toClientList } from '../utils/toClient.js'
import { toBoolean } from '../utils/toBoolean.js'
import {
  cleanupStoredImages,
  isImageUpload,
  resolveImage,
} from '../services/image.service.js'

const WRITABLE_FIELDS = [
  'name',
  'slug',
  'category',
  'categoryId',
  'icon',
  'shortDescription',
  'description',
  'benefits',
  'procedure',
  'recoveryTime',
  'faq',
  'published',
  'featured',
]

function pickWritable(body) {
  const payload = {}
  for (const field of WRITABLE_FIELDS) {
    if (body[field] !== undefined) payload[field] = body[field]
  }
  for (const flag of ['published', 'featured']) {
    if (payload[flag] !== undefined) payload[flag] = toBoolean(payload[flag])
  }
  if (Array.isArray(payload.benefits)) {
    payload.benefits = payload.benefits.map((b) => String(b).trim()).filter(Boolean)
  }
  if (Array.isArray(payload.faq)) {
    // The admin form seeds `[{ q: '', a: '' }]`; drop empty rows before saving.
    payload.faq = payload.faq
      .map((item) => ({ q: String(item?.q ?? '').trim(), a: String(item?.a ?? '').trim() }))
      .filter((item) => item.q && item.a)
  }
  return payload
}

async function buildUniqueSlug(desired, excludeId = null) {
  const base = slugify(desired) || 'treatment'
  let candidate = base
  let suffix = 1

  while (suffix < 100) {
    const existing = await Treatment.findOne({ slug: candidate }).select('_id').lean()
    if (!existing || String(existing._id) === String(excludeId)) return candidate
    suffix += 1
    candidate = `${base}-${suffix}`
  }
  return `${base}-${Date.now().toString(36)}`
}

/**
 * GET /api/treatments  (public)
 * Flattened list, matching what `treatmentService.getTreatments()` returns:
 * each treatment carries `category` (name) and `categoryId`.
 */
export const listTreatments = asyncHandler(async (req, res) => {
  const filter = {}
  if (req.query.categoryId) filter.categoryId = req.query.categoryId
  if (req.query.featured === 'true') filter.featured = true
  // Admins and editors can preview drafts; the public site only sees published.
  if (!req.user) filter.published = true

  const treatments = await Treatment.find(filter).sort({ categoryId: 1, name: 1 }).lean()
  res.json({ success: true, data: toClientList(treatments) })
})

/**
 * GET /api/treatment-categories  (public)
 * Returns the nested `{ id, name, services[] }` shape the existing Services
 * page renders, derived from the treatments collection so admin edits to a
 * category's treatments show up on the public site automatically.
 */
export const listTreatmentCategories = asyncHandler(async (req, res) => {
  const filter = {}
  if (!req.user) filter.published = true

  const treatments = await Treatment.find(filter).sort({ name: 1 }).lean()

  const byCategory = new Map()
  for (const treatment of treatments) {
    if (!byCategory.has(treatment.categoryId)) {
      byCategory.set(treatment.categoryId, {
        id: treatment.categoryId,
        name: treatment.category,
        services: [],
      })
    }
    byCategory.get(treatment.categoryId).services.push(toClient(treatment))
  }

  res.json({ success: true, data: Array.from(byCategory.values()) })
})

/**
 * GET /api/treatments/featured  (public)
 */
export const listFeaturedTreatments = asyncHandler(async (_req, res) => {
  const treatments = await Treatment.find({ published: true, featured: true })
    .sort({ name: 1 })
    .lean()
  res.json({ success: true, data: toClientList(treatments) })
})

/**
 * GET /api/treatments/:id  (public)
 */
export const getTreatment = asyncHandler(async (req, res) => {
  const treatment = await Treatment.findById(req.params.id)
  if (!treatment) throw ApiError.notFound('That treatment could not be found.')
  if (!treatment.published && !req.user) {
    throw ApiError.notFound('That treatment could not be found.')
  }
  res.json({ success: true, data: toClient(treatment) })
})

/** POST /api/admin/treatments  (protected) */
export const createTreatment = asyncHandler(async (req, res) => {
  const payload = pickWritable(req.body)
  let uploadedImage = ''
  let treatment

  try {
    payload.slug = await buildUniqueSlug(payload.slug || payload.name)
    payload.image = await resolveImage(req.body.image, 'image')
    if (isImageUpload(req.body.image)) uploadedImage = payload.image
    treatment = await Treatment.create(payload)
  } catch (error) {
    await cleanupStoredImages([uploadedImage])
    throw error
  }

  res.status(201).json({ success: true, data: toClient(treatment) })
})

/** PUT /api/admin/treatments/:id  (protected) */
export const updateTreatment = asyncHandler(async (req, res) => {
  const treatment = await Treatment.findById(req.params.id)
  if (!treatment) throw ApiError.notFound('That treatment could not be found.')

  const payload = pickWritable(req.body)
  const previousImage = treatment.image
  let uploadedImage = ''

  try {
    if (payload.slug !== undefined) {
      treatment.slug = await buildUniqueSlug(payload.slug, treatment._id)
    }
    if (req.body.image !== undefined) {
      treatment.image = await resolveImage(req.body.image, 'image')
      if (isImageUpload(req.body.image)) uploadedImage = treatment.image
    }

    Object.entries(payload).forEach(([field, value]) => {
      if (field !== 'slug') treatment[field] = value
    })

    await treatment.save()
  } catch (error) {
    await cleanupStoredImages([uploadedImage])
    throw error
  }

  if (previousImage !== treatment.image) await cleanupStoredImages([previousImage])
  res.json({ success: true, data: toClient(treatment) })
})

/** PATCH /api/admin/treatments/:id/publish  (protected) */
export const setTreatmentPublished = asyncHandler(async (req, res) => {
  const treatment = await Treatment.findById(req.params.id)
  if (!treatment) throw ApiError.notFound('That treatment could not be found.')

  treatment.published = toBoolean(req.body.published)
  await treatment.save()

  res.json({ success: true, data: toClient(treatment) })
})

/** DELETE /api/admin/treatments/:id  (protected) */
export const deleteTreatment = asyncHandler(async (req, res) => {
  const treatment = await Treatment.findByIdAndDelete(req.params.id)
  if (!treatment) throw ApiError.notFound('That treatment could not be found.')
  await cleanupStoredImages([treatment.image])
  res.json({ success: true, data: { id: String(treatment._id), deleted: true } })
})
