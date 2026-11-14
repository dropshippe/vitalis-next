const ROWS: [string, string, string, string, string][] = [
  ['How you get it', 'Made fresh in the bottle, when you want it', 'Drop one in a glass and wait for it to dissolve', 'Made at a kitchen bench or tap', 'Open and drink'],
  ['Where it works', 'Anywhere you carry it', 'Anywhere you have a glass', 'At home', 'Anywhere'],
  ['Ongoing cost', 'None. You add water', 'A new tablet for every glass', 'Filters and servicing', 'A new can or pouch every time'],
  ['What’s added to the water', 'Hydrogen only', 'Hydrogen and magnesium', 'Depends on the machine', 'Hydrogen only'],
  ['What’s left over', 'Nothing', 'Tablet packaging', 'Nothing', 'A can or pouch'],
]

export default function Compare() {
  return (
    <section className="compare">
      <div className="compare-inner">
        <h2 className="display-2">Four ways to drink hydrogen water.</h2>
        <p className="lead">They all get hydrogen into water. They differ in where you can do it and what you keep paying for.</p>
        <div className="compare-scroll" tabIndex={0} role="region" aria-label="Comparison table">
          <table>
            <thead>
              <tr>
                <td />
                <th scope="col" className="compare-us">
                  Oxyra bottle
                </th>
                <th scope="col">Tablets</th>
                <th scope="col">Bench-top machine</th>
                <th scope="col">Cans and pouches</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, ...cells]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {cells.map((c, i) => (
                    <td key={i} className={i === 0 ? 'compare-us' : undefined}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
