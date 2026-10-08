import { Review } from '../models/Review.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { toClient, toClientList } from '../utils/toClient.js'
import { toBoolean } from '../utils/toBoolean.js'
import {
  cleanupStoredImages,
  isImageUpload,
  resolveImage,
} from '../services/image.service.js'

const WRITABLE_FIELDS = ['name', 'email', 'treatment', 'rating', 'text', 'date', 'approved']

function pickWritable(body) {
  const payload = {}
  for (const field of WRITABLE_FIELDS) {
    if (body[field] !== undefined) payload[field] = body[field]
  }
  if (payload.approved !== undefined) payload.approved = toBoolean(payload.approved)
  if (payload.rating !== undefined) payload.rating = Number(payload.rating)
  if (payload.email !== undefined) payload.email = String(payload.email || '').trim()
  return payload
}

/**
 * Public reviews never expose the patient's email address.
 * Call this instead of `toClient` for any publicly readable review.
 */
function toPublicReview(doc) {
  const review = toClient(doc)
  delete review.email
  return review
}

/**
 * GET /api/reviews  (public)
 * Approved reviews only, newest first. Optional ?treatment= filter.
 */
export const listApprovedReviews = asyncHandler(async (req, res) => {
  const filter = { approved: true }
  if (req.query.treatment) filter.treatment = req.query.treatment

  const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean()
  res.json({ success: true, data: toClientList(reviews).map(toPublicReview) })
})

/**
 * GET /api/admin/reviews  (protected)
 * Every review, approved or not.
 */
export const listAllReviews = asyncHandler(async (_req, res) => {
  const reviews = await Review.find({}).sort({ createdAt: -1 }).lean()
  res.json({ success: true, data: toClientList(reviews) })
})

/**
 * GET /api/admin/reviews/:id  (protected)
 */
export const getReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
  if (!review) throw ApiError.notFound('That review could not be found.')
  res.json({ success: true, data: toClient(review) })
})

/**
 * POST /api/reviews  (public submission)
 *
 * `approved` defaults to true here to preserve the behaviour the existing
 * Reviews page already shows the user: "Your review has been submitted and is
 * now visible below." An admin can hide it afterwards from the dashboard.
 * `image` is rejected — public visitors do not attach photos.
 */
export const submitReview = asyncHandler(async (req, res) => {
  const review = await Review.create({
    name: req.body.name,
    email: req.body.email || '',
    treatment: req.body.treatment,
    rating: Number(req.body.rating),
    // The public form field is `review`; the database stores `text`.
    text: String(req.body.review).trim(),
    approved: true,
    image: '',
  })

  res.status(201).json({ success: true, data: toPublicReview(review) })
})

/**
 * POST /api/admin/reviews  (protected)
 * Create on behalf of the clinic (the "Add Review" admin form).
 */
export const createReview = asyncHandler(async (req, res) => {
  const payload = pickWritable(req.body)
  let uploadedImage = ''
  let review

  try {
    payload.image = await resolveImage(req.body.image, 'image')
    if (isImageUpload(req.body.image)) uploadedImage = payload.image
    review = await Review.create(payload)
  } catch (error) {
    await cleanupStoredImages([uploadedImage])
    throw error
  }

  res.status(201).json({ success: true, data: toClient(review) })
})

/**
 * PUT /api/admin/reviews/:id  (protected)
 */
export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
  if (!review) throw ApiError.notFound('That review could not be found.')

  const payload = pickWritable(req.body)
  const previousImage = review.image
  let uploadedImage = ''

  try {
    if (req.body.image !== undefined) {
      review.image = await resolveImage(req.body.image, 'image')
      if (isImageUpload(req.body.image)) uploadedImage = review.image
    }

    Object.entries(payload).forEach(([field, value]) => {
      review[field] = value
    })

    await review.save()
  } catch (error) {
    await cleanupStoredImages([uploadedImage])
    throw error
  }

  if (previousImage !== review.image) await cleanupStoredImages([previousImage])
  res.json({ success: true, data: toClient(review) })
})

/** Shared logic for the /approve and /hide endpoints. */
async function setApproved(req, res, approved) {
  const review = await Review.findById(req.params.id)
  if (!review) throw ApiError.notFound('That review could not be found.')

  review.approved = approved
  await review.save()

  res.json({ success: true, data: toClient(review) })
}

/** PATCH /api/admin/reviews/:id/approve  (protected) */
export const approveReview = asyncHandler(async (req, res) => {
  await setApproved(req, res, true)
})

/** PATCH /api/admin/reviews/:id/hide  (protected) */
export const hideReview = asyncHandler(async (req, res) => {
  await setApproved(req, res, false)
})

/**
 * DELETE /api/admin/reviews/:id  (protected)
 */
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id)
  if (!review) throw ApiError.notFound('That review could not be found.')

  await cleanupStoredImages([review.image])
  res.json({ success: true, data: { id: String(review._id), deleted: true } })
})
