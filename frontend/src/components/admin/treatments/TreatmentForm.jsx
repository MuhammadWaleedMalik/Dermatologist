import { useState, useEffect } from 'react'
import { FiSave, FiPlus, FiX } from 'react-icons/fi'
import Modal from '../common/Modal'
import ImageUploader from '../blogs/ImageUploader'
import { serviceCategories } from '../../../data/services'

const categories = serviceCategories.map((c) => ({ id: c.id, name: c.name }))

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

const defaultForm = {
  name: '',
  slug: '',
  categoryId: '',
  image: null,
  shortDescription: '',
  description: '',
  benefits: [''],
  procedure: '',
  recoveryTime: '',
  faq: [{ q: '', a: '' }],
  published: false,
  featured: false,
}

export default function TreatmentForm({ isOpen, onClose, treatment, onSave }) {
  const [form, setForm] = useState(defaultForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const isEditing = !!treatment

  useEffect(() => {
    if (treatment) {
      setForm({
        ...defaultForm,
        ...treatment,
        benefits: treatment.benefits?.length ? treatment.benefits : [''],
        faq: treatment.faq?.length ? treatment.faq : [{ q: '', a: '' }],
        image: treatment.image ? { file: null, preview: treatment.image } : null,
      })
    } else {
      setForm(defaultForm)
    }
    setErrors({})
    setSaveError('')
  }, [treatment, isOpen])

  const handleChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'name' && !isEditing) {
        next.slug = generateSlug(value)
      }
      return next
    })
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
    setSaveError('')
  }

  const handleBenefitChange = (index, value) => {
    const updated = [...form.benefits]
    updated[index] = value
    handleChange('benefits', updated)
  }

  const addBenefit = () => handleChange('benefits', [...form.benefits, ''])
  const removeBenefit = (index) => {
    if (form.benefits.length <= 1) return
    handleChange('benefits', form.benefits.filter((_, i) => i !== index))
  }

  const handleFaqChange = (index, field, value) => {
    const updated = [...form.faq]
    updated[index] = { ...updated[index], [field]: value }
    handleChange('faq', updated)
  }

  const addFaq = () => handleChange('faq', [...form.faq, { q: '', a: '' }])
  const removeFaq = (index) => {
    if (form.faq.length <= 1) return
    handleChange('faq', form.faq.filter((_, i) => i !== index))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Treatment name is required'
    if (!form.slug.trim()) errs.slug = 'Slug is required'
    if (!form.categoryId) errs.categoryId = 'Category is required'
    if (!form.shortDescription.trim()) errs.shortDescription = 'Short description is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    try {
      const cat = categories.find((c) => c.id === form.categoryId)
      const data = {
        ...form,
        category: cat?.name || '',
        image: form.image?.preview || form.image || '',
        benefits: form.benefits.filter((b) => b.trim()),
        faq: form.faq.filter((f) => f.q.trim()),
        id: treatment?.id || form.slug,
      }
      await onSave(data)
      onClose()
    } catch (error) {
      // Surface the API's validation message instead of failing silently.
      setSaveError(error.message || 'Could not save this treatment. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all bg-white min-h-[44px] ${
      errors[field] ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' : 'border-accent focus:border-gold focus:ring-2 focus:ring-gold/20'
    }`

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Treatment' : 'Add New Treatment'} size="xl">
      <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Treatment Name *</label>
          <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} className={inputClass('name')} placeholder="e.g. Hair Transplant" />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Slug + Category */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Slug *</label>
            <input type="text" value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} className={inputClass('slug')} placeholder="treatment-url-slug" />
            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1.5">Category *</label>
            <select value={form.categoryId} onChange={(e) => handleChange('categoryId', e.target.value)} className={inputClass('categoryId')}>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>}
          </div>
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Thumbnail</label>
          <ImageUploader value={form.image} onChange={(val) => handleChange('image', val)} />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Short Description *</label>
          <textarea rows={2} value={form.shortDescription} onChange={(e) => handleChange('shortDescription', e.target.value)} className={inputClass('shortDescription')} placeholder="Brief summary..." />
          {errors.shortDescription && <p className="text-xs text-red-500 mt-1">{errors.shortDescription}</p>}
        </div>

        {/* Full Description */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Full Description</label>
          <textarea rows={4} value={form.description} onChange={(e) => handleChange('description', e.target.value)} className={inputClass('description') + ' resize-none'} placeholder="Detailed description of the treatment..." />
        </div>

        {/* Procedure */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Procedure</label>
          <textarea rows={3} value={form.procedure} onChange={(e) => handleChange('procedure', e.target.value)} className={inputClass('procedure') + ' resize-none'} placeholder="Step-by-step procedure description..." />
        </div>

        {/* Recovery Time */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Recovery Time</label>
          <input type="text" value={form.recoveryTime} onChange={(e) => handleChange('recoveryTime', e.target.value)} className={inputClass('recoveryTime')} placeholder="e.g. 3-5 days" />
        </div>

        {/* Benefits */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">Benefits</label>
          <div className="space-y-2">
            {form.benefits.map((benefit, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleBenefitChange(idx, e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-accent focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm bg-white min-h-[44px]"
                  placeholder={`Benefit ${idx + 1}`}
                />
                {form.benefits.length > 1 && (
                  <button type="button" onClick={() => removeBenefit(idx)} className="w-10 h-10 flex items-center justify-center rounded-xl text-primary/30 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 cursor-pointer">
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addBenefit} className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:text-gold-dark transition-colors cursor-pointer">
            <FiPlus className="w-4 h-4" /> Add Benefit
          </button>
        </div>

        {/* FAQ */}
        <div>
          <label className="block text-sm font-medium text-primary mb-1.5">FAQ</label>
          <div className="space-y-3">
            {form.faq.map((item, idx) => (
              <div key={idx} className="border border-accent rounded-xl p-3 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={item.q}
                    onChange={(e) => handleFaqChange(idx, 'q', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-accent focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm bg-white min-h-[40px]"
                    placeholder="Question"
                  />
                  {form.faq.length > 1 && (
                    <button type="button" onClick={() => removeFaq(idx)} className="w-9 h-9 flex items-center justify-center rounded-lg text-primary/30 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 cursor-pointer">
                      <FiX className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <textarea
                  rows={2}
                  value={item.a}
                  onChange={(e) => handleFaqChange(idx, 'a', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-accent focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm bg-white resize-none"
                  placeholder="Answer"
                />
              </div>
            ))}
          </div>
          <button type="button" onClick={addFaq} className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:text-gold-dark transition-colors cursor-pointer">
            <FiPlus className="w-4 h-4" /> Add FAQ
          </button>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6 pt-2 border-t border-accent">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => handleChange('published', e.target.checked)} className="w-4 h-4 rounded border-accent text-gold focus:ring-gold/20 accent-gold-dark" />
            <span className="text-sm font-medium text-primary">Publish immediately</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => handleChange('featured', e.target.checked)} className="w-4 h-4 rounded border-accent text-gold focus:ring-gold/20 accent-gold-dark" />
            <span className="text-sm font-medium text-primary">Featured treatment</span>
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
            {isEditing ? 'Save Changes' : 'Create Treatment'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
