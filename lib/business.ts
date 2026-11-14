// Business details used on the legal and support pages.
// Fill in the empty fields before launch; lines that depend on them stay hidden until you do.
export const BUSINESS = {
  brand: 'Oxyra',
  legalName: '', // e.g. 'Oxyra Pty Ltd' or your name if you trade as a sole trader
  abn: '', // Australian Business Number
  address: '', // registered or postal address
  phone: '', // support phone number, if you offer one
  email: 'hello@oxyrawater.com',
  jurisdiction: 'Australia', // set to your state, e.g. 'Queensland, Australia'
  updated: '14 November 2026', // date the legal pages were last changed
}

export const trader = BUSINESS.legalName || BUSINESS.brand
// How the business introduces itself at the top of the legal pages.
export const introName = BUSINESS.legalName ? `${BUSINESS.legalName} (“Oxyra”, “we”)` : 'Oxyra (“we”)'
