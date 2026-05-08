import { NextRequest, NextResponse } from 'next/server'

// We use Vercel KV (Redis) for storage - it's built into Vercel
// Events are stored as JSON in simple key-value pairs

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'oxyra-admin-2026'

function getKV() {
  // Use fetch to call Vercel KV REST API
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  return { url, token }
}

async function kvSet(key: string, value: string) {
  const { url, token } = getKV()
  if (!url || !token) return null
  const res = await fetch(`${url}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.ok
}

async function kvGet(key: string) {
  const { url, token } = getKV()
  if (!url || !token) return null
  const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.result
}

async function kvIncr(key: string) {
  const { url, token } = getKV()
  if (!url || !token) return null
  const res = await fetch(`${url}/incr/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.result
}

async function kvLpush(key: string, value: string) {
  const { url, token } = getKV()
  if (!url || !token) return null
  const res = await fetch(`${url}/lpush/${encodeURIComponent(key)}/${encodeURIComponent(value)}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.ok
}

async function kvLrange(key: string, start: number, end: number) {
  const { url, token } = getKV()
  if (!url || !token) return []
  const res = await fetch(`${url}/lrange/${encodeURIComponent(key)}/${start}/${end}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.result || []
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event, page, bundle, ref, ua } = body

    const now = new Date()
    const dateKey = now.toISOString().split('T')[0] // YYYY-MM-DD
    const hour = now.getHours()
    const timestamp = now.toISOString()

    // Track based on event type
    switch (event) {
      case 'pageview':
        await kvIncr(`stats:pageviews:total`)
        await kvIncr(`stats:pageviews:${dateKey}`)
        await kvIncr(`stats:pages:${page || 'home'}`)
        // Store recent visit
        await kvLpush('events:recent', JSON.stringify({ event, page, timestamp, ua: ua?.slice(0, 100) }))
        // Hourly traffic
        await kvIncr(`stats:hourly:${dateKey}:${hour}`)
        break

      case 'bundle_select':
        await kvIncr(`stats:bundle_select:${bundle}`)
        await kvIncr(`stats:bundle_select:total`)
        break

      case 'checkout_start':
        await kvIncr(`stats:checkout_start:total`)
        await kvIncr(`stats:checkout_start:${dateKey}`)
        await kvIncr(`stats:checkout_bundle:${bundle}`)
        await kvLpush('events:checkouts', JSON.stringify({ bundle, timestamp }))
        break

      case 'checkout_complete':
        await kvIncr(`stats:conversions:total`)
        await kvIncr(`stats:conversions:${dateKey}`)
        const amount = bundle === '1' ? 5999 : bundle === '2' ? 9999 : 13499
        // Store revenue
        const currentRevRaw = await kvGet(`stats:revenue:total`)
        const currentRev = parseInt(currentRevRaw || '0')
        await kvSet(`stats:revenue:total`, String(currentRev + amount))
        const currentDayRevRaw = await kvGet(`stats:revenue:${dateKey}`)
        const currentDayRev = parseInt(currentDayRevRaw || '0')
        await kvSet(`stats:revenue:${dateKey}`, String(currentDayRev + amount))
        await kvLpush('events:sales', JSON.stringify({ bundle, amount, timestamp }))
        break

      case 'scroll_depth':
        await kvIncr(`stats:scroll:${body.depth}`)
        break
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  // Protect with secret
  const auth = req.headers.get('x-admin-secret')
  if (auth !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Gather all stats
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    const [
      totalPageviews, todayPageviews, yesterdayPageviews,
      totalCheckouts, todayCheckouts,
      totalConversions, todayConversions,
      totalRevenue, todayRevenue,
      bundleSelect1, bundleSelect2, bundleSelect3,
      checkoutBundle1, checkoutBundle2, checkoutBundle3,
      recentEvents, recentSales, recentCheckouts,
      pageHome, pageProduct, pageWhy, pageScience, pageReviews, pageFaqs,
    ] = await Promise.all([
      kvGet('stats:pageviews:total'),
      kvGet(`stats:pageviews:${today}`),
      kvGet(`stats:pageviews:${yesterday}`),
      kvGet('stats:checkout_start:total'),
      kvGet(`stats:checkout_start:${today}`),
      kvGet('stats:conversions:total'),
      kvGet(`stats:conversions:${today}`),
      kvGet('stats:revenue:total'),
      kvGet(`stats:revenue:${today}`),
      kvGet('stats:bundle_select:1'),
      kvGet('stats:bundle_select:2'),
      kvGet('stats:bundle_select:3'),
      kvGet('stats:checkout_bundle:1'),
      kvGet('stats:checkout_bundle:2'),
      kvGet('stats:checkout_bundle:3'),
      kvLrange('events:recent', 0, 49),
      kvLrange('events:sales', 0, 19),
      kvLrange('events:checkouts', 0, 19),
      kvGet('stats:pages:home'),
      kvGet('stats:pages:product'),
      kvGet('stats:pages:/why'),
      kvGet('stats:pages:/science'),
      kvGet('stats:pages:/reviews'),
      kvGet('stats:pages:/faqs'),
    ])

    // Get last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() - i * 86400000)
      return d.toISOString().split('T')[0]
    }).reverse()

    const dailyData = await Promise.all(
      last7Days.map(async (date) => {
        const [views, conversions, revenue] = await Promise.all([
          kvGet(`stats:pageviews:${date}`),
          kvGet(`stats:conversions:${date}`),
          kvGet(`stats:revenue:${date}`),
        ])
        return { date, views: parseInt(views || '0'), conversions: parseInt(conversions || '0'), revenue: parseInt(revenue || '0') }
      })
    )

    const tv = parseInt(totalPageviews || '0')
    const tc = parseInt(totalConversions || '0')
    const tch = parseInt(totalCheckouts || '0')
    const tr = parseInt(totalRevenue || '0')

    return NextResponse.json({
      summary: {
        totalPageviews: tv,
        todayPageviews: parseInt(todayPageviews || '0'),
        yesterdayPageviews: parseInt(yesterdayPageviews || '0'),
        totalCheckouts: tch,
        todayCheckouts: parseInt(todayCheckouts || '0'),
        totalConversions: tc,
        todayConversions: parseInt(todayConversions || '0'),
        totalRevenue: tr,
        todayRevenue: parseInt(todayRevenue || '0'),
        conversionRate: tv > 0 ? ((tc / tv) * 100).toFixed(1) : '0.0',
        checkoutConversionRate: tch > 0 ? ((tc / tch) * 100).toFixed(1) : '0.0',
        avgOrderValue: tc > 0 ? Math.round(tr / tc) : 0,
      },
      bundles: {
        selected: { '1': parseInt(bundleSelect1 || '0'), '2': parseInt(bundleSelect2 || '0'), '3': parseInt(bundleSelect3 || '0') },
        purchased: { '1': parseInt(checkoutBundle1 || '0'), '2': parseInt(checkoutBundle2 || '0'), '3': parseInt(checkoutBundle3 || '0') },
      },
      pages: {
        home: parseInt(pageHome || '0'),
        product: parseInt(pageProduct || '0'),
        why: parseInt(pageWhy || '0'),
        science: parseInt(pageScience || '0'),
        reviews: parseInt(pageReviews || '0'),
        faqs: parseInt(pageFaqs || '0'),
      },
      dailyData,
      recentEvents: recentEvents.slice(0, 20).map((e: string) => { try { return JSON.parse(e) } catch { return {} } }),
      recentSales: recentSales.map((e: string) => { try { return JSON.parse(e) } catch { return {} } }),
      recentCheckouts: recentCheckouts.map((e: string) => { try { return JSON.parse(e) } catch { return {} } }),
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
