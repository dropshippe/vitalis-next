import PageShell from '@/components/PageShell'
import { BUSINESS } from '@/lib/business'

export const metadata = { title: 'Shipping — Oxyra', description: 'Where Oxyra ships, how long it takes and what it costs.' }

const ROWS: [string, React.ReactNode][] = [
  ['Where we ship', 'Australia, New Zealand, the United States, Canada and the United Kingdom.'],
  ['Cost', 'Free on every order.'],
  ['Dispatch', 'Within one to two business days of your order.'],
  ['Delivery', '7 to 14 business days after dispatch.'],
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
    <PageShell title="Shipping." intro="Free to five countries, tracked the whole way." narrow>
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
