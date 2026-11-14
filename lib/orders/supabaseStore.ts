import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { NewOrder, Order, OrderEvent, OrderPatch, OrderStore } from './types'

export function createSupabaseStore(url: string, secretKey: string): OrderStore {
  const db: SupabaseClient = createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const fail = (what: string, error: { message: string } | null) => {
    if (error) throw new Error(`Database ${what} failed: ${error.message}`)
  }

  const byId = async (id: string) => {
    const { data, error } = await db.from('orders').select('*').eq('id', id).maybeSingle()
    fail('read', error)
    return (data as Order | null) ?? null
  }

  return {
    async createOrder(input: NewOrder) {
      const { data, error } = await db
        .from('orders')
        .upsert(input, { onConflict: 'stripe_session_id', ignoreDuplicates: true })
        .select('*')
      fail('insert', error)
      if (data && data.length > 0) return { order: data[0] as Order, created: true }
      const existing = await db.from('orders').select('*').eq('stripe_session_id', input.stripe_session_id).single()
      fail('read', existing.error)
      return { order: existing.data as Order, created: false }
    },

    getOrder: byId,

    async listOrders(limit = 200) {
      const { data, error } = await db.from('orders').select('*').order('created_at', { ascending: false }).limit(limit)
      fail('list', error)
      return (data ?? []) as Order[]
    },

    async claimForSending(id, staleMinutes) {
      const { data, error } = await db.rpc('claim_order_for_sending', { p_id: id, p_stale_minutes: staleMinutes })
      fail('claim', error)
      const rows = (data ?? []) as Order[]
      return rows[0] ?? null
    },

    async updateOrder(id, patch: OrderPatch) {
      const { data, error } = await db.from('orders').update(patch).eq('id', id).select('*').single()
      fail('update', error)
      return data as Order
    },

    async ordersToSend(staleMinutes) {
      const stale = new Date(Date.now() - staleMinutes * 60_000).toISOString()
      const { data, error } = await db
        .from('orders')
        .select('*')
        .or(`status.in.(paid,failed),and(status.eq.sending,last_attempt_at.lt."${stale}")`)
        .order('created_at', { ascending: true })
        .limit(50)
      fail('list', error)
      return (data ?? []) as Order[]
    },

    async ordersToTrack() {
      const { data, error } = await db
        .from('orders')
        .select('*')
        .in('status', ['sent', 'shipped'])
        .not('cj_order_id', 'is', null)
        .order('created_at', { ascending: true })
        .limit(80)
      fail('list', error)
      return (data ?? []) as Order[]
    },

    async addEvent(orderId, kind, message, data) {
      const { error } = await db.from('order_events').insert({ order_id: orderId, kind, message, data: data ?? null })
      fail('event insert', error)
    },

    async listEvents(orderId, limit = 30) {
      const { data, error } = await db
        .from('order_events')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false })
        .limit(limit)
      fail('event list', error)
      return (data ?? []) as OrderEvent[]
    },

    async getSetting<T>(key: string) {
      const { data, error } = await db.from('app_settings').select('value').eq('key', key).maybeSingle()
      fail('setting read', error)
      return (data?.value as T) ?? null
    },

    async setSetting(key, value) {
      const { error } = await db
        .from('app_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
      fail('setting write', error)
    },
  }
}
