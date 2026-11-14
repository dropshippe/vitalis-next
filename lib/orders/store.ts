import { createSupabaseStore } from './supabaseStore'
import { createFileStore } from './fileStore'
import type { OrderStore } from './types'

let store: OrderStore | null = null

export function getStore(): OrderStore {
  if (store) return store
  const url = process.env.SUPABASE_URL?.trim()
  const key = process.env.SUPABASE_SECRET_KEY?.trim()
  if (url && key) {
    store = createSupabaseStore(url, key)
  } else if (process.env.NODE_ENV !== 'production' || process.env.ORDER_STORE === 'file') {
    store = createFileStore()
  } else {
    // Failing loudly here makes Stripe retry the webhook later instead of losing the order.
    throw new Error('Order database is not configured: set SUPABASE_URL and SUPABASE_SECRET_KEY')
  }
  return store
}
