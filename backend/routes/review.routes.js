import { Router } from 'express'
import { body } from 'express-validator'
import rateLimit from 'express-rate-limit'
import { isProduction } from '../config/env.js'
import { listApprovedReviews, submitReview } from '../controllers/review.controller.js'
import { validate } from '../middleware/validate.middleware.js'

const router = Router()

// Generous but finite: stops a script from flooding the database while leaving
// plenty of room for real patients submitting at once.
// In development every request shares one IP (localhost), so repeated testing
// exhausts a tight bucket instantly and a legitimate first review gets 429.
// Production keeps the strict limit; development gets a larger-but-finite one
// so obvious flooding is still rejected.
const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: isProduction ? 20 : 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many reviews submitted from this connection. Please try again later.',
  },
})

const submitRules = [
  body('name').isString().trim().isLength({ min: 2, max: 120 }).withMessage('Please enter your name'),
  // The public form sends an empty string when the patient leaves the optional
  // email blank, so treat '' the same as omitted rather than rejecting it.
  body('email')
    .optional({ values: 'falsy' })
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail({ gmail_remove_dots: false }),
  body('treatment').isString().trim().isLength({ min: 1, max: 120 }).withMessage('Please choose a treatment'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Please select a rating between 1 and 5').toInt(),
  // The public form calls this field `review`; it maps to `text` in the database.
  body('review')
    .isString()
    .trim()
    .isLength({ min: 10, max: 3000 })
    .withMessage('Your review must be between 10 and 3000 characters'),
  body('text').optional().isString().trim().isLength({ max: 3000 }),
]

// ---- Public review endpoints -------------------------------------------
router.get('/', listApprovedReviews)
router.post('/', submissionLimiter, submitRules, validate, submitReview)

export default router