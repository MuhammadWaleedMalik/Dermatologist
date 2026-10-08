import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaTiktok, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'
import { MdPhone, MdEmail, MdLocationOn } from 'react-icons/md'
import { siteConfig } from '../../data/siteConfig'

const footerLinks = {
  clinic: [
    { name: 'About Us', path: '/#about' },
    { name: 'Services', path: '/services' },
  ],
  quickLinks: [
    { name: 'Home', path: '/' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Before & After', path: '/before-after' },
  ],
  treatments: [
    { name: 'Hair Transplant', path: '/services#hair-transplant' },
    { name: 'PRP Therapy', path: '/services#prp-hair-therapy' },
    { name: 'Microneedling', path: '/services#microneedling' },
    { name: 'Laser Treatments', path: '/services#laser-hair-removal' },
    { name: 'Skin Care', path: '/services#hydra-facial' },
  ],
}

const socialIcons = [
  { icon: FaFacebookF, href: siteConfig.social.facebook, label: 'Facebook' },
  { icon: FaInstagram, href: siteConfig.social.instagram, label: 'Instagram' },
  { icon: FaTiktok, href: siteConfig.social.tiktok, label: 'TikTok' },
  { icon: FaLinkedinIn, href: siteConfig.social.linkedin, label: 'LinkedIn' },
  { icon: FaWhatsapp, href: siteConfig.social.whatsapp, label: 'WhatsApp' },
]

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="bg-primary text-white" role="contentinfo">
      <div className="section-padding pb-8">
        <div className="container-clinic">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <img
                src="/logo.png"
                alt="Dr Salman Skin & Hair Clinic"
                className="h-20 w-auto mb-4 "
                width="80"
                height="80"
                loading="lazy"
              />
              <p className="mb-3 font-serif text-3xl text-white">
                Salman<span className="text-gold-light">Guzellik</span>
              </p>
              <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm">
                <span lang="tr" className="text-gold-light">Güzellik</span> means beauty in Turkish.
                {' '}Discover a personal approach to skin, hair and aesthetic care with Dr Salman.
              </p>
              <div className="space-y-2 text-sm text-white/70">
                <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 hover:text-gold transition-colors">
                  <MdPhone className="w-4 h-4 text-gold shrink-0" />
                  {siteConfig.phone}
                </a>
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-gold transition-colors">
                  <MdEmail className="w-4 h-4 text-gold shrink-0" />
                  {siteConfig.email}
                </a>
                <a
                  href={siteConfig.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View clinic location on Google Maps"
                  className="flex items-start gap-2 text-white/70 hover:text-gold transition-colors cursor-pointer"
                >
                  <MdLocationOn className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span>{siteConfig.address}</span>
                </a>
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([key, links]) => (
              <div key={key}>
                <h3 className="text-gold font-semibold text-sm uppercase tracking-wider mb-4">
                  {key === 'clinic' ? 'Clinic' : key === 'quickLinks' ? 'Quick Links' : 'Treatments'}
                </h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="text-sm text-white/70 hover:text-gold transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Social */}
            <div>
              <h3 className="text-gold font-semibold text-sm uppercase tracking-wider mb-4">
                Follow Us
              </h3>
              <div className="flex flex-wrap gap-3">
                {socialIcons.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-11 h-11 flex items-center justify-center rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-primary transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-clinic px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <p>&copy; {currentYear} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
