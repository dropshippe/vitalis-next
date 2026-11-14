import PageShell from '@/components/PageShell'
import { BUSINESS, trader } from '@/lib/business'

export const metadata = {
  title: 'Returns and warranty — Oxyra',
  description: 'The Oxyra 30-day money-back guarantee, lifetime warranty on steel and glass, and two-year warranty on the battery.',
}

export default function ReturnsPage() {
  return (
    <PageShell
      title="Returns and warranty."
      intro="Thirty days to change your mind. A lifetime warranty on the steel and glass. Two years on the battery."
      narrow
    >
      <div className="prose prose-legal">
        <h2>30-day money-back guarantee</h2>
        <p>
          If you’re not happy with your bottle for any reason, tell us within 30 days of receiving it and we’ll refund
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

        <h2>Our warranty</h2>
        <p>
          This warranty covers the original buyer and starts on the day your bottle is delivered.
        </p>
        <h3>Lifetime warranty on the steel and glass</h3>
        <p>
          The stainless steel cap and base and the glass body are covered for as long as you own the bottle, against
          defects in materials and workmanship. If one fails, we replace the bottle.
        </p>
        <h3>Two years on the battery and electronics</h3>
        <p>
          The battery, membrane, button, light and charging port are covered for two years from delivery. If any of
          them stops working because of a fault, we replace the bottle.
        </p>
        <p>
          Batteries hold less charge as they age. Gradual loss of battery life over time is normal wear, not a fault,
          and isn’t covered.
        </p>
        <h3>What isn’t covered</h3>
        <ul>
          <li>Drops, knocks, cracks or dents from accidental damage.</li>
          <li>Damage from hot liquids, dishwashers or submerging the base.</li>
          <li>Using the bottle with anything other than still drinking water.</li>
          <li>Bottles that have been opened up, modified or repaired by anyone other than us.</li>
          <li>Normal wear, such as scratches and gradual battery fade.</li>
          <li>Lost or stolen bottles.</li>
        </ul>
        <h3>How to claim</h3>
        <ol>
          <li>
            Email <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> with your order number, a short
            description of the problem and a photo or video.
          </li>
          <li>We reply within two business days. We may ask you to try a fix from the care guide first.</li>
          <li>If it’s covered, we send a replacement at no cost to you. We may ask you to return the faulty bottle.</li>
        </ol>
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
        <p>
          If you live outside Australia, you also keep any rights your local consumer law gives you, and nothing in
          this warranty limits them.
        </p>
      </div>
    </PageShell>
  )
}
