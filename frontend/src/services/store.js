// Interim client-side persistence layer.
//
// The project has no backend yet, so we persist content to localStorage
// using the existing static data files (src/data/*) as the seed/fallback.
//
// This keeps the service-layer API stable: when a real backend is available,
// the functions in the service files (blogService, reviewService, ...) can be
// swapped to call api.js WITHOUT changing any page or component code.

const PREFIX = 'drsalman_clinic'

function read(key, seed) {
  try {
    const raw = localStorage.getItem(`${PREFIX}_${key}`)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // Corrupt or unavailable storage — fall back to the seed data.
  }
  return seed
}

function persist(key, items) {
  try {
    localStorage.setItem(`${PREFIX}_${key}`, JSON.stringify(items))
  } catch {
    // Storage may be unavailable (private mode, quota). Content still works
    // in-memory for the current session via the returned array.
  }
  return items
}

/**
 * Get a persisted collection, seeding from `seed` on first load.
 */
export function getCollection(key, seed) {
  return read(key, seed)
}

/**
 * Overwrite a persisted collection entirely.
 */
export function saveCollection(key, items) {
  return persist(key, items)
}

/**
 * Insert or merge an item into a collection. Existing items are deep-merged
 * with the passed partial item (useful for toggle/status updates).
 */
export function upsertCollection(key, seed, item) {
  const items = read(key, seed)
  const index = items.findIndex((existing) => existing.id === item.id)
  let updated
  if (index >= 0) {
    updated = [...items]
    updated[index] = { ...items[index], ...item }
  } else {
    updated = [item, ...items]
  }
  return persist(key, updated)
}

/**
 * Remove an item by id from a persisted collection.
 */
export function removeFromCollection(key, seed, id) {
  const items = read(key, seed)
  return persist(key, items.filter((existing) => existing.id !== id))
}