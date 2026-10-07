export const testimonials = [
  {
    id: 1,
    name: 'Ahmed Khan',
    treatment: 'Hair Transplant',
    rating: 5,
    text: 'Dr Salman and his team transformed my confidence. The hair transplant results exceeded my expectations. Natural hairline and excellent aftercare support.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80&auto=format&fit=crop',
    date: '2025-11-15',
  },
  {
    id: 2,
    name: 'Sara Malik',
    treatment: 'Hydra Facial',
    rating: 5,
    text: 'The most luxurious facial experience I have ever had. My skin was glowing immediately after the Hydra Facial. The clinic atmosphere is premium and welcoming.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80&auto=format&fit=crop',
    date: '2025-12-02',
  },
  {
    id: 3,
    name: 'Usman Ali',
    treatment: 'PRP Hair Therapy',
    rating: 5,
    text: 'After 4 PRP sessions, my hair density has noticeably improved. Dr Salman explained every step clearly. Highly recommend for anyone experiencing hair thinning.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80&auto=format&fit=crop',
    date: '2026-01-08',
  },
  {
    id: 4,
    name: 'Fatima Hassan',
    treatment: 'Laser Hair Removal',
    rating: 5,
    text: 'Painless and effective laser sessions. The staff is professional and the equipment is clearly top-of-the-line. Already seeing great results after 3 sessions.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80&auto=format&fit=crop',
    date: '2026-01-20',
  },
  {
    id: 5,
    name: 'Bilal Ahmed',
    treatment: 'Acne Treatment',
    rating: 4,
    text: 'Struggled with acne for years. The customized treatment plan here finally cleared my skin. Professional, caring, and results-driven clinic.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80&auto=format&fit=crop',
    date: '2026-02-05',
  },
]

export const reviews = [
  ...testimonials,
  {
    id: 6,
    name: 'Ayesha Noor',
    treatment: 'Microneedling',
    rating: 5,
    text: 'My acne scars have faded significantly after microneedling sessions. The clinic maintains the highest hygiene standards. Truly a premium experience.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80&auto=format&fit=crop',
    date: '2026-02-14',
  },
  {
    id: 7,
    name: 'Hamza Sheikh',
    treatment: 'Beard Transplant',
    rating: 5,
    text: 'Perfect beard density and natural look. The team listened to exactly what I wanted and delivered beyond expectations. Worth every penny.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80&auto=format&fit=crop',
    date: '2026-02-28',
  },
  {
    id: 8,
    name: 'Nadia Qureshi',
    treatment: 'Anti Aging',
    rating: 5,
    text: 'The anti-aging program here is comprehensive and personalized. Botox and skincare combination gave me a refreshed, natural look. Friends keep asking my secret!',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80&auto=format&fit=crop',
    date: '2026-03-10',
  },
]

export const getAverageRating = () => {
  const total = reviews.reduce((sum, r) => sum + r.rating, 0)
  return (total / reviews.length).toFixed(1)
}

export const getRatingBreakdown = () => {
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach((r) => { breakdown[r.rating]++ })
  return breakdown
}
