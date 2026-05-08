'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const REASONS = [
  {
    n: '01', color: '#e07060',
    title: 'Your cells are under attack every single day',
    sub: 'Free radical damage is the root cause of ageing, disease, and chronic fatigue.',
    body: `Every breath, every workout, every stressful moment — your body generates free radicals that damage cell membranes, DNA, and proteins. Over time, this oxidative stress drives inflammation, accelerates ageing, and creates the conditions for chronic disease.\n\nStandard water does absolutely nothing about this. Oxyra delivers 3000+ PPB of molecular hydrogen — the smallest antioxidant molecule known to science — directly into your cells. H₂ neutralises the most destructive free radical (hydroxyl radical ·OH) at the cellular source, converting it harmlessly to water.`,
    ref: 'Ohsawa et al. Nature Medicine, 2007'
  },
  {
    n: '02', color: '#4a8fc0',
    title: "You're recovering slower than you should be",
    sub: 'Lactic acid and oxidative stress after exercise are costing you days of peak performance.',
    body: `If you train seriously, you know the feeling — that heavy soreness that lingers for days. DOMS isn't just uncomfortable, it's costing you training days and peak performance.\n\nClinical trials in the Journal of Sports Medicine found hydrogen water reduced blood lactate by 28% after intense exercise and significantly reduced muscle soreness. Elite athletes and sports medicine professionals already use hydrogen therapy. Oxyra brings it to you for $59.99.`,
    ref: 'Journal of Sports Medicine'
  },
  {
    n: '03', color: '#7b5ea0',
    title: 'Chronic inflammation is silently destroying your health',
    sub: "Inflammation isn't just joint pain — it's the underlying driver of most chronic conditions.",
    body: `Chronic low-grade inflammation drives fatigue, brain fog, poor sleep, metabolic dysfunction, and accelerated ageing. Unlike anti-inflammatories with serious side effects, H₂ selectively modulates key pro-inflammatory cytokines (TNF-α, IL-6, IL-1β) — reducing harmful inflammation without suppressing the immune signals your body needs.`,
    ref: 'Inflammation and Allergy — Drug Targets'
  },
  {
    n: '04', color: '#2d8a65',
    title: "You're not sleeping or thinking as well as you could",
    sub: 'Oxidative stress in the brain is directly linked to brain fog, poor sleep, and cognitive decline.',
    body: `The brain is uniquely vulnerable to oxidative stress. Most antioxidants cannot reach it — Vitamin C, Vitamin E, glutathione are all blocked by the blood-brain barrier.\n\nH₂ can. At 0.00024 nanometres, it crosses the blood-brain barrier and penetrates neural cells with zero resistance. Users consistently report sharper focus within 2 weeks and better sleep within 3 weeks of daily use.`,
    ref: 'Neurochemistry International'
  },
]

const D = { fontFamily: "'Cormorant Garamond', serif" } as React.CSSProperties
const B = { fontFamily: "'DM Sans', sans-serif" } as React.CSSProperties

export default function WhyOxyraPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{ ...B, paddingTop: isMobile ? 56 : 64, background: '#fafaf8' }}>
      {/* Hero */}
      <div style={{ background: '#08080a', padding: isMobile ? '48px 24px 40px' : '80px 80px 60px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase' as const, color: '#2d8a65', marginBottom: 16 }}>The Case for Oxyra</div>
        <h1 style={{ ...D, fontSize: isMobile ? 38 : 64, fontWeight: 300, lineHeight: 1.0, marginBottom: 20, color: 'white' }}>
          Why thousands have made<br /><em style={{ fontStyle: 'italic', color: '#5cbf94' }}>Oxyra non-negotiable.</em>
        </h1>
        <p style={{ fontSize: isMobile ? 14 : 16, color: '#aaa', lineHeight: 1.8, maxWidth: 600 }}>
          Four scientifically-backed reasons hydrogen hydration isn&apos;t a trend — it&apos;s a fundamental upgrade to how you function every day.
        </p>
      </div>

      {/* MOBILE: Card slider */}
      {isMobile ? (
        <div style={{ background: '#fafaf8' }}>
          {/* Slide dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '20px 0 0' }}>
            {REASONS.map((_, i) => (
              <button key={i} onClick={() => setActiveSlide(i)} style={{ width: i === activeSlide ? 24 : 8, height: 8, borderRadius: 4, background: i === activeSlide ? '#2d8a65' : '#e5e5e0', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
            ))}
          </div>
          {/* Active card */}
          <div style={{ padding: '20px 20px 40px' }}>
            <div style={{ background: 'white', border: '1px solid #e5e5e0', padding: 28, position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: 40, height: 4, background: REASONS[activeSlide].color, marginBottom: 20 }} />
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase' as const, color: REASONS[activeSlide].color, marginBottom: 12 }}>Reason {REASONS[activeSlide].n}</div>
              <h2 style={{ ...D, fontSize: 26, fontWeight: 500, color: '#08080a', marginBottom: 12, lineHeight: 1.2 }}>{REASONS[activeSlide].title}</h2>
              <p style={{ fontSize: 13, color: '#2d8a65', fontStyle: 'italic', marginBottom: 16, lineHeight: 1.6 }}>{REASONS[activeSlide].sub}</p>
              {REASONS[activeSlide].body.split('\n\n').map((para, j) => (
                <p key={j} style={{ fontSize: 13, color: '#555', lineHeight: 1.8, marginBottom: 12 }}>{para}</p>
              ))}
              <div style={{ fontSize: 10, color: '#2d8a65', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' as const, borderTop: '1px solid #e5e5e0', paddingTop: 14, marginTop: 8 }}>Ref: {REASONS[activeSlide].ref}</div>
            </div>
            {/* Prev / Next */}
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))} disabled={activeSlide === 0} style={{ flex: 1, padding: '12px', background: activeSlide === 0 ? '#f0f0ec' : '#08080a', color: activeSlide === 0 ? '#ccc' : 'white', border: 'none', cursor: activeSlide === 0 ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' as const }}>← Prev</button>
              <button onClick={() => setActiveSlide(Math.min(REASONS.length - 1, activeSlide + 1))} disabled={activeSlide === REASONS.length - 1} style={{ flex: 1, padding: '12px', background: activeSlide === REASONS.length - 1 ? '#f0f0ec' : '#08080a', color: activeSlide === REASONS.length - 1 ? '#ccc' : 'white', border: 'none', cursor: activeSlide === REASONS.length - 1 ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' as const }}>Next →</button>
            </div>
          </div>
        </div>
      ) : (
        /* DESKTOP: Full stacked layout */
        <div>
          {REASONS.map((r, i) => (
            <div key={r.n} style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: 480, borderBottom: '1px solid #e5e5e0', background: i % 2 === 0 ? '#fafaf8' : '#f5f5f3' }}>
              <div style={{ background: '#08080a', padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ ...D, fontSize: 120, fontWeight: 300, color: 'rgba(92,191,148,0.22)', lineHeight: 1, textShadow: '0 0 60px rgba(45,138,101,0.3)' }}>{r.n}</div>
                <div>
                  <div style={{ width: 40, height: 3, background: r.color, marginBottom: 20 }} />
                  <div style={{ fontSize: 11, color: '#555', letterSpacing: 2, textTransform: 'uppercase' as const, lineHeight: 1.6 }}>Ref: {r.ref}</div>
                </div>
              </div>
              <div style={{ padding: '64px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase' as const, color: r.color, marginBottom: 16 }}>Reason {r.n}</div>
                <h2 style={{ ...D, fontSize: 38, fontWeight: 400, color: '#08080a', lineHeight: 1.1, marginBottom: 16 }}>{r.title}</h2>
                <p style={{ fontSize: 16, color: '#2d8a65', fontStyle: 'italic', marginBottom: 24, lineHeight: 1.6 }}>{r.sub}</p>
                {r.body.split('\n\n').map((para, j) => (
                  <p key={j} style={{ fontSize: 14, color: '#6b6b6b', lineHeight: 1.9, marginBottom: 16 }}>{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div style={{ background: '#08080a', padding: isMobile ? '48px 24px' : '80px', textAlign: 'center' as const }}>
        <div style={{ ...D, fontSize: isMobile ? 36 : 52, fontWeight: 300, color: 'white', lineHeight: 1, marginBottom: 12 }}>Ready to upgrade?</div>
        <div style={{ ...D, fontSize: isMobile ? 22 : 32, fontStyle: 'italic', color: '#5cbf94', marginBottom: 36 }}>Try Oxyra risk-free for 90 days.</div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' as const }}>
          <Link href="/product" style={{ background: 'white', color: '#08080a', fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', padding: '16px 36px', textDecoration: 'none' }}>Shop Now — from $59.99</Link>
          <Link href="/science" style={{ background: 'transparent', color: 'white', fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', padding: '15px 36px', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.3)' }}>Read the Science</Link>
        </div>
      </div>
      </div>
      </div>
    </div>
  )
}
