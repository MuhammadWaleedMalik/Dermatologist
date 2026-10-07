import { motion } from 'framer-motion'
import { MdCalendarToday, MdPhone } from 'react-icons/md'
import Button from '../common/Button'
import { getWhatsAppUrl } from '../../utils/whatsapp'
import { siteConfig } from '../../data/siteConfig'

export default function CTASection() {
  return (
    <section className="section-padding bg-gradient-to-r from-primary via-primary-light to-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-2 border-gold" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-gold/50" />
      </div>

      <div className="container-clinic relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4">
            Book Your Visit
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to Transform Your Look?
          </h2>
          <p className="text-lg text-white/80 mb-8 leading-relaxed">
            Schedule a consultation with our expert team and take the first step towards healthier skin, fuller hair, and renewed confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" variant="gold" size="lg">
              <MdCalendarToday className="w-5 h-5" />
              Book Appointment
            </Button>
            <Button href={`tel:${siteConfig.phone}`} variant="outlineWhite" size="lg">
              <MdPhone className="w-5 h-5" />
              Call {siteConfig.phone}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
