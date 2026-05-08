'use client'
import './globals.css'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const BUNDLES = [
  { qty: '1', name: 'The Essential', price: '$59.99', was: '', save: 'Standard', perks: ['1 Oxyra Bottle', 'Free worldwide shipping', '90-day guarantee', '1-year warranty'], popular: false },
  { qty: '2', name: 'The Twin Pack', price: '$99.99', was: 'Was $119.98', save: 'Save $19.99 — 17% off', perks: ['2 Oxyra Bottles', 'Free worldwide shipping', '90-day guarantee', 'Priority support'], popular: true },
]

const REVIEWS = [
  { s: 5, t: "I've been using Oxyra every morning for 6 weeks. My energy levels are noticeably different — sharper, more alert, no afternoon crash. Worth every cent.", n: "Jessica M.", l: "Austin TX" },
  { s: 5, t: "As a triathlete, recovery is everything. My muscle soreness has noticeably reduced. It's as essential as my protein shake now.", n: "David K.", l: "Denver CO" },
  { s: 5, t: "The packaging alone screams premium. But more importantly it actually delivers. I've gifted three to friends already.", n: "Sarah L.", l: "New York NY" },
  { s: 5, t: "Been using for 4 months. My skin looks better, energy more consistent, recovery faster. 10/10.", n: "Chloe B.", l: "Los Angeles CA" },
  { s: 5, t: "I replaced my morning coffee with Oxyra. Same energy, no anxiety, no crash. Absolutely unbelievable.", n: "James P.", l: "Las Vegas NV" },
  { s: 5, t: "My sleep quality has improved noticeably. I fall asleep faster and wake up genuinely refreshed.", n: "Emma C.", l: "Nashville TN" },
]

export default function Home() {
  const [activeBundle, setActiveBundle] = useState('2')
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [whySlide, setWhySlide] = useState(0)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  const currentBundle = BUNDLES.find(b => b.qty === activeBundle) || BUNDLES[1]

  async function handleBuy() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty: activeBundle }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert('Something went wrong. Please try again.')
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const S = {
    page: { fontFamily: "'DM Sans', sans-serif" },
    
    // HERO
    hero: { minHeight: isMobile ? 'auto' : '100vh', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', paddingTop: isMobile ? 56 : 64, background: '#fafaf8' } as React.CSSProperties,
    heroLeft: { display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', padding: isMobile ? '40px 24px 32px' : '80px 60px 80px 80px', background: '#fafaf8' },
    heroRight: { background: '#fafaf8', position: 'relative' as const, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', minHeight: isMobile ? 340 : undefined },
    eyebrow: { fontSize: 11, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase' as const, color: '#2d8a65', marginBottom: 20, fontFamily: "'DM Sans', sans-serif" },
    h1: { fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 48 : 80, fontWeight: 300, lineHeight: 0.92, letterSpacing: isMobile ? -1 : -2, color: '#08080a', marginBottom: isMobile ? 20 : 28 },
    sub: { fontSize: isMobile ? 14 : 16, color: '#6b6b6b', lineHeight: 1.8, marginBottom: isMobile ? 28 : 40, maxWidth: 400, fontWeight: 300 },
    heroBtns: { display: 'flex', gap: 12, marginBottom: 44 },
    btnPrimary: { background: '#08080a', color: 'white', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' as const, padding: '17px 36px', border: 'none', cursor: 'pointer' },
    btnSecondary: { background: 'transparent', color: '#08080a', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' as const, padding: '16px 36px', border: '1.5px solid #08080a', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' },
    trust: { display: 'flex', gap: 24, flexWrap: 'wrap' as const },
    trustItem: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#aaa' },

    // STATS
    stats: { background: '#08080a', padding: isMobile ? '24px 16px' : '40px 80px', display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)' } as React.CSSProperties,
    stat: { textAlign: 'center' as const, borderRight: '1px solid rgba(255,255,255,0.06)', padding: '0 20px' },
    statNum: { fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, color: 'white', marginBottom: 6 },
    statLabel: { fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase' as const, color: '#555' },

    // GUARANTEE
    guarantee: { background: 'linear-gradient(135deg, #030a06, #071410)', padding: isMobile ? '40px 24px' : '56px 80px', display: 'flex', flexDirection: (isMobile ? 'column' : 'row') as 'column' | 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 24 : 52 } as React.CSSProperties,
    gTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, color: 'white', marginBottom: 10 },
    gBody: { fontSize: 14, color: '#5a8a72', lineHeight: 1.75, maxWidth: 520 },
    gNum: { marginLeft: 'auto', textAlign: 'center' as const, flexShrink: 0, paddingLeft: 48, borderLeft: '1px solid rgba(255,255,255,0.06)' },
    gBig: { fontFamily: "'Cormorant Garamond', serif", fontSize: 84, fontWeight: 300, color: 'white', lineHeight: 1 },
    gUnit: { fontSize: 10, color: '#5cbf94', letterSpacing: 3, textTransform: 'uppercase' as const, marginTop: 6 },

    // SECTION
    secLabel: { fontSize: 11, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase' as const, color: '#2d8a65', marginBottom: 16 },
    secLabelLight: { fontSize: 11, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase' as const, color: '#5cbf94', marginBottom: 16 },
    secH2: { fontFamily: "'Cormorant Garamond', serif", fontSize: 56, fontWeight: 300, lineHeight: 1.05 },

    // WHY (teaser on homepage)
    whySection: { padding: isMobile ? '48px 20px' : '100px 80px', background: '#fafaf8' } as React.CSSProperties,
    whyGrid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 1, background: '#e5e5e0', marginTop: isMobile ? 32 : 64 } as React.CSSProperties,
    whyCard: { background: '#fafaf8', padding: '48px', position: 'relative' as const, overflow: 'hidden' },
    whyNum: { fontFamily: "'Cormorant Garamond', serif", fontSize: 100, fontWeight: 300, color: 'rgba(45,138,101,0.05)', position: 'absolute' as const, top: -10, right: 24, lineHeight: 1 },
    whyTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 500, marginBottom: 12, lineHeight: 1.2, color: '#08080a', position: 'relative' as const, zIndex: 1 },
    whyBody: { fontSize: 14, color: '#6b6b6b', lineHeight: 1.8, marginBottom: 16 },
    whyProof: { fontSize: 11, color: '#2d8a65', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' as const, borderTop: '1px solid #e5e5e0', paddingTop: 14 },

    // ATHLETE
    athleteSection: { background: '#08080a', overflow: 'hidden' } as React.CSSProperties,
    athleteInner: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', minHeight: isMobile ? 'auto' : '75vh' } as React.CSSProperties,
    athleteImgSide: { position: 'relative' as const, overflow: 'hidden' },
    athleteCopy: { padding: isMobile ? '36px 24px' : '80px', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center' },
    athleteH2: { fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? 34 : 52, fontWeight: 300, color: 'white', lineHeight: 1.05, marginBottom: 24 },
    athleteBody: { fontSize: 15, color: '#666', lineHeight: 1.8, marginBottom: 32 },
    aStats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 36 } as React.CSSProperties,
    aStat: { borderLeft: '2px solid #2d8a65', paddingLeft: 16 },
    aNum: { fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, color: 'white', marginBottom: 4 },
    aLbl: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' as const, color: '#444' },

    // SHOP
    shopSection: { background: '#030a0e', padding: isMobile ? '48px 20px' : '100px 80px' } as React.CSSProperties,
    shopH: { fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 300, color: 'white', lineHeight: 1.05, margin: '16px 0 48px' },
    bundlesLabel: { fontSize: 11, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase' as const, color: '#5cbf94', marginBottom: 24 },
    bundlesGrid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 16, marginBottom: 64 } as React.CSSProperties,
    productGrid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 32 : 80, alignItems: 'center' } as React.CSSProperties,
    productImgWrap: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' as const, overflow: 'hidden', minHeight: 500 },
    productH2: { fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: 'white', lineHeight: 1.05, marginBottom: 16 },
    productDesc: { fontSize: 14, color: '#555', lineHeight: 1.8, marginBottom: 32 },
    specRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 13 },
    buyBtn: { background: 'white', color: '#08080a', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' as const, padding: '18px 40px', border: 'none', cursor: 'pointer', width: '100%', marginBottom: 14, marginTop: 24 },
    buyGuarantee: { background: 'rgba(45,138,101,0.1)', border: '1px solid rgba(45,138,101,0.3)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },

    // REVIEWS TEASER
    reviewsSection: { background: '#fafaf8', padding: isMobile ? '48px 20px' : '100px 80px' } as React.CSSProperties,
    reviewsGrid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16, marginTop: isMobile ? 32 : 56, marginBottom: 40 } as React.CSSProperties,
    reviewCard: { background: 'white', border: '1px solid #e5e5e0', padding: 28 },

    // FOOTER
    footer: { background: '#0a0a08', padding: isMobile ? '40px 24px 28px' : '64px 80px 40px' } as React.CSSProperties,
    footerGrid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '2fr 1fr 1fr 1fr', gap: isMobile ? 24 : 52, marginBottom: isMobile ? 32 : 52 } as React.CSSProperties,
  }

  return (
    <div style={S.page}>

      {/* HERO */
      <section style={S.hero}>
        <div style={S.heroLeft}>
          <div style={S.eyebrow}>Hydrogen Hydration</div>
          <h1 style={S.h1}>Water,<br /><em style={{ fontStyle: 'italic', color: '#2d8a65' }}>elevated.</em></h1>
          <p style={S.sub}>Advanced SPE/PEM technology infuses your water with pure molecular hydrogen in 3 minutes. Science-backed. Results-proven.</p>
          <div style={S.heroBtns}>
            <button style={S.btnPrimary} onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}>
              Shop Now — from $59.99
            </button>
            <Link href="/science" style={S.btnSecondary}>See the Science</Link>
          </div>
          <div style={S.trust}>
            {['Free worldwide shipping', '90-day guarantee', '4.9★ · 167+ reviews', 'Secure checkout'].map(t => (
              <span key={t} style={S.trustItem}>
                <span style={{ width: 4, height: 4, background: '#2d8a65', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
                {t}
              </span>
            ))}
          </div>
        </div>
        <div style={S.heroRight}>
          {/* Subtle water SVG */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 700 900" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="wg1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a8d8f0" stopOpacity="0" />
                <stop offset="50%" stopColor="#c0e0f8" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#90c8ec" stopOpacity="0.28" />
              </linearGradient>
              <clipPath id="clip"><rect width="700" height="900" /></clipPath>
            </defs>
            <g clipPath="url(#clip)">
              <path fill="url(#wg1)" opacity="0.85">
                <animate attributeName="d" dur="8s" repeatCount="indefinite"
                  values="M-20 420 Q100 340 220 400 Q340 460 460 380 Q580 300 720 360 L720 900 L-20 900Z;M-20 440 Q100 360 220 420 Q340 480 460 400 Q580 320 720 380 L720 900 L-20 900Z;M-20 400 Q100 320 220 380 Q340 440 460 360 Q580 280 720 340 L720 900 L-20 900Z;M-20 420 Q100 340 220 400 Q340 460 460 380 Q580 300 720 360 L720 900 L-20 900Z" />
              </path>
              <circle cx="220" cy="0" r="3" fill="rgba(140,200,230,0.45)"><animate attributeName="cy" values="190;420" dur="1.8s" repeatCount="indefinite" begin="0.3s" /><animate attributeName="opacity" values="0;0.55;0.55;0" dur="1.8s" repeatCount="indefinite" begin="0.3s" /></circle>
              <circle cx="375" cy="0" r="2.5" fill="rgba(120,185,220,0.4)"><animate attributeName="cy" values="155;390" dur="2.2s" repeatCount="indefinite" begin="1.1s" /><animate attributeName="opacity" values="0;0.5;0.5;0" dur="2.2s" repeatCount="indefinite" begin="1.1s" /></circle>
              <circle cx="118" cy="0" r="2.5" fill="rgba(160,215,240,0.45)"><animate attributeName="cy" values="175;370" dur="1.6s" repeatCount="indefinite" begin="0.7s" /><animate attributeName="opacity" values="0;0.55;0.45;0" dur="1.6s" repeatCount="indefinite" begin="0.7s" /></circle>
              <circle cx="195" cy="420" r="0" fill="none" stroke="rgba(140,200,230,0.28)" strokeWidth="1.2"><animate attributeName="r" values="4;55" dur="2.4s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.55;0" dur="2.4s" repeatCount="indefinite" /></circle>
            </g>
          </svg>
          {/* TRANSPARENT BOTTLE */}
          <div style={{ position: 'relative', zIndex: 5, width: isMobile ? 220 : 360, animation: 'float 7s ease-in-out infinite' }}>
            <Image src="/images/bottle-white.png" alt="Oxyra Hydrogen Water Bottle" width={600} height={840} priority style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 12px 40px rgba(30,100,180,0.14)) drop-shadow(0 4px 16px rgba(0,0,0,0.07))', transform: 'rotate(-12deg)' }} />
          </div>
          <div style={{ position: 'absolute', top: '22%', right: '8%', zIndex: 10, background: 'rgba(8,8,10,0.06)', border: '0.5px solid rgba(8,8,10,0.12)', padding: '8px 14px', fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' as const, color: '#08080a' }}>3000+ PPB</div>
          <div style={{ position: 'absolute', bottom: '26%', right: '7%', zIndex: 10, background: 'rgba(8,8,10,0.04)', border: '0.5px solid rgba(8,8,10,0.08)', padding: '8px 14px', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase' as const, color: '#6b6b6b' }}>SPE / PEM Technology</div>
        </div>
      </section>

      {/* STATS */}
      <div style={S.stats}>
        {[['3000+','PPB Hydrogen'],['3 min','Generation Time'],['150+','Verified Reviews'],['4.9★','Average Rating']].map(([n,l]) => (
          <div key={l} style={S.stat}><div style={S.statNum}>{n}</div><div style={S.statLabel}>{l}</div></div>
        ))}
      </div>

      {/* GUARANTEE */}
      <div style={{...S.guarantee}}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', border: '1.5px solid #2d8a65', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d8a65" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
        </div>
        <div><div style={S.gTitle}>90-Day Money-Back Guarantee</div><div style={S.gBody}>Try Oxyra for 3 full months, completely risk-free. Better energy, faster recovery, sharper focus — or we refund every cent. No questions, no hassle.</div></div>
        <div style={S.gNum}><div style={S.gBig}>90</div><div style={S.gUnit}>Day Guarantee</div></div>
      </div>

      {/* WHY OXYRA — TEASER */}
      <section style={S.whySection}>
        <div style={S.secLabel}>4 reasons you need this</div>
        <h2 style={{ ...S.secH2, marginBottom: 8 }}>Why thousands have made<br /><em style={{ fontStyle: 'italic' }}>Oxyra non-negotiable.</em></h2>
        <div style={{ marginBottom: 0 }}>
          <Link href="/why" style={{ fontSize: 13, color: '#2d8a65', fontWeight: 600, letterSpacing: 1, textDecoration: 'none', textTransform: 'uppercase' as const }}>Read all 4 reasons →</Link>
        </div>
        <div style={S.whyGrid}>
          {[
            { n: '01', title: 'Your cells are under attack every single day', body: 'Free radicals generated by stress, exercise, and pollution damage your cells daily. Oxyra delivers 3000+ PPB of molecular hydrogen — the smallest antioxidant known — neutralising the most destructive radicals at the cellular source.', proof: 'Ref: Nature Medicine, 2007' },
            { n: '02', title: "You're recovering slower than you should be", body: 'Clinical trials found hydrogen water reduced blood lactate by 28% after intense exercise and significantly reduced DOMS. Elite athletes worldwide already use hydrogen therapy. Oxyra brings it to you for $59.99.', proof: 'Ref: Journal of Sports Medicine' },
            { n: '03', title: 'Chronic inflammation is silently harming you', body: "H₂ modulates key inflammatory markers (TNF-α, IL-6) naturally and selectively — reducing harmful inflammation without suppressing the immune signals your body needs.", proof: 'Ref: Inflammation and Allergy — Drug Targets' },
            { n: '04', title: "Your brain isn't performing at its best", body: 'H₂ is the only antioxidant small enough to cross the blood-brain barrier. Users report sharper focus within 2 weeks and better sleep within 3 weeks of daily use.', proof: 'Ref: Neurochemistry International' },
          ].map(w => (
            <div key={w.n} style={S.whyCard}>
              <div style={S.whyNum}>{w.n}</div>
              <div style={S.whyTitle}>{w.title}</div>
              <div style={S.whyBody}>{w.body}</div>
              <div style={S.whyProof}>{w.proof}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ATHLETE */}
      <section style={S.athleteSection}>
        <div style={S.athleteInner}>
          <div style={S.athleteImgSide}>
            <Image src="/images/athlete.jpg" alt="Athlete using Oxyra" fill style={{ objectFit: 'cover', objectPosition: 'center top', filter: 'brightness(0.82)' }} />
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 120, background: 'linear-gradient(to right, transparent, #08080a)' }} />
          </div>
          <div style={S.athleteCopy}>
            <div style={S.secLabelLight}>Built for performance</div>
            <h2 style={S.athleteH2}>Trusted by athletes.<br /><em style={{ fontStyle: 'italic' }}>Proven by science.</em></h2>
            <p style={S.athleteBody}>Whether you're training for a triathlon, hitting the gym, or pushing through a demanding day — Oxyra delivers measurable results.</p>
            <div style={S.aStats}>
              <div style={S.aStat}><div style={S.aNum}>↓28%</div><div style={S.aLbl}>Blood lactate</div></div>
              <div style={S.aStat}><div style={S.aNum}>2 wks</div><div style={S.aLbl}>To feel results</div></div>
              <div style={S.aStat}><div style={S.aNum}>99.99%</div><div style={S.aLbl}>H₂ purity</div></div>
            </div>
            <button style={S.btnPrimary} onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}>Shop Oxyra — from $59.99</button>
          </div>
        </div>
      </section>

      {/* SCIENCE TEASER */}
      <section style={{ background: '#030a0e', padding: '80px 80px', position: 'relative' as const, overflow: 'hidden' }}>
        <div style={S.secLabelLight}>The science</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 300, color: 'white', lineHeight: 1.05, margin: '16px 0 20px' }}>
          Molecular hydrogen.<br /><em style={{ fontStyle: 'italic', color: '#5cbf94' }}>The most bioavailable antioxidant known.</em>
        </h2>
        <p style={{ fontSize: 16, color: '#555', lineHeight: 1.8, maxWidth: 640, marginBottom: 40, fontFamily: "'DM Sans', sans-serif" }}>
          Over 2,000 peer-reviewed studies. H₂ does what no other antioxidant can — it crosses the blood-brain barrier, penetrates mitochondria, and selectively neutralises only the most destructive free radicals.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 40 }}>
          {[['2,000+','Peer-reviewed studies','Nature Medicine · 2007'],['↓28%','Blood lactate reduction','Journal of Sports Medicine'],['0.00024','Nanometres — H₂ size','Neurochemistry International']].map(([n,l,r]) => (
            <div key={l} style={{ background: '#050c12', padding: '40px 36px', textAlign: 'center' as const }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 300, color: 'white', marginBottom: 8 }}>{n}</div>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' as const, color: '#444', marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>{l}</div>
              <div style={{ fontSize: 10, color: '#2d8a65', letterSpacing: 1, fontFamily: "'DM Sans', sans-serif" }}>{r}</div>
            </div>
          ))}
        </div>
        <Link href="/science" style={{ background: 'transparent', color: 'white', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' as const, padding: '14px 32px', border: '1.5px solid rgba(255,255,255,0.3)', textDecoration: 'none', display: 'inline-block' }}>Read the Full Science →</Link>
      </section>

      {/* SHOP */}
      <section id="shop" style={S.shopSection}>
        <div style={S.secLabelLight}>Shop Oxyra</div>
        <h2 style={S.shopH}>Choose your<br /><em style={{ fontStyle: 'italic' }}>Oxyra package.</em></h2>
        <div style={S.bundlesLabel}>Select your bundle</div>
        <div style={S.bundlesGrid}>
          {BUNDLES.map(b => (
            <div key={b.qty} onClick={() => setActiveBundle(b.qty)} style={{ border: activeBundle === b.qty ? '1px solid #2d8a65' : '1px solid rgba(255,255,255,0.08)', background: activeBundle === b.qty ? 'rgba(45,138,101,0.08)' : 'rgba(255,255,255,0.02)', padding: 28, cursor: 'pointer', position: 'relative' as const, transition: 'all 0.2s' }}>
              {b.popular && <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', background: '#2d8a65', color: 'white', fontSize: 9, fontWeight: 600, letterSpacing: 2, padding: '4px 14px', whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif" }}>MOST POPULAR</div>}
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, color: 'white', marginBottom: 4 }}>×{b.qty}</div>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' as const, color: '#555', marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>{b.name}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: 'white', marginBottom: 4 }}>{b.price}</div>
              <div style={{ fontSize: 12, color: '#444', textDecoration: 'line-through', marginBottom: 4, minHeight: 18, fontFamily: "'DM Sans', sans-serif" }}>{b.was}</div>
              <div style={{ fontSize: 11, color: '#5cbf94', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{b.save}</div>
              <ul style={{ listStyle: 'none', marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 14 }}>
                {b.perks.map(p => <li key={p} style={{ fontSize: 12, color: '#666', padding: '3px 0', display: 'flex', alignItems: 'center', gap: 7, fontFamily: "'DM Sans', sans-serif" }}><span style={{ color: '#2d8a65', fontWeight: 600 }}>✓</span>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={S.productGrid}>
          <div style={S.productImgWrap}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(40,140,220,0.1) 0%, transparent 70%)' }} />
            <Image src="/images/bottle-dark.png" alt="Oxyra Hydrogen Water Bottle" width={380} height={533} style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 360, height: 'auto', filter: 'drop-shadow(0 0 40px rgba(30,120,220,0.5)) drop-shadow(0 0 80px rgba(10,60,150,0.3))' }} />
          </div>
          <div>
            <div style={S.secLabelLight}>The Oxyra bottle</div>
            <h2 style={S.productH2}>Every detail,<br /><em style={{ fontStyle: 'italic' }}>considered.</em></h2>
            <p style={S.productDesc}>Borosilicate glass. Brushed stainless steel. Platinum-coated SPE/PEM membrane. USB-C rechargeable.</p>
            <div style={{ marginBottom: 24 }}>
              {[['Hydrogen Concentration','3000+ PPB'],['Technology','SPE / PEM Electrolysis'],['Generation Time','3 minutes per cycle'],['Capacity','420ml (14 fl oz)'],['Battery','27 cycles per charge'],['Charging','USB-C'],['Material','Borosilicate Glass'],['Purity','99.99%']].map(([k,v]) => (
                <div key={k} style={S.specRow}><span style={{ color: '#444', fontFamily: "'DM Sans', sans-serif" }}>{k}</span><span style={{ color: 'white', fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>{v}</span></div>
              ))}
            </div>
            <button style={S.buyBtn} onClick={handleBuy} disabled={loading}>
              {loading ? 'Processing...' : `Order ${currentBundle.qty === '1' ? '1 Bottle' : '2 Bottles'} — ${currentBundle.price}`}
            </button>
            <div style={S.buyGuarantee}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2d8a65" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              <span style={{ fontSize: 11, color: '#5cbf94', letterSpacing: 1.5, textTransform: 'uppercase' as const, fontFamily: "'DM Sans', sans-serif" }}>90-Day Money-Back Guarantee</span>
            </div>
            <div style={{ fontSize: 11, color: '#333', marginTop: 12, lineHeight: 1.6, textAlign: 'center' as const, fontFamily: "'DM Sans', sans-serif" }}>Free shipping · 7–14 days · Full tracking · Secure via Stripe</div>
          </div>
        </div>
      </section>

      {/* REVIEWS TEASER */}
      <section style={S.reviewsSection}>
        <div style={S.secLabel}>Customer reviews</div>
        <h2 style={{ ...S.secH2, marginBottom: 8 }}>What our customers<br /><em style={{ fontStyle: 'italic' }}>are saying.</em></h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 0 }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: '#08080a' }}>4.9</span>
          <div>
            <div style={{ fontSize: 20, color: '#f59e0b', letterSpacing: 3, marginBottom: 4 }}>★★★★★</div>
            <div style={{ fontSize: 13, color: '#6b6b6b' }}>Based on 167 verified reviews</div>
          </div>
          <Link href="/reviews" style={{ marginLeft: 'auto', background: '#08080a', color: 'white', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' as const, padding: '14px 28px', textDecoration: 'none' }}>Read All 167 Reviews →</Link>
        </div>
        <div style={S.reviewsGrid}>
          {REVIEWS.map((r, i) => (
            <div key={i} style={S.reviewCard} className='card-hover reveal reveal-d1'>
              <div style={{ color: '#f59e0b', fontSize: 13, letterSpacing: 2, marginBottom: 12 }}>{'★'.repeat(r.s)}</div>
              <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 14, fontFamily: "'DM Sans', sans-serif" }}>&ldquo;{r.t}&rdquo;</div>
              <div style={{ borderTop: '1px solid #e5e5e0', paddingTop: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#08080a', fontFamily: "'DM Sans', sans-serif" }}>{r.n}</div>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>{r.l} · Verified Purchase</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      </div>
      </div>
      <style>{`@keyframes float { 0%,100%{transform:rotate(-12deg) translateY(0)} 50%{transform:rotate(-12deg) translateY(-14px)} }`}</style>
    </div>
  )
}