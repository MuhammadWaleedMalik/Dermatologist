import mongoose from 'mongoose'
import { ApiError } from '../utils/ApiError.js'
import { isProduction } from '../config/env.js'

/** 404 handler for unmatched routes. */
export function notFound(req, _res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`))
}

/** True for Mongo "malformed ObjectId" style errors. */
function isInvalidObjectId(error) {
  return error instanceof mongoose.Error.CastError && error.kind === 'ObjectId'
}

function isDuplicateKey(error) {
  return error?.code === 11000 || error?.code === 11001
}

/** True when the failure is a MongoDB connectivity / server-selection problem. */
function isDatabaseUnavailable(error) {
  return (
    error?.name === 'MongooseServerSelectionError' ||
    error?.name === 'MongoServerSelectionError' ||
    error?.name === 'MongoNetworkError' ||
    (error?.name === 'MongooseError' && /buffering timed out/i.test(error?.message || ''))
  )
}

/**
 * Centralised Express error handler. Every failure leaves the API in the same
 * JSON shape, and stack traces are only exposed outside production.
 */
// eslint-disable-next-line no-unused-vars -- Express requires the 4-arg signature.
export function errorHandler(error, req, res, _next) {
  let statusCode = error.statusCode || 500
  let message = error.message || 'Something went wrong'
  let details = error.details

  if (isInvalidObjectId(error)) {
    statusCode = 400
    message = `Invalid ${error.path}: "${error.value}" is not a valid id.`
  } else if (isDuplicateKey(error)) {
    statusCode = 409
    const field = Object.keys(error.keyPattern || error.keyValue || {})[0] || 'field'
    message =
      field === 'slug'
        ? 'That slug is already in use. Please choose a different one.'
        : `A record with that ${field} already exists.`
  } else if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400
    details = Object.fromEntries(
      Object.entries(error.errors).map(([key, value]) => [key, value.message]),
    )
    message = details[Object.keys(details)[0]] || 'Validation failed'
  } else if (error.name === 'ValidationError' && error.errors) {
    // express-validator surfaced before Mongoose.
    statusCode = 400
  } else if (error.type === 'entity.parse.failed') {
    statusCode = 400
    message = 'Malformed JSON in request body'
  } else if (error.type === 'entity.too.large') {
    statusCode = 413
    message = 'Request body is too large'
  } else if (isDatabaseUnavailable(error)) {
    // The database is down/unreachable. Report it honestly (503) without
    // leaking the connection string or internal driver details.
    statusCode = 503
    console.error(`[error] ${req.method} ${req.originalUrl} — database unavailable`)
    message = 'The service is temporarily unavailable. Please try again shortly.'
  } else if (statusCode >= 500) {
    // Log the real cause, but never leak it to the client.
    console.error(`[error] ${req.method} ${req.originalUrl}`, error)
    message = isProduction
      ? 'Something went wrong on our end. Please try again later.'
      : message
  }

  const body = { success: false, message }
  if (details) body.errors = details
  if (!isProduction && statusCode >= 500) body.stack = error.stack

  res.status(statusCode).json(body)
}