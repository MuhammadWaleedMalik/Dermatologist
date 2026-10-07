import { Blog } from '../models/Blog.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { slugify } from '../utils/slugify.js'
import { toClient, toClientList } from '../utils/toClient.js'
import { toBoolean } from '../utils/toBoolean.js'
import {
  cleanupStoredImages,
  isImageUpload,
  resolveImage,
} from '../services/image.service.js'

// Only these fields may be written by the API. Anything else in the request
// body (including attempts to set `id` or `createdAt`) is discarded.
const WRITABLE_FIELDS = [
  'title',
  'slug',
  'excerpt',
  'content',
  'category',
  'author',
  'date',
  'readTime',
  'seoTitle',
  'seoDescription',
  'published',
  'featured',
]

/** Keep only writable keys, coercing the two booleans. */
function pickWritable(body) {
  const payload = {}
  for (const field of WRITABLE_FIELDS) {
    if (body[field] !== undefined) payload[field] = body[field]
  }
  if (payload.published !== undefined) payload.published = toBoolean(payload.published)
  if (payload.featured !== undefined) payload.featured = toBoolean(payload.featured)
  return payload
}

/**
 * Build a unique slug from the requested title, appending -2, -3, … if needed.
 * `excludeId` lets an update keep its own slug without colliding with itself.
 */
async function buildUniqueSlug(desired, excludeId = null) {
  const base = slugify(desired) || 'post'
  let candidate = base
  let suffix = 1

  // Bounded so a pathological data set cannot spin here forever.
  while (suffix < 100) {
    const existing = await Blog.findOne({ slug: candidate }).select('_id').lean()
    if (!existing || String(existing._id) === String(excludeId)) return candidate
    suffix += 1
    candidate = `${base}-${suffix}`
  }

  // Fall back to something certainly unique.
  return `${base}-${Date.now().toString(36)}`
}

/**
 * GET /api/blogs  (public)
 * Optional query: ?category=, ?featured=true, ?search=, ?limit=
 * Returns published posts only, newest first.
 */
export const listPublishedBlogs = asyncHandler(async (req, res) => {
  const { category, search, featured } = req.query

  const filter = { published: true }
  if (category) filter.category = category
  if (featured === 'true') filter.featured = true
  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = new RegExp(escaped, 'i')
    filter.$or = [{ title: pattern }, { excerpt: pattern }]
  }

  const blogs = await Blog.find(filter).sort({ date: -1, createdAt: -1 }).lean()
  res.json({ success: true, data: toClientList(blogs) })
})

/**
 * GET /api/admin/blogs  (protected)
 * Returns every post regardless of publish state.
 */
export const listAllBlogs = asyncHandler(async (_req, res) => {
  const blogs = await Blog.find({}).sort({ date: -1, createdAt: -1 }).lean()
  res.json({ success: true, data: toClientList(blogs) })
})

/**
 * GET /api/blogs/:slug  (public)
 * Draft posts are only visible to an authenticated admin, so the public page
 * cannot leak an unpublished article by guessing its slug.
 */
export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: String(req.params.slug).toLowerCase() })

  if (!blog) throw ApiError.notFound('That blog post could not be found.')

  if (!blog.published && !req.user) {
    throw ApiError.notFound('That blog post could not be found.')
  }

  res.json({ success: true, data: toClient(blog) })
})

/**
 * POST /api/admin/blogs  (protected)
 */
export const createBlog = asyncHandler(async (req, res) => {
  const payload = pickWritable(req.body)
  let uploadedImage = ''
  let blog

  try {
    payload.slug = await buildUniqueSlug(payload.slug || payload.title)
    payload.image = await resolveImage(req.body.image, 'image')
    if (isImageUpload(req.body.image)) uploadedImage = payload.image

    blog = await Blog.create(payload)
  } catch (error) {
    await cleanupStoredImages([uploadedImage])
    throw error
  }

  res.status(201).json({ success: true, data: toClient(blog) })
})

/**
 * PUT /api/admin/blogs/:id  (protected)
 */
export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (!blog) throw ApiError.notFound('That blog post could not be found.')

  const payload = pickWritable(req.body)
  const previousImage = blog.image
  let uploadedImage = ''

  try {
    if (payload.slug !== undefined) {
      blog.slug = await buildUniqueSlug(payload.slug, blog._id)
    }

    // Only re-process the image when the client actually sent a new value.
    if (req.body.image !== undefined) {
      blog.image = await resolveImage(req.body.image, 'image')
      if (isImageUpload(req.body.image)) uploadedImage = blog.image
    }

    Object.entries(payload).forEach(([field, value]) => {
      if (field !== 'slug') blog[field] = value
    })

    await blog.save()
  } catch (error) {
    await cleanupStoredImages([uploadedImage])
    throw error
  }

  if (previousImage !== blog.image) await cleanupStoredImages([previousImage])
  res.json({ success: true, data: toClient(blog) })
})

/**
 * PATCH /api/admin/blogs/:id/publish  (protected)
 * Body: { published: boolean }
 */
export const setBlogPublished = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (!blog) throw ApiError.notFound('That blog post could not be found.')

  blog.published = toBoolean(req.body.published)
  await blog.save()

  res.json({ success: true, data: toClient(blog) })
})

/**
 * DELETE /api/admin/blogs/:id  (protected)
 */
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id)
  if (!blog) throw ApiError.notFound('That blog post could not be found.')

  await cleanupStoredImages([blog.image])
  res.json({ success: true, data: { id: String(blog._id), deleted: true } })
})
