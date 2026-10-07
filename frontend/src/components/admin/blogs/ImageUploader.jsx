import { useState, useRef } from 'react'
import { FiUploadCloud, FiX } from 'react-icons/fi'
import { getImageUrl } from '../../../utils/image'

export default function ImageUploader({ value, onChange, accept = 'image/*', maxSizeMB = 3 }) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const validateFile = (file) => {
    if (!file) return false
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return false
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB.`)
      return false
    }
    setError('')
    return true
  }

  const handleFile = (file) => {
    if (!validateFile(file)) return
    const reader = new FileReader()
    reader.onload = (e) => {
      onChange({ file, preview: e.target.result })
    }
    reader.readAsDataURL(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleRemove = () => {
    onChange(null)
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  if (value?.preview) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-accent group">
        <img
          src={getImageUrl(value.preview)}
          alt="Upload preview"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-primary hover:bg-accent transition-colors cursor-pointer"
          >
            Change
          </button>
          <button
            type="button"
            onClick={handleRemove}
            className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center text-white hover:bg-red-600 transition-colors cursor-pointer"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </div>
    )
  }

  return (
    <div>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all min-h-[140px] flex flex-col items-center justify-center ${
          dragActive
            ? 'border-gold bg-gold/5'
            : 'border-accent hover:border-gold/50 hover:bg-accent-gray/50'
        }`}
      >
        <FiUploadCloud className={`w-8 h-8 mb-3 ${dragActive ? 'text-gold' : 'text-primary/30'}`} />
        <p className="text-sm font-medium text-primary/60 mb-1">
          Drag and drop an image here, or click to select
        </p>
        <p className="text-xs text-primary/40">
          PNG, JPG, WEBP up to {maxSizeMB}MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}
    </div>
  )
}
