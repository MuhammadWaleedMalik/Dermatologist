import SEO from '../components/common/SEO'
import PageTransition from '../components/common/PageTransition'
import HeroSection from '../components/home/HeroSection'
import AboutSection from '../components/home/AboutSection'
import WhyChooseUs from '../components/home/WhyChooseUs'
import FeaturedServices from '../components/home/FeaturedServices'
import TestimonialsPreview from '../components/home/TestimonialsPreview'
import CTASection from '../components/home/CTASection'

export default function Home() {
  return (
    <PageTransition>
      <SEO
        title="Dr Salman Skin & Hair Clinic"
        description="Welcome to SalmanGuzellik. Güzellik means beauty in Turkish. Meet Dr Salman and explore skin, hair and aesthetic care at Dr Salman Skin & Hair Clinic."
        path="/"
        image="/pic1.jpeg"
      />
      <HeroSection />
      <AboutSection />
      <WhyChooseUs />
      <FeaturedServices />
      <TestimonialsPreview />
      <CTASection />
    </PageTransition>
  )
}
