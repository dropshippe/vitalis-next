import PageShell from '@/components/PageShell'
import { BUSINESS, trader, introName } from '@/lib/business'

export const metadata = { title: 'Privacy policy — Oxyra', description: 'What Oxyra collects, why, and who it is shared with.' }

export default function PrivacyPage() {
  const mail = <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
  return (
    <PageShell title="Privacy policy." intro={`Last updated ${BUSINESS.updated}.`} narrow>
      <div className="prose prose-legal">
        <p>
          This policy explains what {introName} collects when you visit this site or buy from us, why we
          collect it, and who we share it with. We handle personal information in line with the Australian Privacy
          Principles.
        </p>

        <h2>The short version</h2>
        <ul>
          <li>We collect what we need to take your order and deliver it.</li>
          <li>We count page visits without cookies and without building a profile of you.</li>
          <li>We never see or store your card number. Stripe handles payment.</li>
          <li>We don’t sell your information.</li>
        </ul>

        <h2>What we collect</h2>
        <h3>When you order</h3>
        <p>
          Your name, email address, delivery address and what you bought. Payment is taken on Stripe’s checkout page,
          so your card details go to Stripe and not to us.
        </p>
        <h3>When you browse</h3>
        <p>
          We record which page was viewed, when, how far down the page a visit scrolled, and the type of browser used.
          We use this to see which pages work. We don’t set tracking cookies and we don’t use advertising trackers.
          Our hosting provider also keeps standard server logs, which include IP addresses.
        </p>
        <h3>When you write to us</h3>
        <p>Your email address and whatever you tell us, so we can reply and keep a record of the conversation.</p>

        <h2>Why we use it</h2>
        <ul>
          <li>To process, deliver and support your order, including returns and warranty claims.</li>
          <li>To answer your questions.</li>
          <li>To understand how the site is used and improve it.</li>
          <li>To meet our legal and tax obligations.</li>
        </ul>
        <p>We only send marketing emails if you’ve asked for them, and every one has an unsubscribe link.</p>

        <h2>Who we share it with</h2>
        <ul>
          <li>
            <strong>Stripe</strong>, to take payment. See Stripe’s privacy policy at stripe.com/privacy.
          </li>
          <li>
            <strong>Our supplier and delivery carriers</strong>, who need your name and address to pack and deliver
            your order.
          </li>
          <li>
            <strong>Vercel</strong>, which hosts this site and stores our visit counts.
          </li>
          <li>Authorities, where the law requires it.</li>
        </ul>
        <p>
          Some of these companies are outside Australia, including in the United States and in the country your order
          ships from. By placing an order you agree to your information being sent to them for these purposes.
        </p>

        <h2>How long we keep it</h2>
        <p>
          Order records are kept for as long as tax and consumer law require, generally at least five years. Emails
          are kept while they’re useful for supporting you. Visit counts aren’t linked to you.
        </p>

        <h2>Security</h2>
        <p>
          The site is served over an encrypted connection, payments are handled by Stripe, and access to order
          information is limited to the people who need it. No system is perfectly secure, and we’ll tell you and the
          regulator if a breach is likely to cause you serious harm.
        </p>

        <h2>Your choices</h2>
        <p>
          You can ask for a copy of the personal information we hold about you, ask us to correct it, or ask us to
          delete it where we’re not required to keep it. Email {mail} and we’ll respond within 30 days. If you’re in
          the UK or EU you also have the right to object to or restrict how we use your information.
        </p>

        <h2>Children</h2>
        <p>This site is for adults. We don’t knowingly collect information from anyone under 18.</p>

        <h2>Complaints</h2>
        <p>
          If you think we’ve mishandled your information, email {mail} first and we’ll try to put it right. If you’re
          not satisfied, you can contact the Office of the Australian Information Commissioner at oaic.gov.au.
        </p>

        <h2>Changes</h2>
        <p>If we change this policy we’ll post the new version here and update the date at the top.</p>

        <h2>Contact</h2>
        <p>
          {trader}
          {BUSINESS.abn ? `, ABN ${BUSINESS.abn}` : ''}
          {BUSINESS.address ? `, ${BUSINESS.address}` : ''}. Email {mail}.
        </p>
      </div>
    </PageShell>
  )
}
