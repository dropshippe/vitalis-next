import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

const BUNDLES: Record<string, { amount: number; name: string; desc: string }> = {
  '1': { amount: 5999, name: 'Oxyra Hydrogen Water Bottle × 1', desc: 'The Essential — 1 bottle' },
  '2': { amount: 9999, name: 'Oxyra Hydrogen Water Bottle × 2', desc: 'The Partner — 2 bottles, save 17%' },
  '3': { amount: 13499, name: 'Oxyra Hydrogen Water Bottle × 3', desc: 'The Family — 3 bottles, save 25%' },
}

export async function POST(req: NextRequest) {
  try {
    const { qty = '2' } = await req.json()
    const bundle = BUNDLES[qty] || BUNDLES['2']
    const baseUrl = process.env.NEXT_PUBLIC_URL || `https://${req.headers.get('host')}`

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: bundle.name, description: bundle.desc },
          unit_amount: bundle.amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#shop`,
      shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'AU', 'NZ'] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Free Worldwide Shipping',
            delivery_estimate: { minimum: { unit: 'business_day', value: 7 }, maximum: { unit: 'business_day', value: 14 } },
          },
        },
      ],
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
