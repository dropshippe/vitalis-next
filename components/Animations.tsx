'use client'
import { useEffect, useRef } from 'react'

// ── SCROLL REVEAL ──────────────────────────────────────
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

// ── COUNTER ANIMATION ─────────────────────────────────
export function useCounters() {
  useEffect(() => {
    const counters = document.querySelectorAll('[data-count]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const target = parseFloat(el.dataset.count || '0')
            const suffix = el.dataset.suffix || ''
            const prefix = el.dataset.prefix || ''
            const duration = 2000
            const start = performance.now()
            const isDecimal = el.dataset.decimal === 'true'

            function update(now: number) {
              const elapsed = now - start
              const progress = Math.min(elapsed / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              const current = target * eased
              el.textContent = prefix + (isDecimal ? current.toFixed(2) : Math.floor(current).toLocaleString()) + suffix
              if (progress < 1) requestAnimationFrame(update)
            }
            requestAnimationFrame(update)
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.5 }
    )
    counters.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

// ── MOUSE PARALLAX FOR BOTTLE ─────────────────────────
export function useBottleParallax(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let animFrame: number

    function handleMouseMove(e: MouseEvent) {
      cancelAnimationFrame(animFrame)
      animFrame = requestAnimationFrame(() => {
        const rect = document.body.getBoundingClientRect()
        const x = (e.clientX / window.innerWidth - 0.5) * 12
        const y = (e.clientY / window.innerHeight - 0.5) * 8
        el.style.transform = `rotate(-12deg) translate(${x}px, ${y}px)`
      })
    }
    function handleMouseLeave() {
      el.style.transform = 'rotate(-12deg) translate(0, 0)'
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animFrame)
    }
  }, [ref])
}

// ── BUBBLE PARTICLES ──────────────────────────────────
export function BubbleParticles({ count = 18, dark = false }: { count?: number; dark?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const bubbles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * canvas.height,
      r: Math.random() * 5 + 2,
      speed: Math.random() * 0.6 + 0.3,
      opacity: Math.random() * 0.4 + 0.1,
      drift: (Math.random() - 0.5) * 0.4,
    }))

    let running = true

    function draw() {
      if (!ctx || !canvas || !running) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      bubbles.forEach((b) => {
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.strokeStyle = dark
          ? `rgba(92, 191, 148, ${b.opacity})`
          : `rgba(140, 200, 230, ${b.opacity})`
        ctx.lineWidth = 1
        ctx.stroke()

        b.y -= b.speed
        b.x += b.drift
        if (b.y < -10) {
          b.y = canvas.height + 10
          b.x = Math.random() * canvas.width
        }
      })
      requestAnimationFrame(draw)
    }

    draw()

    const resize = () => {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', resize)

    return () => {
      running = false
      window.removeEventListener('resize', resize)
    }
  }, [count, dark])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
    />
  )
}

// ── MAIN ANIMATIONS INIT ──────────────────────────────
export default function Animations() {
  useScrollReveal()
  useCounters()
  return null
}
