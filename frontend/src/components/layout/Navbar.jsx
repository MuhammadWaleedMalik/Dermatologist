import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX, HiChevronDown } from 'react-icons/hi'
import { MdCalendarToday } from 'react-icons/md'
import Button from '../common/Button'
import { getWhatsAppUrl } from '../../utils/whatsapp'
import { serviceCategories } from '../../data/services'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Before & After', path: '/before-after' },
  { name: 'Blogs', path: '/blogs' },
  { name: 'Reviews', path: '/reviews' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 20)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setServicesOpen(false)
    setMobileServicesOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const linkClass = (isActive) => {
    if (isScrolled || isOpen) {
      return isActive ? 'text-gold' : 'text-primary hover:text-gold'
    }
    return isActive ? 'text-gold' : 'text-white/90 hover:text-gold'
  }

  const menuIconClass = isScrolled || isOpen ? 'text-primary' : 'text-white'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg py-2' : 'bg-transparent py-4'
      }`}
    >
      <nav className="container-clinic px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 shrink-0" aria-label="Dr Salman Clinic Home">
            <img
              src="/logo.png"
              alt="Dr Salman Skin & Hair Clinic Logo"
              className={`h-12 sm:h-14 w-auto object-contain transition-all`}
              width="56"
              height="56"
            />
          </Link>

          <ul className="hidden lg:flex items-center gap-1">
            <li>
              <Link to="/" className={`px-4 py-2 rounded-lg font-medium transition-colors ${linkClass(location.pathname === '/')}`}>
                Home
              </Link>
            </li>

            <li
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <Link
                to="/services"
                className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${linkClass(location.pathname.startsWith('/services'))}`}
              >
                Services
                <HiChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
              </Link>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[700px]"
                  >
                    <div className="bg-white rounded-2xl shadow-2xl border border-accent p-6 grid grid-cols-2 gap-6">
                      {serviceCategories.map((cat) => (
                        <div key={cat.id}>
                          <h3 className="text-gold font-semibold text-sm uppercase tracking-wider mb-3 border-b border-gold/20 pb-2">
                            {cat.name}
                          </h3>
                          <ul className="space-y-1">
                            {cat.services.slice(0, 5).map((service) => (
                              <li key={service.id}>
                                <Link
                                  to={`/services#${service.slug}`}
                                  className="block px-2 py-1.5 text-sm text-primary/80 hover:text-gold hover:bg-accent rounded transition-colors"
                                >
                                  {service.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <div className="col-span-2 pt-3 border-t border-accent">
                        <Link to="/services" className="text-gold font-semibold text-sm hover:underline">
                          View All Services
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {navLinks.slice(1).map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${linkClass(location.pathname === link.path)}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <Button href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" variant="gold" size="sm">
              <MdCalendarToday className="w-4 h-4" />
              Book Appointment
            </Button>
          </div>

          <button
            type="button"
            className={`lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center ${menuIconClass}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <HiX className="w-7 h-7" /> : <HiMenu className="w-7 h-7" />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-1 bg-white/95 backdrop-blur-lg rounded-2xl mt-3 shadow-xl border border-accent px-4">
                <Link to="/" className="block px-4 py-3 rounded-lg font-medium text-primary hover:bg-accent min-h-[44px]">
                  Home
                </Link>

                <div>
                  <button
                    type="button"
                    className="flex items-center justify-between w-full px-4 py-3 rounded-lg font-medium text-primary hover:bg-accent min-h-[44px]"
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    aria-expanded={mobileServicesOpen}
                  >
                    Services
                    <HiChevronDown className={`w-5 h-5 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {mobileServicesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        {serviceCategories.map((cat) => (
                          <div key={cat.id} className="pl-4 py-2">
                            <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-1 px-4">
                              {cat.name}
                            </p>
                            {cat.services.map((service) => (
                              <Link
                                key={service.id}
                                to={`/services#${service.slug}`}
                                className="block px-4 py-2 text-sm text-primary/80 hover:text-gold min-h-[44px]"
                              >
                                {service.name}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {navLinks.slice(1).map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block px-4 py-3 rounded-lg font-medium text-primary hover:bg-accent min-h-[44px]"
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="pt-3 px-4">
                  <Button href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" variant="gold" size="md" className="w-full">
                    <MdCalendarToday className="w-4 h-4" />
                    Book Appointment
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
