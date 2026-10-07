import { Helmet } from 'react-helmet-async'
import { siteConfig } from '../../data/siteConfig'

export default function SEO({
  title,
  description,
  path = '',
  image = '/logo.png',
  type = 'website',
}) {
  const fullTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} | Premium Skin & Hair Treatments`
  const desc = description || siteConfig.tagline
  const url = `${siteConfig.url}${path}`
  const imageUrl = image.startsWith('http') ? image : `${siteConfig.url}${image}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: siteConfig.name,
    description: desc,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address,
      addressCountry: 'PK',
    },
    openingHours: ['Mo-Sa 10:00-20:00', 'Su 12:00-18:00'],
    image: imageUrl,
    priceRange: '$$',
    medicalSpecialty: ['Dermatology', 'Hair Restoration', 'Cosmetic Surgery'],
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={siteConfig.name} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={imageUrl} />

      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}
