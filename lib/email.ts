import type { Order } from './orders/types'
import { BUNDLES, isBundleId, formatUsd } from './catalog'
import { BUSINESS } from './business'

// Sends email through Resend (https://resend.com). If RESEND_API_KEY isn't set, emails are skipped
// and the order carries on; the admin page shows which emails went out.

const API = (process.env.EMAIL_API_BASE || 'https://api.resend.com').replace(/\/$/, '')

export type SendResult = { sent: boolean; reason?: string }

async function send(to: string, subject: string, html: string, text: string): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY?.trim()
  const from = process.env.EMAIL_FROM?.trim()
  if (!key || !from) return { sent: false, reason: 'Email is not set up (RESEND_API_KEY and EMAIL_FROM)' }
  const res = await fetch(`${API}/emails`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, html, text, reply_to: BUSINESS.email }),
    signal: AbortSignal.timeout(15_000),
  })
  if (!res.ok) return { sent: false, reason: `Email provider returned ${res.status}: ${(await res.text()).slice(0, 200)}` }
  return { sent: true }
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

function layout(heading: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#edf2f3;font-family:'Helvetica Neue',Arial,sans-serif;color:#0b1d2a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#edf2f3;padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff">
<tr><td style="background:#04121f;padding:28px 32px;color:#ffffff;font-size:18px;letter-spacing:6px">OXYRA</td></tr>
<tr><td style="padding:36px 32px 12px"><h1 style="margin:0 0 16px;font-size:28px;font-weight:300;line-height:1.2">${heading}</h1>${body}</td></tr>
<tr><td style="padding:24px 32px 36px;font-size:13px;color:#51616b;line-height:1.6">Questions? Reply to this email or write to ${esc(BUSINESS.email)}.</td></tr>
</table></td></tr></table></body></html>`
}

const p = (s: string) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#2c3e4a">${s}</p>`

function itemLine(order: Order) {
  const label = isBundleId(order.bundle) ? BUNDLES[order.bundle].label : `${order.quantity} × bottle`
  return `${label}, ${formatUsd(order.amount_total)}`
}

function addressLines(order: Order) {
  return [order.ship_name, order.ship_line1, order.ship_line2, [order.ship_city, order.ship_state, order.ship_postal_code].filter(Boolean).join(' '), order.ship_country]
    .filter(Boolean)
    .map((l) => esc(String(l)))
    .join('<br>')
}

export function trackingUrl(tracking: string) {
  return `https://t.17track.net/en#nums=${encodeURIComponent(tracking)}`
}

export async function sendOrderConfirmation(order: Order): Promise<SendResult> {
  if (!order.customer_email) return { sent: false, reason: 'No customer email' }
  const first = (order.customer_name || '').split(' ')[0]
  const html = layout(
    'Thank you. It’s yours.',
    p(`${first ? `Hi ${esc(first)}, your` : 'Your'} order <strong>${order.order_number}</strong> is confirmed.`) +
      p(esc(itemLine(order))) +
      p(`<strong>Shipping to</strong><br>${addressLines(order)}`) +
      p('We pack and dispatch within one to three business days, then email you a tracking number. Most orders arrive in 5 to 20 business days.'),
  )
  const text = `Your Oxyra order ${order.order_number} is confirmed.\n${itemLine(order)}\n\nWe'll email your tracking number when it ships. Most orders arrive in 5 to 20 business days.\n\nQuestions? ${BUSINESS.email}`
  return send(order.customer_email, `Your Oxyra order ${order.order_number} is confirmed`, html, text)
}

export async function sendShippingNotice(order: Order): Promise<SendResult> {
  if (!order.customer_email || !order.tracking_number) return { sent: false, reason: 'No email or tracking number' }
  const url = trackingUrl(order.tracking_number)
  const html = layout(
    'It’s on its way.',
    p(`Your order <strong>${order.order_number}</strong> has shipped.`) +
      p(`Tracking number: <strong>${esc(order.tracking_number)}</strong>`) +
      `<p style="margin:22px 0"><a href="${url}" style="display:inline-block;background:#0b1d2a;color:#ffffff;text-decoration:none;padding:14px 26px;border-radius:999px;font-size:15px">Track your order</a></p>` +
      p('Tracking can take a day or two to show the first update. Most orders arrive in 5 to 20 business days.'),
  )
  const text = `Your Oxyra order ${order.order_number} has shipped.\nTracking number: ${order.tracking_number}\nTrack it: ${url}`
  return send(order.customer_email, `Your Oxyra order ${order.order_number} has shipped`, html, text)
}

export async function sendAdminAlert(subject: string, lines: string[]): Promise<SendResult> {
  const to = process.env.ADMIN_EMAIL?.trim()
  if (!to) return { sent: false, reason: 'ADMIN_EMAIL is not set' }
  const site = process.env.NEXT_PUBLIC_URL?.replace(/\/$/, '')
  const link = site ? `<p style="margin:22px 0"><a href="${site}/admin">Open the orders page</a></p>` : ''
  const html = layout(esc(subject), lines.map((l) => p(esc(l))).join('') + link)
  return send(to, `Oxyra: ${subject}`, html, `${lines.join('\n')}${site ? `\n\n${site}/admin` : ''}`)
}
