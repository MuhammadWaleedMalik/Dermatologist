import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiHome,
  FiFileText,
  FiTool,
  FiImage,
  FiStar,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi'
import { logoutAdmin } from '../../services/authService'

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: FiHome },
  { name: 'Blogs', path: '/admin/blogs', icon: FiFileText },
  { name: 'Treatments', path: '/admin/treatments', icon: FiTool },
  { name: 'Before & After', path: '/admin/before-after', icon: FiImage },
  { name: 'Reviews', path: '/admin/reviews', icon: FiStar },
]

const linkBase =
  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 min-h-[44px]'

function SidebarContent({ onNavigate, onLogout }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-white/10">
        <img src="/logo.png" alt="Dr Salman Clinic" className="h-10 w-auto mb-2" />
        <p className="text-xs text-white/50 uppercase tracking-wider">Admin Panel</p>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {navItems.map(({ name, path, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  linkBase +
                  (isActive
                    ? ' bg-gold/15 text-gold'
                    : ' text-white/70 hover:bg-white/10 hover:text-white')
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                {name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-4 pb-6">
        <button
          type="button"
          onClick={onLogout}
          className={linkBase + ' w-full text-white/70 hover:bg-red-500/15 hover:text-red-400 cursor-pointer'}
        >
          <FiLogOut className="w-5 h-5 shrink-0" />
          Logout
        </button>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutAdmin()
    navigate('/admin/login')
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64 lg:flex-col bg-primary">
        <SidebarContent onNavigate={() => setMobileOpen(false)} onLogout={handleLogout} />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/60"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-primary shadow-2xl"
            >
              <SidebarContent onNavigate={() => setMobileOpen(false)} onLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
