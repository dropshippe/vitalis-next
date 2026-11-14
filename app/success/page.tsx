'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import PageShell from '@/components/PageShell'
import { track } from '@/components/Tracker'

function Confirm() {
  const params = useSearchParams()
  useEffect(() => {
    track('checkout_complete', { bundle: params.get('bundle') || '1' })
  }, [params])
  return null
}

export default function SuccessPage() {
  return (
    <PageShell title="Thank you. It’s yours." intro="Your order is confirmed and a receipt is on its way to your inbox." narrow>
      <Suspense>
        <Confirm />
      </Suspense>
      <div className="prose prose-legal">
        <h2>What happens next</h2>
        <ol>
          <li>We pack and dispatch your order within one to two business days.</li>
          <li>You get an email with a tracking number when it leaves.</li>
          <li>It arrives in 7 to 14 business days.</li>
        </ol>
        <p>
          Questions about your order? Email <a href="mailto:hello@oxyrawater.com">hello@oxyrawater.com</a> with the
          name you ordered under.
        </p>
        <p>
          <a className="btn btn-dark" href="/">
            Back to the home page
          </a>
        </p>
      </div>
    </PageShell>
  )
}
