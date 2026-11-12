// Single source of truth for what the store sells.
// The checkout route prices orders from this file only; the browser never sends a price.

export type BundleId = '1' | '2'

export type Bundle = {
  id: BundleId
  label: string
  bottles: number
  amount: number // USD cents
  saving: number // USD cents against buying singly
  stripeName: string
  stripeDescription: string
}

export const BUNDLES: Record<BundleId, Bundle> = {
  '1': {
    id: '1',
    label: 'One bottle',
    bottles: 1,
    amount: 5999,
    saving: 0,
    stripeName: 'Oxyra Hydrogen Water Bottle',
    stripeDescription: 'One 460 ml bottle',
  },
  '2': {
    id: '2',
    label: 'Two bottles',
    bottles: 2,
    amount: 9999,
    saving: 1999,
    stripeName: 'Oxyra Hydrogen Water Bottle, set of two',
    stripeDescription: 'Two 460 ml bottles',
  },
}

export const SHIP_TO = ['AU', 'NZ', 'US', 'CA', 'GB'] as const

export function isBundleId(value: unknown): value is BundleId {
  return value === '1' || value === '2'
}

export function formatUsd(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}
