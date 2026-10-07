// Blog service — talks to the Express backend.
//
// The exported function signatures are unchanged from the previous
// localStorage implementation, so every existing caller keeps working.
//
// Category and "popular treatments" lists are navigation metadata that lives in
// frontend/src/data/blogs.js; they are not database content, so they are still
// read from there.

import api from './api'
import { blogCategories, popularTreatments } from '../data/blogs'

/** Categories shown in the blog sidebar / admin filter dropdown. */
export async function getBlogCategories() {
  return [...blogCategories]
}

/** Treatments highlighted in the blog sidebar. */
export async function getPopularTreatments() {
  return [...popularTreatments]
}

/**
 * GET /api/blogs — published posts only.
 * Used by the public Blogs page and the dashboard's blog counts.
 */
export async function getBlogs() {
  const response = await api.get('/blogs')
  return response.data
}

/** GET /api/admin/blogs — every post, drafts included. */
export async function getAllBlogs() {
  const response = await api.get('/admin/blogs')
  return response.data
}

/** GET /api/blogs/:slug */
export async function getBlogBySlug(slug) {
  try {
    const response = await api.get(`/blogs/${encodeURIComponent(slug)}`)
    return response.data
  } catch (error) {
    // A missing or unpublished post is a normal outcome for the public page,
    // which renders a "not found" state. Do not throw.
    if (error.status === 404) return null
    throw error
  }
}

/** POST /api/admin/blogs */
export async function createBlog(blogData) {
  const response = await api.post('/admin/blogs', blogData)
  return response.data
}

/** PUT /api/admin/blogs/:id */
export async function updateBlog(id, blogData) {
  const response = await api.put(`/admin/blogs/${id}`, blogData)
  return response.data
}

/** DELETE /api/admin/blogs/:id */
export async function deleteBlog(id) {
  await api.delete(`/admin/blogs/${id}`)
  return true
}

/** PATCH /api/admin/blogs/:id/publish */
export async function toggleBlogPublish(id, published) {
  const response = await api.patch(`/admin/blogs/${id}/publish`, { published })
  return response.data
}