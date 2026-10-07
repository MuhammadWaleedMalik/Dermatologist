import mongoose from 'mongoose'

const beforeAfterSchema = new mongoose.Schema(
  {
    // Optional in the form (it falls back to `treatment`), kept for clarity.
    title: { type: String, trim: true, default: '', maxlength: 200 },
    treatment: {
      type: String,
      required: [true, 'Treatment is required'],
      trim: true,
      maxlength: 160,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: 80,
    },

    // Both fields store GridFS paths; bytes live in GridFS.
    before: {
      type: String,
      required: [true, 'Before image is required'],
      trim: true,
      maxlength: 2000,
    },
    after: {
      type: String,
      required: [true, 'After image is required'],
      trim: true,
      maxlength: 2000,
    },

    alt: { type: String, trim: true, default: '', maxlength: 250 },
    description: { type: String, trim: true, default: '', maxlength: 2000 },

    published: { type: Boolean, default: true },
  },
  { timestamps: true },
)

beforeAfterSchema.index({ published: 1, category: 1 })

export const BeforeAfter = mongoose.model('BeforeAfter', beforeAfterSchema)
