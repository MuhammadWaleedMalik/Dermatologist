import { useState } from 'react'
import { MdStar, MdSend } from 'react-icons/md'
import Button from '../common/Button'

const treatments = [
  'Hair Transplant', 'PRP Therapy', 'Laser Hair Removal', 'Microneedling',
  'Hydra Facial', 'Acne Treatment', 'Anti Aging', 'Other',
]

export default function ReviewForm({ onSubmit }) {
  const [form, setForm] = useState({ name: '', email: '', treatment: '', rating: 0, review: '' })
  const [hoverRating, setHoverRating] = useState(0)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
    setSubmitError('')
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Please enter your name.'
    if (!form.rating) errs.rating = 'Please select a rating.'
    if (!form.review.trim()) errs.review = 'Please write a short review.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting || !validate()) return

    setSubmitting(true)
    setSubmitError('')
    try {
      if (typeof onSubmit === 'function') {
        await onSubmit(form)
      }
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-accent bg-white p-5 text-center shadow-lg sm:p-8">
        <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <MdSend className="w-8 h-8 text-gold" />
        </div>
        <h3 className="text-xl font-bold text-primary mb-2">Thank You!</h3>
        <p className="break-words text-primary/60 [overflow-wrap:anywhere]">
          Your review has been published and added to the top of the reviews.
        </p>
      </div>
    )
  }

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl border focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none min-h-[44px] ${
      errors[field]
        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
        : 'border-accent'
    }`

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-accent space-y-5">
      <h3 className="text-xl font-bold text-primary">Write a Review</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="review-name" className="block text-sm font-medium text-primary mb-1.5">Name *</label>
          <input
            id="review-name"
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={inputClass('name')}
            placeholder="Your name"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="review-email" className="block text-sm font-medium text-primary mb-1.5">Email</label>
          <input
            id="review-email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={inputClass('email')}
            placeholder="Optional"
          />
        </div>
      </div>

      <div>
        <label htmlFor="review-treatment" className="block text-sm font-medium text-primary mb-1.5">Treatment</label>
        <select
          id="review-treatment"
          value={form.treatment}
          onChange={(e) => handleChange('treatment', e.target.value)}
          className={inputClass('treatment') + ' bg-white'}
        >
          <option value="">Select treatment (optional)</option>
          {treatments.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <span className="block text-sm font-medium text-primary mb-2">Rating *</span>
        <div className="grid max-w-[260px] grid-cols-5 gap-1">
          {Array.from({ length: 5 }, (_, i) => {
            const starValue = i + 1
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleChange('rating', starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                className="flex min-h-[44px] min-w-0 items-center justify-center p-1"
                aria-label={`Rate ${starValue} stars`}
              >
                <MdStar
                  className={`w-7 h-7 transition-colors ${
                    starValue <= (hoverRating || form.rating) ? 'text-gold' : 'text-gray-300'
                  }`}
                />
              </button>
            )
          })}
        </div>
        {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating}</p>}
      </div>

      <div>
        <label htmlFor="review-text" className="block text-sm font-medium text-primary mb-1.5">Review *</label>
        <textarea
          id="review-text"
          rows={4}
          value={form.review}
          onChange={(e) => handleChange('review', e.target.value)}
          className={inputClass('review') + ' resize-none'}
          placeholder="Share your experience..."
        />
        {errors.review && <p className="text-xs text-red-500 mt-1">{errors.review}</p>}
      </div>

      {submitError && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {submitError}
        </div>
      )}

      <Button type="submit" variant="gold" size="md" className="w-full sm:w-auto" disabled={submitting}>
        <MdSend className="w-4 h-4" />
        {submitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  )
}
