import PageShell from '@/components/PageShell'
import { BUSINESS, trader } from '@/lib/business'

export const metadata = {
  title: 'Returns and warranty — Oxyra',
  description: 'The Oxyra 90-day money-back guarantee and one-year warranty.',
}

export default function ReturnsPage() {
  return (
    <PageShell
      title="Returns and warranty."
      intro="Ninety days to change your mind. One year of cover if something fails."
      narrow
    >
      <div className="prose prose-legal">
        <h2>90-day money-back guarantee</h2>
        <p>
          If you’re not happy with your bottle for any reason, tell us within 90 days of receiving it and we’ll refund
          the full price.
        </p>
        <ol>
          <li>
            Email <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> with your order number.
          </li>
          <li>We reply within two business days with a prepaid return label. Return shipping is on us.</li>
          <li>
            Once the bottle is back with us, we refund your original payment method within 5 to 7 business days. Your
            bank may take a few more days to show it.
          </li>
        </ol>
        <p>
          Bottles that have been dropped, modified or damaged through misuse aren’t covered by the change-of-mind
          guarantee. Write to us anyway and we’ll look at it.
        </p>

        <h2>One-year warranty</h2>
        <p>
          If your bottle or its battery develops a fault within 12 months of delivery, email us a short description
          and a photo or video. We’ll send a replacement at no cost to you.
        </p>
        <p>
          The warranty covers defects in materials and workmanship. It doesn’t cover accidental damage, use with
          anything other than water, or damage from hot liquids or dishwashers.
        </p>
        <p>
          This warranty is given by {trader}
          {BUSINESS.address ? `, ${BUSINESS.address}` : ''}
          {BUSINESS.phone ? `, ${BUSINESS.phone}` : ''}. Contact us at{' '}
          <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
        </p>

        <h2>Your rights under Australian Consumer Law</h2>
        <p>
          Our guarantee and warranty are in addition to your rights under the law. Our goods come with guarantees that
          cannot be excluded under the Australian Consumer Law. You are entitled to a replacement or refund for a
          major failure and compensation for any other reasonably foreseeable loss or damage. You are also entitled to
          have the goods repaired or replaced if the goods fail to be of acceptable quality and the failure does not
          amount to a major failure.
        </p>
        <p>If you bought from outside Australia, you may have similar rights under your local consumer law.</p>
      </div>
    </PageShell>
  )
}
