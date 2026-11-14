import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'oxyra_admin'

// The cookie holds a signature derived from ADMIN_SECRET, never the password itself.
// Changing ADMIN_SECRET signs everyone out.
export function sessionValue(): string | null {
  const secret = process.env.ADMIN_SECRET?.trim()
  if (!secret) return null
  return createHmac('sha256', secret).update('oxyra-admin-session-v1').digest('hex')
}

export function passwordMatches(candidate: string): boolean {
  const secret = process.env.ADMIN_SECRET?.trim()
  if (!secret) return false
  const a = Buffer.from(candidate)
  const b = Buffer.from(secret)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function isAdmin(): Promise<boolean> {
  const want = sessionValue()
  if (!want) return false
  const got = (await cookies()).get(ADMIN_COOKIE)?.value ?? ''
  const a = Buffer.from(got)
  const b = Buffer.from(want)
  return a.length === b.length && timingSafeEqual(a, b)
}
