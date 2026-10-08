import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiStar } from 'react-icons/fi'
import ReviewTable from '../../components/admin/reviews/ReviewTable'
import ReviewForm from '../../components/admin/reviews/ReviewForm'
import { getReviews, createReview, updateReview, deleteReview, approveReview, hideReview } from '../../services/reviewService'

export default function ManageReviews() {
  const [reviewList, setReviewList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingReview, setEditingReview] = useState(null)

  useEffect(() => {
    let active = true
    getReviews()
      .then((data) => {
        if (active) {
          setReviewList(data.map((r) => ({ ...r, approved: !!r.approved })))
          setError('')
        }
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load reviews.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  const handleCreate = useCallback(() => {
    setEditingReview(null)
    setFormOpen(true)
  }, [])

  const handleEdit = useCallback((r) => {
    setEditingReview(r)
    setFormOpen(true)
  }, [])

  const handleSave = useCallback(async (data) => {
    const exists = reviewList.some((r) => r.id === data.id)
    const saved = exists
      ? await updateReview(data.id, data)
      : await createReview(data)
    setReviewList((prev) => {
      const index = prev.findIndex((r) => r.id === saved.id)
      if (index >= 0) {
        const updated = [...prev]
        updated[index] = { ...saved, approved: !!saved.approved }
        return updated
      }
      return [{ ...saved, approved: !!saved.approved }, ...prev]
    })
    setError('')
  }, [reviewList])

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteReview(id)
      setReviewList((prev) => prev.filter((r) => r.id !== id))
      setError('')
    } catch (err) {
      setError(err.message || 'Could not delete the review.')
      throw err
    }
  }, [])

  const handleToggleApproval = useCallback(async (id) => {
    const current = reviewList.find((r) => r.id === id)
    const next = current ? !current.approved : false
    try {
      if (next) {
        await approveReview(id)
      } else {
        await hideReview(id)
      }
      setReviewList((prev) =>
        prev.map((r) => (r.id === id ? { ...r, approved: next } : r))
      )
      setError('')
    } catch (err) {
      setError(err.message || 'Could not update the review status.')
    }
  }, [reviewList])

  const approvedCount = reviewList.filter((r) => r.approved).length

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Manage Reviews</h1>
          <p className="text-primary/50 mt-1">
            {reviewList.length} total &middot; {approvedCount} approved &middot; {reviewList.length - approvedCount} pending
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 bg-gold text-primary font-semibold px-5 py-2.5 rounded-xl hover:bg-gold-light transition-all shadow-md hover:shadow-lg min-h-[44px] cursor-pointer"
        >
          <FiPlus className="w-5 h-5" />
          Add Review
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-gold border-t-primary rounded-full animate-spin" role="status" aria-label="Loading reviews" />
        </div>
      ) : reviewList.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-12 shadow-sm border border-accent/50 text-center"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiStar className="w-8 h-8 text-primary/40" />
          </div>
          <h2 className="text-xl font-bold text-primary mb-2">No Reviews Yet</h2>
          <p className="text-primary/50 mb-6">Add your first patient review to get started.</p>
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 bg-gold text-primary font-semibold px-5 py-2.5 rounded-xl hover:bg-gold-light transition-all cursor-pointer"
          >
            <FiPlus className="w-5 h-5" />
            Add Review
          </button>
        </motion.div>
      ) : (
        <ReviewTable
          reviews={reviewList}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleApproval={handleToggleApproval}
        />
      )}

      <ReviewForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditingReview(null) }}
        review={editingReview}
        onSave={handleSave}
      />
    </div>
  )
}
