'use client'

import { useActionState } from 'react'
import { login } from '../actions'

export default function AdminLogin() {
  const [state, action, pending] = useActionState(login, null)
  return (
    <main className="admin-login">
      <form action={action}>
        <h1>Orders</h1>
        <label htmlFor="password">Admin password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus />
        <button className="btn btn-dark" disabled={pending}>
          {pending ? 'Checking…' : 'Sign in'}
        </button>
        <p role="alert">{state?.error}</p>
      </form>
    </main>
  )
}
