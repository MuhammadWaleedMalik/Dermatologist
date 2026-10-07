import { Blog } from '../models/Blog.js'
import { Review } from '../models/Review.js'
import { Treatment } from '../models/Treatment.js'
import { BeforeAfter } from '../models/BeforeAfter.js'
import { asyncHandler } from '../utils/asyncHandler.js'

/**
 * GET /api/admin/stats  (protected)
 *
 * Aggregated counts for the admin dashboard. Runs as parallel aggregation
 * pipelines so the dashboard is a single request instead of five.
 */
export const getStats = asyncHandler(async (_req, res) => {
  const [blogs, reviews, treatments, treatmentCategories, beforeAfter, galleryCategories] =
    await Promise.all([
      Blog.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            published: { $sum: { $cond: ['$published', 1, 0] } },
          },
        },
        { $project: { _id: 0, total: 1, published: 1 } },
      ]),

      Review.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            approved: { $sum: { $cond: ['$approved', 1, 0] } },
          },
        },
        { $project: { _id: 0, total: 1, approved: 1 } },
      ]),

      Treatment.countDocuments(),
      Treatment.distinct('categoryId'),

      BeforeAfter.countDocuments(),
      BeforeAfter.distinct('category'),
    ])

  const blogTotals = blogs[0] ?? { total: 0, published: 0 }
  const reviewTotals = reviews[0] ?? { total: 0, approved: 0 }

  res.json({
    success: true,
    data: {
      blogs: {
        total: blogTotals.total,
        published: blogTotals.published,
        drafts: blogTotals.total - blogTotals.published,
      },
      reviews: {
        total: reviewTotals.total,
        approved: reviewTotals.approved,
        pending: reviewTotals.total - reviewTotals.approved,
      },
      treatments: {
        total: treatments,
        categories: treatmentCategories.filter(Boolean).length,
      },
      beforeAfter: {
        total: beforeAfter,
        categories: galleryCategories.filter(Boolean).length,
      },
    },
  })
})