'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { ADMIN_COOKIE, isAdmin, passwordMatches, sessionValue } from '@/lib/adminAuth'
import { getStore } from '@/lib/orders/store'
import { forwardOrder, syncAll } from '@/lib/fulfil'
import { sendShippingNotice } from '@/lib/email'

async function guard() {
  if (!(await isAdmin())) redirect('/admin/login')
}

export async function login(_: { error: string } | null, form: FormData) {
  const password = String(form.get('password') ?? '')
  if (!process.env.ADMIN_SECRET) return { error: 'ADMIN_SECRET isn’t set in Vercel yet.' }
  if (!passwordMatches(password)) {
    await new Promise((r) => setTimeout(r, 1200))
    return { error: 'That password isn’t right.' }
  }
  ;(await cookies()).set(ADMIN_COOKIE, sessionValue()!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/admin',
    maxAge: 60 * 60 * 24 * 30,
  })
  redirect('/admin')
}

export async function logout() {
  ;(await cookies()).delete({ name: ADMIN_COOKIE, path: '/admin' })
  redirect('/admin/login')
}

export async function retryOrder(form: FormData) {
  await guard()
  const id = String(form.get('id'))
  const store = getStore()
  const order = await store.getOrder(id)
  if (order && (order.status === 'failed' || order.status === 'needs_review')) {
    await store.updateOrder(id, { status: 'paid', last_error: null })
    await store.addEvent(id, 'retry', 'Retry pressed on the orders page')
    await forwardOrder(id)
  }
  revalidatePath('/admin')
}

export async function syncNow() {
  await guard()
  await syncAll()
  revalidatePath('/admin')
}

export async function markShipped(form: FormData) {
  await guard()
  const id = String(form.get('id'))
  const tracking = String(form.get('tracking') ?? '').trim()
  if (!tracking) return
  const store = getStore()
  const order = await store.updateOrder(id, {
    status: 'shipped',
    tracking_number: tracking,
    shipped_at: new Date().toISOString(),
    last_error: null,
  })
  await store.addEvent(id, 'shipped', `Tracking ${tracking} entered by hand`)
  const res = await sendShippingNotice(order).catch(() => ({ sent: false }))
  if (res.sent) await store.updateOrder(id, { shipping_email_at: new Date().toISOString() })
  revalidatePath('/admin')
}

export async function cancelOrder(form: FormData) {
  await guard()
  const id = String(form.get('id'))
  const store = getStore()
  await store.updateOrder(id, { status: 'cancelled' })
  await store.addEvent(id, 'cancelled', 'Cancelled on the orders page. Refund the customer in Stripe if they paid.')
  revalidatePath('/admin')
}
