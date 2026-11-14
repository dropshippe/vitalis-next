import { FillArt, PressArt, DrinkArt } from './Illustrations'

export default function Ritual() {
  return (
    <section className="ritual">
      <div className="ritual-inner">
        <h2 className="display-2">Three minutes, start to finish.</h2>
        <ol className="ritual-steps">
          <li>
            <FillArt />
            <h3>Fill</h3>
            <p>Still drinking water, room temperature or colder.</p>
          </li>
          <li>
            <PressArt />
            <h3>Press</h3>
            <p>One press. Watch the hydrogen climb through the glass.</p>
          </li>
          <li>
            <DrinkArt />
            <h3>Drink</h3>
            <p>Straight from the bottle, while the hydrogen is still in it.</p>
          </li>
        </ol>
      </div>
    </section>
  )
}
