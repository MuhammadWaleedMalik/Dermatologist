import { useState, useEffect } from 'react'
import SEO from '../components/common/SEO'
import PageTransition from '../components/common/PageTransition'
import SectionHeading from '../components/common/SectionHeading'
import ReviewCard from '../components/reviews/ReviewCard'
import RatingBreakdown from '../components/reviews/RatingBreakdown'
import ReviewForm from '../components/reviews/ReviewForm'
import { getTestimonials, submitReview } from '../services/reviewService'

export default function Reviews() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getTestimonials()
      .then((data) => {
        if (active) {
          setItems(data)
          setError('')
        }
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load patient reviews.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  const handleSubmit = async (formData) => {
    const created = await submitReview(formData)
    setItems((prev) => [created, ...prev])
    return created
  }

  return (
    <PageTransition>
      <SEO
        title="Patient Reviews"
        description="Read authentic patient reviews and ratings for Dr Salman Skin & Hair Clinic. Share your experience with our treatments."
        path="/reviews"
      />

      <section className="pt-32 pb-16 bg-gradient-to-br from-primary to-primary-light">
        <div className="container-clinic px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Patient Reviews</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Hear from our satisfied patients about their transformation journeys.
          </p>
        </div>
      </section>

      <section className="section-padding bg-accent-gray">
        <div className="container-clinic">
          <SectionHeading
            subtitle="Testimonials"
            title="Trusted by Thousands"
            description="Our patients consistently rate us highly for quality care, results, and experience."
          />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-10 h-10 border-4 border-gold border-t-primary rounded-full animate-spin" role="status" aria-label="Loading reviews" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {items.map((review, index) => (
                    <ReviewCard key={review.id} review={review} index={index} />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-8">
              <RatingBreakdown reviews={items} />
              <ReviewForm onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
