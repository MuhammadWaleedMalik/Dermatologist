import { Router } from 'express'
import {
  listTreatments,
  listTreatmentCategories,
  listFeaturedTreatments,
  getTreatment,
} from '../controllers/treatment.controller.js'
import { optionalAuth } from '../middleware/auth.middleware.js'

const router = Router()

// Static segments are declared before `/:id` so they are not swallowed by it.
// optionalAuth lets a signed-in admin see drafts; visitors only get published.
router.get('/', optionalAuth, listTreatments)
router.get('/featured', listFeaturedTreatments)
router.get('/:id', optionalAuth, getTreatment)

// CRUD lives in /api/admin/treatments.
export default router

// Mounted separately so the public and admin URLs stay distinct.
export const treatmentCategoryRouter = Router()
treatmentCategoryRouter.get('/', optionalAuth, listTreatmentCategories)