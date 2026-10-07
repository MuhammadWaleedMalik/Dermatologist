import { useState, useEffect } from 'react'
import { FiSave } from 'react-icons/fi'
import Modal from '../common/Modal'
import ImageUploader from './ImageUploader'
import { blogCategories } from '../../../data/blogs'

const categories = blogCategories.filter((c) => c !== 'All')

const defaultForm = {
  title: '',
  slug: '',
  category: '',
  image: null,
  author: '',
  date: new Date().toISOString().split('T')[0],
  readTime: '5 min read',
  excerpt: '',
  content: '',
  seoTitle: '',
  seoDescription: '',
  published: false,
  featured: false,
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function BlogForm({ isOpen, onClose, blog, onSave }) {
  const [form, setForm] = useState(defaultForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const isEditing = !!blog

  useEffect(() => {
    if (blog) {
      setForm({
        ...defaultForm,
        ...blog,
        published: blog.published !== false,
        image: blog.image ? { file: null, preview: blog.image } : null,
      })
    } else {
      setForm(defaultForm)
    }
    setErrors({})
    setSaveError('')
  }, [blog, isOpen])

  const handleChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'title' && !isEditing) {
        next.slug = generateSlug(value)
      }
      return next
    })
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
    setSaveError('')
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.slug.trim()) errs.slug = 'Slug is required'
    if (!form.category) errs.category = 'Category is required'
    if (!form.author.trim()) errs.author = 'Author is required'
    if (!form.excerpt.trim()) errs.excerpt = 'Short description is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    try {
      const blogData = {
        ...form,
        image: form.image?.preview || form.image || '',
        id: blog?.id || Date.now(),
      }
      await onSave(blogData)
      onClose()
    } catch (error) {
      // Surface the API's validation message instead of failing silently.
      setSaveError(error.message || 'Could not save this blog post. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all bg-white min-h-[44px] ${
      errors[field] ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-accent focus:border-gold focus:ring-2 focus:ring-gold/20'
    }`

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Blog' : 'Add New Blog'} size="xl">
      <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={inputClass('title')}
            placeholder="Enter blog title"
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Slug *</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
            className={inputClass('slug')}
            placeholder="blog-url-slug"
          />
          {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
        </div>

        {/* Category + Author row */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Category *</label>
            <select
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={inputClass('category')}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Author *</label>
            <input
              type="text"
              value={form.author}
              onChange={(e) => handleChange('author', e.target.value)}
              className={inputClass('author')}
              placeholder="Dr Salman"
            />
            {errors.author && <p className="text-xs text-red-500 mt-1">{errors.author}</p>}
          </div>
        </div>

        {/* Date + Reading Time row */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className={inputClass('date')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Reading Time</label>
            <input
              type="text"
              value={form.readTime}
              onChange={(e) => handleChange('readTime', e.target.value)}
              className={inputClass('readTime')}
              placeholder="5 min read"
            />
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Featured Image</label>
          <ImageUploader
            value={form.image}
            onChange={(val) => handleChange('image', val)}
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Short Description *</label>
          <textarea
            rows={2}
            value={form.excerpt}
            onChange={(e) => handleChange('excerpt', e.target.value)}
            className={inputClass('excerpt')}
            placeholder="Brief summary of the article..."
          />
          {errors.excerpt && <p className="text-xs text-red-500 mt-1">{errors.excerpt}</p>}
        </div>

        {/* Full Content */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Full Content</label>
          <textarea
            rows={6}
            value={form.content}
            onChange={(e) => handleChange('content', e.target.value)}
            className={inputClass('content') + ' resize-none'}
            placeholder="Write the full blog article content here..."
          />
        </div>

        {/* SEO Section */}
        <div className="pt-2 border-t border-accent">
          <h4 className="text-sm font-semibold text-primary mb-3">SEO Settings</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">SEO Title</label>
              <input
                type="text"
                value={form.seoTitle}
                onChange={(e) => handleChange('seoTitle', e.target.value)}
                className={inputClass('seoTitle')}
                placeholder="Custom title for search engines"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">SEO Description</label>
              <textarea
                rows={2}
                value={form.seoDescription}
                onChange={(e) => handleChange('seoDescription', e.target.value)}
                className={inputClass('seoDescription') + ' resize-none'}
                placeholder="Meta description for search engines"
              />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => handleChange('published', e.target.checked)}
              className="w-4 h-4 rounded border-accent text-gold focus:ring-gold/20 accent-gold-dark"
            />
            <span className="text-sm font-medium text-primary">Publish immediately</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => handleChange('featured', e.target.checked)}
              className="w-4 h-4 rounded border-accent text-gold focus:ring-gold/20 accent-gold-dark"
            />
            <span className="text-sm font-medium text-primary">Featured post</span>
          </label>
        </div>

        {/* Server-side error (duplicate slug, validation failure, offline, ...) */}
        {saveError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {saveError}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-3 border-t border-accent">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-accent text-sm font-medium text-primary hover:bg-accent transition-colors min-h-[44px] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-primary text-sm font-semibold hover:bg-gold-light transition-all shadow-md disabled:opacity-60 min-h-[44px] cursor-pointer"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <FiSave className="w-4 h-4" />
            )}
            {isEditing ? 'Save Changes' : 'Create Blog'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
