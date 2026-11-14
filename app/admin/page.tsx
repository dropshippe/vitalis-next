import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/adminAuth'
import { getStore } from '@/lib/orders/store'
import type { Order, OrderEvent } from '@/lib/orders/types'
import { getBalance } from '@/lib/cj'
import { formatUsd } from '@/lib/catalog'
import { trackingUrl } from '@/lib/email'
import { cancelOrder, logout, markShipped, retryOrder, syncNow } from './actions'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Orders — Oxyra', robots: { index: false, follow: false } }

const LABEL: Record<Order['status'], string> = {
  paid: 'Paid, queued for CJ',
  sending: 'Sending to CJ',
  sent: 'At CJ, waiting for tracking',
  shipped: 'Shipped',
  delivered: 'Delivered',
  failed: 'Failed, will retry',
  needs_review: 'Needs you',
  cancelled: 'Cancelled',
}

const when = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString('en-AU', {
        timeZone: process.env.ADMIN_TIMEZONE || 'Australia/Brisbane',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
      })
    : ''

const CONFIG: [string, string][] = [
  ['SUPABASE_URL', 'Order database'],
  ['SUPABASE_SECRET_KEY', 'Order database key'],
  ['STRIPE_SECRET_KEY', 'Stripe checkout'],
  ['STRIPE_WEBHOOK_SECRET', 'Stripe payment confirmations'],
  ['CJ_API_KEY', 'CJ ordering'],
  ['RESEND_API_KEY', 'Customer emails'],
  ['EMAIL_FROM', 'Email sender address'],
  ['ADMIN_EMAIL', 'Alerts to you'],
  ['CRON_SECRET', 'Daily tracking check'],
]

export default async function AdminPage() {
  if (!(await isAdmin())) redirect('/admin/login')

  const store = getStore()
  const orders = await store.listOrders(200)
  const events = new Map<string, OrderEvent[]>()
  await Promise.all(orders.slice(0, 60).map(async (o) => events.set(o.id, await store.listEvents(o.id, 12))))

  let balance: string
  try {
    balance = process.env.CJ_API_KEY ? formatUsd(Math.round((await getBalance()) * 100)) : 'CJ not connected'
  } catch (err) {
    balance = `Couldn’t check (${err instanceof Error ? err.message : 'error'})`
  }

  const missing = CONFIG.filter(([k]) => !process.env[k])
  const attention = orders.filter((o) => o.status === 'needs_review' || o.status === 'failed')
  const revenue = orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.amount_total, 0)
  const cjCost = orders.reduce((s, o) => s + (o.cj_order_amount ?? 0), 0)

  return (
    <main className="admin">
      <header className="admin-top">
        <h1>Orders</h1>
        <div className="admin-top-actions">
          <a href="/admin/analytics">Traffic</a>
          <form action={syncNow}>
            <button className="btn btn-dark">Check CJ now</button>
          </form>
          <form action={logout}>
            <button className="admin-link">Sign out</button>
          </form>
        </div>
      </header>

      {missing.length > 0 && (
        <section className="admin-warn">
          <strong>Not set up yet:</strong> {missing.map(([k, label]) => `${label} (${k})`).join(', ')}. Add these in Vercel →
          Settings → Environment Variables, then redeploy.
        </section>
      )}

      <dl className="admin-stats">
        <div>
          <dt>Needs you</dt>
          <dd className={attention.length ? 'hot' : ''}>{attention.length}</dd>
        </div>
        <div>
          <dt>Orders</dt>
          <dd>{orders.length}</dd>
        </div>
        <div>
          <dt>Taken</dt>
          <dd>{formatUsd(revenue)}</dd>
        </div>
        <div>
          <dt>Paid to CJ</dt>
          <dd>{formatUsd(Math.round(cjCost * 100))}</dd>
        </div>
        <div>
          <dt>CJ wallet</dt>
          <dd>{balance}</dd>
        </div>
      </dl>

      {orders.length === 0 ? (
        <p className="admin-empty">No orders yet. They appear here the moment Stripe confirms a payment.</p>
      ) : (
        <ul className="admin-orders">
          {orders.map((o) => (
            <li key={o.id} className={`admin-order status-${o.status}`}>
              <details open={o.status === 'needs_review' || o.status === 'failed'}>
                <summary>
                  <span className="o-num">{o.order_number}</span>
                  <span className="o-when">{when(o.created_at)}</span>
                  <span className="o-who">
                    {o.customer_name || 'No name'} · {o.ship_country || '??'}
                  </span>
                  <span className="o-qty">
                    {o.quantity} {o.quantity === 1 ? 'bottle' : 'bottles'}, {formatUsd(o.amount_total)}
                  </span>
                  <span className="o-status">{LABEL[o.status]}</span>
                </summary>

                <div className="o-body">
                  {o.last_error && <p className="o-error">{o.last_error}</p>}
                  <dl className="o-facts">
                    <div>
                      <dt>Customer</dt>
                      <dd>
                        {o.customer_name}
                        <br />
                        {o.customer_email}
                        {o.customer_phone ? (
                          <>
                            <br />
                            {o.customer_phone}
                          </>
                        ) : null}
                      </dd>
                    </div>
                    <div>
                      <dt>Ship to</dt>
                      <dd>
                        {[o.ship_name, o.ship_line1, o.ship_line2, [o.ship_city, o.ship_state, o.ship_postal_code].filter(Boolean).join(' '), o.ship_country]
                          .filter(Boolean)
                          .map((l, i) => (
                            <span key={i}>
                              {l}
                              <br />
                            </span>
                          ))}
                      </dd>
                    </div>
                    <div>
                      <dt>CJ</dt>
                      <dd>
                        {o.cj_order_id ? `Order ${o.cj_order_id}` : 'Not placed yet'}
                        {o.cj_status ? ` · ${o.cj_status}` : ''}
                        {o.cj_logistic_name ? (
                          <>
                            <br />
                            {o.cj_logistic_name}
                          </>
                        ) : null}
                        {o.cj_order_amount !== null ? (
                          <>
                            <br />
                            Cost {formatUsd(Math.round(Number(o.cj_order_amount) * 100))}
                          </>
                        ) : null}
                      </dd>
                    </div>
                    <div>
                      <dt>Tracking</dt>
                      <dd>
                        {o.tracking_number ? (
                          <a href={trackingUrl(o.tracking_number)} target="_blank" rel="noopener noreferrer">
                            {o.tracking_number}
                          </a>
                        ) : (
                          'None yet'
                        )}
                        <br />
                        Confirmation email {o.confirmation_email_at ? 'sent' : 'not sent'}
                        <br />
                        Shipping email {o.shipping_email_at ? 'sent' : 'not sent'}
                      </dd>
                    </div>
                  </dl>

                  <div className="o-actions">
                    {(o.status === 'failed' || o.status === 'needs_review') && (
                      <form action={retryOrder}>
                        <input type="hidden" name="id" value={o.id} />
                        <button className="btn btn-dark">Retry sending to CJ</button>
                      </form>
                    )}
                    {o.status !== 'shipped' && o.status !== 'delivered' && o.status !== 'cancelled' && (
                      <form action={markShipped} className="o-track">
                        <input type="hidden" name="id" value={o.id} />
                        <input name="tracking" placeholder="Tracking number" aria-label="Tracking number" />
                        <button className="admin-link">Mark shipped and email customer</button>
                      </form>
                    )}
                    {o.status !== 'cancelled' && o.status !== 'shipped' && o.status !== 'delivered' && (
                      <form action={cancelOrder}>
                        <input type="hidden" name="id" value={o.id} />
                        <button className="admin-link">Cancel</button>
                      </form>
                    )}
                  </div>

                  {(events.get(o.id) ?? []).length > 0 && (
                    <ol className="o-events">
                      {(events.get(o.id) ?? []).map((e) => (
                        <li key={e.id}>
                          <time>{when(e.created_at)}</time> {e.message}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
