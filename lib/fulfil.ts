import { getStore } from './orders/store'
import type { Order } from './orders/types'
import {
  CjError,
  NeedsReviewError,
  UNPAID_STATUSES,
  chooseShipping,
  createAndPayOrder,
  getBalance,
  getOrderDetail,
  payOrder,
  quoteShipping,
  resolveVariantId,
  type CjOrderDetail,
} from './cj'
import { sendAdminAlert, sendOrderConfirmation, sendShippingNotice } from './email'
import { formatUsd } from './catalog'

const STALE_MINUTES = 15
const MAX_ATTEMPTS = 5
const INLINE_TRIES = 3

const num = (v: unknown) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}
const errMessage = (err: unknown) => (err instanceof Error ? err.message : String(err))

// ---------- emails, sent at most once each ----------

export async function sendConfirmationOnce(order: Order) {
  if (order.confirmation_email_at) return
  const store = getStore()
  const res = await sendOrderConfirmation(order).catch((e) => ({ sent: false, reason: errMessage(e) }))
  if (res.sent) {
    await store.updateOrder(order.id, { confirmation_email_at: new Date().toISOString() })
    await store.addEvent(order.id, 'email', 'Order confirmation emailed to the customer')
  } else {
    await store.addEvent(order.id, 'email_skipped', `Order confirmation not sent: ${res.reason}`)
  }
}

async function sendShippingOnce(order: Order) {
  if (order.shipping_email_at || !order.tracking_number) return
  const store = getStore()
  const res = await sendShippingNotice(order).catch((e) => ({ sent: false, reason: errMessage(e) }))
  if (res.sent) {
    await store.updateOrder(order.id, { shipping_email_at: new Date().toISOString() })
    await store.addEvent(order.id, 'email', `Shipping email with tracking ${order.tracking_number} sent`)
  } else {
    await store.addEvent(order.id, 'email_skipped', `Shipping email not sent: ${res.reason}`)
  }
}

async function needsReview(order: Order, message: string) {
  const store = getStore()
  await store.updateOrder(order.id, { status: 'needs_review', last_error: message })
  await store.addEvent(order.id, 'needs_review', message)
  await sendAdminAlert(`order ${order.order_number} needs you`, [
    message,
    `Customer: ${order.customer_name ?? ''} (${order.customer_email ?? 'no email'}), ${order.ship_country ?? ''}`,
    'The customer has paid. Fix the problem, then press Retry on the orders page.',
  ]).catch(() => {})
}

// ---------- sending one order to CJ ----------

async function markSent(order: Order, cj: { orderId: string; orderStatus?: string; logisticName?: string; postage?: unknown; amount?: unknown }) {
  const store = getStore()
  const updated = await store.updateOrder(order.id, {
    status: 'sent',
    cj_order_id: cj.orderId,
    cj_status: cj.orderStatus ?? null,
    cj_logistic_name: cj.logisticName ?? order.cj_logistic_name,
    cj_postage: num(cj.postage) ?? order.cj_postage,
    cj_order_amount: num(cj.amount) ?? order.cj_order_amount,
    sent_at: order.sent_at ?? new Date().toISOString(),
    last_error: null,
  })
  await store.addEvent(
    order.id,
    'sent',
    `Placed and paid at CJ (order ${cj.orderId}${cj.logisticName ? `, ${cj.logisticName}` : ''}${num(cj.amount) !== null ? `, total $${num(cj.amount)!.toFixed(2)}` : ''})`,
  )
  return updated
}

/** If CJ already has this order (an earlier try got through), finish it instead of ordering twice. */
async function adoptExisting(order: Order, detail: CjOrderDetail) {
  const store = getStore()
  if (detail.orderStatus && UNPAID_STATUSES.has(detail.orderStatus)) {
    await store.updateOrder(order.id, { cj_order_id: detail.orderId, cj_status: detail.orderStatus })
    try {
      await payOrder(detail.orderId)
    } catch (err) {
      throw new NeedsReviewError(
        `Order ${detail.orderId} is at CJ but unpaid, and paying it from the CJ wallet failed (${errMessage(err)}). Top up your CJ wallet, then press Retry.`,
      )
    }
    const after = await getOrderDetail(detail.orderId)
    return markSent(order, {
      orderId: detail.orderId,
      orderStatus: after?.orderStatus ?? 'PAID',
      logisticName: after?.logisticName ?? detail.logisticName,
      postage: after?.postageAmount,
      amount: after?.orderAmount,
    })
  }
  if (detail.orderStatus === 'CANCELLED') {
    throw new NeedsReviewError(`CJ shows order ${detail.orderId} as cancelled. Check it in CJ before resending.`)
  }
  return markSent(order, {
    orderId: detail.orderId,
    orderStatus: detail.orderStatus,
    logisticName: detail.logisticName,
    postage: detail.postageAmount,
    amount: detail.orderAmount,
  })
}

async function attempt(order: Order) {
  const store = getStore()
  const country = order.ship_country?.toUpperCase()
  if (!country || !order.ship_line1 || !order.ship_city || !order.ship_name) {
    throw new NeedsReviewError('The shipping address is incomplete. Get the full address from the customer and enter it in CJ by hand.')
  }

  // A retry, or a crash mid-send: CJ may already have it.
  const existing = order.cj_order_id
    ? await getOrderDetail(order.cj_order_id)
    : order.attempts > 1
      ? await getOrderDetail(order.order_number)
      : null
  if (existing) return adoptExisting(order, existing)

  const vid = await resolveVariantId()
  const quotes = await quoteShipping(country, order.ship_postal_code, vid, order.quantity)
  const choice = chooseShipping(quotes)
  if (!choice) throw new NeedsReviewError(`CJ has no shipping method to ${country} for this bottle. Refund the customer or ship it another way.`)

  const max = Number(process.env.CJ_MAX_SHIPPING_USD || 45)
  if (choice.logisticPrice > max) {
    throw new NeedsReviewError(
      `Shipping to ${country} costs $${choice.logisticPrice.toFixed(2)} (${choice.logisticName}), above your automatic limit of $${max}. Place it in CJ by hand, or raise CJ_MAX_SHIPPING_USD and press Retry.`,
    )
  }
  await store.addEvent(order.id, 'quote', `Shipping by ${choice.logisticName}: $${choice.logisticPrice.toFixed(2)}`, { quotes })

  let res
  try {
    res = await createAndPayOrder({
      orderNumber: order.order_number,
      countryCode: country,
      province: order.ship_state || order.ship_city,
      city: order.ship_city,
      zip: order.ship_postal_code,
      address: order.ship_line1,
      address2: order.ship_line2,
      name: order.ship_name,
      phone: order.customer_phone,
      email: order.customer_email,
      logisticName: choice.logisticName,
      vid,
      quantity: order.quantity,
      shopAmount: order.amount_total / 100,
    })
  } catch (err) {
    if (err instanceof CjError && /balance|insufficient|余额/i.test(err.message)) {
      throw new NeedsReviewError(`CJ couldn't take payment from your wallet (${err.message}). Top up your CJ wallet, then press Retry.`)
    }
    throw err
  }
  if (!res?.orderId) throw new CjError('CJ accepted the request but returned no order id')

  if (res.orderStatus && UNPAID_STATUSES.has(res.orderStatus)) {
    await store.updateOrder(order.id, { cj_order_id: res.orderId, cj_status: res.orderStatus, cj_logistic_name: choice.logisticName })
    throw new NeedsReviewError(
      `Placed at CJ as ${res.orderId} but not paid (status ${res.orderStatus}). Usually this means the CJ wallet is low. Top it up, then press Retry.`,
    )
  }
  return markSent(order, {
    orderId: res.orderId,
    orderStatus: res.orderStatus,
    logisticName: choice.logisticName,
    postage: res.postageAmount ?? choice.logisticPrice,
    amount: res.orderAmount,
  })
}

/** Sends a paid order to CJ and pays for it. Safe to call repeatedly: it only ever places one CJ order. */
export async function forwardOrder(orderId: string): Promise<{ status: string; error?: string }> {
  const store = getStore()
  for (let i = 0; i < INLINE_TRIES; i++) {
    const order = await store.claimForSending(orderId, STALE_MINUTES)
    if (!order) {
      const current = await store.getOrder(orderId)
      return { status: current?.status ?? 'missing' }
    }
    try {
      const sent = await attempt(order)
      return { status: sent.status }
    } catch (err) {
      const message = errMessage(err)
      if (err instanceof NeedsReviewError) {
        await needsReview(order, message)
        return { status: 'needs_review', error: message }
      }
      if (order.attempts >= MAX_ATTEMPTS) {
        await needsReview(order, `Gave up after ${order.attempts} tries. Last error: ${message}`)
        return { status: 'needs_review', error: message }
      }
      await store.updateOrder(order.id, { status: 'failed', last_error: message })
      await store.addEvent(order.id, 'failed', `Try ${order.attempts} failed: ${message}`)
      if (i === INLINE_TRIES - 1) {
        await sendAdminAlert(`order ${order.order_number} hasn't reached CJ yet`, [
          `Sending to CJ failed ${order.attempts} times. Last error: ${message}`,
          'It will be retried automatically each day. You can also press Retry on the orders page.',
        ]).catch(() => {})
        return { status: 'failed', error: message }
      }
      await new Promise((r) => setTimeout(r, 2000 * (i + 1)))
    }
  }
  return { status: 'failed' }
}

// ---------- the daily check ----------

export type SyncSummary = { sent: number; failed: number; review: number; shipped: number; delivered: number; errors: string[]; balance?: number }

export async function syncAll(): Promise<SyncSummary> {
  const store = getStore()
  const summary: SyncSummary = { sent: 0, failed: 0, review: 0, shipped: 0, delivered: 0, errors: [] }

  // 1. Anything paid but not yet at CJ.
  for (const o of (await store.ordersToSend(STALE_MINUTES)).slice(0, 20)) {
    try {
      const r = await forwardOrder(o.id)
      if (r.status === 'sent') summary.sent++
      else if (r.status === 'needs_review') summary.review++
      else if (r.status === 'failed') summary.failed++
    } catch (err) {
      summary.errors.push(`${o.order_number}: ${errMessage(err)}`)
    }
  }

  // 2. Tracking numbers and delivery.
  if (process.env.CJ_API_KEY) {
    for (const o of await store.ordersToTrack()) {
      try {
        const d = await getOrderDetail(o.cj_order_id!)
        if (!d) continue
        let order = o
        const patch: Partial<Order> = {}
        if (d.orderStatus && d.orderStatus !== o.cj_status) patch.cj_status = d.orderStatus
        if (d.logisticName && d.logisticName !== o.cj_logistic_name) patch.cj_logistic_name = d.logisticName
        if (d.trackNumber && d.trackNumber !== o.tracking_number) {
          patch.tracking_number = d.trackNumber
          patch.tracking_carrier = d.trackingProvider || d.logisticName || null
          if (o.status === 'sent') {
            patch.status = 'shipped'
            patch.shipped_at = new Date().toISOString()
            summary.shipped++
          }
        }
        if (d.orderStatus === 'DELIVERED' && o.status !== 'delivered') {
          patch.status = 'delivered'
          patch.delivered_at = new Date().toISOString()
          summary.delivered++
        }
        if (Object.keys(patch).length) {
          order = await store.updateOrder(o.id, patch)
          if (patch.tracking_number) await store.addEvent(o.id, 'shipped', `Tracking number ${patch.tracking_number}`)
          if (patch.status === 'delivered') await store.addEvent(o.id, 'delivered', 'CJ marked it delivered')
        }
        if (d.orderStatus === 'CANCELLED') {
          await needsReview(order, 'CJ cancelled this order. Check why in CJ, then resend it or refund the customer.')
          summary.review++
          continue
        }
        await sendShippingOnce(order)

        // No tracking ten days after sending: worth a look.
        const sentAt = order.sent_at ? Date.parse(order.sent_at) : NaN
        if (order.status === 'sent' && !order.alerted_at && sentAt < Date.now() - 10 * 86_400_000) {
          await store.updateOrder(o.id, { alerted_at: new Date().toISOString() })
          await sendAdminAlert(`order ${order.order_number} has no tracking yet`, [
            `It was placed at CJ (${order.cj_order_id}) over ten days ago and still has no tracking number.`,
            'Ask your CJ agent what is holding it up.',
          ]).catch(() => {})
        }
      } catch (err) {
        summary.errors.push(`${o.order_number}: ${errMessage(err)}`)
      }
    }

    // 3. Wallet.
    try {
      summary.balance = await getBalance()
      const low = Number(process.env.CJ_LOW_BALANCE_USD || 150)
      if (summary.balance < low) {
        await sendAdminAlert('your CJ wallet is running low', [
          `Balance: ${formatUsd(Math.round(summary.balance * 100))}. Orders can't be paid automatically once it runs out.`,
          'Top it up in CJ under Wallet.',
        ]).catch(() => {})
      }
    } catch (err) {
      summary.errors.push(`Balance check: ${errMessage(err)}`)
    }
  }

  return summary
}
