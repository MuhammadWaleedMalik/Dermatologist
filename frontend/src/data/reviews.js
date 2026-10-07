// Mock reviews data for admin dashboard development.
// This file contains the same reviews as testimonials.js but with additional
// admin-related fields (email, approved, profileImage).
//
// TODO: Remove this file and use the real backend API when available.

export const reviews = [
  {
    id: 1,
    name: 'Ahmed Khan',
    email: 'ahmed.khan@example.com',
    treatment: 'Hair Transplant',
    rating: 5,
    text: 'Dr Salman and his team transformed my confidence. The hair transplant results exceeded my expectations. Natural hairline and excellent aftercare support.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80&auto=format&fit=crop',
    date: '2025-11-15',
    approved: true,
  },
  {
    id: 2,
    name: 'Sara Malik',
    email: 'sara.malik@example.com',
    treatment: 'Hydra Facial',
    rating: 5,
    text: 'The most luxurious facial experience I have ever had. My skin was glowing immediately after the Hydra Facial. The clinic atmosphere is premium and welcoming.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80&auto=format&fit=crop',
    date: '2025-12-02',
    approved: true,
  },
  {
    id: 3,
    name: 'Usman Ali',
    email: 'usman.ali@example.com',
    treatment: 'PRP Hair Therapy',
    rating: 5,
    text: 'After 4 PRP sessions, my hair density has noticeably improved. Dr Salman explained every step clearly. Highly recommend for anyone experiencing hair thinning.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80&auto=format&fit=crop',
    date: '2026-01-08',
    approved: true,
  },
  {
    id: 4,
    name: 'Fatima Hassan',
    email: 'fatima.h@example.com',
    treatment: 'Laser Hair Removal',
    rating: 5,
    text: 'Painless and effective laser sessions. The staff is professional and the equipment is clearly top-of-the-line. Already seeing great results after 3 sessions.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80&auto=format&fit=crop',
    date: '2026-01-20',
    approved: true,
  },
  {
    id: 5,
    name: 'Bilal Ahmed',
    email: 'bilal.ahmed@example.com',
    treatment: 'Acne Treatment',
    rating: 4,
    text: 'Struggled with acne for years. The customized treatment plan here finally cleared my skin. Professional, caring, and results-driven clinic.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80&auto=format&fit=crop',
    date: '2026-02-05',
    approved: true,
  },
  {
    id: 6,
    name: 'Ayesha Noor',
    email: 'ayesha.noor@example.com',
    treatment: 'Microneedling',
    rating: 5,
    text: 'My acne scars have faded significantly after microneedling sessions. The clinic maintains the highest hygiene standards. Truly a premium experience.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80&auto=format&fit=crop',
    date: '2026-02-14',
    approved: true,
  },
  {
    id: 7,
    name: 'Hamza Sheikh',
    email: 'hamza.sheikh@example.com',
    treatment: 'Beard Transplant',
    rating: 5,
    text: 'Perfect beard density and natural look. The team listened to exactly what I wanted and delivered beyond expectations. Worth every penny.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80&auto=format&fit=crop',
    date: '2026-02-28',
    approved: true,
  },
  {
    id: 8,
    name: 'Nadia Qureshi',
    email: 'nadia.q@example.com',
    treatment: 'Anti Aging',
    rating: 5,
    text: 'The anti-aging program here is comprehensive and personalized. Botox and skincare combination gave me a refreshed, natural look. Friends keep asking my secret!',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80&auto=format&fit=crop',
    date: '2026-03-10',
    approved: true,
  },
  {
    id: 9,
    name: 'Imran Shah',
    email: 'imran.shah@example.com',
    treatment: 'CO2 Laser',
    rating: 4,
    text: 'Had CO2 laser for acne scars. Recovery took a week but the improvement is remarkable. Dr Salman was very transparent about the healing timeline.',
    image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&q=80&auto=format&fit=crop',
    date: '2026-03-18',
    approved: false,
  },
  {
    id: 10,
    name: 'Zainab Malik',
    email: 'zainab.m@example.com',
    treatment: 'Skin Whitening',
    rating: 5,
    text: 'IV glutathione sessions have given me a noticeably brighter complexion. Very professional setup and the nurse was extremely gentle.',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&q=80&auto=format&fit=crop',
    date: '2026-04-01',
    approved: false,
  },
]

export const getAverageRating = () => {
  const approved = reviews.filter((r) => r.approved)
  if (approved.length === 0) return '0.0'
  const total = approved.reduce((sum, r) => sum + r.rating, 0)
  return (total / approved.length).toFixed(1)
}

export const getRatingBreakdown = () => {
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews
    .filter((r) => r.approved)
    .forEach((r) => {
      breakdown[r.rating]++
    })
  return breakdown
}
