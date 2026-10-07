import mongoose from 'mongoose'

// The admin blog form submits `date` as a `YYYY-MM-DD` string from an
// <input type="date">. It is kept as a string (not a Date) so the value
// round-trips through the existing form without timezone shifting.
const dateString = {
  type: String,
  trim: true,
  match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must use the YYYY-MM-DD format'],
}

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug may only contain lowercase letters, numbers and hyphens'],
    },
    excerpt: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: 500,
    },
    content: {
      type: String,
      trim: true,
      maxlength: 50000,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: 80,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      maxlength: 120,
    },
    date: { ...dateString, default: () => new Date().toISOString().slice(0, 10) },

    // GridFS path (`/uploads/<ObjectId>`). Binary uploads live in MongoDB's
    // GridFS collections rather than this content document.
    image: {
      type: String,
      trim: true,
      default: '',
      maxlength: 2000,
    },

    readTime: { type: String, trim: true, default: '5 min read', maxlength: 40 },
    seoTitle: { type: String, trim: true, default: '', maxlength: 200 },
    seoDescription: { type: String, trim: true, default: '', maxlength: 320 },

    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
)

// Serves the public blog list (published only, newest first).
blogSchema.index({ published: 1, date: -1 })
blogSchema.index({ category: 1 })

export const Blog = mongoose.model('Blog', blogSchema)
