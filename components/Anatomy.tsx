'use client'

import { useState } from 'react'

const PARTS = [
  ['steel', 'Steel cap and base', 'Brushed stainless steel at both ends. The cap seals the bottle so pressure can build during a cycle.'],
  ['glass', 'Borosilicate glass', 'Holds 460 ml. It’s the family of glass used for lab ware, chosen because it copes with changes in temperature.'],
  ['plate', 'Light plate', 'Glows blue while a cycle is running, so you can see it working from across the room.'],
  ['membrane', 'Platinum-coated membrane', 'Where the water is split. Hydrogen goes up into the bottle and the oxygen side is kept apart.'],
  ['battery', '1,200 mAh battery', 'Runs about fifteen cycles before it needs charging.'],
  ['button', 'One button', 'Press once to start. The cycle stops on its own after three to five minutes.'],
  ['usb', 'USB-C port', 'A full charge takes two to three hours with any USB-C cable.'],
  ['foot', 'Silicone foot', 'Keeps the bottle steady and quiet on a desk.'],
] as const

type PartId = (typeof PARTS)[number][0]

const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export default function Anatomy() {
  const [active, setActive] = useState<PartId>('membrane')
  const part = (id: PartId) => ({ className: `part${active === id ? ' on' : ''}`, onMouseEnter: () => setActive(id) })

  return (
    <section className="anatomy" data-dark>
      <div className="anatomy-inner">
        <h2 className="display-2">Eight parts. Nothing spare.</h2>
        <div className="anatomy-grid">
          <svg viewBox="0 0 320 560" className="anatomy-art" role="img" aria-label="Drawing of the bottle with its parts: steel cap and base, glass body, light plate, membrane, battery, button, charging port and silicone foot">
            <g {...part('steel')}>
              <rect x="100" y="20" width="120" height="56" rx="6" {...line} />
              <rect x="100" y="338" width="120" height="170" rx="6" {...line} />
            </g>
            <g {...part('glass')}>
              <path d="M104 76v254M216 76v254" {...line} />
              <path d="M106 104c18-7 32 7 54 0s36 7 54 0" {...line} strokeWidth={1.5} />
              <g className="ill-rise">
                {[
                  [132, 312, 4],
                  [178, 300, 3],
                  [156, 280, 5],
                  [190, 258, 3],
                  [138, 240, 3.5],
                  [166, 216, 4],
                  [184, 190, 2.5],
                  [144, 172, 3],
                  [170, 148, 3.5],
                  [150, 128, 2.5],
                ].map(([cx, cy, r], i) => (
                  <circle key={i} cx={cx} cy={cy} r={r} {...line} strokeWidth={1.5} style={{ animationDelay: `${(i * 0.37) % 2.4}s` }} />
                ))}
              </g>
            </g>
            <g {...part('plate')}>
              <rect x="106" y="324" width="108" height="8" rx="4" fill="currentColor" stroke="none" />
            </g>
            <g {...part('membrane')}>
              <path d="M112 354h96" {...line} strokeWidth={4} />
              <path d="M118 365h84" {...line} strokeWidth={1} strokeDasharray="2 5" />
            </g>
            <g {...part('battery')}>
              <rect x="126" y="382" width="68" height="38" rx="4" {...line} strokeWidth={1.5} />
              <path d="M150 401h8M154 397v8M166 401h8" {...line} strokeWidth={1.5} />
            </g>
            <g {...part('button')}>
              <circle cx="160" cy="456" r="13" {...line} />
              <path d="M160 449v7" {...line} strokeWidth={1.5} />
            </g>
            <g {...part('usb')}>
              <rect x="205" y="474" width="10" height="20" rx="4" {...line} strokeWidth={1.5} />
            </g>
            <g {...part('foot')}>
              <rect x="106" y="512" width="108" height="10" rx="5" {...line} />
            </g>
          </svg>

          <ul className="anatomy-list">
            {PARTS.map(([id, name, text]) => (
              <li key={id} data-on={active === id}>
                <button onClick={() => setActive(id)} onMouseEnter={() => setActive(id)} onFocus={() => setActive(id)} aria-expanded={active === id}>
                  {name}
                </button>
                <p hidden={active !== id}>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
