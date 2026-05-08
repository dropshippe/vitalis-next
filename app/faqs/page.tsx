'use client'
import { useState } from 'react'
import Link from 'next/link'

const FAQS = [
  { q: 'What exactly is hydrogen water?', a: 'Hydrogen water is regular water that has been infused with dissolved molecular hydrogen gas (H₂) at therapeutic concentrations. It is not the same as the hydrogen already present in H₂O molecules — that hydrogen is chemically bonded to oxygen and unavailable to your body. Oxyra uses SPE/PEM electrolysis to dissolve free H₂ gas into water at 3000+ PPB, making it bioavailable and able to enter your cells directly.' },
  { q: 'Is hydrogen water safe?', a: 'Yes. Molecular hydrogen is a natural, colourless, odourless, tasteless gas. It is produced naturally in the human gut and has been the subject of over 2,000 peer-reviewed studies. The FDA classifies hydrogen as a GRAS (Generally Recognised As Safe) substance. Our dual-chamber design also ensures ozone and chlorine byproducts are expelled and never enter your drinking water.' },
  { q: 'How long does one cycle take?', a: 'One hydrogen generation cycle takes 3 minutes. You can run a second cycle back-to-back for even higher concentration. We recommend drinking immediately after generation — molecular hydrogen is a gas and begins to dissipate within 10–15 minutes of generation.' },
  { q: 'How is this different from the hydrogen already in water?', a: 'Water molecules (H₂O) contain hydrogen, but those hydrogen atoms are covalently bonded to oxygen — they are part of the water molecule and completely unavailable for any antioxidant purpose. Oxyra uses electrolysis to dissolve free molecular hydrogen gas (H₂) into the water at 3000+ PPB. This dissolved H₂ is neutral, tiny (0.00024 nanometres), and bioavailable — it can cross every cell membrane including the blood-brain barrier.' },
  { q: 'What water should I use?', a: 'We recommend filtered, mineral, or spring water. These contain dissolved minerals which are needed for effective electrolysis. Avoid distilled or reverse-osmosis water as these lack the mineral content needed. Tap water works well in most regions.' },
  { q: 'How do I charge the bottle?', a: 'Oxyra charges via USB-C. A full charge takes approximately 2 hours and provides up to 27 hydrogen generation cycles — more than enough for a week of daily use.' },
  { q: 'How do I clean the bottle?', a: 'Rinse with clean water after each use. For a deeper clean, add a small amount of food-grade citric acid (lemon juice works) to water, run a generation cycle, then rinse thoroughly. Do not submerge the base (charging port) or place in a dishwasher.' },
  { q: 'When will I notice results?', a: 'Most users report noticeably improved energy and mental clarity within 1–2 weeks of daily use. Athletic recovery improvements are typically noticed within the first few sessions. For sleep and anti-inflammatory benefits, most users report noticeable changes within 2–4 weeks. Results vary by individual.' },
  { q: 'What countries do you ship to?', a: 'We ship worldwide — to every country. Shipping is completely free on every order, no exceptions.' },
  { q: 'How long does shipping take?', a: 'All orders are dispatched within 1–2 business days and delivered in 7–14 business days worldwide. You will receive a tracking number by email once dispatched.' },
  { q: 'What is your return policy?', a: 'We offer a 90-day money-back guarantee. If you are not completely satisfied for any reason within 90 days of receiving your order, contact us at hello@oxyrawater.com and we will issue a full refund. No questions, no hoops to jump through.' },
  { q: 'Does the bottle come with a warranty?', a: 'Yes — every Oxyra bottle comes with a 1-year manufacturer warranty covering defects in materials and workmanship. If your bottle develops a fault within 12 months, we will replace it at no cost.' },
  { q: 'Can I use it for hot drinks?', a: 'No. The bottle is designed for cold or room-temperature water only. Hot liquids can damage the electrolysis membrane and void the warranty. The hydrogen generation process also works best with cold water.' },
  { q: 'Are there any medical claims?', a: 'No. Oxyra is a wellness hydration device, not a medical device. The FDA has not evaluated hydrogen water for the diagnosis, treatment, cure, or prevention of any disease. We market Oxyra based on its hydration properties and the existing peer-reviewed research. Always consult a healthcare professional for medical concerns.' },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid #e5e5e0' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
          fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 500, color: '#08080a',
          gap: 16
        }}
      >
        <span>{q}</span>
        <span style={{ fontSize: 20, color: '#2d8a65', flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
      </button>
      {open && (
        <div style={{ paddingBottom: 20, fontSize: 14, color: '#6b6b6b', lineHeight: 1.8, fontFamily: "'DM Sans',sans-serif" }}>
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQsPage() {
  return (
    <div style={{ paddingTop: 64, background: '#fafaf8', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: '#08080a', padding: '80px 80px 60px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase', color: '#2d8a65', marginBottom: 16, fontFamily: "'DM Sans',sans-serif" }}>Help Centre</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 64, fontWeight: 300, lineHeight: 1, marginBottom: 16, color: 'white' }}>
          Frequently Asked<br /><em style={{ fontStyle: 'italic', color: '#5cbf94' }}>Questions.</em>
        </h1>
        <p style={{ fontSize: 15, color: '#aaa', lineHeight: 1.8, maxWidth: 520, fontFamily: "'DM Sans',sans-serif" }}>
          Can&apos;t find your answer? Email us at{' '}
          <a href="mailto:hello@oxyrawater.com" style={{ color: '#5cbf94', textDecoration: 'none' }}>hello@oxyrawater.com</a>
        </p>
      </div>

      {/* FAQ list */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 40px' }}>
        {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
      </div>

      {/* CTA */}
      <div style={{ background: '#f0f5f1', padding: '60px 80px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 300, marginBottom: 20 }}>
          Still have questions?
        </div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="mailto:hello@oxyrawater.com" style={{ background: '#08080a', color: 'white', fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', padding: '14px 28px', textDecoration: 'none' }}>Email Us</a>
          <Link href="/#shop" style={{ background: 'transparent', color: '#08080a', fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', padding: '13px 28px', textDecoration: 'none', border: '1.5px solid #08080a' }}>Shop Now</Link>
        </div>
      </div>
    </div>
  )
}
