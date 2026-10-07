import { useState } from 'react'
import { getImageUrl } from '../../utils/image'

export default function LazyImage({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  ...props
}) {
  const imageSrc = getImageUrl(src)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [prevSrc, setPrevSrc] = useState(imageSrc)

  // Reset loading/error state when the resolved URL changes so a replaced
  // image starts a fresh load instead of inheriting stale state.
  if (prevSrc !== imageSrc) {
    setPrevSrc(imageSrc)
    setLoaded(false)
    setError(false)
  }

  // The wrapper is a positioning context for the placeholder and the image.
  // Callers may override the position (e.g. "absolute inset-0" for full-bleed
  // layers) — only default to `relative` when no position class was passed,
  // otherwise both classes are emitted and Tailwind's stylesheet order wins.
  const hasPosition = /\b(?:absolute|fixed|relative|sticky)\b/.test(wrapperClassName)

  return (
    <div className={`${hasPosition ? '' : 'relative'} overflow-hidden ${wrapperClassName}`}>
      {imageSrc && !loaded && !error && (
        <div className="absolute inset-0 bg-accent animate-pulse" aria-hidden="true" />
      )}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          {...props}
        />
      )}
    </div>
  )
}
