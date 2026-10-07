const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

/**
 * Get the backend base origin (protocol + host + port) from API_BASE_URL
 * e.g., http://localhost:5000/api -> http://localhost:5000
 */
function getBackendOrigin() {
  try {
    const url = new URL(API_BASE_URL)
    return `${url.protocol}//${url.host}`
  } catch {
    // fallback
    return API_BASE_URL.replace(/\/api.*$/, '')
  }
}

/**
 * Normalize image URL to be usable by the frontend
 * - null/undefined/empty -> ''
 * - data:image/* (base64) -> unchanged
 * - http:// or https:// -> unchanged (absolute URLs, external/CDN)
 * - starts with /uploads/ -> prepend backend origin (MongoDB GridFS stream)
 * - other relative paths starting with / -> try to be conservative? but uploads are the main case
 */
export function getImageUrl(src) {
  if (!src) return ''
  const str = String(src).trim()
  if (!str) return ''

  // Data URLs (previews) - unchanged
  if (str.startsWith('data:image/')) return str

  // Absolute URLs - unchanged
  if (/^https?:\/\//i.test(str)) return str

  // Relative backend upload paths
  if (str.startsWith('/uploads/')) {
    const origin = getBackendOrigin()
    return `${origin}${str}`
  }

  // Upload paths missing the leading slash ("uploads/x.png")
  if (str.startsWith('uploads/')) {
    const origin = getBackendOrigin()
    return `${origin}/${str}`
  }

  // Other absolute paths like /images/ etc - these are typically frontend assets
  // Don't prepend backend origin to avoid breaking existing assets
  // But if it's clearly an upload path variant, handle it
  if (str.startsWith('/')) {
    // For safety, only prefix if it looks like an upload
    if (str.includes('uploads')) {
      const origin = getBackendOrigin()
      return `${origin}${str}`
    }
    // Otherwise return as-is (could be served from frontend)
    return str
  }

  return str
}

export default getImageUrl
