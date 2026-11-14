import PageShell, { BuyBand } from '@/components/PageShell'
import { REVIEWS } from '@/lib/reviews'
import { BUSINESS } from '@/lib/business'

export const metadata = {
  title: 'Reviews — Oxyra',
  description: 'What people who bought an Oxyra bottle say about it.',
}

export default function ReviewsPage() {
  const count = REVIEWS.length
  const average = count ? REVIEWS.reduce((sum, r) => sum + r.rating, 0) / count : 0

  return (
    <PageShell
      title="In their words."
      intro={
        count
          ? `${average.toFixed(1)} out of 5 from ${count} ${count === 1 ? 'buyer' : 'buyers'}. Every review here comes from someone who bought a bottle.`
          : 'Every review on this page will come from someone who bought a bottle. We publish the good ones and the critical ones.'
      }
    >
      {count ? (
        <ul className="reviews">
          {REVIEWS.map((r, i) => (
            <li key={i} className="review">
              <p className="review-stars" aria-label={`${r.rating} out of 5`}>
                {'★'.repeat(r.rating)}
                <span aria-hidden="true">{'★'.repeat(5 - r.rating)}</span>
              </p>
              <blockquote>{r.text}</blockquote>
              <p className="review-by">
                {r.name}, {r.place}. {r.date}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <section className="empty">
          <h2 className="display-3">The first reviews are on their way.</h2>
          <p>
            We’ve just reopened, so there’s nothing to show yet. As orders arrive and people have had time with their
            bottle, their reviews will appear here, unedited.
          </p>
        </section>
      )}

      <section className="split">
        <h2 className="display-3">Bought one?</h2>
        <div className="prose">
          <p>
            Tell us how it’s going, good or bad. Email{' '}
            <a href={`mailto:${BUSINESS.email}?subject=My%20Oxyra%20review`}>{BUSINESS.email}</a> with your order
            number and a few lines, and we’ll add it to this page.
          </p>
        </div>
      </section>

      <BuyBand />
    </PageShell>
  )
}
