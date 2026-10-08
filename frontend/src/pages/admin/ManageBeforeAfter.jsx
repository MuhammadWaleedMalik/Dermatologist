import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiImage } from 'react-icons/fi'
import BeforeAfterTable from '../../components/admin/beforeAfter/BeforeAfterTable'
import BeforeAfterForm from '../../components/admin/beforeAfter/BeforeAfterForm'
import {
  getAdminBeforeAfterCases,
  createBeforeAfter,
  updateBeforeAfter,
  deleteBeforeAfter,
  toggleBeforeAfterPublish,
} from '../../services/beforeAfterService'

export default function ManageBeforeAfter() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingCase, setEditingCase] = useState(null)

  const loadCases = useCallback(async () => {
    setLoading(true)
    try {
      setCases(await getAdminBeforeAfterCases())
      setError('')
    } catch (err) {
      setError(err.message || 'Could not load the gallery.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCases()
  }, [loadCases])

  // The admin view shows drafts as well, so derive the filter list from the
  // loaded records instead of the static seed data.
  const categories = useMemo(() => {
    return Array.from(new Set(cases.map((c) => c.category).filter(Boolean))).sort()
  }, [cases])

  const handleCreate = useCallback(() => {
    setEditingCase(null)
    setFormOpen(true)
  }, [])

  const handleEdit = useCallback((c) => {
    setEditingCase(c)
    setFormOpen(true)
  }, [])

  const handleSave = useCallback(async (data) => {
    const exists = cases.some((c) => c.id === data.id)
    const saved = exists
      ? await updateBeforeAfter(data.id, data)
      : await createBeforeAfter(data)

    setCases((prev) => {
      const index = prev.findIndex((c) => c.id === saved.id)
      if (index >= 0) {
        const updated = [...prev]
        updated[index] = saved
        return updated
      }
      return [saved, ...prev]
    })
    setError('')
  }, [cases])

  const handleDelete = useCallback(async (id) => {
    try {
      await deleteBeforeAfter(id)
      setCases((prev) => prev.filter((c) => c.id !== id))
      setError('')
    } catch (err) {
      setError(err.message || 'Could not delete the gallery entry.')
      throw err
    }
  }, [])

  const handleTogglePublish = useCallback(async (id) => {
    const current = cases.find((c) => c.id === id)
    if (!current) return

    try {
      const saved = await toggleBeforeAfterPublish(id, !current.published)
      setCases((prev) => prev.map((c) => (c.id === id ? { ...c, published: saved.published } : c)))
      setError('')
    } catch (err) {
      setError(err.message || 'Could not update the publish status.')
    }
  }, [cases])

  const publishedCount = cases.filter((c) => c.published).length

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Manage Before & After</h1>
          <p className="text-primary/50 mt-1">
            {cases.length} total &middot; {publishedCount} published &middot; {cases.length - publishedCount} drafts
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 bg-gold text-primary font-semibold px-5 py-2.5 rounded-xl hover:bg-gold-light transition-all shadow-md hover:shadow-lg min-h-[44px] cursor-pointer"
        >
          <FiPlus className="w-5 h-5" />
          Add Case
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-gold border-t-primary rounded-full animate-spin" role="status" aria-label="Loading gallery" />
        </div>
      ) : cases.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-12 shadow-sm border border-accent/50 text-center"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiImage className="w-8 h-8 text-primary/40" />
          </div>
          <h2 className="text-xl font-bold text-primary mb-2">No Cases Yet</h2>
          <p className="text-primary/50 mb-6">Add your first before & after case to get started.</p>
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 bg-gold text-primary font-semibold px-5 py-2.5 rounded-xl hover:bg-gold-light transition-all cursor-pointer"
          >
            <FiPlus className="w-5 h-5" />
            Add Case
          </button>
        </motion.div>
      ) : (
        <BeforeAfterTable
          cases={cases}
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTogglePublish={handleTogglePublish}
        />
      )}

      <BeforeAfterForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditingCase(null) }}
        caseData={editingCase}
        onSave={handleSave}
      />
    </div>
  )
}
