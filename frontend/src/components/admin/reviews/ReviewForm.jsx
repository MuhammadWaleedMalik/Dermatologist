import { useState, useEffect } from 'react'
import { FiSave, FiStar } from 'react-icons/fi'
import Modal from '../common/Modal'
import ImageUploader from '../blogs/ImageUploader'

const treatments = [
  'Hair Transplant', 'PRP Hair Therapy', 'Hydra Facial', 'Laser Hair Removal',
  'Acne Treatment', 'Microneedling', 'Beard Transplant', 'Anti Aging',
  'CO2 Laser', 'Skin Whitening', 'Botox', 'Chemical Peel',
]

const defaultForm = {
  name: '',
  email: '',
  treatment: '',
  rating: 5,
  text: '',
  image: null,
  date: new Date().toISOString().split('T')[0],
  approved: false,
}

export default function ReviewForm({ isOpen, onClose, review, onSave }) {
  const [form, setForm] = useState(defaultForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const isEditing = !!review

  useEffect(() => {
    if (review) {
      setForm({
        ...defaultForm,
        ...review,
        image: review.image ? { file: null, preview: review.image } : null,
      })
    } else {
      setForm(defaultForm)
    }
    setErrors({})
    setSaveError('')
  }, [review, isOpen])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
    setSaveError('')
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Patient name is required'
    if (!form.treatment) errs.treatment = 'Treatment is required'
    if (!form.text.trim()) errs.text = 'Review text is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    try {
      const data = {
        ...form,
        image: form.image?.preview || form.image || '',
        id: review?.id || Date.now(),
      }
      await onSave(data)
      onClose()
    } catch (error) {
      // Surface the API's validation message instead of failing silently.
      setSaveError(error.message || 'Could not save this review. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all bg-white min-h-[44px] ${
      errors[field] ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-accent focus:border-gold focus:ring-2 focus:ring-gold/20'
    }`

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Review' : 'Add New Review'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
        {/* Patient Info */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Patient Name *</label>
            <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} className={inputClass('name')} placeholder="e.g. Ahmed Khan" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} className={inputClass('email')} placeholder="patient@email.com" />
          </div>
        </div>

        {/* Treatment + Rating */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Treatment *</label>
            <select value={form.treatment} onChange={(e) => handleChange('treatment', e.target.value)} className={inputClass('treatment')}>
              <option value="">Select treatment</option>
              {treatments.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.treatment && <p className="text-xs text-red-500 mt-1">{errors.treatment}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Rating *</label>
            <div className="flex items-center gap-1 pt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleChange('rating', s)}
                  className="p-0.5 cursor-pointer"
                >
                  <FiStar
                    className={`w-7 h-7 transition-colors ${
                      s <= form.rating ? 'text-gold fill-gold' : 'text-primary/20 hover:text-gold/50'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Review Text *</label>
          <textarea rows={4} value={form.text} onChange={(e) => handleChange('text', e.target.value)} className={inputClass('text') + ' resize-none'} placeholder="Patient's review text..." />
          {errors.text && <p className="text-xs text-red-500 mt-1">{errors.text}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Date</label>
          <input type="date" value={form.date} onChange={(e) => handleChange('date', e.target.value)} className={inputClass('date')} />
        </div>

        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Profile Image</label>
          <ImageUploader
            value={form.image}
            onChange={(val) => handleChange('image', val)}
          />
        </div>

        {/* Approved */}
        <div className="pt-2 border-t border-accent">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.approved} onChange={(e) => handleChange('approved', e.target.checked)} className="w-4 h-4 rounded border-accent text-gold focus:ring-gold/20 accent-gold-dark" />
            <span className="text-sm font-medium text-primary">Approve immediately</span>
          </label>
        </div>

        {/* Server-side error (validation failure, offline, ...) */}
        {saveError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {saveError}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-3 border-t border-accent">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-accent text-sm font-medium text-primary hover:bg-accent transition-colors min-h-[44px] cursor-pointer">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-primary text-sm font-semibold hover:bg-gold-light transition-all shadow-md disabled:opacity-60 min-h-[44px] cursor-pointer">
            {saving ? <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> : <FiSave className="w-4 h-4" />}
            {isEditing ? 'Save Changes' : 'Create Review'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
