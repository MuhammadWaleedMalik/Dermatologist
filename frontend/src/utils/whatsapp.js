const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '923499995484'

const GENERAL_MESSAGE =
  'Assalam o Alaikum, I would like to book an appointment at Dr Salman Skin & Hair Clinic.'

export function getWhatsAppUrl(serviceName = null) {
  const message = serviceName
    ? `Assalam o Alaikum, I am interested in ${serviceName} treatment and would like to book an appointment at Dr Salman Skin & Hair Clinic.`
    : GENERAL_MESSAGE

  const encoded = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
}

export function openWhatsApp(serviceName = null) {
  window.open(getWhatsAppUrl(serviceName), '_blank', 'noopener,noreferrer')
}

export { WHATSAPP_NUMBER }
