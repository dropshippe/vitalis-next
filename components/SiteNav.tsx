'use client'

import { useEffect, useState } from 'react'
import Logo from './Logo'

const LINKS = [
  ['/science', 'Science'],
  ['/story', 'Our story'],
  ['/reviews', 'Reviews'],
  ['/faqs', 'Questions'],
] as const

export default function SiteNav() {
  // White over dark sections, ink over light ones.
  const [onLight, setOnLight] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const update = () => {
      const dark = Array.from(document.querySelectorAll<HTMLElement>('[data-dark]')).some((el) => {
        const r = el.getBoundingClientRect()
        const extend = Number(el.dataset.darkExtend || 0) * window.innerHeight
        return r.top <= 40 && r.bottom + extend > 40
      })
      setOnLight(!dark)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <header className="site-nav" data-on-light={onLight && !open}>
        <a className="wordmark" href="/" aria-label="Oxyra home">
          <Logo />
        </a>
        <nav aria-label="Main">
          {LINKS.map(([href, label]) => (
            <a key={href} className="nav-link" href={href}>
              {label}
            </a>
          ))}
          <a className="nav-buy" href="/#buy">
            Buy
          </a>
          <button className="nav-menu" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(!open)}>
            {open ? 'Close' : 'Menu'}
          </button>
        </nav>
      </header>

      <div id="site-menu" className="site-menu" data-open={open} hidden={!open}>
        <nav aria-label="Menu">
          <a href="/">Home</a>
          {LINKS.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
          <a href="/shipping">Shipping</a>
          <a href="/returns">Returns</a>
          <a href="/#buy" onClick={() => setOpen(false)}>
            Buy from $59.99
          </a>
        </nav>
      </div>
    </>
  )
}
