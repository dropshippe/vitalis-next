// Line drawings in the same hand as the logo: one weight, round ends, drawn in the text colour.

const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

function Bubbles({ points, className = 'ill-rise' }: { points: [number, number, number][]; className?: string }) {
  return (
    <g className={className}>
      {points.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} {...line} strokeWidth={1.5} style={{ animationDelay: `${(i * 0.37) % 2.4}s` }} />
      ))}
    </g>
  )
}

export function FillArt() {
  return (
    <svg viewBox="0 0 160 180" className="ill" aria-hidden="true">
      {/* cap set down beside the bottle */}
      <rect x="112" y="142" width="34" height="18" rx="3" {...line} />
      {/* open bottle */}
      <path d="M52 38v84M100 38v84" {...line} />
      <rect x="50" y="122" width="52" height="38" rx="3" {...line} />
      <circle cx="76" cy="141" r="5" {...line} />
      {/* water pouring in */}
      <path className="ill-pour" d="M76 4v88" {...line} strokeDasharray="10 8" />
      <path d="M53 92c8-5 14 5 23 0s15 5 23 0" {...line} />
    </svg>
  )
}

export function PressArt() {
  return (
    <svg viewBox="0 0 160 180" className="ill" aria-hidden="true">
      <rect x="50" y="18" width="52" height="22" rx="3" {...line} />
      <path d="M52 40v82M100 40v82" {...line} />
      <rect x="50" y="122" width="52" height="38" rx="3" {...line} />
      <circle cx="76" cy="141" r="5" fill="currentColor" stroke="none" />
      <circle className="ill-ring" cx="76" cy="141" r="11" {...line} strokeWidth={1.5} />
      <circle className="ill-ring ill-ring-2" cx="76" cy="141" r="17" {...line} strokeWidth={1.5} />
      <Bubbles
        points={[
          [66, 108, 3],
          [84, 100, 2],
          [74, 88, 4],
          [88, 76, 2.5],
          [68, 70, 2],
          [78, 58, 3],
        ]}
      />
    </svg>
  )
}

export function DrinkArt() {
  return (
    <svg viewBox="0 0 160 180" className="ill" aria-hidden="true">
      <g transform="rotate(-38 80 96)">
        <path d="M54 30v82M106 30v82" {...line} />
        <rect x="52" y="112" width="56" height="38" rx="3" {...line} />
        <circle cx="80" cy="131" r="5" {...line} />
      </g>
      {/* the water stays level as the bottle tips */}
      <path d="M47 88c8-4 14 4 23 0s15 4 23 0" {...line} />
      <Bubbles
        className="ill-rise ill-rise-short"
        points={[
          [70, 104, 2.5],
          [88, 110, 2],
          [98, 98, 3],
        ]}
      />
    </svg>
  )
}

// Cutaway of the bottle, keyed 1 to 3 to the steps beside it.
export function Cutaway() {
  const key = (n: number, x: number, y: number, toX: number, toY: number) => (
    <g>
      <path d={`M${x + 13} ${y}H${toX}V${toY}`} {...line} strokeWidth={1} strokeDasharray="3 4" />
      <circle cx={x} cy={y} r="12" fill="var(--color-glacier)" stroke="currentColor" strokeWidth="1.5" />
      <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fill="currentColor" stroke="none">
        {n}
      </text>
    </g>
  )
  return (
    <figure className="cutaway">
      <svg viewBox="0 0 300 420" role="img" aria-label="Cutaway drawing of the bottle: the button on the base, the membrane under the glass, and hydrogen bubbles rising through the water">
        {/* cap */}
        <rect x="104" y="16" width="112" height="46" rx="5" {...line} />
        {/* glass */}
        <path d="M108 62v196M212 62v196" {...line} />
        <path d="M110 84c17-6 30 6 50 0s33 6 50 0" {...line} strokeWidth={1.5} />
        {/* base, cut open */}
        <rect x="104" y="258" width="112" height="136" rx="5" {...line} />
        {/* membrane */}
        <path d="M112 272h96" {...line} strokeWidth={4} />
        <path d="M118 282h84" {...line} strokeWidth={1} strokeDasharray="2 5" />
        {/* battery */}
        <rect x="128" y="300" width="64" height="34" rx="4" {...line} strokeWidth={1.5} />
        <path d="M150 317h8M154 313v8M166 317h8" {...line} strokeWidth={1.5} />
        {/* button */}
        <circle cx="160" cy="364" r="11" {...line} />
        <path d="M160 358v6" {...line} strokeWidth={1.5} />
        <Bubbles
          points={[
            [136, 246, 4],
            [176, 240, 3],
            [156, 222, 5],
            [186, 204, 3],
            [140, 190, 3.5],
            [164, 172, 4],
            [182, 150, 2.5],
            [146, 138, 3],
            [168, 118, 3.5],
            [150, 102, 2.5],
          ]}
        />
        {key(1, 52, 364, 100, 364)}
        {key(2, 52, 272, 100, 272)}
        {key(3, 52, 170, 100, 170)}
      </svg>
      <figcaption>
        <span>1 Button</span>
        <span>2 Membrane</span>
        <span>3 Hydrogen rising</span>
      </figcaption>
    </figure>
  )
}

// How the rated figure compares with what water holds at normal pressure.
export function HydrogenScale() {
  return (
    <figure className="h2-scale" aria-label="Scale from 0 to 3,000 parts per billion. Water is saturated at about 1,600 at normal air pressure. The bottle is rated at up to 3,000 from a sealed cycle.">
      <div className="h2-bar" aria-hidden="true">
        <span className="h2-fill" />
        <span className="h2-tick" style={{ left: '53.3%' }} />
      </div>
      <dl aria-hidden="true">
        <div style={{ left: '53.3%' }}>
          <dt>1,600 ppb</dt>
          <dd>Saturated at normal air pressure</dd>
        </div>
        <div className="h2-end">
          <dt>3,000 ppb</dt>
          <dd>Rated maximum, sealed cycle</dd>
        </div>
      </dl>
    </figure>
  )
}
