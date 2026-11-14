import PageShell from '@/components/PageShell'
import { BUSINESS } from '@/lib/business'

export const metadata = { title: 'Shipping — Oxyra', description: 'Oxyra ships worldwide for free. How long it takes and what to expect.' }

const ROWS: [string, React.ReactNode][] = [
  ['Where we ship', 'Worldwide.'],
  ['Cost', 'Free on every order, wherever you are.'],
  ['Dispatch', 'Within one to three business days of your order.'],
  ['Delivery', 'Most orders arrive in 5 to 20 business days. Orders to the United States are usually at the faster end.'],
  ['Tracking', 'We email a tracking number when your order leaves.'],
  [
    'Duties and taxes',
    'Some countries charge import duties or taxes on delivery. These are set by your local customs office and aren’t included in our price.',
  ],
  [
    'Lost or damaged',
    <>
      If your order hasn’t arrived 14 days after the expected date, or arrives damaged, email{' '}
      <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>. We’ll replace it or refund you.
    </>,
  ],
]

export default function ShippingPage() {
  return (
    <PageShell title="Shipping." intro="Free to anywhere in the world, tracked the whole way." narrow>
      <dl className="specs">
        {ROWS.map(([k, v]) => (
          <div key={k} className="spec">
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <p className="after-note">
        Changed your mind after it arrives? See <a href="/returns">returns and warranty</a>.
      </p>
    </PageShell>
  )
}
