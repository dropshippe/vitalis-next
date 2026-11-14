import { getStore } from './orders/store'

// CJ Dropshipping API v2. Docs: https://developers.cjdropshipping.com/en/api/introduction.html
// CJ allows about one request per second, so every call goes through a small queue.

const BASE = (process.env.CJ_API_BASE || 'https://developers.cjdropshipping.com/api2.0/v1').replace(/\/$/, '')

export class CjError extends Error {
  constructor(
    message: string,
    public code?: number,
  ) {
    super(message)
  }
}

/** A problem a person has to fix (no money in the wallet, product not found, no shipping route). */
export class NeedsReviewError extends Error {}

type CjResponse<T> = { code: number; result?: boolean; message?: string; data: T; success?: boolean }

type Token = { accessToken: string; expiresAt: number }

let lastCall = 0
let chain: Promise<unknown> = Promise.resolve()

function throttle<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(async () => {
    const wait = lastCall + 1100 - Date.now()
    if (wait > 0) await new Promise((r) => setTimeout(r, wait))
    lastCall = Date.now()
    return fn()
  })
  chain = run.catch(() => {})
  return run
}

async function raw<T>(method: 'GET' | 'POST', path: string, body?: unknown, token?: string): Promise<CjResponse<T>> {
  return throttle(async () => {
    const res = await fetch(`${BASE}/${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'CJ-Access-Token': token } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(25_000),
      cache: 'no-store',
    })
    const text = await res.text()
    let json: CjResponse<T>
    try {
      json = JSON.parse(text)
    } catch {
      throw new CjError(`CJ returned HTTP ${res.status} with an unreadable body`)
    }
    return json
  })
}

async function getToken(force = false): Promise<string> {
  const apiKey = process.env.CJ_API_KEY?.trim()
  if (!apiKey) throw new NeedsReviewError('CJ_API_KEY is not set in Vercel, so orders cannot be sent to CJ.')
  const store = getStore()
  const cached = force ? null : await store.getSetting<Token>('cj_token')
  // Refresh two days before expiry.
  if (cached && cached.expiresAt - Date.now() > 2 * 86_400_000) return cached.accessToken

  const res = await raw<{ accessToken: string; accessTokenExpiryDate?: string }>('POST', 'authentication/getAccessToken', {
    apiKey,
  })
  if (res.code !== 200 || !res.data?.accessToken) {
    throw new NeedsReviewError(`CJ rejected the API key: ${res.message || `code ${res.code}`}. Check CJ_API_KEY.`)
  }
  const parsed = Date.parse(res.data.accessTokenExpiryDate || '')
  const token: Token = {
    accessToken: res.data.accessToken,
    expiresAt: Number.isFinite(parsed) ? parsed : Date.now() + 14 * 86_400_000,
  }
  await store.setSetting('cj_token', token)
  return token.accessToken
}

async function call<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> {
  let token = await getToken()
  let res = await raw<T>(method, path, body, token)
  // Expired or revoked token: get a fresh one and try once more.
  if (res.code === 1600001 || res.code === 1600002 || res.code === 401) {
    token = await getToken(true)
    res = await raw<T>(method, path, body, token)
  }
  if (res.code !== 200) throw new CjError(res.message || `CJ error ${res.code}`, res.code)
  return res.data
}

// ---------- products and shipping ----------

type Variant = { vid: string; variantSku: string; variantNameEn?: string; variantSellPrice?: number }

/** Finds CJ's variant id for our SKU, and remembers it. */
export async function resolveVariantId(): Promise<string> {
  const fixed = process.env.CJ_VARIANT_ID?.trim()
  if (fixed) return fixed
  const sku = (process.env.CJ_VARIANT_SKU || 'CJJJCFHS00663-Silver Upgraded').trim()
  const store = getStore()
  const cacheKey = `cj_vid:${sku}`
  const cached = await store.getSetting<string>(cacheKey)
  if (cached) return cached

  const data = await call<{ variants?: Variant[] }>('GET', `product/query?variantSku=${encodeURIComponent(sku)}`)
  const norm = (s: string) => s.trim().toLowerCase()
  const match = data?.variants?.find((v) => norm(v.variantSku) === norm(sku))
  if (!match) {
    throw new NeedsReviewError(
      `CJ has no variant with SKU "${sku}". Check CJ_VARIANT_SKU (copy it from the CJ product page), or set CJ_VARIANT_ID.`,
    )
  }
  await store.setSetting(cacheKey, match.vid)
  return match.vid
}

export type ShippingQuote = { logisticName: string; logisticPrice: number; logisticAging?: string }

export async function quoteShipping(country: string, zip: string | null, vid: string, quantity: number) {
  const data = await call<ShippingQuote[]>('POST', 'logistic/freightCalculate', {
    startCountryCode: 'CN',
    endCountryCode: country,
    ...(zip ? { zip } : {}),
    products: [{ vid, quantity }],
  })
  return (data || []).map((q) => ({ ...q, logisticPrice: Number(q.logisticPrice) }))
}

/** Prefers the methods listed in CJ_PREFERRED_SHIPPING (in order), otherwise the cheapest. */
export function chooseShipping(quotes: ShippingQuote[]): ShippingQuote | null {
  const usable = quotes.filter((q) => q.logisticName && Number.isFinite(q.logisticPrice))
  if (usable.length === 0) return null
  const preferred = (process.env.CJ_PREFERRED_SHIPPING || 'CJPacket Sensitive')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  for (const name of preferred) {
    const hit = usable.find((q) => q.logisticName.trim().toLowerCase() === name)
    if (hit) return hit
  }
  return usable.slice().sort((a, b) => a.logisticPrice - b.logisticPrice)[0]
}

// ---------- orders ----------

export type CjOrderInput = {
  orderNumber: string
  countryCode: string
  province: string
  city: string
  zip: string | null
  address: string
  address2: string | null
  name: string
  phone: string | null
  email: string | null
  logisticName: string
  vid: string
  quantity: number
  shopAmount: number
}

export type CjOrderResult = {
  orderId: string
  orderNumber?: string
  orderStatus?: string
  postageAmount?: string | number
  productAmount?: string | number
  orderAmount?: string | number
}

const cut = (s: string | null | undefined, n: number) => (s ? s.slice(0, n) : s ?? undefined)

function countryName(code: string) {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code
  } catch {
    return code
  }
}

/** Creates the order at CJ and pays it from the CJ wallet in the same step. */
export async function createAndPayOrder(o: CjOrderInput): Promise<CjOrderResult> {
  const sandbox = process.env.CJ_SANDBOX === '1'
  return call<CjOrderResult>('POST', 'shopping/order/createOrderV2', {
    orderNumber: o.orderNumber,
    shippingCountryCode: o.countryCode,
    shippingCountry: cut(countryName(o.countryCode), 50),
    shippingProvince: cut(o.province, 50),
    shippingCity: cut(o.city, 50),
    shippingZip: cut(o.zip, 20),
    shippingAddress: cut(o.address, 500),
    shippingAddress2: cut(o.address2, 500),
    shippingCustomerName: cut(o.name, 50),
    shippingPhone: cut(o.phone, 20),
    email: cut(o.email, 50),
    logisticName: o.logisticName,
    fromCountryCode: 'CN',
    payType: 2,
    isSandbox: sandbox ? 1 : 0,
    shopAmount: o.shopAmount,
    remark: '',
    products: [{ vid: o.vid, quantity: o.quantity }],
  })
}

export type CjOrderDetail = {
  orderId: string
  orderNum?: string
  orderStatus?: string
  logisticName?: string
  trackNumber?: string | null
  trackingProvider?: string | null
  postageAmount?: string | number
  orderAmount?: string | number
}

/** Looks an order up by CJ's id or by our own order number. Returns null if CJ doesn't have it. */
export async function getOrderDetail(id: string): Promise<CjOrderDetail | null> {
  try {
    const data = await call<CjOrderDetail | null>('GET', `shopping/order/getOrderDetail?orderId=${encodeURIComponent(id)}`)
    return data && data.orderId ? data : null
  } catch (err) {
    if (err instanceof CjError) return null
    throw err
  }
}

export async function payOrder(orderId: string) {
  await call<null>('POST', 'shopping/pay/payBalance', { orderId })
}

export async function getBalance(): Promise<number> {
  const data = await call<{ amount: number | string }>('GET', 'shopping/pay/getBalance')
  return Number(data?.amount ?? 0)
}

/** CJ statuses that mean the order exists but hasn't been paid for yet. */
export const UNPAID_STATUSES = new Set(['CREATED', 'IN_CART', 'UNPAID'])
