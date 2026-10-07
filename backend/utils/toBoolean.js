/**
 * Convert the boolean representations accepted by express-validator into a
 * real boolean. Using Boolean("false") would incorrectly produce true.
 */
export function toBoolean(value) {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value === 1
  return ['true', '1'].includes(String(value).trim().toLowerCase())
}
