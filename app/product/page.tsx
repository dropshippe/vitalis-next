'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const BUNDLES = [
  { qty: '1', name: 'The Essential', price: '$59.99', was: '', save: 'Single bottle', perks: ['1 Oxyra Bottle', 'Free worldwide shipping', '90-day guarantee', '1-year warranty'], popular: false },
  { qty: '2', name: 'The Twin Pack', price: '$99.99', was: 'Was $119.98', save: 'Save $19.99 — 17% off', perks: ['2 Oxyra Bottles', 'Free worldwide shipping', '90-day guarantee', 'Priority support'], popular: true },
]

const D = { fontFamily: "'Cormorant Garamond', serif" } as React.CSSProperties
const B = { fontFamily: "'DM Sans', sans-serif" } as React.CSSProperties

export default function ProductPage() {
  const [activeBundle, setActiveBundle] = useState('2')
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ qty: activeBundle }) })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert('Something went wrong.')
    } catch { alert('Something went wrong.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ ...B, paddingTop: 64, background: '#fafaf8' }}>

      {/* HERO */}
      <div style={{ background: '#030a0e', position: 'relative' as const, overflow: 'hidden', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', alignItems: 'center', minHeight: isMobile ? 'auto' : '88vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' as const, padding: isMobile ? 32 : 60, minHeight: isMobile ? 320 : 560, zIndex: 2 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(20,100,200,0.2) 0%, transparent 70%)' }} />
          <Image src="/images/bottle-dark.png" alt="Oxyra Hydrogen Water Bottle" width={400} height={560} priority
            style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 360, height: 'auto',
              filter: 'drop-shadow(0 0 50px rgba(30,120,220,0.65)) drop-shadow(0 0 100px rgba(10,60,150,0.4))',
              animation: 'float 7s ease-in-out infinite' }} />
        </div>
        <div style={{ padding: isMobile ? '32px 24px 48px' : '80px 80px 80px 40px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase' as const, color: '#5cbf94', marginBottom: 20 }}>The Oxyra Bottle</div>
          <h1 style={{ ...D, fontSize: isMobile ? 38 : 60, fontWeight: 300, color: 'white', lineHeight: 1.0, marginBottom: 24 }}>Every detail,<br /><em style={{ fontStyle: 'italic', color: '#5cbf94' }}>considered.</em></h1>
          <p style={{ fontSize: 15, color: '#aaa', lineHeight: 1.8, marginBottom: 40, maxWidth: 440 }}>Borosilicate glass. Brushed stainless steel. Platinum-coated SPE/PEM membrane. USB-C rechargeable. This is what premium hydrogen hydration looks like.</p>
          <div style={{ marginBottom: 44 }}>
            {[['Hydrogen Concentration','3000+ PPB'],['Technology','SPE / PEM Electrolysis'],['Generation Time','3–5 minutes'],['Capacity','460ml (15.5 fl oz)'],['Battery','1200mAh · ~15 uses/charge'],['Charging','USB-C (2–3hr charge)'],['Material','High Borosilicate Glass'],['Base','Non-slip Silicone + Steel'],['Dimensions','9.25in × 2.76in'],['H₂ Purity','99.99%']].map(([k,v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13 }}>
                <span style={{ color: '#888' }}>{k}</span><span style={{ color: 'white', fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
          <a href="#bundles" style={{ background: 'white', color: '#08080a', fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' as const, padding: '16px 40px', textDecoration: 'none', display: 'inline-block' }}>Shop Now — from $59.99</a>
        </div>
      </div>

      {/* BUNDLES */}
      <div id="bundles" style={{ background: '#030a0e', padding: isMobile ? '48px 20px' : '80px' }}>
        <div style={{ textAlign: 'center' as const, marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase' as const, color: '#5cbf94', marginBottom: 16 }}>Shop Oxyra</div>
          <h2 style={{ ...D, fontSize: 48, fontWeight: 300, color: 'white', lineHeight: 1.05 }}>Choose your<br /><em style={{ fontStyle: 'italic' }}>Oxyra package.</em></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 16, marginBottom: 48, maxWidth: 900, margin: '0 auto 48px' }}>
          {BUNDLES.map(b => (
            <div key={b.qty} onClick={() => setActiveBundle(b.qty)} style={{ border: activeBundle === b.qty ? '1px solid #2d8a65' : '1px solid rgba(255,255,255,0.1)', background: activeBundle === b.qty ? 'rgba(45,138,101,0.1)' : 'rgba(255,255,255,0.02)', padding: 28, cursor: 'pointer', position: 'relative' as const, transition: 'all 0.2s' }}>
              {b.popular && <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', background: '#2d8a65', color: 'white', fontSize: 9, fontWeight: 600, letterSpacing: 2, padding: '4px 14px', whiteSpace: 'nowrap' as const, fontFamily: "'DM Sans',sans-serif" }}>MOST POPULAR</div>}
              <div style={{ ...D, fontSize: 32, fontWeight: 300, color: 'white', marginBottom: 4 }}>×{b.qty}</div>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' as const, color: '#777', marginBottom: 16 }}>{b.name}</div>
              <div style={{ ...D, fontSize: 28, fontWeight: 300, color: 'white', marginBottom: 4 }}>{b.price}</div>
              <div style={{ fontSize: 12, color: '#555', textDecoration: 'line-through', marginBottom: 4, minHeight: 18 }}>{b.was}</div>
              <div style={{ fontSize: 11, color: '#5cbf94', fontWeight: 600 }}>{b.save}</div>
              <ul style={{ listStyle: 'none', marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
                {b.perks.map(p => <li key={p} style={{ fontSize: 12, color: '#888', padding: '3px 0', display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ color: '#2d8a65', fontWeight: 600 }}>✓</span>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center' as const }}>
          <button onClick={handleBuy} disabled={loading} style={{ background: 'white', color: '#08080a', fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' as const, padding: '20px 60px', border: 'none', cursor: 'pointer', width: '100%', marginBottom: 14, opacity: loading ? 0.7 : 1, fontFamily: "'DM Sans',sans-serif" }}>
            {loading ? 'Processing...' : `Order ${currentBundle.qty === '1' ? '1 Bottle' : '2 Bottles'} — ${currentBundle.price}`}
          </button>
          <div style={{ background: 'rgba(45,138,101,0.1)', border: '1px solid rgba(45,138,101,0.3)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2d8a65" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
            <span style={{ fontSize: 11, color: '#5cbf94', letterSpacing: 1.5, textTransform: 'uppercase' as const }}>90-Day Money-Back Guarantee</span>
          </div>
          <p style={{ fontSize: 11, color: '#555', lineHeight: 1.6 }}>Free shipping · 7–14 days delivery · Full tracking · Secure via Stripe</p>
        </div>
      </div>


      {/* INFOGRAPHIC */}
      <div style={{ background: '#f5f5f3', padding: isMobile ? '48px 24px' : '80px', textAlign: 'center' as const }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase' as const, color: '#2d8a65', marginBottom: 16 }}>What You Get</div>
        <h2 style={{ ...D, fontSize: 48, fontWeight: 300, color: '#08080a', lineHeight: 1.05, marginBottom: 48 }}>Built with science.<br /><em style={{ fontStyle: 'italic' }}>Designed for your life.</em></h2>
        <div style={{ maxWidth: 800, margin: '0 auto', borderRadius: 8, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.12)' }}>
          <Image src="/images/product-info.jpg" alt="Oxyra specifications" width={1024} height={1023} style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
      </div>

      {/* FEATURE CARDS */}
      <div style={{ background: '#fafaf8', padding: isMobile ? '48px 20px' : '80px' }}>
        <div style={{ textAlign: 'center' as const, marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase' as const, color: '#2d8a65', marginBottom: 16 }}>Why It Works</div>
          <h2 style={{ ...D, fontSize: 48, fontWeight: 300, color: '#08080a', lineHeight: 1.05 }}>Six reasons it outperforms<br /><em style={{ fontStyle: 'italic' }}>everything else on the market.</em></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 1, background: '#e5e5e0' }}>
          {[
            { n: '01', title: 'High Borosilicate Glass', body: 'Food-grade, durable, and resistant to temperature changes. Zero BPA. Zero chemicals leaching into your water. Built to the same standard as laboratory equipment.' },
            { n: '02', title: 'Vital Health Benefits', body: 'Enhances cellular hydration, reduces oxidative stress and inflammation, supports overall vitality, and boosts energy for peak performance. Backed by 2,000+ peer-reviewed studies.' },
            { n: '03', title: '3–5 Min H₂ Generation', body: 'Produces up to 3200 PPB of hydrogen-rich water via SPE/PEM electrolysis. One press, 3 minutes, drink immediately — H₂ begins to dissipate within 15 minutes of generation.' },
            { n: '04', title: '1200mAh Battery', body: 'Fully charges in 2–3 hours via USB-C and provides approximately 15 uses per charge — more than enough for a full week of daily use.' },
            { n: '05', title: 'Non-Slip Silicone Base', body: 'Ensures stability on any surface and reduces vibration during the generation cycle. Weighted stainless steel base with silicone grip stays exactly where you put it.' },
            { n: '06', title: 'Dual-Chamber Design', body: 'Physically separates and expels ozone and chlorine byproducts through a dedicated vent, delivering only pure molecular hydrogen into your drinking water.' },
          ].map((f) => (
            <div key={f.n} style={{ background: '#fafaf8', padding: 44, position: 'relative' as const, overflow: 'hidden' }}>
              <div style={{ ...D, fontSize: 80, fontWeight: 300, color: 'rgba(45,138,101,0.06)', position: 'absolute', top: -10, right: 20, lineHeight: 1 }}>{f.n}</div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase' as const, color: '#2d8a65', marginBottom: 14 }}>Feature {f.n}</div>
              <h3 style={{ ...D, fontSize: 22, fontWeight: 500, color: '#08080a', marginBottom: 12, lineHeight: 1.2, position: 'relative', zIndex: 1 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: '#6b6b6b', lineHeight: 1.8 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* DARK CLOSER SECTION */}
      <div style={{ background: '#030a0e', padding: isMobile ? '48px 24px' : '80px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 80, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase' as const, color: '#5cbf94', marginBottom: 20 }}>The Real Question</div>
          <h2 style={{ ...D, fontSize: isMobile ? 32 : 52, fontWeight: 300, color: 'white', lineHeight: 1.05, marginBottom: 24 }}>This isn&apos;t just<br /><em style={{ fontStyle: 'italic', color: '#5cbf94' }}>a water bottle.</em></h2>
          <p style={{ fontSize: 15, color: '#aaa', lineHeight: 1.85, marginBottom: 20 }}>Most people spend years and thousands of dollars searching for the edge. Better supplements. Better routines. Better recovery. Hydrogen therapy has been used by elite sports programmes and performance medicine practices for years.</p>
          <p style={{ fontSize: 15, color: '#aaa', lineHeight: 1.85, marginBottom: 40 }}>Oxyra brings the same technology to you for $59.99. One press. Three minutes. Your water transformed at the molecular level. Every single day.</p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 24, marginBottom: 40 }}>
            {[['2,000+','Peer-reviewed studies'],['↓28%','Blood lactate reduction'],['90 days','Risk-free trial']].map(([n,l]) => (
              <div key={l} style={{ borderLeft: '2px solid #2d8a65', paddingLeft: 16 }}>
                <div style={{ ...D, fontSize: 26, fontWeight: 300, color: 'white', marginBottom: 4 }}>{n}</div>
                <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' as const, color: '#777' }}>{l}</div>
              </div>
            ))}
          </div>
          <a href="#bundles" style={{ background: 'white', color: '#08080a', fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' as const, padding: '16px 40px', textDecoration: 'none', display: 'inline-block' }}>Get Yours Now</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' as const }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(20,100,200,0.18) 0%, transparent 65%)' }} />
          <Image src="/images/bottle-dark.png" alt="Oxyra bottle" width={400} height={560}
            style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 340, height: 'auto',
              filter: 'drop-shadow(0 0 50px rgba(30,120,220,0.6)) drop-shadow(0 0 100px rgba(10,60,150,0.35))',
              animation: 'float 7s ease-in-out 3.5s infinite' }} />
        </div>
      </div>

      {/* FINAL DEAL CLOSER */}
      <div style={{ background: '#08080a', padding: isMobile ? '60px 24px' : '100px 80px', textAlign: 'center' as const }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase' as const, color: '#5cbf94', marginBottom: 24 }}>The Decision</div>
        <h2 style={{ ...D, fontSize: isMobile ? 34 : 60, fontWeight: 300, color: 'white', lineHeight: 1.0, marginBottom: 24, maxWidth: 800, margin: '0 auto 24px' }}>
          You already know you need to<br />take better care of yourself.<br /><em style={{ fontStyle: 'italic', color: '#5cbf94' }}>Today is the day you do.</em>
        </h2>
        <p style={{ fontSize: 16, color: '#aaa', lineHeight: 1.85, maxWidth: 640, margin: '0 auto 20px' }}>
          The question isn&apos;t whether hydrogen therapy works — 2,000 peer-reviewed studies answer that. The question is whether you&apos;ll act on it today.
        </p>
        <p style={{ fontSize: 16, color: '#aaa', lineHeight: 1.85, maxWidth: 640, margin: '0 auto 60px' }}>
          Try Oxyra for 90 days. If you don&apos;t feel sharper, recover faster, sleep better, and simply feel more like yourself — we&apos;ll refund every cent. No forms. No hoops. No questions asked.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: isMobile ? 24 : 48, marginBottom: isMobile ? 48 : 72 }}>
          {[['🛡️','90-Day Guarantee','No questions asked'],['🚚','Free Shipping','On every order'],['⭐','4.9 Stars','150+ verified reviews'],['🔒','Secure Checkout','Powered by Stripe']].map(([icon,title,sub]) => (
            <div key={String(title)} style={{ textAlign: 'center' as const }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'white', marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 11, color: '#666' }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>


      </div>
      </div>
      <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }`}</style>
    </div>
  )
}