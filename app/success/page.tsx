'use client'
import Link from 'next/link'
import { useEffect, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Fire conversion event
    const bundle = searchParams.get('bundle') || '2'
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'checkout_complete', bundle }),
    }).catch(() => {})
  }, [searchParams])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafaf8', fontFamily: "'DM Sans', sans-serif", padding: 20 }}>
      <div style={{ textAlign: 'center', maxWidth: 560 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', border: '1.5px solid #2d8a65', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d8a65" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, letterSpacing: 4, textTransform: 'uppercase', color: '#2d8a65', marginBottom: 16 }}>Order Confirmed</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 300, color: '#08080a', lineHeight: 1, marginBottom: 20 }}>Thank you.</h1>
        <p style={{ fontSize: 15, color: '#6b6b6b', lineHeight: 1.8, marginBottom: 36 }}>Your Oxyra bottle is on its way. You&apos;ll receive a confirmation email shortly with tracking details.</p>
        <div style={{ background: '#f0f5f1', padding: '20px 28px', marginBottom: 32, textAlign: 'left' }}>
          <p style={{ fontSize: 13, color: '#555', marginBottom: 8 }}>📦 Dispatched within 1–2 business days</p>
          <p style={{ fontSize: 13, color: '#555', marginBottom: 8 }}>🚚 Delivered in 7–14 days (standard)</p>
          <p style={{ fontSize: 13, color: '#555' }}>📧 Tracking sent to your email</p>
        </div>
        <Link href="/" style={{ background: '#08080a', color: 'white', fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', padding: '14px 32px', textDecoration: 'none', display: 'inline-block' }}>Back to Home</Link>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
