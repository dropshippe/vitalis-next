import PageShell, { BuyBand } from '@/components/PageShell'

export const metadata = {
  title: 'Our story — Oxyra',
  description: 'Why Oxyra exists and what we will and won’t promise you.',
}

export default function StoryPage() {
  return (
    <PageShell
      title="One bottle, done properly."
      intro="Oxyra started with a simple irritation: hydrogen water was sold either as a bench-top machine or as a plastic gadget with a miracle attached."
    >
      <section className="split">
        <h2 className="display-3">Why we made it</h2>
        <div className="prose">
          <p>
            We wanted the version we would keep on our own desk. Glass you can see through. Steel that feels like
            something. One button. A cycle you can watch from start to finish, then drink.
          </p>
          <p>
            So that is the whole product. One bottle, 460 ml, charged over USB-C. No app, no subscription, no
            cartridges to reorder.
          </p>
        </div>
      </section>

      <section className="split">
        <h2 className="display-3">What we promise</h2>
        <div className="prose">
          <ul className="plain-list">
            <li>
              <strong>It does what we say.</strong> It makes hydrogen water in three to five minutes, and you can see
              it happen.
            </li>
            <li>
              <strong>You have thirty days.</strong> If it isn’t for you, send it back for a full refund.
            </li>
            <li>
              <strong>It’s built to last.</strong> A lifetime warranty on the steel and glass, and two years on the
              battery and electronics.
            </li>
            <li>
              <strong>A person answers.</strong> Write to hello@oxyrawater.com and you’ll hear back within two
              business days.
            </li>
          </ul>
        </div>
      </section>

      <section className="split">
        <h2 className="display-3">What we won’t promise</h2>
        <div className="prose">
          <p>
            We won’t tell you a water bottle will fix your sleep, your skin or your blood work. The research on
            hydrogen water is early and interesting, and we’ve laid out what it does and doesn’t show on the{' '}
            <a href="/science">science page</a>.
          </p>
          <p>Buy it because you like the ritual and the object. Keep it because you use it.</p>
        </div>
      </section>

      <BuyBand />
    </PageShell>
  )
}
