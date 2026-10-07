import { Router } from 'express'
import { listCases, listCategories, getCase } from '../controllers/beforeAfter.controller.js'
import { optionalAuth } from '../middleware/auth.middleware.js'

const router = Router()

// Public reads always return published content only; drafts are managed
// through /api/admin/before-after. `/categories` is declared before `/:id` so
// the static segment is not swallowed by the id parameter.
router.get('/', listCases)
router.get('/categories', listCategories)

// optionalAuth lets a signed-in admin preview a draft at its direct URL, while
// the public site still gets a clean 404 for an unpublished id.
router.get('/:id', optionalAuth, getCase)

// CRUD lives in /api/admin/before-after.
export default router
