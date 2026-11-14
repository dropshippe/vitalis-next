import PageShell, { BuyBand } from '@/components/PageShell'
import { Cutaway, HydrogenScale } from '@/components/Illustrations'

export const metadata = {
  title: 'The science — Oxyra',
  description: 'How Oxyra makes hydrogen water, how much hydrogen is in it, and what the research does and does not show.',
}

export default function SciencePage() {
  return (
    <PageShell
      title="The science, plainly."
      intro="How the bottle makes hydrogen water, how much hydrogen ends up in your glass, and what researchers have and haven’t shown so far."
    >
      <section className="split">
        <h2 className="display-3">What hydrogen water is</h2>
        <div className="prose">
          <p>
            Hydrogen water is ordinary drinking water with hydrogen gas (H₂) dissolved in it, the way sparkling water
            has carbon dioxide dissolved in it. It has no taste, colour or smell.
          </p>
          <p>
            It is not the hydrogen in H₂O. Those atoms are bonded to oxygen and stay that way. Dissolved hydrogen is
            free gas sitting between the water molecules, which is why it slowly escapes once the lid is off.
          </p>
        </div>
      </section>

      <section className="split">
        <div>
          <h2 className="display-3">How the bottle makes it</h2>
          <Cutaway />
        </div>
        <div className="prose">
          <ol className="steps">
            <li>
              <strong>You press the button.</strong> A small current runs through a platinum-coated membrane in the
              base. This is called SPE/PEM electrolysis.
            </li>
            <li>
              <strong>Water splits.</strong> At the membrane, a tiny amount of water separates into hydrogen and
              oxygen.
            </li>
            <li>
              <strong>Hydrogen rises into your water.</strong> That is the column of fine bubbles you can watch. The
              membrane is designed to keep the oxygen side apart from the water you drink.
            </li>
            <li>
              <strong>The cycle ends.</strong> After three to five minutes the bottle stops on its own.
            </li>
          </ol>
        </div>
      </section>

      <section className="split">
        <h2 className="display-3">How much hydrogen</h2>
        <div className="prose">
          <p>
            Dissolved hydrogen is measured in parts per billion (ppb). At normal air pressure, water holds about 1,600
            ppb before it is saturated. Getting more in takes pressure, which is why a cycle runs with the lid closed.
          </p>
          <p>
            The manufacturer rates this bottle at up to 3,000 ppb from a sealed cycle. Your result depends on water
            temperature, how full the bottle is and how soon you drink.
          </p>
          <HydrogenScale />
          <p>
            <strong>Drink it soon.</strong> Hydrogen starts leaving the water as soon as you open the lid. Colder
            water holds it longer, and shaking or pouring loses it faster.
          </p>
        </div>
      </section>

      <section className="split">
        <h2 className="display-3">What the research says</h2>
        <div className="prose">
          <p>
            Interest took off in 2007, when a study in <em>Nature Medicine</em> found that hydrogen gas reduced a
            particularly damaging kind of oxidative stress in cell cultures and in rats. Since then, researchers have run human trials on
            hydrogen water looking at exercise recovery, metabolic markers and inflammation.
          </p>
          <p>
            Some of those trials report benefits. Most are small and short, and they don’t all agree. A 2024
            systematic review looked at 25 human studies and found the results promising, and also said there
            aren’t yet enough studies to draw firm conclusions.
          </p>
          <p>
            So here is where we stand. Oxyra is a well-made bottle that does one thing: it puts hydrogen in your
            water. We don’t claim it treats, cures or prevents anything, and it isn’t a substitute for medical advice.
          </p>
          <h3>Is it safe?</h3>
          <p>
            Hydrogen gas isn’t toxic, and the bacteria in your own gut produce it every day. If you’re pregnant,
            managing a medical condition or taking medication, check with your doctor before changing what you drink.
          </p>
          <h3>Sources</h3>
          <ul className="sources">
            <li>
              Ohsawa I. et al., “Hydrogen acts as a therapeutic antioxidant by selectively reducing cytotoxic oxygen
              radicals,” <em>Nature Medicine</em> 13, 688–694, 2007.{' '}
              <a href="https://doi.org/10.1038/nm1577" rel="noopener">
                Read the paper
              </a>
            </li>
            <li>
              Dhillon G. et al., “Hydrogen Water: Extra Healthy or a Hoax? A Systematic Review,”{' '}
              <em>International Journal of Molecular Sciences</em>, 2024.{' '}
              <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10816294/" rel="noopener">
                Read the review
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="split">
        <h2 className="display-3">Hydrogen at a glance</h2>
        <div className="prose">
          <ul className="plain-list">
            <li>
              <strong>The lightest element there is.</strong> A hydrogen molecule is two of the smallest atoms joined
              together.
            </li>
            <li>
              <strong>No taste, colour or smell.</strong> Hydrogen water looks and tastes like the water you started
              with.
            </li>
            <li>
              <strong>Neutral.</strong> Dissolved hydrogen doesn’t make water acidic or alkaline.
            </li>
            <li>
              <strong>Restless.</strong> It’s a gas, so it leaves open water steadily. That’s why the bottle makes it
              on the spot.
            </li>
          </ul>
        </div>
      </section>

      <section className="split">
        <h2 className="display-3">Words you’ll see</h2>
        <div className="prose">
          <dl className="glossary">
            <div>
              <dt>ppb</dt>
              <dd>Parts per billion. The usual measure of how much hydrogen is dissolved. 1,000 ppb is the same as 1 ppm, or 1 milligram per litre.</dd>
            </div>
            <div>
              <dt>Electrolysis</dt>
              <dd>Using electricity to split water into hydrogen and oxygen.</dd>
            </div>
            <div>
              <dt>SPE/PEM</dt>
              <dd>
                Solid polymer electrolyte and proton exchange membrane. A thin membrane that lets the bottle split
                water while keeping the hydrogen and oxygen sides apart.
              </dd>
            </div>
            <div>
              <dt>Saturation</dt>
              <dd>The most hydrogen water can hold at a given pressure and temperature. About 1,600 ppb at normal air pressure.</dd>
            </div>
          </dl>
        </div>
      </section>

      <BuyBand line="See it work for yourself. Ninety days to decide." />
    </PageShell>
  )
}
