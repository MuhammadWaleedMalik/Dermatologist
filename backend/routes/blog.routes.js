import { Router } from 'express'
import { listPublishedBlogs, getBlogBySlug } from '../controllers/blog.controller.js'
import { optionalAuth } from '../middleware/auth.middleware.js'

const router = Router()

// ---- Public blog endpoints ---------------------------------------------
// Drafts are created/edited through /api/admin/blogs.
router.get('/', listPublishedBlogs)

// optionalAuth lets a signed-in admin preview a draft at its direct URL, while
// the public site still gets a clean 404 for an unpublished slug.
router.get('/:slug', optionalAuth, getBlogBySlug)

export default router