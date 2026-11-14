import { NextRequest, NextResponse, after } from 'next/server'
import Stripe from 'stripe'
import { getStore } from '@/lib/orders/store'
import { BUNDLES, isBundleId } from '@/lib/catalog'
import { forwardOrder, sendConfirmationOnce } from '@/lib/fulfil'

export const runtime = 'nodejs'
export const maxDuration = 120

// Stripe calls this when a checkout is paid. The order is saved first; sending it to CJ happens
// right after the reply, so Stripe gets a quick answer and the order is never lost.
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim()
  if (!secret) return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET is not set' }, { status: 503 })

  const signature = req.headers.get('stripe-signature')
  if (!signature) return NextResponse.json({ error: 'missing signature' }, { status: 400 })

  const body = await req.text()
  let event: Stripe.Event
  try {
    event = Stripe.webhooks.constructEvent(body, signature, secret)
  } catch {
    return NextResponse.json({ error: 'bad signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed' && event.type !== 'checkout.session.async_payment_succeeded') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  if (session.payment_status !== 'paid') return NextResponse.json({ received: true, note: 'not paid yet' })

  // Stripe moved the address in newer API versions; accept either place.
  const legacy = session as unknown as { shipping_details?: Stripe.Checkout.Session.CollectedInformation.ShippingDetails | null }
  const shipping = session.collected_information?.shipping_details ?? legacy.shipping_details ?? null
  const addr = shipping?.address
  const bundle = String(session.metadata?.bundle ?? '')
  const known = isBundleId(bundle)

  const store = getStore()
  const { order, created } = await store.createOrder({
    stripe_session_id: session.id,
    stripe_payment_intent: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null,
    bundle: known ? bundle : bundle || 'unknown',
    quantity: known ? BUNDLES[bundle].bottles : 1,
    amount_total: session.amount_total ?? 0,
    currency: (session.currency ?? 'usd').toLowerCase(),
    customer_email: session.customer_details?.email ?? null,
    customer_name: session.customer_details?.name ?? shipping?.name ?? null,
    customer_phone: session.customer_details?.phone ?? null,
    ship_name: shipping?.name ?? session.customer_details?.name ?? null,
    ship_line1: addr?.line1 ?? null,
    ship_line2: addr?.line2 ?? null,
    ship_city: addr?.city ?? null,
    ship_state: addr?.state ?? null,
    ship_postal_code: addr?.postal_code ?? null,
    ship_country: addr?.country ?? null,
    ...(known ? {} : { status: 'needs_review' as const, last_error: `Unknown bundle "${bundle}" in Stripe metadata` }),
  })

  if (created) {
    await store.addEvent(order.id, 'paid', `Paid ${(order.amount_total / 100).toFixed(2)} ${order.currency.toUpperCase()} through Stripe`, {
      session: session.id,
      event: event.id,
    })
  }

  after(async () => {
    try {
      await sendConfirmationOnce(order)
      if (order.status === 'paid' || order.status === 'failed') await forwardOrder(order.id)
    } catch (err) {
      console.error('order follow-up failed', order.order_number, err)
    }
  })

  return NextResponse.json({ received: true, order: order.order_number, created })
}
