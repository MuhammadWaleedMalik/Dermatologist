import SEO from '../components/common/SEO'
import PageTransition from '../components/common/PageTransition'
import HeroSlider from '../components/home/HeroSlider'
import AboutSection from '../components/home/AboutSection'
import WhyChooseUs from '../components/home/WhyChooseUs'
import FeaturedServices from '../components/home/FeaturedServices'
import TestimonialsPreview from '../components/home/TestimonialsPreview'
import CTASection from '../components/home/CTASection'

export default function Home() {
  return (
    <PageTransition>
      <SEO
        title="Premium Skin & Hair Treatments"
        description="Dr Salman Skin & Hair Clinic offers premium hair transplant, laser treatments, PRP therapy, and advanced skin care. Book your appointment today."
        path="/"
      />
      <HeroSlider />
      <AboutSection />
      <WhyChooseUs />
      <FeaturedServices />
      <TestimonialsPreview />
      <CTASection />
    </PageTransition>
  )
}
