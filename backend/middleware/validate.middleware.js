import { validationResult } from 'express-validator'
import { ApiError } from '../utils/ApiError.js'

/**
 * Runs after express-validator chains and converts any failures into a single
 * 400 response with a field -> message map the frontend can display directly.
 */
export function validate(req, _res, next) {
  const result = validationResult(req)
  if (result.isEmpty()) return next()

  const details = {}
  for (const error of result.array()) {
    // Keep the first message per field.
    if (!details[error.path]) {
      details[error.path] = error.msg
    }
  }

  return next(ApiError.badRequest(details[Object.keys(details)[0]] || 'Validation failed', details))
}