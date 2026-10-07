/**
 * Turn a title into a URL-safe slug. Mirrors the slug generator already used by
 * the frontend blog/treatment forms so slugs stay predictable on both sides.
 */
export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}