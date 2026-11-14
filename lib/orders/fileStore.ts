import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import type { NewOrder, Order, OrderEvent, OrderPatch, OrderStore } from './types'

// A JSON file stand-in for the database, for running the site on your own computer.
// Never used in production: there the site refuses to run without the real database.

type Data = { seq: number; eventSeq: number; orders: Order[]; events: OrderEvent[]; settings: Record<string, unknown> }

export function createFileStore(file = path.join(/*turbopackIgnore: true*/ process.cwd(), '.data', 'orders.json')): OrderStore {
  let queue: Promise<unknown> = Promise.resolve()

  const read = async (): Promise<Data> => {
    try {
      return JSON.parse(await fs.readFile(/*turbopackIgnore: true*/ file, 'utf8')) as Data
    } catch {
      return { seq: 1000, eventSeq: 0, orders: [], events: [], settings: {} }
    }
  }
  const write = async (data: Data) => {
    await fs.mkdir(/*turbopackIgnore: true*/ path.dirname(file), { recursive: true })
    const tmp = `${file}.${process.pid}.tmp`
    await fs.writeFile(/*turbopackIgnore: true*/ tmp, JSON.stringify(data, null, 2))
    await fs.rename(/*turbopackIgnore: true*/ tmp, file)
  }
  // Every change runs one at a time, like a database transaction.
  const tx = <T>(fn: (data: Data) => T | Promise<T>): Promise<T> => {
    const run = queue.then(async () => {
      const data = await read()
      const result = await fn(data)
      await write(data)
      return result
    })
    queue = run.catch(() => {})
    return run
  }
  const now = () => new Date().toISOString()
  const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v))

  return {
    createOrder: (input: NewOrder) =>
      tx((data) => {
        const existing = data.orders.find((o) => o.stripe_session_id === input.stripe_session_id)
        if (existing) return { order: clone(existing), created: false }
        data.seq += 1
        const order: Order = {
          id: randomUUID(),
          order_number: `OXY${data.seq}`,
          status: 'paid',
          last_error: null,
          cj_order_id: null,
          cj_status: null,
          cj_logistic_name: null,
          cj_postage: null,
          cj_order_amount: null,
          tracking_number: null,
          tracking_carrier: null,
          attempts: 0,
          last_attempt_at: null,
          confirmation_email_at: null,
          shipping_email_at: null,
          alerted_at: null,
          sent_at: null,
          shipped_at: null,
          delivered_at: null,
          created_at: now(),
          updated_at: now(),
          ...input,
        } as Order
        data.orders.push(order)
        return { order: clone(order), created: true }
      }),

    getOrder: async (id) => clone((await read()).orders.find((o) => o.id === id) ?? null),

    listOrders: async (limit = 200) =>
      clone((await read()).orders.slice().sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, limit)),

    claimForSending: (id, staleMinutes) =>
      tx((data) => {
        const o = data.orders.find((x) => x.id === id)
        if (!o) return null
        const stale =
          o.status === 'sending' && o.last_attempt_at && Date.parse(o.last_attempt_at) < Date.now() - staleMinutes * 60_000
        if (!(o.status === 'paid' || o.status === 'failed' || stale)) return null
        o.status = 'sending'
        o.attempts += 1
        o.last_attempt_at = now()
        o.updated_at = now()
        return clone(o)
      }),

    updateOrder: (id, patch: OrderPatch) =>
      tx((data) => {
        const o = data.orders.find((x) => x.id === id)
        if (!o) throw new Error(`Order ${id} not found`)
        Object.assign(o, patch, { updated_at: now() })
        return clone(o)
      }),

    ordersToSend: async (staleMinutes) =>
      clone(
        (await read()).orders.filter(
          (o) =>
            o.status === 'paid' ||
            o.status === 'failed' ||
            (o.status === 'sending' && !!o.last_attempt_at && Date.parse(o.last_attempt_at) < Date.now() - staleMinutes * 60_000),
        ),
      ),

    ordersToTrack: async () =>
      clone((await read()).orders.filter((o) => (o.status === 'sent' || o.status === 'shipped') && o.cj_order_id)),

    addEvent: (orderId, kind, message, extra) =>
      tx((data) => {
        data.eventSeq += 1
        data.events.push({ id: data.eventSeq, order_id: orderId, kind, message, data: extra ?? null, created_at: now() })
      }),

    listEvents: async (orderId, limit = 30) =>
      clone(
        (await read()).events
          .filter((e) => e.order_id === orderId)
          .sort((a, b) => b.id - a.id)
          .slice(0, limit),
      ),

    getSetting: async <T,>(key: string) => ((await read()).settings[key] as T) ?? null,

    setSetting: (key, value) =>
      tx((data) => {
        data.settings[key] = value
      }),
  }
}
