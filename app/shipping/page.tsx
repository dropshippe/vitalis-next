import Link from 'next/link'
export const metadata = { title: 'Shipping — Oxyra' }
export default function ShippingPage() {
  return (
    <div style={{ paddingTop: 64, background: '#fafaf8', minHeight: '100vh' }}>
      <div style={{ background: '#08080a', padding: '80px 80px 60px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase' as const, color: '#2d8a65', marginBottom: 16, fontFamily: "'DM Sans',sans-serif" }}>Delivery</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 64, fontWeight: 300, lineHeight: 1, color: 'white' }}>Shipping<br /><em style={{ fontStyle: 'italic', color: '#5cbf94' }}>Information.</em></h1>
      </div>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 40px' }}>
        {[
          { title: 'Where do you ship?', body: 'We ship worldwide — to every country across North America, Europe, Asia Pacific, and beyond. Wherever you are, Oxyra will reach you.' },
          { title: 'How long does shipping take?', body: 'All orders are dispatched within 1–2 business days and delivered in 7–14 business days worldwide.' },
          { title: 'How much does shipping cost?', body: 'Shipping is completely free on every order worldwide — no minimum spend, no exceptions, no hidden fees.' },
          { title: 'Will I get a tracking number?', body: 'Yes — you will receive a tracking number by email as soon as your order is dispatched, typically within 1–2 business days of placing your order.' },
          { title: 'What if my order is lost or damaged?', body: 'If your order is lost in transit or arrives damaged, please contact us at hello@oxyrawater.com within 14 days of the expected delivery date. We will replace it or refund you immediately.' },
          { title: 'Customs and import duties', body: 'For international orders, customs duties and import taxes may apply. These are the responsibility of the customer and are not included in the product or shipping price. We recommend checking your local regulations.' },
        ].map((item, i) => (
          <div key={i} style={{ borderBottom: '1px solid #e5e5e0', padding: '28px 0' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 500, color: '#08080a', marginBottom: 10 }}>{item.title}</h3>
            <p style={{ fontSize: 14, color: '#6b6b6b', lineHeight: 1.8, fontFamily: "'DM Sans',sans-serif" }}>{item.body}</p>
          </div>
        ))}
        <div style={{ marginTop: 48, display: 'flex', gap: 16 }}>
          <Link href="/#shop" style={{ background: '#08080a', color: 'white', fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', padding: '14px 28px', textDecoration: 'none' }}>Shop Now</Link>
          <Link href="/returns" style={{ background: 'transparent', color: '#08080a', fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', padding: '13px 28px', textDecoration: 'none', border: '1.5px solid #08080a' }}>Returns Policy</Link>
        </div>
      </div>
    </div>
  )
}
