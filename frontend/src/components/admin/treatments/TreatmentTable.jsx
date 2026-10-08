import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'
import LazyImage from '../../common/LazyImage'
import StatusBadge from '../common/StatusBadge'
import SearchBar from '../common/SearchBar'
import ConfirmDialog from '../common/ConfirmDialog'

const ITEMS_PER_PAGE = 8

export default function TreatmentTable({ treatments, categories, onEdit, onDelete, onTogglePublish }) {
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = useMemo(() => {
    return treatments.filter((t) => {
      const matchesCategory = filterCategory === 'All' || t.categoryId === filterCategory
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [treatments, search, filterCategory])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleDelete = async () => {
    if (deleteTarget) {
      await onDelete(deleteTarget.id)
      setDeleteTarget(null)
    }
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search treatments..." />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => { setFilterCategory(e.target.value); setPage(1) }}
          className="px-4 py-2.5 rounded-xl border border-accent focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-sm text-primary bg-white min-h-[44px]"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {paginated.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-accent">
          <p className="text-primary/50">No treatments found matching your criteria.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-accent bg-white">
            <table className="w-full">
              <thead>
                <tr className="bg-accent-gray">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-primary/60 uppercase tracking-wider">Treatment</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-primary/60 uppercase tracking-wider">Category</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-primary/60 uppercase tracking-wider">Recovery</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-primary/60 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-primary/60 uppercase tracking-wider">Featured</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-primary/60 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-accent">
                {paginated.map((t) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-accent-gray/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <LazyImage
                          src={t.image}
                          alt={t.name}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                          wrapperClassName="w-12 h-12 rounded-lg shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-primary truncate max-w-[220px]">{t.name}</p>
                          <p className="text-xs text-primary/40 truncate max-w-[220px]">{t.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-medium text-primary/60 bg-accent px-2 py-1 rounded-md">{t.category}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-primary/70 max-w-[180px] truncate">{t.recoveryTime}</td>
                    <td className="px-5 py-4">
                      <StatusBadge published={t.published} />
                    </td>
                    <td className="px-5 py-4">
                      {t.featured && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold-dark bg-gold/10 px-2 py-1 rounded-md">
                          <FiStar className="w-3 h-3" /> Featured
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onTogglePublish(t.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-primary/40 hover:text-gold hover:bg-gold/10 transition-colors cursor-pointer"
                          title={t.published ? 'Unpublish' : 'Publish'}
                        >
                          {t.published ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(t)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-primary/40 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(t)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-primary/40 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {paginated.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-accent p-4"
              >
                <div className="flex gap-3 mb-3">
                  <LazyImage
                    src={t.image}
                    alt={t.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                    wrapperClassName="w-16 h-16 rounded-lg shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-primary truncate">{t.name}</p>
                    <p className="text-xs text-primary/40 mt-0.5">{t.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge published={t.published} />
                      {t.featured && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold-dark bg-gold/10 px-2 py-0.5 rounded-md">
                          <FiStar className="w-3 h-3" /> Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => onTogglePublish(t.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-primary/40 hover:text-gold hover:bg-gold/10 transition-colors cursor-pointer"
                  >
                    {t.published ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(t)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-primary/40 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(t)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-primary/40 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-primary/50">
                Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-accent text-primary/60 hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    type="button"
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      page === i + 1
                        ? 'bg-primary text-white'
                        : 'border border-accent text-primary/60 hover:bg-accent'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-accent text-primary/60 hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Treatment"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}
