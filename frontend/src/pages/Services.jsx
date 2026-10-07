import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiChevronDown } from 'react-icons/hi'
import {
  MdCheckCircle,
  MdSchedule,
  MdMedicalServices,
  MdHelpOutline,
  MdCalendarToday,
} from 'react-icons/md'
import SEO from '../components/common/SEO'
import PageTransition from '../components/common/PageTransition'
import SectionHeading from '../components/common/SectionHeading'
import ServiceIcon from '../components/common/ServiceIcon'
import LazyImage from '../components/common/LazyImage'
import Button from '../components/common/Button'
import { getWhatsAppUrl } from '../utils/whatsapp'
import { getTreatmentCategories } from '../services/treatmentService'

function ServiceAccordion({ category, isOpen, onToggle }) {
  return (
    <div className="border border-accent rounded-2xl overflow-hidden bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full px-6 py-4 text-left min-h-[44px] hover:bg-accent-gray transition-colors"
        aria-expanded={isOpen}
      >
        <h2 className="text-lg font-bold text-primary">{category.name}</h2>
        <HiChevronDown className={`w-5 h-5 text-gold transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {category.services.map((service) => (
                <ServiceDetailCard key={service.id} service={service} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ServiceDetailCard({ service }) {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <article
      id={service.slug}
      className="scroll-mt-28 bg-accent-gray rounded-2xl overflow-hidden border border-accent/50"
    >
      <div className="grid md:grid-cols-2 gap-0">
        <LazyImage
          src={service.image}
          alt={`${service.name} treatment`}
          className="w-full h-64 md:h-full object-cover min-h-[250px]"
        />
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <ServiceIcon name={service.icon} className="w-5 h-5 text-gold" />
            </div>
            <h3 className="text-2xl font-bold text-primary">{service.name}</h3>
          </div>
          <p className="text-primary/70 leading-relaxed mb-6">{service.description}</p>

          <div className="space-y-4 mb-6">
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-primary mb-2">
                <MdCheckCircle className="w-5 h-5 text-gold" /> Benefits
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {service.benefits.map((b) => (
                  <li key={b} className="text-sm text-primary/70 flex items-start gap-1.5">
                    <span className="text-gold mt-0.5">•</span> {b}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="flex items-center gap-2 font-semibold text-primary mb-2">
                <MdMedicalServices className="w-5 h-5 text-gold" /> Procedure
              </h4>
              <p className="text-sm text-primary/70">{service.procedure}</p>
            </div>

            <div>
              <h4 className="flex items-center gap-2 font-semibold text-primary mb-2">
                <MdSchedule className="w-5 h-5 text-gold" /> Recovery Time
              </h4>
              <p className="text-sm text-primary/70">{service.recoveryTime}</p>
            </div>
          </div>

          {service.faq.length > 0 && (
            <div className="mb-6">
              <h4 className="flex items-center gap-2 font-semibold text-primary mb-3">
                <MdHelpOutline className="w-5 h-5 text-gold" /> FAQ
              </h4>
              <div className="space-y-2">
                {service.faq.map((item, idx) => (
                  <div key={idx} className="border border-accent rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="flex items-center justify-between w-full px-4 py-3 text-left text-sm font-medium text-primary hover:bg-white transition-colors min-h-[44px]"
                      aria-expanded={openFaq === idx}
                    >
                      {item.q}
                      <HiChevronDown className={`w-4 h-4 text-gold shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === idx && (
                      <p className="px-4 pb-3 text-sm text-primary/70">{item.a}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" variant="gold" size="md">
            <MdCalendarToday className="w-4 h-4" />
            Book Appointment
          </Button>
        </div>
      </div>
    </article>
  )
}

export default function Services() {
  const location = useLocation()
  const hash = location.hash.replace('#', '')

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openCategory, setOpenCategory] = useState(null)

  const findCategoryForService = useCallback(
    (slug) => categories.find((cat) => cat.services.some((s) => s.slug === slug)),
    [categories]
  )

  useEffect(() => {
    let active = true
    setLoading(true)
    getTreatmentCategories()
      .then((data) => {
        if (!active) return
        setCategories(data)
        setError('')
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load our services.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  // Open the category that owns the linked treatment, or the first one.
  useEffect(() => {
    if (loading || categories.length === 0) return
    const category = findCategoryForService(hash)
    setOpenCategory((prev) => {
      if (prev && !hash) return prev
      if (category) return category.id
      return prev ?? categories[0].id
    })
  }, [loading, categories, findCategoryForService, hash])

  useEffect(() => {
    if (!hash || loading || categories.length === 0) return
    if (openCategory !== findCategoryForService(hash)?.id) return

    const timer = setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 350)
    return () => clearTimeout(timer)
  }, [hash, openCategory, loading, categories, findCategoryForService])

  return (
    <PageTransition>
      <SEO
        title="Our Services"
        description="Explore our comprehensive range of hair transplant, skin care, laser, and advanced aesthetic treatments at Dr Salman Skin & Hair Clinic."
        path="/services"
      />

      {/* Page Header */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary to-primary-light relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full border border-gold" />
        </div>
        <div className="container-clinic px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Our Services</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Comprehensive aesthetic treatments delivered with precision, care, and the latest medical technology.
          </p>
        </div>
      </section>

      <section className="section-padding bg-accent-gray">
        <div className="container-clinic">
          <SectionHeading
            subtitle="Treatment Categories"
            title="Professional Aesthetic Solutions"
            description="Browse our full range of treatments organized by category. Each service includes detailed information about benefits, procedure, and recovery."
          />

          {error && (
            <div className="max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-gold border-t-primary rounded-full animate-spin" role="status" aria-label="Loading services" />
            </div>
          ) : (
            <div className="space-y-4 max-w-5xl mx-auto">
              {categories.map((category) => (
                <ServiceAccordion
                  key={category.id}
                  category={category}
                  isOpen={openCategory === category.id}
                  onToggle={() =>
                    setOpenCategory(openCategory === category.id ? null : category.id)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  )
}
