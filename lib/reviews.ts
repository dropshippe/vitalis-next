// Reviews shown on /reviews. Only add reviews from people who actually bought a bottle,
// in their own words, good or bad. Leave the list empty rather than filling it with placeholders.
export type Review = {
  name: string // first name and initial, e.g. 'Dana K.'
  place: string // city or country
  date: string // e.g. 'November 2026'
  rating: 1 | 2 | 3 | 4 | 5
  text: string
}

export const REVIEWS: Review[] = []
