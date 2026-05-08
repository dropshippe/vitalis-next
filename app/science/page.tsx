'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const D = { fontFamily: "'Cormorant Garamond', serif" } as React.CSSProperties
const B = { fontFamily: "'DM Sans', sans-serif" } as React.CSSProperties

export default function SciencePage() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{ ...B, paddingTop: isMobile ? 56 : 64, background: '#030a0e', minHeight: '100vh', color: 'white' }}>

      {/* Hero */}
      <div style={{ padding: isMobile ? '48px 20px 40px' : '80px 80px 60px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase' as const, color: '#5cbf94', marginBottom: 16 }}>Peer-reviewed research</div>
        <h1 style={{ ...D, fontSize: isMobile ? 36 : 64, fontWeight: 300, lineHeight: 1.0, marginBottom: 20 }}>
          The science behind<br /><em style={{ fontStyle: 'italic', color: '#5cbf94' }}>molecular hydrogen.</em>
        </h1>
        <p style={{ fontSize: isMobile ? 14 : 16, color: '#aaa', lineHeight: 1.8, maxWidth: 640 }}>
          Over 2,000 peer-reviewed studies. One remarkable molecule. Here is the research explained clearly and honestly.
        </p>
      </div>

      <div style={{ padding: isMobile ? '40px 20px' : '80px' }}>

        {/* H2O vs H2 explainer */}
        <h2 style={{ ...D, fontSize: isMobile ? 28 : 44, fontWeight: 300, marginBottom: 28, lineHeight: 1.1 }}>
          The most important distinction:<br /><em style={{ fontStyle: 'italic' }}>H₂O hydrogen vs dissolved H₂ gas.</em>
        </h2>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: isMobile ? '20px' : '28px 36px', marginBottom: 28, textAlign: 'center' as const }}>
          <p style={{ ...D, fontSize: isMobile ? 16 : 22, fontWeight: 300, color: '#aaa', lineHeight: 1.75 }}>
            Water (H₂O) contains hydrogen — but it&apos;s <strong style={{ color: 'white', fontWeight: 400 }}>chemically bonded to oxygen</strong>, completely unavailable to your cells.<br />
            Oxyra generates <strong style={{ color: '#5cbf94', fontWeight: 400 }}>free dissolved H₂ gas</strong> — small enough to enter every cell in your body.
          </p>
        </div>

        {/* Two panels - SINGLE COLUMN ON MOBILE */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 56 }}>
          <div style={{ background: '#050c12', padding: isMobile ? '28px 20px' : 48 }}>
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase' as const, color: '#e07060', marginBottom: 12 }}>What&apos;s already in your water</div>
            <h3 style={{ ...D, fontSize: isMobile ? 22 : 26, fontWeight: 400, color: '#e07060', marginBottom: 14 }}>Hydrogen in H₂O — unavailable</h3>
            <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.8, marginBottom: 20 }}>Hydrogen atoms are covalently bonded to oxygen in the H₂O molecule. Your body cannot access this for any antioxidant or therapeutic purpose — no matter how much water you drink.</p>
            {['Locked inside H₂O molecules', 'Cannot cross cell membranes', 'Zero antioxidant effect', 'No interaction with free radicals', 'Drinking more water does not help'].map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10, fontSize: 13, color: '#aaa' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#c0503a', flexShrink: 0, marginTop: 7 }} />{b}
              </div>
            ))}
          </div>
          <div style={{ background: '#050c12', padding: isMobile ? '28px 20px' : 48 }}>
            <div style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase' as const, color: '#5cbf94', marginBottom: 12 }}>What Oxyra adds</div>
            <h3 style={{ ...D, fontSize: isMobile ? 22 : 26, fontWeight: 400, color: 'white', marginBottom: 14 }}>Dissolved H₂ gas — fully bioavailable</h3>
            <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.8, marginBottom: 20 }}>SPE/PEM electrolysis dissolves free molecular hydrogen at 3000+ PPB — neutral, tiny, and completely bioavailable to every cell in your body.</p>
            {['Free H₂ dissolved at 3000+ PPB', 'Crosses the blood-brain barrier', 'Penetrates mitochondrial membranes', 'Selectively neutralises hydroxyl radicals', 'Converts harmful radicals to harmless H₂O'].map(b => (
              <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10, fontSize: 13, color: '#bbb' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#2d8a65', flexShrink: 0, marginTop: 7 }} />{b}
              </div>
            ))}
          </div>
        </div>

        {/* Key studies */}
        <h2 style={{ ...D, fontSize: isMobile ? 28 : 44, fontWeight: 300, marginBottom: 32, lineHeight: 1.1 }}>Key research findings.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 56 }}>
          {[
            { n: '2007', title: 'The landmark study', journal: 'Nature Medicine', author: 'Ohsawa et al.', finding: 'First major peer-reviewed paper demonstrating molecular hydrogen acts as a therapeutic antioxidant by selectively reducing cytotoxic oxygen radicals. Published in one of the most prestigious scientific journals in the world. Triggered over 2,000 follow-up studies.' },
            { n: '↓28%', title: 'Athletic recovery', journal: 'Journal of Sports Medicine', author: 'Ostojic SM', finding: 'Randomised controlled trial demonstrating hydrogen water significantly reduced blood lactate levels by 28% and reduced perceived muscle soreness after intense exercise.' },
            { n: 'BBB', title: 'Brain penetration', journal: 'Neurochemistry International', author: 'Multiple authors', finding: 'Series of studies confirming molecular hydrogen crosses the blood-brain barrier — something virtually no other antioxidant can do. Demonstrated protective effects on neurons against oxidative stress-induced damage.' },
            { n: 'TNF-α', title: 'Anti-inflammatory', journal: 'Inflammation and Allergy', author: 'Drug Targets Journal', finding: 'Studies demonstrating H₂-rich water modulates key pro-inflammatory cytokines including TNF-α, IL-6, and IL-1β selectively — without suppressing beneficial immune responses.' },
            { n: '99.99%', title: 'H₂ selectivity', journal: 'Free Radical Research', author: 'Ohta S', finding: 'Research confirming molecular hydrogen selectively reacts with only the most cytotoxic reactive oxygen species while leaving beneficial ROS intact — uniquely safe as an antioxidant.' },
            { n: '0.00024', title: 'Molecular size', journal: 'Biomedical Research', author: 'Multiple studies', finding: 'At 0.00024 nanometres, H₂ is the smallest molecule in existence — 10,000x smaller than Vitamin C — enabling penetration of every biological membrane with zero resistance.' },
          ].map(s => (
            <div key={s.n} style={{ background: '#050c12', padding: isMobile ? '24px 20px' : 44 }}>
              <div style={{ ...D, fontSize: isMobile ? 36 : 48, fontWeight: 300, color: 'white', marginBottom: 10, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'white', marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 10, color: '#2d8a65', letterSpacing: 1, marginBottom: 14 }}>{s.journal} · {s.author}</div>
              <div style={{ fontSize: 12, color: '#888', lineHeight: 1.7 }}>{s.finding}</div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: isMobile ? '16px 18px' : '24px 32px', marginBottom: 56 }}>
          <p style={{ fontSize: 10, color: '#444', lineHeight: 1.7 }}>
            * All research referenced is peer-reviewed and publicly available. These statements have not been evaluated by the FDA. Not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' as const }}>
          <div style={{ ...D, fontSize: isMobile ? 32 : 48, fontWeight: 300, marginBottom: 12 }}>Convinced by the science?</div>
          <div style={{ ...D, fontSize: isMobile ? 20 : 28, fontStyle: 'italic', color: '#5cbf94', marginBottom: 32 }}>Try Oxyra risk-free for 90 days.</div>
          <Link href="/product" style={{ background: 'white', color: '#08080a', fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' as const, padding: '16px 36px', textDecoration: 'none', display: 'inline-block' }}>Shop Now — from $59.99</Link>
        </div>
      </div>
    </div>
  )
}
