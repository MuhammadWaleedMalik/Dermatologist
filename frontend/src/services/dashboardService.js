import api from './api'

/**
 * Aggregated counts for the admin dashboard.
 * Requires an admin token — the API returns 401 otherwise.
 *
 * @returns {{
 *   blogs: { total: number, published: number, drafts: number },
 *   reviews: { total: number, approved: number, pending: number },
 *   treatments: { total: number, categories: number },
 *   beforeAfter: { total: number, categories: number },
 * }}
 */
export async function getDashboardStats() {
  const response = await api.get('/admin/stats')
  return response.data
}