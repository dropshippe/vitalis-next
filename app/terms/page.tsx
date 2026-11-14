import PageShell from '@/components/PageShell'
import { BUSINESS, trader, introName } from '@/lib/business'

export const metadata = { title: 'Terms and conditions — Oxyra', description: 'The terms that apply when you use this site or buy from Oxyra.' }

export default function TermsPage() {
  const mail = <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
  return (
    <PageShell title="Terms and conditions." intro={`Last updated ${BUSINESS.updated}.`} narrow>
      <div className="prose prose-legal">
        <p>
          These terms apply when you use this site or buy from {introName}. By placing an order you agree
          to them. Nothing here limits rights you have under consumer law.
        </p>

        <h2>1. Ordering</h2>
        <p>
          Your order is an offer to buy. We accept it when we take payment and send your confirmation email. We may
          decline or cancel an order, for example if an item is out of stock, a price was shown in error or we suspect
          fraud. If we cancel after you’ve paid, we refund you in full.
        </p>

        <h2>2. Prices and payment</h2>
        <p>
          Prices are in US dollars. Your bank may convert the amount and charge a fee. Payment is taken by card
          through Stripe when you order. Import duties or taxes charged by your country’s customs office aren’t
          included in our prices and are yours to pay.
        </p>

        <h2>3. Delivery</h2>
        <p>
          We ship worldwide. Delivery times on the{' '}
          <a href="/shipping">shipping page</a> are estimates. Responsibility for the goods passes to you when they’re
          delivered to the address you gave us.
        </p>

        <h2>4. Returns, refunds and warranty</h2>
        <p>
          You can return your bottle within 90 days for a full refund. The steel and glass carry a lifetime
          warranty, and the battery and electronics are covered for two years. The
          details are on the <a href="/returns">returns and warranty page</a>, which forms part of these terms.
        </p>

        <h2>5. Using the bottle</h2>
        <p>
          Use the bottle only with still drinking water, and follow the instructions supplied with it. Don’t use hot
          liquids, don’t submerge the base, and don’t put it in a dishwasher.
        </p>

        <h2>6. Not medical advice</h2>
        <p>
          Oxyra is a water bottle. It is not a medical device and isn’t intended to diagnose, treat, cure or prevent
          any disease. Information on this site is general and isn’t medical advice. Talk to your doctor about your
          own health.
        </p>

        <h2>7. This site and its content</h2>
        <p>
          The Oxyra name, logo, text, images and design belong to us or our licensors. You may view the site for
          personal use. Please don’t copy or reuse the content without asking.
        </p>

        <h2>8. Our liability</h2>
        <p>
          Our goods come with guarantees that cannot be excluded under the Australian Consumer Law. Subject to those
          guarantees and any other rights that can’t legally be excluded, we aren’t liable for indirect or
          consequential loss, and our total liability for any order is limited to the amount you paid for it.
        </p>

        <h2>9. Governing law</h2>
        <p>
          These terms are governed by the laws of {BUSINESS.jurisdiction}. If you’re a consumer elsewhere, you keep
          the protection of the mandatory laws of the country you live in.
        </p>

        <h2>10. Changes</h2>
        <p>
          We may update these terms. The version on this page when you place an order is the one that applies to that
          order.
        </p>

        <h2>11. Contact</h2>
        <p>
          {trader}
          {BUSINESS.abn ? `, ABN ${BUSINESS.abn}` : ''}
          {BUSINESS.address ? `, ${BUSINESS.address}` : ''}. Email {mail}.
        </p>
      </div>
    </PageShell>
  )
}
