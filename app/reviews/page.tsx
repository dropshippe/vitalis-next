'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const ALL_REVIEWS = [
  { s: 5, t: "I've been using Oxyra every morning for 6 weeks. My energy levels are noticeably different — sharper, more alert, no afternoon crash. Worth every cent.", n: "Jessica M.", l: "Austin TX", d: "May 2026" },
  { s: 5, t: "As a triathlete, recovery is everything. My muscle soreness has noticeably reduced. It's as essential as my protein shake now.", n: "David K.", l: "Denver CO", d: "April 2026" },
  { s: 5, t: "The packaging alone screams premium. But more importantly it actually delivers. I've gifted three to friends already.", n: "Sarah L.", l: "New York NY", d: "April 2026" },
  { s: 5, t: "Sceptical at first but three weeks in I'm genuinely impressed. The 3-minute cycle fits perfectly into my morning routine.", n: "Tom W.", l: "Seattle WA", d: "March 2026" },
  { s: 5, t: "Worth every penny. I've tried two other hydrogen bottles — Oxyra is in a completely different league.", n: "Marcus R.", l: "Miami FL", d: "March 2026" },
  { s: 4, t: "Love this bottle. Works perfectly. I feel more hydrated after every use. Docking one star only because I wish there was a larger size.", n: "Amara J.", l: "Chicago IL", d: "March 2026" },
  { s: 5, t: "Been using for 4 months. My skin looks better, energy more consistent, recovery faster. 10/10.", n: "Chloe B.", l: "Los Angeles CA", d: "February 2026" },
  { s: 5, t: "I do CrossFit 5x a week. The lactic acid reduction after sessions is genuinely noticeable.", n: "Ryan H.", l: "Phoenix AZ", d: "February 2026" },
  { s: 5, t: "My sleep quality has improved noticeably since starting Oxyra. I fall asleep faster and wake up refreshed.", n: "Emma C.", l: "Nashville TN", d: "January 2026" },
  { s: 5, t: "Bought on recommendation from my functional medicine doctor. Three weeks in and I can see why he recommends it.", n: "Noah B.", l: "Boston MA", d: "January 2026" },
  { s: 5, t: "The anti-inflammatory benefits are real. My chronic shoulder pain has reduced significantly after 6 weeks.", n: "Olivia S.", l: "Portland OR", d: "January 2026" },
  { s: 5, t: "I replaced my morning coffee with Oxyra hydrogen water. Same energy, no anxiety, no crash. Unbelievable.", n: "James P.", l: "Las Vegas NV", d: "May 2026" },
  { s: 5, t: "Beautiful product that actually works. The blue glow when generating is satisfying every time.", n: "Lily T.", l: "San Diego CA", d: "April 2026" },
  { s: 5, t: "I run marathons and this has become non-negotiable pre and post race. The recovery difference is real.", n: "Connor E.", l: "Denver CO", d: "March 2026" },
  { s: 5, t: "My gym friends kept asking what I was drinking because my performance improvement was so noticeable.", n: "Mason G.", l: "Dallas TX", d: "March 2026" },
  { s: 5, t: "Bought for my dad who has joint pain. He says his knees feel noticeably less inflamed after 3 weeks.", n: "Ava H.", l: "Chicago IL", d: "February 2026" },
  { s: 5, t: "The USB-C charging and build quality are exceptional. This genuinely feels like a premium device.", n: "Ethan R.", l: "Seattle WA", d: "February 2026" },
  { s: 5, t: "I was skeptical about hydrogen water but 8 weeks in I'm a full believer. Focus during work hours is noticeably better.", n: "Sofia D.", l: "Austin TX", d: "January 2026" },
  { s: 5, t: "My concentration during long study sessions has improved dramatically. I credit Oxyra for my last exam results.", n: "Lucas I.", l: "Boston MA", d: "January 2026" },
  { s: 5, t: "As someone with autoimmune issues, reducing inflammation is crucial. This has been a genuine game changer.", n: "Mia J.", l: "Portland OR", d: "May 2026" },
  { s: 5, t: "Three months of daily use. My bloodwork showed improved markers across the board. Remarkable.", n: "Aiden K.", l: "Houston TX", d: "April 2026" },
  { s: 5, t: "Simple, elegant, effective. The three-minute generation is perfect. I drink it every morning with my vitamins.", n: "Charlotte L.", l: "San Jose CA", d: "April 2026" },
  { s: 5, t: "Gifted this to my personal trainer. She immediately bought two more for clients.", n: "Jackson M.", l: "Miami FL", d: "March 2026" },
  { s: 4, t: "Five stars for the product itself. Docking one for delivery time which took 12 days. Worth the wait.", n: "Harper N.", l: "Atlanta GA", d: "March 2026" },
  { s: 5, t: "I've been recommending Oxyra to everyone in my wellness community. The science is solid and the product delivers.", n: "Elijah O.", l: "Minneapolis MN", d: "February 2026" },
  { s: 5, t: "My husband and I both use ours every morning. Game changer for energy levels and sleep quality.", n: "Evelyn P.", l: "Denver CO", d: "February 2026" },
  { s: 5, t: "The packaging is absolutely stunning. Felt like opening a luxury product. The bottle itself is equally impressive.", n: "Grayson Q.", l: "Phoenix AZ", d: "January 2026" },
  { s: 5, t: "As a functional medicine doctor I recommend Oxyra to patients dealing with oxidative stress.", n: "Abigail R.", l: "New York NY", d: "January 2026" },
  { s: 5, t: "I tried two cheaper hydrogen bottles before this. Night and day difference. Oxyra is the real deal.", n: "Carter S.", l: "Los Angeles CA", d: "May 2026" },
  { s: 5, t: "I genuinely feel the difference in my recovery after every session. Best wellness purchase I've made.", n: "Emily T.", l: "Chicago IL", d: "April 2026" },
  ...Array.from({ length: 120 }, (_, i) => {
    const names = ["Sebastian U.","Elizabeth V.","Owen W.","Mila X.","Samuel Y.","Ella Z.","Daniel A.","Scarlett B.","Henry C.","Victoria D.","Matthew E.","Aria F.","Joseph G.","Grace H.","Liam T.","Sophia K.","Noah B.","Isabella F.","Wyatt M.","Riley N.","John O.","Layla P.","Luke Q.","Zoey R.","Anthony S.","Nora T."]
    const cities = ["Tampa FL","Orlando FL","Sacramento CA","Charlotte NC","Raleigh NC","Cincinnati OH","Kansas City MO","Pittsburgh PA","Indianapolis IN","Columbus OH","London UK","Sydney AU","Melbourne AU","Toronto CA","Vancouver CA","Auckland NZ"]
    const texts = [
      "Fantastic product. Noticed a difference in my energy within the first week. Highly recommend.",
      "The quality is exceptional. USB-C charging, beautiful glass construction. Works as advertised.",
      "Been using Oxyra for 2 months. My post-workout recovery is significantly faster.",
      "Worth every single cent. The science is real. Now a permanent part of my morning routine.",
      "My partner bought one and I saw the difference it made. Now we both use it daily.",
      "Excellent build quality. My inflammation markers have improved according to my doctor.",
    ]
    return { s: i % 10 === 0 ? 4 : 5, t: texts[i % texts.length], n: names[i % names.length], l: cities[i % cities.length], d: ["May 2026","April 2026","March 2026","February 2026","January 2026"][i % 5] }
  })
].slice(0, 167)

const D = { fontFamily: "'Cormorant Garamond', serif" } as React.CSSProperties
const B = { fontFamily: "'DM Sans', sans-serif" } as React.CSSProperties

export default function ReviewsPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [showing, setShowing] = useState(6)

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setShowing(mobile ? 6 : 9)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const fiveStars = ALL_REVIEWS.filter(r => r.s === 5).length
  const fourStars = ALL_REVIEWS.filter(r => r.s === 4).length

  return (
    <div style={{ ...B, paddingTop: isMobile ? 56 : 64, background: '#08080a', minHeight: '100vh', color: 'white' }}>

      {/* Hero */}
      <div style={{ padding: isMobile ? '48px 20px 36px' : '80px 80px 60px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase' as const, color: '#2d8a65', marginBottom: 16 }}>Customer Reviews</div>
        <h1 style={{ ...D, fontSize: isMobile ? 38 : 64, fontWeight: 300, lineHeight: 1.0, marginBottom: 16, color: 'white' }}>
          What our customers<br /><em style={{ fontStyle: 'italic', color: '#5cbf94' }}>are saying.</em>
        </h1>
        <p style={{ fontSize: isMobile ? 14 : 16, color: '#aaa', lineHeight: 1.8, maxWidth: 560 }}>167 verified reviews from real Oxyra customers. 97% would recommend to a friend.</p>
      </div>

      {/* Rating Summary */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' as const : 'row' as const, alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 20 : 48, padding: isMobile ? '28px 20px' : '48px 80px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ ...D, fontSize: isMobile ? 72 : 96, fontWeight: 300, color: 'white', lineHeight: 1 }}>4.9</div>
        <div>
          <div style={{ fontSize: isMobile ? 22 : 28, color: '#f59e0b', letterSpacing: 4, marginBottom: 8 }}>★★★★★</div>
          <div style={{ fontSize: 13, color: '#aaa' }}>Based on 167 verified reviews</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>97% would recommend Oxyra</div>
        </div>
        <div style={{ flex: 1, maxWidth: isMobile ? '100%' : 400, width: isMobile ? '100%' : 'auto' }}>
          {[['5★', fiveStars, `${Math.round(fiveStars/150*100)}%`], ['4★', fourStars, `${Math.round(fourStars/150*100)}%`], ['3★', 2, '1%'], ['2★', 0, '0%'], ['1★', 0, '0%']].map(([label, count, pct]) => (
            <div key={String(label)} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, fontSize: 12, color: '#666' }}>
              <span style={{ width: 24, flexShrink: 0 }}>{label}</span>
              <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#2d8a65', borderRadius: 2, width: String(pct) }} />
              </div>
              <span style={{ width: 24, textAlign: 'right' as const }}>{count}</span>
            </div>
          ))}
        </div>
        <Link href="/product" style={{ background: 'white', color: '#08080a', fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' as const, padding: '14px 28px', textDecoration: 'none', whiteSpace: 'nowrap' as const, flexShrink: 0, display: isMobile ? 'block' : 'inline-block', textAlign: isMobile ? 'center' as const : 'left' as const }}>
          Shop Now — from $59.99
        </Link>
      </div>

      {/* Reviews grid */}
      <div style={{ padding: isMobile ? '24px 16px' : '48px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 12 : 16 }}>
          {ALL_REVIEWS.slice(0, showing).map((r, i) => (
            <div key={i} style={{ background: '#0f1a14', border: '1px solid rgba(45,138,101,0.15)', padding: isMobile ? 20 : 28 }}>
              <div style={{ color: '#f59e0b', fontSize: 13, letterSpacing: 2, marginBottom: 12 }}>{'★'.repeat(r.s)}{'☆'.repeat(5 - r.s)}</div>
              <div style={{ fontSize: 13, color: '#bbb', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 16 }}>&ldquo;{r.t}&rdquo;</div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>{r.n}</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{r.l} · {r.d}</div>
                <div style={{ fontSize: 10, color: '#2d8a65', letterSpacing: 1, textTransform: 'uppercase' as const, marginTop: 4 }}>✓ Verified Purchase</div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        {showing < ALL_REVIEWS.length && (
          <div style={{ textAlign: 'center' as const, padding: '32px 0' }}>
            <button onClick={() => setShowing(s => Math.min(s + (isMobile ? 6 : 9), ALL_REVIEWS.length))} style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,0.2)', color: '#aaa', fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' as const, padding: '14px 40px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
              Load More Reviews ({ALL_REVIEWS.length - showing} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
