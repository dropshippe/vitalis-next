'use client'

import { useState } from 'react'
import { BUNDLES, formatUsd, type BundleId } from '@/lib/catalog'
import { track } from '@/components/Tracker'

const ORDER: BundleId[] = ['1', '2']

export default function Buy() {
  const [choice, setChoice] = useState<BundleId>('1')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const bundle = BUNDLES[choice]

  async function buy() {
    setBusy(true)
    setError('')
    track('checkout_start', { bundle: choice })
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty: choice }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.url) {
        window.location.href = data.url
        return
      }
      setError(
        data.error === 'not_configured'
          ? 'Checkout isn’t switched on yet. Email hello@oxyrawater.com and we’ll take your order directly.'
          : 'The payment page didn’t open. Try again, or email hello@oxyrawater.com.',
      )
    } catch {
      setError('The payment page didn’t open. Check your connection and try again.')
    }
    setBusy(false)
  }

  return (
    <section id="buy" className="buy">
      <div className="buy-inner">
        <h2 className="display-2">One for you, or two to share.</h2>

        <fieldset className="choices">
          <legend className="sr-only">How many bottles</legend>
          {ORDER.map((id) => {
            const b = BUNDLES[id]
            return (
              <label key={id} className="choice" data-checked={choice === id}>
                <input
                  type="radio"
                  name="bundle"
                  value={id}
                  checked={choice === id}
                  onChange={() => setChoice(id)}
                />
                <span className="choice-name">{b.label}</span>
                <span className="choice-note">
                  {b.saving > 0 ? `Save ${formatUsd(b.saving)} on buying two separately` : 'Glass and stainless steel'}
                </span>
                <span className="choice-price">{formatUsd(b.amount)}</span>
              </label>
            )
          })}
        </fieldset>

        <button className="btn btn-dark buy-btn" onClick={buy} disabled={busy}>
          {busy ? 'Opening secure checkout…' : `Buy ${bundle.label.toLowerCase()} for ${formatUsd(bundle.amount)}`}
        </button>
        <p className="buy-error" role="alert">
          {error}
        </p>

        <ul className="terms">
          <li>
            <strong>Free tracked shipping worldwide.</strong> Most orders arrive in 5 to 20 business days.
          </li>
          <li>
            <strong>30 days to decide.</strong> Send it back for a full refund if it isn&rsquo;t for you.
          </li>
          <li>
            <strong>Lifetime warranty</strong> on the steel and glass, two years on the battery and electronics.
            Prices in US dollars, paid through Stripe.
          </li>
        </ul>
      </div>
    </section>
  )
}
