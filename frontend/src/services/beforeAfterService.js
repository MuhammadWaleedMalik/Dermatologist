// Before & After gallery service — talks to the Express backend.
//
// Images are handled as URLs. The uploader sends a base64 data URL; the API
// stores its bytes in MongoDB GridFS and returns a `/uploads/<ObjectId>` path.

import api from './api'

/** Published gallery entries, optionally filtered by category (public site). */
export async function getBeforeAfterCases(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : ''
  const response = await api.get(`/before-after${query}`)
  return response.data
}

/** All gallery entries — published and drafts — for the admin table. */
export async function getAdminBeforeAfterCases() {
  const response = await api.get('/admin/before-after')
  return response.data
}

/** Distinct gallery categories, with 'All' prepended for the filter row. */
export async function getBeforeAfterCategories() {
  const response = await api.get('/before-after/categories')
  return ['All', ...response.data]
}

/** A single gallery entry by id. */
export async function getBeforeAfterById(id) {
  try {
    const response = await api.get(`/before-after/${id}`)
    return response.data
  } catch (error) {
    if (error.status === 404) return null
    throw error
  }
}

/** POST /api/admin/before-after */
export async function createBeforeAfter(caseData) {
  const response = await api.post('/admin/before-after', caseData)
  return response.data
}

/** PUT /api/admin/before-after/:id */
export async function updateBeforeAfter(id, caseData) {
  const response = await api.put(`/admin/before-after/${id}`, caseData)
  return response.data
}

/** DELETE /api/admin/before-after/:id */
export async function deleteBeforeAfter(id) {
  await api.delete(`/admin/before-after/${id}`)
  return true
}

/** PATCH /api/admin/before-after/:id/publish */
export async function toggleBeforeAfterPublish(id, published) {
  const response = await api.patch(`/admin/before-after/${id}/publish`, { published })
  return response.data
}
