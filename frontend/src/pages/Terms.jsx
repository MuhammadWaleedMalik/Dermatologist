import SEO from '../components/common/SEO'
import PageTransition from '../components/common/PageTransition'

export default function Terms() {
  return (
    <PageTransition>
      <SEO title="Terms & Conditions" description="Terms and Conditions for Dr Salman Skin & Hair Clinic." path="/terms" />

      <section className="pt-32 pb-16 bg-gradient-to-br from-primary to-primary-light">
        <div className="container-clinic px-4 text-center">
          <h1 className="text-4xl font-bold text-white">Terms & Conditions</h1>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-clinic max-w-3xl">
          <p className="text-primary/70 leading-relaxed mb-4">
            By accessing and using the Dr Salman Skin & Hair Clinic website, you agree to comply with these terms and conditions.
          </p>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Medical Disclaimer</h2>
          <p className="text-primary/70 leading-relaxed mb-4">
            Information on this website is for general educational purposes only and does not constitute medical advice. Always consult with a qualified healthcare professional before starting any treatment.
          </p>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Appointments</h2>
          <p className="text-primary/70 leading-relaxed mb-4">
            Appointment requests submitted through our website are subject to confirmation. We reserve the right to reschedule appointments when necessary.
          </p>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Intellectual Property</h2>
          <p className="text-primary/70 leading-relaxed">
            All content, images, and branding on this website are the property of Dr Salman Skin & Hair Clinic and may not be reproduced without permission.
          </p>
        </div>
      </section>
    </PageTransition>
  )
}
