import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { motion } from 'framer-motion'
import { MdStar } from 'react-icons/md'
import SectionHeading from '../common/SectionHeading'
import LazyImage from '../common/LazyImage'
import Button from '../common/Button'
import { getTestimonials } from '../../services/reviewService'

import 'swiper/css'
import 'swiper/css/pagination'

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <MdStar
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-gold' : 'text-gray-300'}`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export default function TestimonialsPreview() {
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    let active = true
    getTestimonials()
      .then((data) => {
        if (active) setTestimonials(data)
      })
    return () => { active = false }
  }, [])

  return (
    <section className="section-padding bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gold blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-gold blur-3xl" />
      </div>

      <div className="container-clinic relative z-10">
        <SectionHeading
          subtitle="Testimonials"
          title="What Our Patients Say"
          description="Real stories from patients who trusted us with their skin and hair transformation journey."
          light
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {testimonials.length > 0 ? (
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop
              spaceBetween={24}
              breakpoints={{
                320: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-12 [&_.swiper-pagination-bullet]:bg-white/50 [&_.swiper-pagination-bullet-active]:bg-gold"
            >
              {testimonials.map((item) => (
                <SwiperSlide key={item.id}>
                  <article className="glass-card rounded-2xl p-6 sm:p-8 h-full flex flex-col">
                    <StarRating rating={item.rating} />
                    <blockquote className="text-primary/80 leading-relaxed my-4 flex-1 italic">
                      &ldquo;{item.text}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-4 pt-4 border-t border-accent">
                      <LazyImage
                        src={item.image}
                        alt={`${item.name} profile photo`}
                        className="w-12 h-12 rounded-full object-cover"
                        wrapperClassName="w-12 h-12 rounded-full shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-primary">{item.name}</p>
                        <p className="text-sm text-gold">{item.treatment}</p>
                      </div>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-white/60 text-center py-12">No reviews yet.</p>
          )}
        </motion.div>

        <div className="text-center mt-4">
          <Button to="/reviews" variant="gold" size="md">
            Read All Reviews
          </Button>
        </div>
      </div>
    </section>
  )
}