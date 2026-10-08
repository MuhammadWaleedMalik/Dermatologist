import { motion } from 'framer-motion'
import { MdArrowOutward } from 'react-icons/md'
import LazyImage from '../common/LazyImage'
import { fadeInUp } from '../../utils/motionVariants'
import { getWhatsAppUrl } from '../../utils/whatsapp'

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="section-padding scroll-mt-28 overflow-hidden bg-[#F8F5EF]"
    >
      <div className="container-clinic">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div {...fadeInUp} className="relative mx-auto w-full max-w-xl pb-24 sm:pb-28">
            <div
              aria-hidden="true"
              className="absolute right-3 top-7 h-3/4 w-3/4 rounded-t-full border border-gold/30"
            />

            <figure className="relative w-[75%]">
              <LazyImage
                src="/pic3.jpeg"
                alt="Dr Salman seated at his clinic desk, writing notes"
                width={960}
                height={1280}
                className="aspect-[4/5] w-full object-cover object-[center_38%]"
                wrapperClassName="rounded-t-[10rem] rounded-b-2xl bg-white shadow-lg"
              />
              <figcaption className="mt-3 max-w-[40%] pl-1 text-xs leading-relaxed tracking-wide text-primary/65 sm:text-sm">
                A moment at the clinic
              </figcaption>
            </figure>

            <figure className="absolute bottom-0 right-0 w-[66%] rounded-2xl border-[6px] border-[#F8F5EF] bg-white shadow-xl sm:border-8">
              <LazyImage
                src="/pic2.jpeg"
                alt="Dr Salman in blue scrubs holding a certificate alongside colleagues at an event"
                width={1280}
                height={960}
                className="aspect-[4/3] w-full object-cover"
                wrapperClassName="rounded-t-lg bg-white"
              />
              <figcaption className="px-3 py-3 text-xs leading-relaxed text-primary/70 sm:px-4 sm:text-sm">
                Dr Salman with colleagues
              </figcaption>
            </figure>
          </motion.div>

          <motion.div {...fadeInUp}>
            <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/70 sm:text-xs">
              <span aria-hidden="true" className="h-px w-10 bg-gold" />
              The doctor behind the name
            </p>
            <h2 id="about-heading" className="text-4xl leading-tight text-primary sm:text-5xl lg:text-[3.5rem]">
              Meet Dr <span className="italic">Salman.</span>
            </h2>
            <p className="mt-6 max-w-md text-xl leading-relaxed text-primary sm:text-2xl">
              Skin, hair &amp; aesthetic care, with you at the centre.
            </p>
            <p className="mt-5 max-w-lg text-base leading-8 text-primary/70">
              Dr Salman is the doctor behind Dr Salman Skin &amp; Hair Clinic and
              SalmanGuzellik. Discover the clinic's skin, hair and aesthetic
              services, and arrange a consultation to discuss your concerns and
              the care you are looking for.
            </p>

            <div className="my-8 border-y border-primary/10 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/55">
                Begin with a conversation
              </p>
              <p className="mt-2 max-w-md text-sm leading-7 text-primary/75">
                Share what matters to you, ask your questions, and explore your
                treatment options with Dr Salman.
              </p>
            </div>

            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book a consultation with Dr Salman on WhatsApp (opens in a new tab)"
              className="group inline-flex min-h-12 items-center gap-4 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              Book a consultation
              <MdArrowOutward aria-hidden="true" className="h-5 w-5 text-gold transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
