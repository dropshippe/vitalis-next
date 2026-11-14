export type OrderStatus =
  | 'paid' // customer paid, not yet sent to the supplier
  | 'sending' // being sent to the supplier right now
  | 'sent' // placed and paid at CJ, waiting for a tracking number
  | 'shipped' // tracking number received, customer emailed
  | 'delivered'
  | 'failed' // supplier call failed, will be retried automatically
  | 'needs_review' // a person needs to look at it (see last_error)
  | 'cancelled'

export type Order = {
  id: string
  order_number: string
  stripe_session_id: string
  stripe_payment_intent: string | null
  status: OrderStatus
  bundle: string
  quantity: number
  amount_total: number
  currency: string
  customer_email: string | null
  customer_name: string | null
  customer_phone: string | null
  ship_name: string | null
  ship_line1: string | null
  ship_line2: string | null
  ship_city: string | null
  ship_state: string | null
  ship_postal_code: string | null
  ship_country: string | null
  cj_order_id: string | null
  cj_status: string | null
  cj_logistic_name: string | null
  cj_postage: number | null
  cj_order_amount: number | null
  tracking_number: string | null
  tracking_carrier: string | null
  attempts: number
  last_error: string | null
  last_attempt_at: string | null
  confirmation_email_at: string | null
  shipping_email_at: string | null
  alerted_at: string | null
  sent_at: string | null
  shipped_at: string | null
  delivered_at: string | null
  created_at: string
  updated_at: string
}

export type NewOrder = Pick<
  Order,
  | 'stripe_session_id'
  | 'stripe_payment_intent'
  | 'bundle'
  | 'quantity'
  | 'amount_total'
  | 'currency'
  | 'customer_email'
  | 'customer_name'
  | 'customer_phone'
  | 'ship_name'
  | 'ship_line1'
  | 'ship_line2'
  | 'ship_city'
  | 'ship_state'
  | 'ship_postal_code'
  | 'ship_country'
> & { status?: OrderStatus; last_error?: string | null }

export type OrderPatch = Partial<Omit<Order, 'id' | 'order_number' | 'stripe_session_id' | 'created_at' | 'updated_at'>>

export type OrderEvent = {
  id: number
  order_id: string
  kind: string
  message: string | null
  data: unknown
  created_at: string
}

export interface OrderStore {
  /** Saves a paid order once. A repeat for the same Stripe session returns the existing order. */
  createOrder(input: NewOrder): Promise<{ order: Order; created: boolean }>
  getOrder(id: string): Promise<Order | null>
  listOrders(limit?: number): Promise<Order[]>
  /** Takes an order for sending, atomically. Returns null if it isn't sendable or someone else has it. */
  claimForSending(id: string, staleMinutes: number): Promise<Order | null>
  updateOrder(id: string, patch: OrderPatch): Promise<Order>
  ordersToSend(staleMinutes: number): Promise<Order[]>
  ordersToTrack(): Promise<Order[]>
  addEvent(orderId: string, kind: string, message: string, data?: unknown): Promise<void>
  listEvents(orderId: string, limit?: number): Promise<OrderEvent[]>
  getSetting<T>(key: string): Promise<T | null>
  setSetting(key: string, value: unknown): Promise<void>
}
