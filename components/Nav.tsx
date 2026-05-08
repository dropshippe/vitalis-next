'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Nav() {
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const links = [
    ['/product', 'The Bottle'],
    ['/why', 'Why Oxyra'],
    ['/science', 'Science'],
    ['/reviews', 'Reviews'],
    ['/faqs', 'FAQs'],
    ['/shipping', 'Shipping'],
    ['/returns', 'Returns'],
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(250,250,248,0.95)', backdropFilter: 'blur(24px)',
        borderBottom: '0.5px solid #e5e5e0',
        height: isMobile ? 56 : 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '0 20px' : '0 64px',
        fontFamily: "'DM Sans', sans-serif"
      }}>
        <Link href="/" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: isMobile ? 15 : 18, fontWeight: 300,
          letterSpacing: 6, textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 7,
          textDecoration: 'none', color: '#08080a'
        }}>
          <div style={{ width: 7, height: 7, background: '#2d8a65', borderRadius: '50%', flexShrink: 0 }} />
          Oxyra
        </Link>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 28 }}>
            {links.map(([href, label]) => (
              <Link key={href} href={href} style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#6b6b6b', textDecoration: 'none' }}>{label}</Link>
            ))}
          </div>
        )}

        {/* Desktop CTA / Mobile hamburger */}
        {isMobile ? (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 8,
            display: 'flex', flexDirection: 'column', gap: 5
          }}>
            <span style={{ display: 'block', width: 24, height: 2, background: menuOpen ? 'transparent' : '#08080a', transition: 'all 0.2s' }} />
            <span style={{ display: 'block', width: 24, height: 2, background: '#08080a', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ display: 'block', width: 24, height: 2, background: '#08080a', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none', marginTop: menuOpen ? -7 : 0 }} />
          </button>
        ) : (
          <Link href="/product" style={{
            background: '#08080a', color: 'white', fontSize: 11, fontWeight: 600,
            letterSpacing: 2, textTransform: 'uppercase', padding: '12px 26px',
            textDecoration: 'none', whiteSpace: 'nowrap'
          }}>
            Shop Now — from $59.99
          </Link>
        )}
      </nav>

      {/* Mobile menu dropdown */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'fixed', top: 56, left: 0, right: 0, zIndex: 99,
          background: '#fafaf8', borderBottom: '1px solid #e5e5e0',
          padding: '20px 24px 28px',
          fontFamily: "'DM Sans', sans-serif"
        }}>
          {links.map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
              display: 'block', fontSize: 15, letterSpacing: 1.5,
              textTransform: 'uppercase', color: '#08080a',
              textDecoration: 'none', padding: '12px 0',
              borderBottom: '1px solid #f0f0ec'
            }}>{label}</Link>
          ))}
          <Link href="/product" onClick={() => setMenuOpen(false)} style={{
            display: 'block', marginTop: 20,
            background: '#08080a', color: 'white', textAlign: 'center',
            fontSize: 12, fontWeight: 600, letterSpacing: 2,
            textTransform: 'uppercase', padding: '16px',
            textDecoration: 'none'
          }}>
            Shop Now — from $59.99
          </Link>
        </div>
      )}
    </>
  )
}
