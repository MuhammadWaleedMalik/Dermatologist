import { useState, useRef, useLayoutEffect } from 'react'
import LazyImage from '../common/LazyImage'

export default function BeforeAfterSlider({ before, after, alt }) {
  const [position, setPosition] = useState(50)
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef(null)

  // The "before" layer is clipped to `position`% but must keep the slider's
  // full width so both images stay pixel-aligned. Measure the container
  // instead of reading the ref during render (refs don't trigger updates).
  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return undefined
    const update = () => setContainerWidth(el.offsetWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleMove = (clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setPosition((x / rect.width) * 100)
  }

  return (
    <div
      ref={containerRef}
      className="comparison-slider relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-ew-resize select-none"
      onMouseMove={(e) => e.buttons === 1 && handleMove(e.clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      <LazyImage
        src={after}
        alt={`After - ${alt}`}
        wrapperClassName="absolute inset-0"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <LazyImage
          src={before}
          alt={`Before - ${alt}`}
          wrapperClassName="absolute inset-0"
          className="absolute inset-0 w-full h-full max-w-none object-cover"
          style={{ width: containerWidth ? `${containerWidth}px` : '100%' }}
        />
      </div>

      <div
        className="absolute top-0 bottom-0 w-1 bg-gold z-10"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gold rounded-full flex items-center justify-center shadow-lg">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-4 bg-primary rounded" />
            <div className="w-0.5 h-4 bg-primary rounded" />
          </div>
        </div>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label="Drag to compare before and after"
      />

      <span className="absolute top-3 left-3 px-3 py-1 bg-primary/80 text-white text-xs font-semibold rounded-full z-10">
        Before
      </span>
      <span className="absolute top-3 right-3 px-3 py-1 bg-gold/90 text-primary text-xs font-semibold rounded-full z-10">
        After
      </span>
    </div>
  )
}
