import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'

const Home = lazy(() => import('./pages/Home'))
const Services = lazy(() => import('./pages/Services'))
const BeforeAfter = lazy(() => import('./pages/BeforeAfter'))
const Blogs = lazy(() => import('./pages/Blogs'))
const BlogDetail = lazy(() => import('./pages/BlogDetail'))
const Reviews = lazy(() => import('./pages/Reviews'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const Terms = lazy(() => import('./pages/Terms'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminLayout = lazy(() => import('./layouts/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const ManageTreatments = lazy(() => import('./pages/admin/ManageTreatments'))
const ManageBlogs = lazy(() => import('./pages/admin/ManageBlogs'))
const ManageReviews = lazy(() => import('./pages/admin/ManageReviews'))
const ManageBeforeAfter = lazy(() => import('./pages/admin/ManageBeforeAfter'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-accent-gray">
      <div className="w-12 h-12 border-4 border-gold border-t-primary rounded-full animate-spin" role="status" aria-label="Loading page" />
    </div>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="services" element={<Services />} />
              <Route path="before-after" element={<BeforeAfter />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="blogs/:slug" element={<BlogDetail />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<Terms />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="treatments" element={<ManageTreatments />} />
              <Route path="blogs" element={<ManageBlogs />} />
              <Route path="reviews" element={<ManageReviews />} />
              <Route path="before-after" element={<ManageBeforeAfter />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  )
}
