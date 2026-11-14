# Oxyra: going live

The site takes payment with Stripe, saves every order to a Supabase database, places and pays for it at
CJ Dropshipping from your CJ wallet, then emails the customer their tracking number. You only step in when
an order shows **Needs you** on `/admin`.

## How an order flows

1. Customer pays on Stripe Checkout.
2. Stripe calls `/api/stripe/webhook`. The order is saved straight away and the customer gets a confirmation email.
3. The order is sent to CJ: the cheapest allowed shipping method is chosen (CJPacket Sensitive when available),
   and the order is paid from your CJ wallet in the same step.
4. Once a day (`/api/cron/sync`, 8am Brisbane) the site checks CJ for tracking numbers, emails customers when their
   order ships, retries anything that failed, and warns you if the CJ wallet is low.
5. `/admin` lists every order. **Check CJ now** runs the daily check on demand.

An order is held for you instead of being sent automatically when:
- shipping costs more than `CJ_MAX_SHIPPING_USD` (default $45),
- CJ has no shipping method to that country,
- the address is incomplete,
- the CJ wallet can't pay,
- CJ fails five times in a row.

You get an email each time. Fix the cause, then press **Retry** on `/admin`.

## Setup

### 1. Database (Supabase)
- Create a free project, then run `supabase/migrations/20261114_orders.sql` in the SQL editor
  (or ask Claude to apply it).
- From Project settings → API keys, copy the project URL and a **secret** key.

### 2. Stripe
- Developers → Webhooks → Add endpoint: `https://YOUR-DOMAIN/api/stripe/webhook`
- Events: `checkout.session.completed` and `checkout.session.async_payment_succeeded`
- Copy the endpoint's signing secret (`whsec_...`).
- Use test keys until a full test order has gone through.

### 3. CJ Dropshipping
- My CJ → Authorization → API: generate an API key.
- Top up the CJ wallet: orders are paid from it automatically.
- Keep `CJ_SANDBOX=1` for your first tests (CJ treats them as sandbox orders with no real charge),
  then remove it.

### 4. Email (Resend)
- Create an account at resend.com, add and verify your domain, and create an API key.
- `EMAIL_FROM` must use that domain, for example `Oxyra <orders@oxyra.org>`.

### 5. Vercel environment variables
Add everything in `.env.local.example` under Settings → Environment Variables (Production and Preview), then redeploy.
`/admin` shows a yellow banner listing anything still missing.

## Testing before real orders

1. Stripe test mode, `CJ_SANDBOX=1`.
2. Buy one bottle on the preview site with card `4242 4242 4242 4242`, any future date, any CVC.
3. On `/admin` the order should move to **At CJ, waiting for tracking** within a minute, and the confirmation email
   should arrive.
4. Switch to live Stripe keys and a live webhook secret, remove `CJ_SANDBOX`, and place one real order to yourself.
