import { useState, useEffect } from 'react'
import { FiSave } from 'react-icons/fi'
import Modal from '../common/Modal'
import DualImageUploader from './DualImageUploader'
import { galleryCategories } from '../../../data/beforeAfter'
import { getImageUrl } from '../../../utils/image'

const categories = galleryCategories.filter((c) => c !== 'All')

const defaultForm = {
  title: '',
  treatment: '',
  category: '',
  before: null,
  after: null,
  description: '',
  published: false,
}

export default function BeforeAfterForm({ isOpen, onClose, caseData, onSave }) {
  const [form, setForm] = useState(defaultForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const isEditing = !!caseData

  useEffect(() => {
    if (caseData) {
      setForm({
        ...defaultForm,
        ...caseData,
        // Keep the raw stored value alongside the display preview so an edit
        // that doesn't touch the images sends the original path back instead
        // of a frontend-resolved absolute URL.
        before: caseData.before ? { file: null, preview: getImageUrl(caseData.before), original: caseData.before } : null,
        after: caseData.after ? { file: null, preview: getImageUrl(caseData.after), original: caseData.after } : null,
      })
    } else {
      setForm(defaultForm)
    }
    setErrors({})
    setSaveError('')
  }, [caseData, isOpen])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
    setSaveError('')
  }

  const validate = () => {
    const errs = {}
    if (!form.treatment.trim()) errs.treatment = 'Treatment name is required'
    if (!form.category) errs.category = 'Category is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    try {
      // A newly chosen file is submitted as its data-URL preview (the API's
      // upload contract). Otherwise send back exactly what the API stored, so
      // editing text never rewrites or drops the existing image paths.
      const imageValue = (field) => {
        const value = form[field]
        if (!value) return ''
        if (value.file instanceof File) return value.preview
        return value.original ?? value.preview ?? ''
      }

      const data = {
        ...form,
        before: imageValue('before'),
        after: imageValue('after'),
        title: form.title.trim() || form.treatment,
      }
      if (isEditing && caseData?.id) {
        data.id = caseData.id
      } else {
        delete data.id
      }
      await onSave(data)
      onClose()
    } catch (error) {
      // Surface the API's validation message instead of failing silently.
      setSaveError(error.message || 'Could not save this case. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all bg-white min-h-[44px] ${
      errors[field] ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-accent focus:border-gold focus:ring-2 focus:ring-gold/20'
    }`

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Case' : 'Add New Case'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Before & After Images</label>
          <DualImageUploader
            before={form.before}
            after={form.after}
            onBeforeChange={(val) => handleChange('before', val)}
            onAfterChange={(val) => handleChange('after', val)}
          />
        </div>

        {/* Treatment + Category */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Treatment Name *</label>
            <input type="text" value={form.treatment} onChange={(e) => handleChange('treatment', e.target.value)} className={inputClass('treatment')} placeholder="e.g. FUE Hair Transplant" />
            {errors.treatment && <p className="text-xs text-red-500 mt-1">{errors.treatment}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Category *</label>
            <select value={form.category} onChange={(e) => handleChange('category', e.target.value)} className={inputClass('category')}>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Title</label>
          <input type="text" value={form.title} onChange={(e) => handleChange('title', e.target.value)} className={inputClass('title')} placeholder="Optional display title" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Description</label>
          <textarea rows={3} value={form.description} onChange={(e) => handleChange('description', e.target.value)} className={inputClass('description') + ' resize-none'} placeholder="Optional case description or notes..." />
        </div>

        {/* Published */}
        <div className="pt-2 border-t border-accent">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => handleChange('published', e.target.checked)} className="w-4 h-4 rounded border-accent text-gold focus:ring-gold/20 accent-gold-dark" />
            <span className="text-sm font-medium text-primary">Publish immediately</span>
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
            {isEditing ? 'Save Changes' : 'Create Case'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
