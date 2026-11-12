const SPECS: [string, string][] = [
  ['Capacity', '460 ml (15.5 fl oz)'],
  ['Hydrogen', 'Up to 3,000 ppb per cycle'],
  ['Method', 'SPE/PEM electrolysis, platinum-coated membrane'],
  ['Cycle', '3 to 5 minutes'],
  ['Battery', '1,200 mAh, about 15 cycles per charge'],
  ['Charging', 'USB-C, 2 to 3 hours'],
  ['Body', 'Borosilicate glass, brushed stainless steel'],
  ['Size', '23.5 cm tall, 7 cm across'],
]

export default function Details() {
  return (
    <section id="details" className="details">
      <div className="details-inner">
        <div className="details-lead">
          <h2 className="display-2">What you&rsquo;re holding.</h2>
          <p className="lead">
            One bottle, one button. Fill it with still water, press, and it makes hydrogen water on the spot, at
            your desk, in the car, at the gym.
          </p>
        </div>
        <dl className="specs">
          {SPECS.map(([k, v]) => (
            <div key={k} className="spec">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
