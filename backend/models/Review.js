import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 120,
    },
    // Optional — the public review form marks email as "Optional".
    // Used by the clinic to follow up, so it is not exposed on public reads.
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
      maxlength: 200,
      match: [
        /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    treatment: {
      type: String,
      required: [true, 'Treatment is required'],
      trim: true,
      maxlength: 120,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
    },
    // Field name matches the existing frontend data shape (`text`, not `comment`).
    text: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      maxlength: 3000,
    },
    // GridFS path; binary uploads live in GridFS.
    image: { type: String, trim: true, default: '', maxlength: 2000 },
    date: {
      type: String,
      trim: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must use the YYYY-MM-DD format'],
      default: () => new Date().toISOString().slice(0, 10),
    },

    // The frontend has exactly two states: approved (public) and not approved
    // (hidden). `false` therefore means "hidden" rather than a third state.
    approved: { type: Boolean, default: false },
  },
  { timestamps: true },
)

reviewSchema.index({ approved: 1, createdAt: -1 })

export const Review = mongoose.model('Review', reviewSchema)
