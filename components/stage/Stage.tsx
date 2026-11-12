'use client'

import { useEffect, useRef } from 'react'
import { startHeroBubbles } from './heroBubbles'

const HEADLINE = ['Water,', 'elevated.']

// Each chapter is on screen between `from` and `to` (fractions of the scroll through the stage).
const CHAPTERS = [
  {
    from: 0.25,
    to: 0.44,
    side: 'left',
    title: 'Press once.',
    body: 'A platinum-coated membrane in the base splits water and sends pure hydrogen up through the glass. No tablets, no cartridges, nothing to refill but the water.',
  },
  {
    from: 0.5,
    to: 0.66,
    side: 'right',
    title: 'Give it three minutes.',
    body: 'A fine column of hydrogen climbs through 460 ml of still water. A cycle runs three to five minutes. Drink it soon after, while the hydrogen is still in it.',
  },
  {
    from: 0.72,
    to: 0.87,
    side: 'left',
    title: 'Glass and steel.',
    body: 'Borosilicate glass that takes hot and cold without complaint. Brushed stainless steel at both ends. A silicone foot that stays where you put it.',
  },
  {
    from: 0.93,
    to: 1.2,
    side: 'left',
    title: 'About a week on one charge.',
    body: 'The 1,200 mAh battery runs around fifteen cycles, then refills over USB-C in two to three hours.',
    cta: true,
  },
] as const

// Where the bottle photo sits at each point of the scroll.
// x is % of stage width, y is % of stage height (from centre), s is zoom, r is tilt in degrees.
type Pose = { p: number; x: number; y: number; s: number; r: number }

const WIDE: Pose[] = [
  { p: 0.0, x: 0, y: 67, s: 1, r: 0 }, // just the cap, under the headline
  { p: 0.17, x: 0, y: 2, s: 1, r: 0 },
  { p: 0.28, x: 22, y: -24, s: 1.38, r: 0 }, // the base and power button
  { p: 0.42, x: 22, y: -24, s: 1.38, r: 0 },
  { p: 0.53, x: -22, y: 2, s: 1.08, r: 0 }, // the whole bottle
  { p: 0.64, x: -22, y: 2, s: 1.08, r: 0 },
  { p: 0.75, x: 22, y: 26, s: 1.42, r: -3 }, // the cap and glass
  { p: 0.85, x: 22, y: 26, s: 1.42, r: -3 },
  { p: 0.95, x: 22, y: 2, s: 1, r: 0 },
  { p: 1.0, x: 22, y: 2, s: 1, r: 0 },
]

const NARROW: Pose[] = [
  { p: 0.0, x: 0, y: 44, s: 1, r: 0 },
  { p: 0.17, x: 0, y: -14, s: 1, r: 0 },
  { p: 0.28, x: 0, y: -34, s: 1.35, r: 0 },
  { p: 0.42, x: 0, y: -34, s: 1.35, r: 0 },
  { p: 0.53, x: 0, y: -14, s: 1.05, r: 0 },
  { p: 0.64, x: 0, y: -14, s: 1.05, r: 0 },
  { p: 0.75, x: 0, y: 6, s: 1.35, r: -3 },
  { p: 0.85, x: 0, y: 6, s: 1.35, r: -3 },
  { p: 0.95, x: 0, y: -14, s: 1, r: 0 },
  { p: 1.0, x: 0, y: -14, s: 1, r: 0 },
]

const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function samplePose(keys: Pose[], p: number): Pose {
  let i = 0
  while (i < keys.length - 2 && p > keys[i + 1].p) i++
  const a = keys[i]
  const b = keys[i + 1]
  const t = smooth(a.p, b.p, p)
  return { p, x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), s: lerp(a.s, b.s, t), r: lerp(a.r, b.r, t) }
}

export default function Stage() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const bottleRef = useRef<HTMLImageElement>(null)
  const bubblesRef = useRef<HTMLCanvasElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const cueRef = useRef<HTMLDivElement>(null)
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    const pin = pinRef.current
    const bottle = bottleRef.current
    const bubbles = bubblesRef.current
    if (!section || !pin || !bottle || !bubbles) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const getTarget = () => {
      const rect = section.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      return total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0
    }

    const apply = (p: number) => {
      const w = pin.clientWidth
      const h = pin.clientHeight
      const pose = samplePose(w / h < 0.9 ? NARROW : WIDE, p)
      bottle.style.transform =
        `translate(-50%, -50%) translate3d(${(pose.x / 100) * w}px, ${(pose.y / 100) * h}px, 0) ` +
        `rotate(${pose.r}deg) scale(${pose.s})`

      const hero = heroRef.current
      if (hero) {
        const o = 1 - smooth(0.015, 0.09, p)
        hero.style.opacity = String(o)
        hero.style.transform = `translate3d(0, ${-p * 420}px, 0)`
        hero.style.visibility = o < 0.01 ? 'hidden' : 'visible'
      }
      if (cueRef.current) cueRef.current.style.opacity = String(1 - smooth(0.005, 0.04, p))
      bubbles.style.opacity = String(1 - smooth(0.05, 0.2, p) * 0.7)
      CHAPTERS.forEach((c, i) => {
        const el = chapterRefs.current[i]
        if (!el) return
        const o = smooth(c.from, c.from + 0.045, p) * (1 - smooth(c.to - 0.045, c.to, p))
        el.style.opacity = String(o)
        el.style.visibility = o < 0.01 ? 'hidden' : 'visible'
      })
    }

    // Follow the scroll with a little easing so the bottle glides instead of jumping.
    let p = getTarget()
    let last = performance.now()
    let raf = 0
    let running = false
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const target = getTarget()
      p = reducedMotion ? target : p + (target - p) * Math.min(1, dt * 7)
      apply(p)
      if (Math.abs(target - p) > 0.0004) {
        raf = requestAnimationFrame(frame)
      } else {
        running = false
      }
    }
    const wake = () => {
      if (running) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
    window.addEventListener('scroll', wake, { passive: true })
    window.addEventListener('resize', wake)
    apply(p)
    bottle.dataset.ready = 'true'

    const stopBubbles = startHeroBubbles(bubbles, reducedMotion)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', wake)
      window.removeEventListener('resize', wake)
      stopBubbles()
    }
  }, [])

  let letter = 0

  return (
    <section ref={sectionRef} className="stage" aria-label="Oxyra hydrogen water bottle">
      <div ref={pinRef} className="stage-pin">
        <canvas ref={bubblesRef} className="stage-layer" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={bottleRef}
          className="stage-bottle"
          src="/images/bottle-hero.jpg"
          width={728}
          height={1024}
          alt="The Oxyra bottle: a glass body lit blue, full of rising bubbles, between a brushed steel cap and base"
        />

        <div ref={heroRef} className="hero-copy">
          <h1 className="hero-title" aria-label="Water, elevated.">
            {HEADLINE.map((line) => (
              <span key={line} className="hero-line" aria-hidden="true">
                {[...line].map((ch) => {
                  const i = letter++
                  return (
                    <span
                      key={i}
                      className="hero-letter"
                      style={{ '--i': i, '--j': `${((i * 37) % 11) * 14}ms` } as React.CSSProperties}
                    >
                      {ch}
                    </span>
                  )
                })}
              </span>
            ))}
          </h1>
          <p className="hero-sub">
            Oxyra fills still water with hydrogen while you watch. One press, about three minutes.
          </p>
          <div className="hero-actions">
            <a className="btn btn-light" href="#buy">
              Buy from $59.99
            </a>
            <a className="link-quiet" href="#details">
              Read the details
            </a>
          </div>
        </div>

        <div ref={cueRef} className="scroll-cue" aria-hidden="true">
          <span>Scroll for a closer look</span>
        </div>

        {CHAPTERS.map((c, i) => (
          <div
            key={c.title}
            ref={(el) => {
              chapterRefs.current[i] = el
            }}
            className={`chapter chapter-${c.side}`}
          >
            <h2 className="chapter-title">{c.title}</h2>
            <p className="chapter-body">{c.body}</p>
            {'cta' in c && (
              <a className="btn btn-light chapter-cta" href="#buy">
                Buy from $59.99
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
