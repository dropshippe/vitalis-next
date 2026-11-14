import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { BUNDLES, SHIP_TO, isBundleId } from '@/lib/catalog'

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 })
  }

  let qty: unknown
  try {
    qty = (await req.json())?.qty
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }
  if (!isBundleId(qty)) {
    return NextResponse.json({ error: 'unknown_bundle' }, { status: 400 })
  }

  const bundle = BUNDLES[qty]
  const baseUrl = process.env.NEXT_PUBLIC_URL || `https://${req.headers.get('host')}`

  try {
    const stripe = new Stripe(secret)
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: bundle.stripeName, description: bundle.stripeDescription },
            unit_amount: bundle.amount,
          },
          quantity: 1,
        },
      ],
      metadata: { bundle: bundle.id, bottles: String(bundle.bottles) },
      success_url: `${baseUrl}/success?bundle=${bundle.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#buy`,
      shipping_address_collection: { allowed_countries: [...SHIP_TO] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 7 },
              maximum: { unit: 'business_day', value: 14 },
            },
          },
        },
      ],
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('checkout failed', err)
    return NextResponse.json({ error: 'checkout_failed' }, { status: 500 })
  }
}
