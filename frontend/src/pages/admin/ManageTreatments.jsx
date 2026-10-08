import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiTool } from 'react-icons/fi'
import TreatmentTable from '../../components/admin/treatments/TreatmentTable'
import TreatmentForm from '../../components/admin/treatments/TreatmentForm'
import {
  getTreatments,
  createTreatment,
  updateTreatment,
  deleteTreatment,
  toggleTreatmentPublish,
} from '../../services/treatmentService'

export default function ManageTreatments() {
  const [treatments, setTreatments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingTreatment, setEditingTreatment] = useState(null)

  const loadTreatments = useCallback(async () => {
    setLoading(true)
    try {
      setTreatments(await getTreatments())
      setError('')
    } catch (err) {
      setError(err.message || 'Could not load treatments.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTreatments()
  }, [loadTreatments])

  // Filter dropdown for the table, derived from the loaded records so it always
  // reflects what is actually in the database.
  const categories = useMemo(() => {
    const seen = new Map()
    for (const treatment of treatments) {
      if (!seen.has(treatment.categoryId)) {
        seen.set(treatment.categoryId, { id: treatment.categoryId, name: treatment.category })
      }
    }
    return Array.from(seen.values())
  }, [treatments])

  const handleCreate = useCallback(() => {
    setEditingTreatment(null)
    setFormOpen(true)
  }, [])

  const handleEdit = useCallback((treatment) => {
    setEditingTreatment(treatment)
    setFormOpen(true)
  }, [])

  const handleSave = useCallback(async (data) => {
    const exists = treatments.some((t) => t.id === data.id)
    const saved = exists
      ? await updateTreatment(data.id, data)
      : await createTreatment(data)

    setTreatments((prev) => {
      const index = prev.findIndex((t) => t.id === saved.id)
      if (index >= 0) {
        const updated = [...prev]
        updated[index] = saved
        return updated
      }
      return [saved, ...prev]
    })
    setError('')
  }, [treatments])

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteTreatment(id)
      setTreatments((prev) => prev.filter((t) => t.id !== id))
      setError('')
    } catch (err) {
      setError(err.message || 'Could not delete the treatment.')
      throw err
    }
  }, [])

  const handleTogglePublish = useCallback(async (id) => {
    const current = treatments.find((t) => t.id === id)
    if (!current) return

    try {
      const saved = await toggleTreatmentPublish(id, !current.published)
      setTreatments((prev) => prev.map((t) => (t.id === id ? { ...t, published: saved.published } : t)))
      setError('')
    } catch (err) {
      setError(err.message || 'Could not update the publish status.')
    }
  }, [treatments])

  const publishedCount = treatments.filter((t) => t.published).length
  const featuredCount = treatments.filter((t) => t.featured).length

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Manage Treatments</h1>
          <p className="text-primary/50 mt-1">
            {treatments.length} total &middot; {publishedCount} published &middot; {featuredCount} featured
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 bg-gold text-primary font-semibold px-5 py-2.5 rounded-xl hover:bg-gold-light transition-all shadow-md hover:shadow-lg min-h-[44px] cursor-pointer"
        >
          <FiPlus className="w-5 h-5" />
          Add Treatment
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-gold border-t-primary rounded-full animate-spin" role="status" aria-label="Loading treatments" />
        </div>
      ) : treatments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-12 shadow-sm border border-accent/50 text-center"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiTool className="w-8 h-8 text-primary/40" />
          </div>
          <h2 className="text-xl font-bold text-primary mb-2">No Treatments Yet</h2>
          <p className="text-primary/50 mb-6">Add your first treatment to get started.</p>
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 bg-gold text-primary font-semibold px-5 py-2.5 rounded-xl hover:bg-gold-light transition-all cursor-pointer"
          >
            <FiPlus className="w-5 h-5" />
            Add Treatment
          </button>
        </motion.div>
      ) : (
        <TreatmentTable
          treatments={treatments}
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTogglePublish={handleTogglePublish}
        />
      )}

      {/* Form Modal */}
      <TreatmentForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditingTreatment(null) }}
        treatment={editingTreatment}
        onSave={handleSave}
      />
    </div>
  )
}
