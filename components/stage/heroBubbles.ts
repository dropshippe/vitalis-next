// The landing moment: a plume of bubbles surges up from the bottom of the screen
// and carries the headline into view, then settles into a slow drift.

type Bubble = { x: number; y: number; r: number; vy: number; wob: number; amp: number; a: number }

export function startHeroBubbles(canvas: HTMLCanvasElement, reducedMotion: boolean) {
  const g = canvas.getContext('2d')
  if (!g) return () => {}

  let w = 0
  let h = 0
  let dpr = 1
  const bubbles: Bubble[] = []
  let last = performance.now()
  let raf = 0
  let debt = 0
  let elapsed = 0 // animation time, so a slow first frame can't skip the surge

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = canvas.clientWidth
    h = canvas.clientHeight
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  const spawn = (plume: boolean) => {
    // The plume gathers under the headline; the drift afterwards spans the whole width.
    const spread = plume ? Math.min(w * 0.62, 900) : w
    const centre = w / 2
    const u = Math.random() + Math.random() - 1 // triangular, denser in the middle
    const big = Math.random() < 0.12
    bubbles.push({
      x: plume ? centre + u * spread * 0.5 : Math.random() * w,
      y: h + 20 + Math.random() * 60,
      r: big ? 7 + Math.random() * 13 : 1.2 + Math.random() * 4.2,
      vy: plume ? h * (0.55 + Math.random() * 0.75) : h * (0.05 + Math.random() * 0.09),
      wob: Math.random() * 10,
      amp: 4 + Math.random() * 14,
      a: 0.25 + Math.random() * 0.55,
    })
  }

  const draw = (b: Bubble, t: number) => {
    const x = b.x + Math.sin(t * 2.2 + b.wob) * b.amp
    g.beginPath()
    g.arc(x, b.y, b.r, 0, Math.PI * 2)
    g.strokeStyle = `rgba(190,228,255,${b.a})`
    g.lineWidth = b.r > 6 ? 1.1 : 0.9
    g.stroke()
    if (b.r > 2.4) {
      g.fillStyle = `rgba(120,190,255,${b.a * 0.1})`
      g.fill()
      g.beginPath()
      g.arc(x - b.r * 0.36, b.y - b.r * 0.4, Math.max(0.6, b.r * 0.16), 0, Math.PI * 2)
      g.fillStyle = `rgba(255,255,255,${b.a * 0.9})`
      g.fill()
    }
  }

  if (reducedMotion) {
    // One still frame: a few bubbles, no movement.
    for (let i = 0; i < 26; i++) {
      spawn(false)
      bubbles[i].y = Math.random() * h
    }
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    bubbles.forEach((b) => draw(b, 0))
    return () => ro.disconnect()
  }

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame)
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    elapsed += dt
    const t = now / 1000

    // Surge for the first two seconds, then taper to a quiet drift.
    const surge = elapsed < 0.15 ? 0 : Math.max(0, 1 - (elapsed - 0.15) / 2.1)
    const density = Math.min(1.6, w / 900)
    debt += dt * (surge * surge * 260 * density + 5 * density)
    while (debt >= 1) {
      debt -= 1
      spawn(surge > 0.12 && Math.random() < 0.9)
    }

    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    g.clearRect(0, 0, w, h)
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i]
      b.y -= b.vy * dt
      // Fast bubbles ease off as they climb, like real ones reaching calmer water.
      b.vy += (h * 0.09 - b.vy) * dt * 0.55
      if (b.y < -40) {
        bubbles.splice(i, 1)
        continue
      }
      draw(b, t)
    }
  }
  raf = requestAnimationFrame(frame)

  return () => {
    cancelAnimationFrame(raf)
    ro.disconnect()
  }
}
