// All admin-only endpoints live under /api/admin and are mounted behind
// `protect` + `requireRole` in one place, so a new admin route is protected by
// default rather than by remembering to add middleware.

import { Router } from 'express'
import { body, param } from 'express-validator'

import { protect, requireRole } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { getStats } from '../controllers/dashboard.controller.js'

import {
  listAllBlogs,
  createBlog,
  updateBlog,
  setBlogPublished,
  deleteBlog,
} from '../controllers/blog.controller.js'

import {
  listAllReviews,
  getReview,
  createReview,
  updateReview,
  approveReview,
  hideReview,
  deleteReview,
} from '../controllers/review.controller.js'

import {
  createTreatment,
  updateTreatment,
  setTreatmentPublished,
  deleteTreatment,
} from '../controllers/treatment.controller.js'

import {
  listAllCases,
  listAllCategories as listGalleryCategories,
  createCase,
  updateCase,
  setPublished as setCasePublished,
  deleteCase,
} from '../controllers/beforeAfter.controller.js'

const router = Router()

// ---- Guards applied to every route in this file -------------------------
router.use(protect, requireRole('admin', 'editor'))

// ---- Shared validation chains -------------------------------------------
const blogId = param('id').isMongoId().withMessage('Invalid blog id')
const reviewId = param('id').isMongoId().withMessage('Invalid review id')
const treatmentId = param('id').isMongoId().withMessage('Invalid treatment id')
const caseId = param('id').isMongoId().withMessage('Invalid gallery entry id')

const blogRules = [
  body('title').isString().trim().isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('slug')
    .optional()
    .isString()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug may only contain lowercase letters, numbers and hyphens'),
  body('excerpt')
    .isString()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Short description must be between 10 and 500 characters'),
  body('content').optional().isString().isLength({ max: 50000 }).withMessage('Content is too long'),
  body('category').isString().trim().isLength({ min: 1, max: 80 }).withMessage('Category is required'),
  body('author').isString().trim().isLength({ min: 1, max: 120 }).withMessage('Author is required'),
  body('date').optional().isISO8601().withMessage('Date must use the YYYY-MM-DD format'),
  body('image').optional({ nullable: true }).isString().withMessage('Image must be a URL'),
  body('readTime').optional().isString().trim().isLength({ max: 40 }),
  body('seoTitle').optional().isString().trim().isLength({ max: 200 }),
  body('seoDescription').optional().isString().trim().isLength({ max: 320 }),
  body('published').optional().isBoolean().withMessage('Published must be true or false'),
  body('featured').optional().isBoolean().withMessage('Featured must be true or false'),
]

const reviewRules = [
  body('name').isString().trim().isLength({ min: 2, max: 120 }).withMessage('Name must be between 2 and 120 characters'),
  body('email')
    .optional({ values: 'falsy' })
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail({ gmail_remove_dots: false }),
  body('treatment').isString().trim().isLength({ min: 1, max: 120 }).withMessage('Treatment is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5').toInt(),
  body('text').isString().trim().isLength({ min: 10, max: 3000 }).withMessage('Review text must be between 10 and 3000 characters'),
  body('date').optional().isISO8601().withMessage('Date must use the YYYY-MM-DD format'),
  body('image').optional({ nullable: true }).isString().withMessage('Image must be a URL'),
  body('approved').optional().isBoolean().withMessage('Approved must be true or false'),
]

const treatmentRules = [
  body('name').isString().trim().isLength({ min: 2, max: 160 }).withMessage('Name must be between 2 and 160 characters'),
  body('slug')
    .optional()
    .isString()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug may only contain lowercase letters, numbers and hyphens'),
  body('category').isString().trim().isLength({ min: 1, max: 80 }).withMessage('Category is required'),
  body('categoryId').isString().trim().isLength({ min: 1, max: 80 }).withMessage('Category is required'),
  body('icon').optional().isString().trim().isLength({ max: 60 }),
  body('shortDescription').optional().isString().trim().isLength({ max: 400 }),
  body('description').optional().isString().trim().isLength({ max: 5000 }),
  body('benefits').optional().isArray().withMessage('Benefits must be a list of strings'),
  body('procedure').optional().isString().trim().isLength({ max: 3000 }),
  body('recoveryTime').optional().isString().trim().isLength({ max: 500 }),
  body('faq').optional().isArray().withMessage('FAQ must be a list of question/answer pairs'),
  body('image').optional({ nullable: true }).isString().withMessage('Image must be a URL'),
  body('published').optional().isBoolean().withMessage('Published must be true or false'),
  body('featured').optional().isBoolean().withMessage('Featured must be true or false'),
]

const caseRules = [
  body('treatment').isString().trim().isLength({ min: 2, max: 160 }).withMessage('Treatment is required'),
  body('category').isString().trim().isLength({ min: 1, max: 80 }).withMessage('Category is required'),
  body('title').optional().isString().trim().isLength({ max: 200 }),
  body('alt').optional().isString().trim().isLength({ max: 250 }),
  body('description').optional().isString().trim().isLength({ max: 2000 }),
  body('published').optional().isBoolean().withMessage('Published must be true or false'),
  // `before` / `after` accept either a URL or a base64 data URL from the
  // existing ImageUploader, so they are only checked for being a string.
  body('before').isString().trim().notEmpty().withMessage('Before image is required'),
  body('after').isString().trim().notEmpty().withMessage('After image is required'),
]

// ---- Dashboard ----------------------------------------------------------
router.get('/stats', getStats)

// ---- Blogs --------------------------------------------------------------
router.get('/blogs', listAllBlogs)
router.post('/blogs', blogRules, validate, createBlog)
router.put('/blogs/:id', blogId, blogRules, validate, updateBlog)
router.patch(
  '/blogs/:id/publish',
  blogId,
  body('published').isBoolean().withMessage('Published must be true or false'),
  validate,
  setBlogPublished,
)
router.delete('/blogs/:id', blogId, validate, deleteBlog)

// ---- Reviews -----------------------------------------------------------
router.get('/reviews', listAllReviews)
router.get('/reviews/:id', reviewId, validate, getReview)
router.post('/reviews', reviewRules, validate, createReview)
router.put('/reviews/:id', reviewId, reviewRules, validate, updateReview)
router.patch('/reviews/:id/approve', reviewId, validate, approveReview)
router.patch('/reviews/:id/hide', reviewId, validate, hideReview)
router.delete('/reviews/:id', reviewId, validate, deleteReview)

// ---- Treatments ---------------------------------------------------------
router.post('/treatments', treatmentRules, validate, createTreatment)
router.put('/treatments/:id', treatmentId, treatmentRules, validate, updateTreatment)
router.patch(
  '/treatments/:id/publish',
  treatmentId,
  body('published').isBoolean().withMessage('Published must be true or false'),
  validate,
  setTreatmentPublished,
)
router.delete('/treatments/:id', treatmentId, validate, deleteTreatment)

// ---- Before & After gallery --------------------------------------------
router.get('/before-after', listAllCases)
router.get('/before-after/categories', listGalleryCategories)
router.post('/before-after', caseRules, validate, createCase)
router.put('/before-after/:id', caseId, caseRules, validate, updateCase)
router.patch(
  '/before-after/:id/publish',
  caseId,
  body('published').isBoolean().withMessage('Published must be true or false'),
  validate,
  setCasePublished,
)
router.delete('/before-after/:id', caseId, validate, deleteCase)

export default router
