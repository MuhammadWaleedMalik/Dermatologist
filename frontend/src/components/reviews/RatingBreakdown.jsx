import { MdStar } from 'react-icons/md'

export default function RatingBreakdown({ reviews = [] }) {
  const total = reviews.length

  const average = total
    ? (reviews.reduce((sum, r) => sum + Number(r.rating), 0) / total).toFixed(1)
    : '0.0'

  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach((r) => {
    if (breakdown[r.rating] !== undefined) breakdown[r.rating]++
  })

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-accent text-center">
      <p className="text-5xl font-bold text-primary mb-2">{average}</p>
      <div className="flex justify-center gap-1 mb-2">
        {Array.from({ length: 5 }, (_, i) => (
          <MdStar
            key={i}
            className={`w-6 h-6 ${i < Math.round(average) ? 'text-gold' : 'text-gray-300'}`}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="text-sm text-primary/60 mb-6">Based on {total} reviews</p>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className="flex items-center gap-3">
            <span className="text-sm text-primary/60 w-8">{star}</span>
            <MdStar className="w-4 h-4 text-gold shrink-0" aria-hidden="true" />
            <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all duration-500"
                style={{ width: `${total ? (breakdown[star] / total) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs text-primary/40 w-6">{breakdown[star]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}