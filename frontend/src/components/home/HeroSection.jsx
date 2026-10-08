import { MdArrowDownward, MdArrowForward, MdCalendarToday } from 'react-icons/md'
import Button from '../common/Button'
import { siteConfig } from '../../data/siteConfig'
import { getWhatsAppUrl } from '../../utils/whatsapp'

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-primary-dark text-white" aria-labelledby="welcome-heading">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#1a4a7a_0%,_transparent_65%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-64 top-28 size-[800px] rounded-full border border-gold/10" />

      <div className="container-clinic relative px-5 pt-32 pb-10 sm:px-8 sm:pt-36 lg:px-8 lg:pt-40 lg:pb-14">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="max-w-xl">
            <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-light sm:text-xs">
              <span aria-hidden="true" className="h-px w-8 shrink-0 bg-gold" />
              Skin, hair & aesthetic care
            </p>
            <p className="mb-3 font-serif text-2xl text-white/95 sm:text-3xl">{siteConfig.brandName}</p>
            <p className="max-w-md text-sm leading-relaxed text-white/65">
              <span lang="tr" className="font-medium text-gold-light">Güzellik</span> means
              {' '}<span className="text-white">“beauty”</span> in Turkish.
              A beautiful name for care that celebrates you.
            </p>

            <h1 id="welcome-heading" className="mt-8 text-[clamp(2.8rem,5.1vw,4.75rem)] font-medium leading-[1.1] tracking-tight">
              Beauty begins<br />
              <span className="italic text-gold-light">with you.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-8 text-white/75 sm:text-lg">
              Welcome to Dr Salman Skin & Hair Clinic. Discover skin,
              hair and aesthetic care with a personal touch, guided by Dr Salman.
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6">
              <Button href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" variant="gold" className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light">
                <MdCalendarToday className="size-4" aria-hidden="true" />
                Book a Consultation
              </Button>
              <a href="#about" className="inline-flex min-h-12 items-center justify-center gap-2 text-sm font-medium text-white/90 transition-colors hover:text-gold-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light">
                Meet Dr Salman
                <MdArrowDownward className="size-4" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/15 pt-5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/55 sm:text-xs">
              <span>Skin health</span>
              <span aria-hidden="true" className="text-gold">/</span>
              <span>Hair care</span>
              <span aria-hidden="true" className="text-gold">/</span>
              <span>Aesthetics</span>
            </div>
          </div>

          <figure className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div aria-hidden="true" className="absolute -inset-2 rounded-t-[10rem] rounded-b-2xl border border-gold/30 sm:-inset-3 sm:rounded-t-[12rem]" />
            <div className="relative overflow-hidden rounded-t-[9.5rem] rounded-b-xl bg-primary sm:rounded-t-[11.5rem]">
              <img
                src="/pic1.jpeg"
                alt="Dr Salman in a black suit outside a building"
                width="960"
                height="1280"
                loading="eager"
                fetchPriority="high"
                className="aspect-[4/5] w-full object-cover object-[center_38%]"
              />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-primary-dark/95 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-6 pb-6 sm:px-8 sm:pb-8">
                <div>
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-gold-light">The person behind the care</p>
                  <p className="font-serif text-3xl sm:text-4xl">Dr Salman</p>
                  <p className="mt-2 text-sm text-white/70">Skin & Hair Clinic</p>
                </div>
                <a href="#about" aria-label="Learn about Dr Salman" className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:border-gold hover:bg-gold hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light">
                  <MdArrowForward className="size-5" aria-hidden="true" />
                </a>
              </figcaption>
            </div>
          </figure>
        </div>

        <p className="mt-12 text-center text-[10px] uppercase tracking-[0.24em] text-white/65 sm:mt-14 sm:text-xs">
          A personal approach to feeling like yourself
        </p>
      </div>
    </section>
  )
}
