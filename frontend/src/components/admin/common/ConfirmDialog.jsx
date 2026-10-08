import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertTriangle } from 'react-icons/fi'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState('')

  const handleClose = () => {
    if (confirming) return
    setError('')
    onClose()
  }

  const handleConfirm = async () => {
    if (confirming) return

    setConfirming(true)
    setError('')
    try {
      await onConfirm()
    } catch (err) {
      setError(err?.message || 'The item could not be deleted. Please try again.')
    } finally {
      setConfirming(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <FiAlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h3 id="confirm-dialog-title" className="text-lg font-bold text-primary">{title}</h3>
            </div>
            <p className="mb-6 break-words text-sm text-primary/60 [overflow-wrap:anywhere]">{message}</p>
            {error && (
              <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={confirming}
                className="px-4 py-2.5 rounded-xl border border-accent text-sm font-medium text-primary hover:bg-accent transition-colors min-h-[44px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={confirming}
                className="px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors min-h-[44px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              >
                {confirming ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
