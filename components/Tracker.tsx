'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function track(event: string, data: Record<string, string> = {}) {
  if (typeof window === 'undefined') return
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, ...data, ua: navigator.userAgent }),
  }).catch(() => {})
}

export default function Tracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Skip admin pages
    if (pathname?.startsWith('/admin')) return

    // Track pageview
    track('pageview', { page: pathname || 'home' })

    // Track scroll depth
    let maxScroll = 0
    const handleScroll = () => {
      const scrollPct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
      const depth = scrollPct >= 75 ? '75' : scrollPct >= 50 ? '50' : scrollPct >= 25 ? '25' : '10'
      if (parseInt(depth) > maxScroll) {
        maxScroll = parseInt(depth)
        track('scroll_depth', { depth, page: pathname || 'home' })
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  return null
}
