import { useRef } from 'react'
import { FiUploadCloud, FiX } from 'react-icons/fi'
import { getImageUrl } from '../../../utils/image'

export default function DualImageUploader({ before, after, onBeforeChange, onAfterChange }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ImageSlot label="Before" value={before} onChange={onBeforeChange} />
      <ImageSlot label="After" value={after} onChange={onAfterChange} />
    </div>
  )
}

function ImageSlot({ label, value, onChange }) {
  const inputRef = useRef(null)
  const previewUrl = value?.preview ? getImageUrl(value.preview) : ''

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (file.size > 3 * 1024 * 1024) return
    const reader = new FileReader()
    reader.onload = (e) => onChange({ file, preview: e.target.result })
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0])
  }

  if (value?.preview) {
    return (
      <div>
        <label className="block text-xs font-semibold text-primary/50 uppercase tracking-wider mb-1.5">{label}</label>
        <div className="relative rounded-xl overflow-hidden border border-accent group">
          <img src={previewUrl} alt={`${label} preview`} className="w-full h-36 sm:h-44 object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-primary cursor-pointer"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => { onChange(null); if (inputRef.current) inputRef.current.value = '' }}
              className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center text-white cursor-pointer"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          </div>
          <input ref={inputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-primary/50 uppercase tracking-wider mb-1.5">{label}</label>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-accent rounded-xl p-4 text-center cursor-pointer hover:border-gold/50 hover:bg-accent-gray/30 transition-all min-h-[140px] flex flex-col items-center justify-center"
      >
        <FiUploadCloud className="w-6 h-6 text-primary/25 mb-1.5" />
        <p className="text-xs text-primary/40">Drop or click</p>
        <p className="text-[10px] text-primary/30 mt-0.5">JPG, PNG, WEBP &middot; 3MB</p>
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" />
    </div>
  )
}
