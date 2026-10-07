import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdClose, MdZoomIn } from 'react-icons/md'
import BeforeAfterSlider from '../components/beforeAfter/BeforeAfterSlider'
import SEO from '../components/common/SEO'
import PageTransition from '../components/common/PageTransition'
import SectionHeading from '../components/common/SectionHeading'
import {
  getBeforeAfterCases,
  getBeforeAfterCategories,
} from '../services/beforeAfterService'

export default function BeforeAfter() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [categories, setCategories] = useState(['All'])
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lightboxItem, setLightboxItem] = useState(null)

  useEffect(() => {
    let active = true
    getBeforeAfterCategories()
      .then((data) => { if (active) setCategories(data) })
      .catch(() => { /* filter row degrades to 'All' */ })
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true
    setLoading(true)
    getBeforeAfterCases(activeCategory === 'All' ? undefined : activeCategory)
      .then((data) => {
        if (active) {
          // Defensive: the API only returns published entries, but never render
          // a draft on the public site even if one slips through.
          setGallery(data.filter((item) => item.published === true))
          setError('')
        }
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load the gallery.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [activeCategory])

  return (
    <PageTransition>
      <SEO
        title="Before & After Gallery"
        description="View real before and after results from hair transplant, PRP, acne, laser, and skin treatments at Dr Salman Skin & Hair Clinic."
        path="/before-after"
      />

      <section className="pt-32 pb-16 bg-gradient-to-br from-primary to-primary-light">
        <div className="container-clinic px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Before & After</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Real transformations from our patients. Drag the slider to compare results.
          </p>
        </div>
      </section>

      <section className="section-padding bg-accent-gray">
        <div className="container-clinic">
          <SectionHeading
            subtitle="Results Gallery"
            title="See the Difference"
            description="Browse our collection of treatment results. Filter by treatment type to find relevant transformations."
          />

          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 min-h-[44px] ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-primary hover:bg-gold hover:text-primary border border-accent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          {error && (
            <div className="p-4 mb-8 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-gold border-t-primary rounded-full animate-spin" role="status" aria-label="Loading gallery" />
            </div>
          ) : gallery.length === 0 ? (
            <p className="text-center text-primary/50 py-12">No results in this category yet.</p>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {gallery.map((item) => (
                  <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
                >
                  <div className="relative">
                    <BeforeAfterSlider
                      before={item.before}
                      after={item.after}
                      alt={item.alt}
                    />
                    <button
                      type="button"
                      onClick={() => setLightboxItem(item)}
                      className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg min-h-[44px] min-w-[44px]"
                      aria-label="View full size comparison"
                    >
                      <MdZoomIn className="w-5 h-5 text-primary" />
                    </button>
                  </div>
<div className="p-4">
                      <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="text-lg font-bold text-primary mt-1">{item.treatment}</h3>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxItem(null)}
            role="dialog"
            aria-label="Image lightbox"
          >
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 w-11 h-11 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label="Close lightbox"
            >
              <MdClose className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <BeforeAfterSlider
                before={lightboxItem.before}
                after={lightboxItem.after}
                alt={lightboxItem.alt}
              />
              <p className="text-white text-center mt-4 text-lg font-semibold">
                {lightboxItem.treatment}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
