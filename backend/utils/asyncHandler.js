/**
 * Wraps an async route handler so rejected promises are forwarded to Express'
 * error pipeline instead of becoming unhandled rejections.
 */
export function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}