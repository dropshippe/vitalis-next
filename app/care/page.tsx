import PageShell, { BuyBand } from '@/components/PageShell'
import { BUSINESS } from '@/lib/business'

export const metadata = {
  title: 'Care guide — Oxyra',
  description: 'How to set up, charge, clean and look after your Oxyra bottle.',
}

export default function CarePage() {
  return (
    <PageShell
      title="Care guide."
      intro="Five minutes of looking after it now and then keeps the bubbles fine and the glass clear. If the manual in your box says something different, follow the manual."
    >
      <section className="split">
        <h2 className="display-3">First use</h2>
        <div className="prose">
          <ol className="steps">
            <li>
              <strong>Charge it fully.</strong> Two to three hours over USB-C.
            </li>
            <li>
              <strong>Rinse it.</strong> Wash the glass and cap with clean water.
            </li>
            <li>
              <strong>Run one cycle and pour it away.</strong> This wets the membrane and clears anything left from
              packing.
            </li>
            <li>
              <strong>Fill, press, drink.</strong> You’re set.
            </li>
          </ol>
        </div>
      </section>

      <section className="split">
        <h2 className="display-3">Everyday care</h2>
        <div className="prose">
          <ul className="plain-list">
            <li>
              <strong>Rinse after use.</strong> Clean water, a quick swirl, lid off to dry.
            </li>
            <li>
              <strong>Use it often.</strong> The membrane works best when it doesn’t dry out. If the bottle has sat
              unused for a couple of weeks, run one cycle and pour it away.
            </li>
            <li>
              <strong>Wipe the base, don’t wash it.</strong> A damp cloth is enough. The base holds the battery and
              the charging port.
            </li>
          </ul>
        </div>
      </section>

      <section className="split">
        <h2 className="display-3">A deeper clean</h2>
        <div className="prose">
          <p>Every week or two, or when you see fewer bubbles than usual:</p>
          <ol className="steps">
            <li>
              <strong>Mix.</strong> Fill the bottle with water and add a teaspoon of lemon juice or food-grade citric
              acid.
            </li>
            <li>
              <strong>Run a cycle.</strong> This loosens mineral build-up from the membrane.
            </li>
            <li>
              <strong>Rinse well.</strong> Two or three times with clean water.
            </li>
          </ol>
        </div>
      </section>

      <section className="split">
        <h2 className="display-3">Keep it away from</h2>
        <div className="prose">
          <ul className="plain-list">
            <li>
              <strong>Hot water.</strong> Room temperature or colder only. Heat can damage the membrane.
            </li>
            <li>
              <strong>Anything that isn’t water.</strong> No juice, milk, tea, sparkling water or supplements.
            </li>
            <li>
              <strong>Dishwashers and sinks.</strong> Never submerge the base.
            </li>
            <li>
              <strong>Soap inside the base.</strong> Soap residue on the membrane affects how it works.
            </li>
          </ul>
        </div>
      </section>

      <section className="split">
        <h2 className="display-3">If something’s off</h2>
        <div className="faq">
          <details>
            <summary>It won’t start</summary>
            <p>Charge it for a full two to three hours, then press the button once.</p>
          </details>
          <details>
            <summary>There are fewer bubbles than before</summary>
            <p>Minerals from your water have probably built up on the membrane. Do the deeper clean above.</p>
          </details>
          <details>
            <summary>The water tastes or smells odd</summary>
            <p>Do the deeper clean, rinse well, and let the bottle air-dry with the lid off.</p>
          </details>
          <details>
            <summary>It still isn’t right</summary>
            <p>
              Email <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> with a short description and a photo or
              video. The bottle and battery are covered for a year.
            </p>
          </details>
        </div>
      </section>

      <BuyBand />
    </PageShell>
  )
}
