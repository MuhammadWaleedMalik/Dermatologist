import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FiFileText,
  FiCheckCircle,
  FiTool,
  FiImage,
  FiStar,
  FiClock,
} from 'react-icons/fi'
import { staggerContainer, staggerItem } from '../../utils/motionVariants'
import { getDashboardStats } from '../../services/dashboardService'
import { getStoredAdmin } from '../../services/authService'

function StatCard({ label, value, icon: Icon, iconBg }) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-accent/50"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-primary/50 font-medium">{label}</p>
          <p className="text-3xl font-bold text-primary mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shadow-md`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const user = getStoredAdmin()
  const [stats, setStats] = useState({
    blogs: { total: 0, published: 0, drafts: 0 },
    reviews: { total: 0, approved: 0, pending: 0 },
    treatments: { total: 0, categories: 0 },
    beforeAfter: { total: 0, categories: 0 },
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getDashboardStats()
      .then((data) => {
        if (active) setStats(data)
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load dashboard statistics.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  const cards = [
    {
      label: 'Total Blogs',
      value: stats.blogs.total,
      icon: FiFileText,
      iconBg: 'bg-blue-500',
    },
    {
      label: 'Published Blogs',
      value: stats.blogs.published,
      icon: FiCheckCircle,
      iconBg: 'bg-emerald-500',
    },
    {
      label: 'Total Treatments',
      value: stats.treatments.total,
      icon: FiTool,
      iconBg: 'bg-violet-500',
    },
    {
      label: 'Before & After Cases',
      value: stats.beforeAfter.total,
      icon: FiImage,
      iconBg: 'bg-amber-500',
    },
    {
      label: 'Total Reviews',
      value: stats.reviews.total,
      icon: FiStar,
      iconBg: 'bg-gold',
    },
    {
      label: 'Pending Reviews',
      value: stats.reviews.pending,
      icon: FiClock,
      iconBg: 'bg-rose-500',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-primary/50 mt-1">
          Welcome back{user.name ? `, ${user.name}` : ''}. Here is an overview of your clinic content.
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-gold border-t-primary rounded-full animate-spin" role="status" aria-label="Loading dashboard" />
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            {cards.map(({ label, value, icon, iconBg }) => (
              <StatCard key={label} label={label} value={value} icon={icon} iconBg={iconBg} />
            ))}
          </motion.div>

          {/* Quick Info */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-accent/50">
            <h2 className="text-lg font-bold text-primary mb-4">Quick Info</h2>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-accent-gray rounded-xl">
                <p className="text-primary/50 mb-1">Treatment Categories</p>
                <p className="text-xl font-bold text-primary">{stats.treatments.categories}</p>
              </div>
              <div className="p-4 bg-accent-gray rounded-xl">
                <p className="text-primary/50 mb-1">Approved Reviews</p>
                <p className="text-xl font-bold text-primary">{stats.reviews.approved}</p>
              </div>
              <div className="p-4 bg-accent-gray rounded-xl">
                <p className="text-primary/50 mb-1">Gallery Categories</p>
                <p className="text-xl font-bold text-primary">{stats.beforeAfter.categories}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}