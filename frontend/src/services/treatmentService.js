// Treatment service — talks to the Express backend.
//
// The public Services page renders a nested category list, so
// getTreatmentCategories() returns `[{ id, name, services[] }]` and
// getTreatments() returns the flat list. Both shapes match what the existing
// components already expect from the old static data files.

import api from './api'

/** Flat list of treatments; each carries `category` (name) and `categoryId`. */
export async function getTreatments() {
  const response = await api.get('/treatments')
  return response.data
}

/** Nested `{ id, name, services[] }` list used by the Services page accordion. */
export async function getTreatmentCategories() {
  const response = await api.get('/treatment-categories')
  return response.data
}

/** Only category names, for filter dropdowns. */
export async function getTreatmentCategoryNames() {
  const categories = await getTreatmentCategories()
  return categories.map((category) => category.name)
}

/** Treatments flagged as featured. */
export async function getFeaturedServices() {
  const response = await api.get('/treatments/featured')
  return response.data
}

/** A single treatment by id. */
export async function getTreatmentById(id) {
  try {
    const response = await api.get(`/treatments/${id}`)
    return response.data
  } catch (error) {
    if (error.status === 404) return null
    throw error
  }
}

/** POST /api/admin/treatments */
export async function createTreatment(treatmentData) {
  const response = await api.post('/admin/treatments', treatmentData)
  return response.data
}

/** PUT /api/admin/treatments/:id */
export async function updateTreatment(id, treatmentData) {
  const response = await api.put(`/admin/treatments/${id}`, treatmentData)
  return response.data
}

/** PATCH /api/admin/treatments/:id/publish */
export async function toggleTreatmentPublish(id, published) {
  const response = await api.patch(`/admin/treatments/${id}/publish`, { published })
  return response.data
}

/** DELETE /api/admin/treatments/:id */
export async function deleteTreatment(id) {
  await api.delete(`/admin/treatments/${id}`)
  return true
}