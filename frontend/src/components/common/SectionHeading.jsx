import { motion } from 'framer-motion'

export default function SectionHeading({
  subtitle,
  title,
  description,
  align = 'center',
  light = false,
}) {
  const alignClass = {
    center: 'text-center mx-auto',
    left: 'text-left',
  }[align]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className={`mb-12 md:mb-16 max-w-3xl ${alignClass}`}
    >
      {subtitle && (
        <span className={`inline-block text-sm font-semibold tracking-widest uppercase mb-3 ${light ? 'text-gold' : 'text-gold'}`}>
          {subtitle}
        </span>
      )}
      <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight ${light ? 'text-white' : 'text-primary'}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-base sm:text-lg leading-relaxed ${light ? 'text-white/80' : 'text-primary/70'}`}>
          {description}
        </p>
      )}
      <div className={`mt-4 h-1 w-20 bg-gold rounded-full ${align === 'center' ? 'mx-auto' : ''}`} />
    </motion.div>
  )
}
