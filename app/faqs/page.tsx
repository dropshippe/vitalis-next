import PageShell, { BuyBand } from '@/components/PageShell'

export const metadata = {
  title: 'Questions — Oxyra',
  description: 'Answers about using, charging, cleaning, shipping and returning the Oxyra bottle.',
}

const GROUPS: { heading: string; items: [string, React.ReactNode][] }[] = [
  {
    heading: 'Using it',
    items: [
      [
        'How do I use it?',
        'Fill it with still drinking water, close the lid and press the button once. A cycle runs for three to five minutes and stops on its own. Drink it soon after.',
      ],
      [
        'What water should I use?',
        'Still drinking water at room temperature or colder: filtered, spring or tap. Don’t use hot water, sparkling water, juice, milk or anything other than water.',
      ],
      [
        'How soon should I drink it?',
        'Straight away is best. Hydrogen is a gas and starts leaving the water once the lid is open.',
      ],
      ['Can I run two cycles in a row?', 'Yes. A second cycle adds more hydrogen to the same water.'],
      [
        'Does it change the taste?',
        'No. Hydrogen has no taste or smell. Your water tastes like the water you put in.',
      ],
    ],
  },
  {
    heading: 'Charging and care',
    items: [
      [
        'How do I charge it?',
        'With any USB-C cable. A full charge takes two to three hours and runs about fifteen cycles.',
      ],
      [
        'How do I clean it?',
        <>
          Rinse it with clean water after use. For a deeper clean, add a little lemon juice or food-grade citric acid
          to water, run a cycle, then rinse well. The <a href="/care">care guide</a> has the full steps.
        </>,
      ],
      [
        'Can it go in the dishwasher?',
        'No. Don’t put it in a dishwasher or submerge the base, which holds the battery and charging port.',
      ],
    ],
  },
  {
    heading: 'Hydrogen water',
    items: [
      [
        'What is hydrogen water?',
        <>
          Water with hydrogen gas dissolved in it. There’s a plain-language explanation on the{' '}
          <a href="/science">science page</a>.
        </>,
      ],
      [
        'Will it improve my health?',
        <>
          We don’t claim that. Research on hydrogen water is early, and the <a href="/science">science page</a> sets
          out what it does and doesn’t show. Oxyra is a water bottle, not a medical device.
        </>,
      ],
      [
        'Is it safe?',
        'Hydrogen gas isn’t toxic, and your gut bacteria make it every day. If you’re pregnant, have a medical condition or take medication, check with your doctor first.',
      ],
    ],
  },
  {
    heading: 'Orders',
    items: [
      [
        'Where do you ship?',
        <>
          Worldwide, and shipping is free. Details are on the <a href="/shipping">shipping page</a>.
        </>,
      ],
      ['How long does delivery take?', 'Orders leave within one to three business days. Most arrive in 5 to 20 business days.'],
      [
        'What if I don’t like it?',
        <>
          Send it back within 90 days for a full refund. See <a href="/returns">returns and warranty</a>.
        </>,
      ],
      [
        'Is there a warranty?',
        <>
          Yes. A lifetime warranty on the steel and glass, and two years on the battery and electronics. Accidental
          damage such as drops isn’t covered. See <a href="/returns">returns and warranty</a>.
        </>,
      ],
      ['How do I pay?', 'By card through Stripe’s secure checkout. Prices are in US dollars.'],
    ],
  },
]

export default function FaqsPage() {
  return (
    <PageShell title="Questions." intro="The short answers. If yours isn’t here, write to hello@oxyrawater.com.">
      {GROUPS.map((group) => (
        <section key={group.heading} className="split">
          <h2 className="display-3">{group.heading}</h2>
          <div className="faq">
            {group.items.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
      <BuyBand />
    </PageShell>
  )
}
