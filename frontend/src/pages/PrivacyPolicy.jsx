import SEO from '../components/common/SEO'
import PageTransition from '../components/common/PageTransition'

export default function PrivacyPolicy() {
  return (
    <PageTransition>
      <SEO title="Privacy Policy" description="Privacy Policy for Dr Salman Skin & Hair Clinic." path="/privacy-policy" />

      <section className="pt-32 pb-16 bg-gradient-to-br from-primary to-primary-light">
        <div className="container-clinic px-4 text-center">
          <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-clinic max-w-3xl prose prose-primary">
          <p className="text-primary/70 leading-relaxed mb-4">
            Dr Salman Skin & Hair Clinic is committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information when you visit our website or use our services.
          </p>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Information We Collect</h2>
          <p className="text-primary/70 leading-relaxed mb-4">
            We may collect personal information including your name, email address, phone number, and treatment preferences when you fill out appointment forms, review forms, or contact us directly.
          </p>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">How We Use Your Information</h2>
          <p className="text-primary/70 leading-relaxed mb-4">
            Your information is used to schedule appointments, respond to inquiries, improve our services, and send relevant health information with your consent.
          </p>
          <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Data Security</h2>
          <p className="text-primary/70 leading-relaxed">
            We implement appropriate security measures to protect your personal data against unauthorized access, alteration, or disclosure.
          </p>
        </div>
      </section>
    </PageTransition>
  )
}
