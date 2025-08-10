import { useEffect, useRef, useState } from 'react'

export default function LazyImage({
  src,
  alt = '',
  className = '',
  width,
  height,
  fetchPriority = 'low',
  sizes,
  onLoad,
}) {
  const containerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSrc, setCurrentSrc] = useState('')

  useEffect(() => {
    if (!containerRef.current || isVisible) return
    const node = containerRef.current
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
            break
          }
        }
      }, { rootMargin: '200px' })
      observer.observe(node)
      return () => observer.disconnect()
    }
    setIsVisible(true)
  }, [isVisible])

  useEffect(() => {
    if (!isVisible || !src) return
    let cancelled = false
    const img = new Image()
    img.decoding = 'async'
    img.src = src
    img.onload = async () => {
      if (cancelled) return
      try { if (img.decode) await img.decode() } catch {}
      if (!cancelled) {
        setCurrentSrc(src)
        setIsLoaded(true)
        onLoad?.()
      }
    }
    img.onerror = () => { if (!cancelled) setCurrentSrc(src) }
    return () => { cancelled = true }
  }, [isVisible, src, onLoad])

  return (
    <div ref={containerRef} className={`relative ${className || ''}`} style={{ width, height }}>
      {!isLoaded && <div className="absolute inset-0 animate-pulse bg-gray-100" />}
      {isVisible && (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
          src={currentSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          fetchpriority={fetchPriority}
          sizes={sizes}
          className={`w-full h-full object-cover ${isLoaded ? '' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  )
}
