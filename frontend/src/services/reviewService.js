// Review service — talks to the Express backend.
//
// Function signatures are unchanged from the previous localStorage version.
//
// Two distinct read paths, matching the API:
//   getTestimonials() -> GET /api/reviews        (approved only, no emails)
//   getReviews()      -> GET /api/admin/reviews  (everything, admin token)
//
// The public form's field is `review`; the API maps it to `text`, which is the
// field name the existing ReviewCard / ReviewTable components already read.

import api from './api'

/** Public: approved reviews for the Reviews page and the home testimonial slider. */
export async function getTestimonials() {
  const response = await api.get('/reviews')
  return response.data
}

/** Admin: every review, approved or not. */
export async function getReviews() {
  const response = await api.get('/admin/reviews')
  return response.data
}

/** Admin: a single review. */
export async function getReviewById(id) {
  try {
    const response = await api.get(`/admin/reviews/${id}`)
    return response.data
  } catch (error) {
    if (error.status === 404) return null
    throw error
  }
}

/**
 * POST /api/reviews — public submission.
 * The API approves public submissions immediately, which is the behaviour the
 * Reviews page already promises ("now visible below").
 */
export async function submitReview({ name, email = '', treatment = 'Other', rating, review }) {
  const response = await api.post('/reviews', {
    name: (name || '').trim(),
    email: (email || '').trim(),
    treatment: (treatment || 'Other').trim() || 'Other',
    rating: Number(rating),
    review: (review || '').trim(),
  })
  return response.data
}

/** POST /api/admin/reviews — create on behalf of the clinic. */
export async function createReview(reviewData) {
  const response = await api.post('/admin/reviews', reviewData)
  return response.data
}

/** PUT /api/admin/reviews/:id */
export async function updateReview(id, reviewData) {
  const response = await api.put(`/admin/reviews/${id}`, reviewData)
  return response.data
}

/** PATCH /api/admin/reviews/:id/approve */
export async function approveReview(id) {
  const response = await api.patch(`/admin/reviews/${id}/approve`)
  return response.data
}

/** PATCH /api/admin/reviews/:id/hide */
export async function hideReview(id) {
  const response = await api.patch(`/admin/reviews/${id}/hide`)
  return response.data
}

/** DELETE /api/admin/reviews/:id */
export async function deleteReview(id) {
  await api.delete(`/admin/reviews/${id}`)
  return true
}