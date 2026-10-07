import { motion } from 'framer-motion'
import {
  MdMedicalServices,
  MdAttachMoney,
  MdPrecisionManufacturing,
  MdFavorite,
  MdBiotech,
  MdVerifiedUser,
} from 'react-icons/md'
import SectionHeading from '../common/SectionHeading'
import { staggerContainer, staggerItem } from '../../utils/motionVariants'

const reasons = [
  { icon: MdMedicalServices, title: 'Certified Doctors', description: 'Board-certified specialists with extensive aesthetic medicine experience.' },
  { icon: MdAttachMoney, title: 'Affordable Treatments', description: 'Premium quality treatments at competitive, transparent pricing.' },
  { icon: MdPrecisionManufacturing, title: 'Modern Equipment', description: 'State-of-the-art FDA-approved devices and technology.' },
  { icon: MdFavorite, title: 'Personalized Care', description: 'Customized treatment plans tailored to your unique needs and goals.' },
  { icon: MdBiotech, title: 'Latest Technology', description: 'Continuous investment in the newest aesthetic medical innovations.' },
  { icon: MdVerifiedUser, title: 'Safe Procedures', description: 'Strict hygiene protocols and safety standards in every treatment.' },
]

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-white">
      <div className="container-clinic">
        <SectionHeading
          subtitle="Why Choose Us"
          title="The Dr Salman Difference"
          description="Experience the perfect blend of medical expertise, luxury comfort, and proven results at our premium aesthetic clinic."
        />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {reasons.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={staggerItem}
              whileHover={{ y: -5 }}
              className="group p-6 sm:p-8 rounded-2xl bg-accent-gray border border-transparent hover:border-gold/20 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mb-5 group-hover:bg-gold transition-colors duration-300">
                <Icon className="w-7 h-7 text-gold group-hover:text-primary transition-colors duration-300" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
              <p className="text-primary/60 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
