import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Navigation, Pagination, Keyboard } from 'swiper/modules'
import { motion } from 'framer-motion'
import { MdCalendarToday, MdExplore } from 'react-icons/md'
import Button from '../common/Button'
import { getWhatsAppUrl } from '../../utils/whatsapp'
import { heroSlides } from '../../data/heroSlides'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function HeroSlider() {
  const swiperRef = useRef(null)

  return (
    <section className="relative h-screen min-h-[600px] max-h-[100vh] overflow-hidden" aria-label="Hero banner">
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, EffectFade, Navigation, Pagination, Keyboard]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop
        speed={1000}
        navigation
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        className="hero-swiper h-full w-full"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              {/* Background Image with Zoom Animation */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  loading="lazy"
                  className="hero-slide-bg absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Dark Blue Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-primary/50" />

              {/* Decorative Elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 right-20 w-64 h-64 rounded-full border border-gold/30" />
                <div className="absolute bottom-32 left-10 w-40 h-40 rounded-full border border-gold/20" />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="container-clinic px-4 sm:px-6 lg:px-8">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="max-w-2xl"
                    >
                      <span className="inline-block px-4 py-1.5 bg-gold/20 border border-gold/40 rounded-full text-gold text-sm font-semibold tracking-wider uppercase mb-4">
                        {slide.title}
                      </span>
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-4">
                        {slide.heading}
                      </h1>
                      <p className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed max-w-xl">
                        {slide.description}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" variant="gold" size="lg">
                          <MdCalendarToday className="w-5 h-5" />
                          Book Appointment
                        </Button>
                        <Button to="/services" variant="outlineWhite" size="lg">
                          <MdExplore className="w-5 h-5" />
                          Explore Services
                        </Button>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="hidden lg:flex justify-center"
                    >
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-gold rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
