import Link from 'next/link'
export const metadata = { title: 'Returns — Oxyra' }
export default function ReturnsPage() {
  return (
    <div style={{ paddingTop: 64, background: '#fafaf8', minHeight: '100vh' }}>
      <div style={{ background: '#08080a', padding: '80px 80px 60px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase' as const, color: '#2d8a65', marginBottom: 16, fontFamily: "'DM Sans',sans-serif" }}>Returns & Refunds</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 64, fontWeight: 300, lineHeight: 1, color: 'white', marginBottom: 16 }}>Returns<br /><em style={{ fontStyle: 'italic', color: '#5cbf94' }}>Policy.</em></h1>
        <div style={{ background: 'rgba(45,138,101,0.15)', border: '1px solid rgba(45,138,101,0.4)', padding: '20px 28px', maxWidth: 520, display: 'flex', alignItems: 'center', gap: 14 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5cbf94" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
          <span style={{ fontSize: 14, color: '#5cbf94', fontFamily: "'DM Sans',sans-serif" }}>90-Day Money-Back Guarantee — no questions asked</span>
        </div>
      </div>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 40px' }}>
        {[
          { title: '90-Day Money-Back Guarantee', body: 'If you are not completely satisfied with your Oxyra bottle for any reason within 90 days of receiving it, contact us at hello@oxyrawater.com and we will issue a full refund. No questions, no hoops, no hassle.' },
          { title: 'How to initiate a return', body: 'Email us at hello@oxyrawater.com with your order number. We will respond within 1–2 business days with return instructions. Once we receive and inspect the return, your refund will be processed within 5–7 business days to your original payment method.' },
          { title: 'Damaged or faulty items', body: 'If your Oxyra bottle arrives damaged or develops a fault within the 1-year warranty period, email us with photos and we will replace it immediately at no cost to you.' },
          { title: 'Return shipping', body: 'For returns within the 90-day guarantee period, we cover return shipping costs. Please use the prepaid label we send you.' },
          { title: 'Refund timeline', body: 'Refunds are processed within 5–7 business days of receiving your return. It may take an additional 3–5 business days to appear on your bank statement depending on your financial institution.' },
          { title: 'Non-returnable items', body: 'Items that have been damaged through misuse, dropped, or modified are not eligible for return or refund under the standard policy. Please contact us and we will assess on a case-by-case basis.' },
        ].map((item, i) => (
          <div key={i} style={{ borderBottom: '1px solid #e5e5e0', padding: '28px 0' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 500, color: '#08080a', marginBottom: 10 }}>{item.title}</h3>
            <p style={{ fontSize: 14, color: '#6b6b6b', lineHeight: 1.8, fontFamily: "'DM Sans',sans-serif" }}>{item.body}</p>
          </div>
        ))}
        <div style={{ marginTop: 48 }}>
          <a href="mailto:hello@oxyrawater.com" style={{ background: '#08080a', color: 'white', fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', padding: '14px 28px', textDecoration: 'none' }}>Contact Us</a>
        </div>
      </div>
    </div>
  )
}
