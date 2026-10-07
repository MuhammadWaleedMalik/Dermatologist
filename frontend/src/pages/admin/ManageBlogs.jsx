import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiFileText } from 'react-icons/fi'
import BlogTable from '../../components/admin/blogs/BlogTable'
import BlogForm from '../../components/admin/blogs/BlogForm'
import { getBlogCategories, getAllBlogs, createBlog, updateBlog, deleteBlog, toggleBlogPublish } from '../../services/blogService'

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)

  useEffect(() => {
    let active = true
    Promise.all([getAllBlogs(), getBlogCategories()])
      .then(([blogData, categoryData]) => {
        if (active) {
          setBlogs(blogData.map((b) => ({ ...b, published: b.published !== false })))
          setCategories(categoryData.filter((c) => c !== 'All'))
          setError('')
        }
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load blog posts.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  const handleCreate = useCallback(() => {
    setEditingBlog(null)
    setFormOpen(true)
  }, [])

  const handleEdit = useCallback((blog) => {
    setEditingBlog(blog)
    setFormOpen(true)
  }, [])

  const handleSave = useCallback(async (blogData) => {
    const exists = blogs.some((b) => b.id === blogData.id)
    const saved = exists
      ? await updateBlog(blogData.id, blogData)
      : await createBlog(blogData)
    setBlogs((prev) => {
      const index = prev.findIndex((b) => b.id === saved.id)
      if (index >= 0) {
        const updated = [...prev]
        updated[index] = { ...saved, published: saved.published !== false }
        return updated
      }
      return [{ ...saved, published: saved.published !== false }, ...prev]
    })
    setError('')
  }, [blogs])

  const handleDelete = useCallback(async (id) => {
    await deleteBlog(id)
    setBlogs((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const handleTogglePublish = useCallback(async (id) => {
    const current = blogs.find((b) => b.id === id)
    const nextPublished = current ? !current.published : false
    await toggleBlogPublish(id, nextPublished)
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, published: nextPublished } : b))
    )
  }, [blogs])

  const publishedCount = blogs.filter((b) => b.published).length

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Manage Blogs</h1>
          <p className="text-primary/50 mt-1">
            {blogs.length} total &middot; {publishedCount} published &middot; {blogs.length - publishedCount} drafts
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 bg-gold text-primary font-semibold px-5 py-2.5 rounded-xl hover:bg-gold-light transition-all shadow-md hover:shadow-lg min-h-[44px] cursor-pointer"
        >
          <FiPlus className="w-5 h-5" />
          Add Blog
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Blog Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-gold border-t-primary rounded-full animate-spin" role="status" aria-label="Loading blogs" />
        </div>
      ) : blogs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-12 shadow-sm border border-accent/50 text-center"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiFileText className="w-8 h-8 text-primary/40" />
          </div>
          <h2 className="text-xl font-bold text-primary mb-2">No Blogs Yet</h2>
          <p className="text-primary/50 mb-6">Create your first blog post to get started.</p>
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 bg-gold text-primary font-semibold px-5 py-2.5 rounded-xl hover:bg-gold-light transition-all cursor-pointer"
          >
            <FiPlus className="w-5 h-5" />
            Create Blog
          </button>
        </motion.div>
      ) : (
        <BlogTable
          blogs={blogs}
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTogglePublish={handleTogglePublish}
        />
      )}

      {/* Blog Form Modal */}
      <BlogForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditingBlog(null) }}
        blog={editingBlog}
        onSave={handleSave}
      />
    </div>
  )
}
