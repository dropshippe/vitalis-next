import Link from 'next/link'

export default function Footer() {
  return (
    <>
      <footer style={{ background: '#0a0a08', padding: '64px 80px 40px', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 52, marginBottom: 52 }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, letterSpacing: 5, textTransform: 'uppercase' as const, color: 'white', fontWeight: 300, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 7, height: 7, background: '#2d8a65', borderRadius: '50%' }} />Oxyra
            </div>
            <div style={{ fontSize: 12, color: '#333', lineHeight: 1.7 }}>Advanced hydrogen hydration. Built on science. Designed for life.</div>
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' as const, color: '#333', marginBottom: 16 }}>Explore</div>
            {[['/', 'Home'], ['/why', 'Why Oxyra'], ['/science', 'Science'], ['/reviews', 'Reviews'], ['/faqs', 'FAQs']].map(([href, label]) => (
              <Link key={href} href={href} style={{ display: 'block', fontSize: 12, color: '#444', marginBottom: 9, textDecoration: 'none' }}>{label}</Link>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' as const, color: '#333', marginBottom: 16 }}>Support</div>
            {[['/shipping', 'Shipping Info'], ['/returns', 'Returns & Refunds'], ['/faqs', 'FAQs']].map(([href, label]) => (
              <Link key={href} href={href} style={{ display: 'block', fontSize: 12, color: '#444', marginBottom: 9, textDecoration: 'none' }}>{label}</Link>
            ))}
            <a href="mailto:hello@oxyrawater.com" style={{ display: 'block', fontSize: 12, color: '#444', marginBottom: 9, textDecoration: 'none' }}>Contact Us</a>
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' as const, color: '#333', marginBottom: 16 }}>Legal</div>
            <span style={{ display: 'block', fontSize: 12, color: '#444', marginBottom: 9 }}>Privacy Policy</span>
            <span style={{ display: 'block', fontSize: 12, color: '#444', marginBottom: 9 }}>Terms & Conditions</span>
            <span style={{ display: 'block', fontSize: 12, color: '#444', marginBottom: 9 }}>Disclaimer</span>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #151513', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 11, color: '#333' }}>© 2026 Oxyra. All rights reserved.</div>
          <div style={{ fontSize: 11, color: '#333' }}>Payments secured by Stripe</div>
        </div>
      </footer>
      <div style={{ background: '#020607', padding: '20px 80px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <p style={{ fontSize: 10, color: '#2a3a32', lineHeight: 1.7, maxWidth: 800, margin: '0 auto' }}>* These statements have not been evaluated by the FDA. Not intended to diagnose, treat, cure, or prevent any disease. References: Nature Medicine 2007; Journal of Sports Medicine; Neurochemistry International.</p>
      </div>
    </>
  )
}
