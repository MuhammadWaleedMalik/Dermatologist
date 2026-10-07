import mongoose from 'mongoose'

const faqSchema = new mongoose.Schema(
  {
    q: { type: String, required: true, trim: true, maxlength: 300 },
    a: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { _id: false },
)

const treatmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 160,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug may only contain lowercase letters, numbers and hyphens'],
    },

    // Kept as plain strings rather than a second collection: the frontend
    // flattens categories into `category` (name) + `categoryId`, and a student
    // project does not benefit from an extra join. Categories are derived with
    // `.distinct()` in the treatment service.
    category: { type: String, required: [true, 'Category is required'], trim: true, maxlength: 80 },
    categoryId: { type: String, required: [true, 'Category id is required'], trim: true, maxlength: 80 },

    // e.g. 'MdSpa' / 'GiHairStrands' — resolved by the frontend's ServiceIcon map.
    icon: { type: String, trim: true, default: 'MdMedicalServices', maxlength: 60 },

    shortDescription: { type: String, trim: true, default: '', maxlength: 400 },
    description: { type: String, trim: true, default: '', maxlength: 5000 },
    benefits: [{ type: String, trim: true, maxlength: 200 }],
    procedure: { type: String, trim: true, default: '', maxlength: 3000 },
    recoveryTime: { type: String, trim: true, default: '', maxlength: 500 },
    faq: { type: [faqSchema], default: [] },

    // GridFS path; binary uploads live in GridFS.
    image: { type: String, trim: true, default: '', maxlength: 2000 },

    published: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
)

treatmentSchema.index({ categoryId: 1, published: 1 })

export const Treatment = mongoose.model('Treatment', treatmentSchema)
