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
    amount: 11999,
    saving: 0,
    stripeName: 'Oxyra Hydrogen Water Bottle',
    stripeDescription: 'One glass and stainless steel bottle',
  },
  '2': {
    id: '2',
    label: 'Two bottles',
    bottles: 2,
    amount: 19999,
    saving: 3999,
    stripeName: 'Oxyra Hydrogen Water Bottle, set of two',
    stripeDescription: 'Two glass and stainless steel bottles',
  },
}

// Worldwide: every country Stripe Checkout accepts as a delivery address.
export const SHIP_TO = [
  'AC', 'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AT', 'AU', 'AW', 'AX', 'AZ',
  'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS',
  'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO',
  'CR', 'CV', 'CW', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER',
  'ES', 'ET', 'FI', 'FJ', 'FK', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL',
  'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HN', 'HR', 'HT', 'HU', 'ID',
  'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI',
  'KM', 'KN', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV',
  'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MK', 'ML', 'MM', 'MN', 'MO', 'MQ', 'MR', 'MS', 'MT',
  'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU',
  'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PY', 'QA',
  'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL',
  'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SZ', 'TA', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ',
  'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'US', 'UY', 'UZ', 'VA',
  'VC', 'VE', 'VG', 'VN', 'VU', 'WF', 'WS', 'XK', 'YE', 'YT', 'ZA', 'ZM', 'ZW',
] as const

export function isBundleId(value: unknown): value is BundleId {
  return value === '1' || value === '2'
}

export function formatUsd(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

// The lowest price on the site, for "Buy from" buttons.
export const FROM_PRICE = formatUsd(Math.min(...Object.values(BUNDLES).map((b) => b.amount)))
