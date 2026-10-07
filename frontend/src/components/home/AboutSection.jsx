import { motion } from 'framer-motion'
import { MdVerified, MdGroups, MdBiotech, MdHealthAndSafety } from 'react-icons/md'
import SectionHeading from '../common/SectionHeading'
import LazyImage from '../common/LazyImage'
import { fadeInUp, staggerContainer, staggerItem } from '../../utils/motionVariants'

const stats = [
  { icon: MdVerified, value: '15+', label: 'Years of Experience' },
  { icon: MdGroups, value: '10+', label: 'Certified Specialists' },
  { icon: MdBiotech, value: '50+', label: 'Advanced Technology' },
  { icon: MdHealthAndSafety, value: '100%', label: 'Safe Treatments' },
]

export default function AboutSection() {
  return (
    <section id="about" className="section-padding bg-accent-gray">
      <div className="container-clinic">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div {...fadeInUp} className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <LazyImage
                src="/WhatsApp Image 2026-10-07 at 12.51.26 PM.jpeg"
                alt="Dr Salman Skin & Hair Clinic interior"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gold/10 rounded-full blur-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10" />
          </motion.div>

          <div>
            <SectionHeading
              subtitle="About Our Clinic"
              title="Excellence in Skin & Hair Aesthetics"
              description="Dr Salman Skin & Hair Clinic is a premier aesthetic destination offering world-class treatments in a luxurious, medical-grade environment. Our certified specialists combine advanced technology with personalized care."
              align="left"
            />

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4 sm:gap-6"
            >
              {stats.map(({ icon: Icon, value, label }) => (
                <motion.div
                  key={label}
                  variants={staggerItem}
                  className="glass-card rounded-2xl p-5 sm:p-6 text-center hover:shadow-xl transition-shadow duration-300"
                >
                  <Icon className="w-8 h-8 text-gold mx-auto mb-3" aria-hidden="true" />
                  <p className="text-2xl sm:text-3xl font-bold text-primary mb-1">{value}</p>
                  <p className="text-sm text-primary/60">{label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
