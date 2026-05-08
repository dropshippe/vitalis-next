'use client'
import { useState, useEffect, useCallback } from 'react'

const ADMIN_SECRET = 'oxyra-admin-2026'

const D = { fontFamily: "'Cormorant Garamond', serif" } as React.CSSProperties
const B = { fontFamily: "'DM Sans', sans-serif" } as React.CSSProperties

function fmt(n: number) { return n.toLocaleString() }
function fmtMoney(cents: number) { return `$${(cents / 100).toFixed(2)}` }
function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  } catch { return iso }
}
function shortDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
  } catch { return iso }
}

type Analytics = {
  summary: {
    totalPageviews: number
    todayPageviews: number
    yesterdayPageviews: number
    totalCheckouts: number
    todayCheckouts: number
    totalConversions: number
    todayConversions: number
    totalRevenue: number
    todayRevenue: number
    conversionRate: string
    checkoutConversionRate: string
    avgOrderValue: number
  }
  bundles: {
    selected: Record<string, number>
    purchased: Record<string, number>
  }
  pages: Record<string, number>
  dailyData: { date: string; views: number; conversions: number; revenue: number }[]
  recentEvents: { event: string; page: string; timestamp: string }[]
  recentSales: { bundle: string; amount: number; timestamp: string }[]
  recentCheckouts: { bundle: string; timestamp: string }[]
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/track', {
        headers: { 'x-admin-secret': ADMIN_SECRET }
      })
      if (res.ok) {
        const json = await res.json()
        setData(json)
        setLastRefresh(new Date())
      }
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => {
    if (authed) {
      fetchData()
      const interval = setInterval(fetchData, 30000) // refresh every 30s
      return () => clearInterval(interval)
    }
  }, [authed, fetchData])

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (password === ADMIN_SECRET) {
      setAuthed(true)
      setError('')
    } else {
      setError('Incorrect password')
    }
  }

  if (!authed) {
    return (
      <div style={{ ...B, minHeight: '100vh', background: '#030a0e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 360, padding: 40, background: '#0a1a10', border: '1px solid rgba(45,138,101,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
            <div style={{ width: 8, height: 8, background: '#2d8a65', borderRadius: '50%' }} />
            <span style={{ ...D, fontSize: 20, letterSpacing: 5, textTransform: 'uppercase', color: 'white', fontWeight: 300 }}>Oxyra</span>
            <span style={{ fontSize: 10, color: '#555', letterSpacing: 2, textTransform: 'uppercase', marginLeft: 4 }}>Admin</span>
          </div>
          <div style={{ fontSize: 14, color: '#aaa', marginBottom: 24 }}>Enter your admin password to access the dashboard.</div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 14, marginBottom: 12, outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans',sans-serif" }}
            />
            {error && <div style={{ fontSize: 12, color: '#e07060', marginBottom: 12 }}>{error}</div>}
            <button type="submit" style={{ width: '100%', padding: '13px', background: '#2d8a65', color: 'white', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', fontFamily: "'DM Sans',sans-serif" }}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  const s = data?.summary
  const tabs = ['overview', 'traffic', 'sales', 'live feed']

  const statCard = (label: string, value: string, sub?: string, color?: string) => (
    <div style={{ background: '#0a1a10', border: '1px solid rgba(45,138,101,0.15)', padding: '24px 28px' }}>
      <div style={{ fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase' as const, color: '#555', marginBottom: 10 }}>{label}</div>
      <div style={{ ...D, fontSize: 40, fontWeight: 300, color: color || 'white', lineHeight: 1, marginBottom: 6 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#555' }}>{sub}</div>}
    </div>
  )

  const maxViews = Math.max(...(data?.dailyData?.map(d => d.views) || [1]))
  const maxRev = Math.max(...(data?.dailyData?.map(d => d.revenue) || [1]))

  return (
    <div style={{ ...B, minHeight: '100vh', background: '#030a0e', color: 'white' }}>

      {/* Top bar */}
      <div style={{ background: '#0a1a10', borderBottom: '1px solid rgba(45,138,101,0.2)', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 7, height: 7, background: '#2d8a65', borderRadius: '50%' }} />
          <span style={{ ...D, fontSize: 16, letterSpacing: 5, textTransform: 'uppercase', color: 'white', fontWeight: 300 }}>Oxyra</span>
          <span style={{ fontSize: 10, color: '#2d8a65', letterSpacing: 2, textTransform: 'uppercase', marginLeft: 4, background: 'rgba(45,138,101,0.15)', padding: '3px 8px' }}>Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {lastRefresh && <span style={{ fontSize: 11, color: '#555' }}>Updated {lastRefresh.toLocaleTimeString()}</span>}
          <button onClick={fetchData} disabled={loading} style={{ background: 'rgba(45,138,101,0.15)', border: '1px solid rgba(45,138,101,0.3)', color: '#5cbf94', fontSize: 11, fontWeight: 600, letterSpacing: 1, padding: '6px 14px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
            {loading ? 'Refreshing...' : '↻ Refresh'}
          </button>
          <button onClick={() => setAuthed(false)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#666', fontSize: 11, padding: '6px 14px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Sign out</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 32px', display: 'flex', gap: 0 }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '14px 20px', background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid #2d8a65' : '2px solid transparent', color: activeTab === tab ? 'white' : '#555', fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", marginBottom: -1 }}>
            {tab}
          </button>
        ))}
      </div>

      <div style={{ padding: 32 }}>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            {/* Key metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
              {statCard('Total Revenue', s ? fmtMoney(s.totalRevenue) : '—', `Today: ${s ? fmtMoney(s.todayRevenue) : '—'}`, '#5cbf94')}
              {statCard('Total Orders', s ? fmt(s.totalConversions) : '—', `Today: ${s?.todayConversions || 0}`)}
              {statCard('Conversion Rate', s ? `${s.conversionRate}%` : '—', 'Visitors → Orders')}
              {statCard('Avg Order Value', s ? fmtMoney(s.avgOrderValue) : '—', 'Per conversion')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
              {statCard('Total Visits', s ? fmt(s.totalPageviews) : '—', `Today: ${s?.todayPageviews || 0}`)}
              {statCard('Checkout Starts', s ? fmt(s.totalCheckouts) : '—', `Today: ${s?.todayCheckouts || 0}`)}
              {statCard('Checkout Conv.', s ? `${s.checkoutConversionRate}%` : '—', 'Started → Completed')}
              {statCard('Drop-off Rate', s ? `${(100 - parseFloat(s.checkoutConversionRate)).toFixed(1)}%` : '—', 'Left checkout')}
            </div>

            {/* 7-day chart */}
            <div style={{ background: '#0a1a10', border: '1px solid rgba(45,138,101,0.15)', padding: 28, marginBottom: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase' as const, color: '#555', marginBottom: 20 }}>Last 7 Days — Traffic & Revenue</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 160 }}>
                {data?.dailyData?.map(d => (
                  <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: 9, color: '#5cbf94' }}>{d.revenue > 0 ? fmtMoney(d.revenue) : ''}</div>
                    <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: 120 }}>
                      <div style={{ flex: 1, background: 'rgba(45,138,101,0.6)', height: `${Math.max(4, (d.views / maxViews) * 100)}%`, minHeight: 4 }} title={`${d.views} views`} />
                      <div style={{ flex: 1, background: '#5cbf94', height: `${Math.max(d.revenue > 0 ? 4 : 0, (d.revenue / Math.max(maxRev, 1)) * 100)}%` }} title={fmtMoney(d.revenue)} />
                    </div>
                    <div style={{ fontSize: 9, color: '#444', textAlign: 'center' as const }}>{shortDate(d.date)}</div>
                    <div style={{ fontSize: 9, color: '#666' }}>{d.views}v</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
                <span style={{ fontSize: 10, color: '#555', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, background: 'rgba(45,138,101,0.6)', display: 'inline-block' }} />Visits</span>
                <span style={{ fontSize: 10, color: '#555', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, background: '#5cbf94', display: 'inline-block' }} />Revenue</span>
              </div>
            </div>

            {/* Bundle performance */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: '#0a1a10', border: '1px solid rgba(45,138,101,0.15)', padding: 28 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase' as const, color: '#555', marginBottom: 20 }}>Bundle Selection</div>
                {[['×1 Essential $59.99', '1'], ['×2 Partner $99.99', '2'], ['×3 Family $134.99', '3']].map(([label, key]) => {
                  const total = Object.values(data?.bundles?.selected || {}).reduce((a, b) => a + b, 0) || 1
                  const count = data?.bundles?.selected?.[key] || 0
                  const pct = Math.round((count / total) * 100)
                  return (
                    <div key={key} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                        <span style={{ color: '#aaa' }}>{label}</span>
                        <span style={{ color: 'white', fontWeight: 600 }}>{count} ({pct}%)</span>
                      </div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: key === '2' ? '#2d8a65' : 'rgba(45,138,101,0.4)', width: `${pct}%`, borderRadius: 3 }} />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div style={{ background: '#0a1a10', border: '1px solid rgba(45,138,101,0.15)', padding: 28 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase' as const, color: '#555', marginBottom: 20 }}>Bundle Purchases</div>
                {[['×1 Essential', '1', 5999], ['×2 Partner', '2', 9999], ['×3 Family', '3', 13499]].map(([label, key, price]) => {
                  const count = data?.bundles?.purchased?.[key as string] || 0
                  const rev = count * (price as number)
                  return (
                    <div key={key} style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize: 12, color: '#aaa' }}>{label}</span>
                      <div style={{ textAlign: 'right' as const }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{count} orders</div>
                        <div style={{ fontSize: 11, color: '#5cbf94' }}>{fmtMoney(rev)}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* TRAFFIC TAB */}
        {activeTab === 'traffic' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
              {statCard('Total Pageviews', s ? fmt(s.totalPageviews) : '—', `Yesterday: ${s?.yesterdayPageviews || 0}`)}
              {statCard("Today's Views", s ? fmt(s.todayPageviews) : '—')}
              {statCard('Scroll 75%+', fmt(0), 'Deep engagement')}
            </div>
            <div style={{ background: '#0a1a10', border: '1px solid rgba(45,138,101,0.15)', padding: 28, marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase' as const, color: '#555', marginBottom: 20 }}>Page Performance</div>
              {Object.entries(data?.pages || {}).sort((a, b) => b[1] - a[1]).map(([page, views]) => {
                const totalViews = Object.values(data?.pages || {}).reduce((a, b) => a + b, 0) || 1
                const pct = Math.round((views / totalViews) * 100)
                return (
                  <div key={page} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                      <span style={{ color: '#aaa' }}>/{page === 'home' ? '' : page}</span>
                      <span style={{ color: 'white', fontWeight: 600 }}>{views} views ({pct}%)</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: 'rgba(45,138,101,0.5)', width: `${pct}%`, borderRadius: 3 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* SALES TAB */}
        {activeTab === 'sales' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
              {statCard('Total Revenue', s ? fmtMoney(s.totalRevenue) : '—', undefined, '#5cbf94')}
              {statCard('Total Orders', s ? fmt(s.totalConversions) : '—')}
              {statCard('Avg Order', s ? fmtMoney(s.avgOrderValue) : '—')}
            </div>
            <div style={{ background: '#0a1a10', border: '1px solid rgba(45,138,101,0.15)', padding: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase' as const, color: '#555', marginBottom: 20 }}>Recent Sales</div>
              {data?.recentSales?.length === 0 && <div style={{ fontSize: 13, color: '#555' }}>No sales yet — they will appear here once customers complete checkout.</div>}
              {data?.recentSales?.map((sale, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontSize: 13, color: 'white', fontWeight: 600, marginBottom: 3 }}>
                      {sale.bundle === '1' ? '×1 The Essential' : sale.bundle === '2' ? '×2 The Partner' : '×3 The Family'}
                    </div>
                    <div style={{ fontSize: 11, color: '#555' }}>{fmtDate(sale.timestamp)}</div>
                  </div>
                  <div style={{ fontSize: 18, color: '#5cbf94', fontWeight: 600 }}>{fmtMoney(sale.amount)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIVE FEED TAB */}
        {activeTab === 'live feed' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: 'uppercase' as const, color: '#555' }}>Real-time Activity</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, background: '#2d8a65', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                <span style={{ fontSize: 11, color: '#2d8a65' }}>Live</span>
              </div>
            </div>
            <div style={{ background: '#0a1a10', border: '1px solid rgba(45,138,101,0.15)', padding: 0, overflow: 'hidden' }}>
              {data?.recentEvents?.length === 0 && (
                <div style={{ padding: 28, fontSize: 13, color: '#555' }}>No events yet — they will appear here as visitors use the site.</div>
              )}
              {data?.recentEvents?.map((ev, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: i === 0 ? 'rgba(45,138,101,0.05)' : 'transparent' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: ev.event === 'pageview' ? '#2d8a65' : ev.event === 'checkout_start' ? '#f59e0b' : ev.event === 'checkout_complete' ? '#5cbf94' : '#444' }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 12, color: 'white', fontWeight: 600 }}>{ev.event}</span>
                    {ev.page && <span style={{ fontSize: 12, color: '#555', marginLeft: 8 }}>{ev.page}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: '#444' }}>{fmtDate(ev.timestamp)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  )
}
