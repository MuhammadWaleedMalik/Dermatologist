import { Outlet } from 'react-router-dom'
import Sidebar from '../components/admin/Sidebar'
import useScrollToTop from '../hooks/useScrollToTop'

export default function AdminLayout() {
  useScrollToTop()

  return (
    <div className="flex min-h-screen bg-accent-gray">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
