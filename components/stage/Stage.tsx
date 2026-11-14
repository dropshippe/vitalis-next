'use client'

import { useEffect, useRef, useState } from 'react'
import type { BottleScene } from './bottleScene'
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

const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export default function Stage() {
  const sectionRef = useRef<HTMLElement>(null)
  const glRef = useRef<HTMLCanvasElement>(null)
  const bubblesRef = useRef<HTMLCanvasElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const cueRef = useRef<HTMLDivElement>(null)
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([])
  const [noWebgl, setNoWebgl] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const gl = glRef.current
    const bubbles = bubblesRef.current
    if (!section || !gl || !bubbles) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const getTarget = () => {
      const rect = section.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      return total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0
    }

    const onFrame = (p: number) => {
      const hero = heroRef.current
      if (hero) {
        const o = 1 - smooth(0.015, 0.09, p)
        hero.style.opacity = String(o)
        hero.style.transform = `translate3d(0, ${-p * 420}px, 0)`
        hero.style.visibility = o < 0.01 ? 'hidden' : 'visible'
      }
      if (cueRef.current) cueRef.current.style.opacity = String(1 - smooth(0.005, 0.04, p))
      bubbles.style.opacity = String(1 - smooth(0.05, 0.2, p) * 0.75)
      CHAPTERS.forEach((c, i) => {
        const el = chapterRefs.current[i]
        if (!el) return
        const o = smooth(c.from, c.from + 0.045, p) * (1 - smooth(c.to - 0.045, c.to, p))
        el.style.opacity = String(o)
        el.style.visibility = o < 0.01 ? 'hidden' : 'visible'
              })
    }

    let scene: BottleScene | null = null
    let cancelled = false
    // The 3D code is loaded after the page is interactive so the headline never waits for it.
    import('./bottleScene')
      .then(({ createBottleScene }) => {
        if (cancelled) return
        try {
          scene = createBottleScene(gl, { getTarget, onFrame, reducedMotion })
          gl.dataset.ready = 'true'
        } catch {
          setNoWebgl(true)
        }
      })
      .catch(() => setNoWebgl(true))

    // Until the scene is running (or if it can't), keep the copy in step with scrolling.
    const onScroll = () => {
      if (!scene) onFrame(getTarget())
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onFrame(getTarget())

    const stopBubbles = startHeroBubbles(bubbles, reducedMotion)

    const io = new IntersectionObserver(([entry]) => scene?.setActive(entry.isIntersecting))
    io.observe(section)

    return () => {
      cancelled = true
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
      stopBubbles()
      scene?.dispose()
    }
  }, [])

  let letter = 0

  return (
    <section ref={sectionRef} className="stage" data-dark data-dark-extend="0.2" aria-label="Oxyra hydrogen water bottle">
      <div className="stage-pin">
        <canvas ref={bubblesRef} className="stage-layer" aria-hidden="true" />
        {noWebgl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="stage-fallback" src="/images/bottle-hero.jpg" alt="The Oxyra bottle, glass body lit blue between a steel cap and base" />
        ) : (
          <canvas ref={glRef} className="stage-layer stage-gl" aria-hidden="true" />
        )}

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
          <span>Scroll to turn it</span>
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
