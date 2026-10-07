import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdArrowForward } from 'react-icons/md'
import SectionHeading from '../common/SectionHeading'
import ServiceIcon from '../common/ServiceIcon'
import LazyImage from '../common/LazyImage'
import Button from '../common/Button'
import { getFeaturedServices } from '../../services/treatmentService'
import { staggerContainer, staggerItem } from '../../utils/motionVariants'

export default function FeaturedServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getFeaturedServices()
      .then((data) => {
        if (active) setServices(data)
      })
      .catch(() => {
        if (active) setServices([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  return (
    <section className="section-padding bg-gradient-to-b from-accent-gray to-white">
      <div className="container-clinic">
        <SectionHeading
          subtitle="Our Services"
          title="Featured Treatments"
          description="Discover our most popular aesthetic treatments designed to enhance your natural beauty and restore your confidence."
        />

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-gold border-t-primary rounded-full animate-spin" role="status" aria-label="Loading featured treatments" />
          </div>
        ) : services.length === 0 ? (
          <p className="text-primary/60 text-center py-12">No featured treatments available yet.</p>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((service) => (
              <motion.article
                key={service.id}
                variants={staggerItem}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-accent"
              >
                <div className="relative h-48 overflow-hidden">
                  <LazyImage
                    src={service.image}
                    alt={`${service.name} treatment at Dr Salman Clinic`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
                    <ServiceIcon name={service.icon} className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-primary mb-2">{service.name}</h3>
                  <p className="text-sm text-primary/60 mb-4 line-clamp-2">{service.shortDescription}</p>
                  <Button
                    to={`/services#${service.slug}`}
                    variant="ghost"
                    size="sm"
                    className="!px-0 text-gold hover:!bg-transparent group/btn"
                  >
                    Learn More
                    <MdArrowForward className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        <div className="text-center mt-12">
          <Button to="/services" variant="primary" size="lg">
            View All Services
            <MdArrowForward className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}