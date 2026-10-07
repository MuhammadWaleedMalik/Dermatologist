import { motion } from 'framer-motion'
import { MdStar } from 'react-icons/md'
import LazyImage from '../common/LazyImage'

function StarRating({ rating, size = 'md' }) {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  const safeRating = Math.min(5, Math.max(0, Number(rating) || 0))

  return (
    <div className="flex shrink-0 flex-nowrap gap-0.5" aria-label={`${safeRating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <MdStar
          key={i}
          className={`${sizeClass} shrink-0 ${i < safeRating ? 'text-gold' : 'text-gray-300'}`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

function getInitials(name) {
  const words = String(name || 'Patient').trim().split(/\s+/).filter(Boolean)
  return words.slice(0, 2).map((word) => word[0]).join('').toUpperCase() || 'P'
}

function formatDate(value) {
  if (!value) return ''

  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function ReviewCard({ review, index }) {
  const formattedDate = formatDate(review.date)

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-accent bg-white p-5 shadow-lg transition-shadow hover:shadow-xl sm:p-6"
    >
      <div className="mb-4 flex min-w-0 items-start gap-3 sm:gap-4">
        {review.image ? (
          <LazyImage
            src={review.image}
            alt={`${review.name || 'Patient'} profile`}
            className="h-12 w-12 rounded-full object-cover sm:h-14 sm:w-14"
            wrapperClassName="h-12 w-12 shrink-0 overflow-hidden rounded-full sm:h-14 sm:w-14"
          />
        ) : (
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-gold sm:h-14 sm:w-14 sm:text-base"
            aria-hidden="true"
          >
            {getInitials(review.name)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="break-words font-bold leading-snug text-primary [overflow-wrap:anywhere]">
            {review.name || 'Anonymous patient'}
          </h3>
          {review.treatment && (
            <p className="mt-0.5 break-words text-sm leading-snug text-gold [overflow-wrap:anywhere]">
              {review.treatment}
            </p>
          )}
          {formattedDate && (
            <p className="mt-1 text-xs text-primary/40">{formattedDate}</p>
          )}
          <div className="mt-2 max-w-full overflow-hidden">
            <StarRating rating={review.rating} size="sm" />
          </div>
        </div>
      </div>
      <p className="max-w-full whitespace-pre-wrap break-words text-primary/70 leading-relaxed italic [overflow-wrap:anywhere]">
        &ldquo;{review.text}&rdquo;
      </p>
    </motion.article>
  )
}

export { StarRating }
