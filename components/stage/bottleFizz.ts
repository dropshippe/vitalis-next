// Live bubbles drawn over the glass part of the bottle photo, so the water inside looks like it's working.
// Coordinates are fractions of the glass area: x 0..1 across, y 0 (water surface) .. 1 (base).

type Fizz = { phase: number; h: number; speed: number; r: number; size: number; turn: number; big: boolean }

const seeded = (n: number) => {
  const s = Math.sin(n * 127.1) * 43758.5453
  return s - Math.floor(s)
}

export function startBottleFizz(
  canvas: HTMLCanvasElement,
  opts: { getEnergy: () => number; reducedMotion: boolean },
) {
  const g = canvas.getContext('2d')
  if (!g) return { stop: () => {}, setActive: (_on: boolean) => {} }

  // Fixed internal size: sharp enough for the closest zoom without resizing every frame.
  const W = (canvas.width = 560)
  const H = (canvas.height = 1100)

  const COUNT = 210
  const fizz: Fizz[] = Array.from({ length: COUNT }, (_, i) => {
    const big = seeded(i + 7) < 0.16
    return {
      phase: seeded(i + 1) * Math.PI * 2,
      h: seeded(i + 31),
      speed: big ? 0.1 + seeded(i + 61) * 0.08 : 0.14 + seeded(i + 61) * 0.22,
      r: seeded(i + 91),
      size: big ? 7 + seeded(i + 121) * 9 : 1.6 + seeded(i + 121) * 3.6,
      turn: 4 + seeded(i + 151) * 5,
      big,
    }
  })

  const draw = (t: number, energy: number) => {
    g.clearRect(0, 0, W, H)

    // Light from the base, breathing slowly.
    const pulse = 0.5 + 0.5 * Math.sin(t * 1.3)
    const glow = g.createRadialGradient(W / 2, H * 1.0, 0, W / 2, H * 1.0, H * 0.42)
    glow.addColorStop(0, `rgba(150,215,255,${0.2 + 0.2 * pulse * energy})`)
    glow.addColorStop(1, 'rgba(60,140,255,0)')
    g.fillStyle = glow
    g.fillRect(0, H * 0.5, W, H * 0.5)

    const shown = Math.floor(COUNT * (0.45 + 0.55 * energy))
    for (let i = 0; i < shown; i++) {
      const f = fizz[i]
      const h = opts.reducedMotion ? f.h : (f.h + t * f.speed * (0.55 + 0.6 * energy)) % 1 // 0 at base, 1 at surface
      // A loose helix that widens as it climbs, like the swirl in the photo.
      const ang = f.phase + h * f.turn + t * 0.35
      const spread = (0.07 + f.r * 0.3) * (0.55 + h * 0.6)
      const depth = Math.sin(ang) // -1 back of the glass, 1 front
      const x = W * (0.5 + Math.cos(ang) * spread)
      const y = H * (0.97 - h * 0.93)
      const fade = Math.min(1, h * 9) * Math.min(1, (1 - h) * 7)
      const size = f.size * (0.75 + h * 0.5) * (0.82 + depth * 0.18)
      const a = Math.min(1, fade * (0.56 + depth * 0.28) * (f.big ? 0.85 : 1))

      g.beginPath()
      g.arc(x, y, size, 0, Math.PI * 2)
      if (f.big) {
        g.strokeStyle = `rgba(225,243,255,${a})`
        g.lineWidth = 1.5
        g.stroke()
        g.fillStyle = `rgba(150,205,255,${a * 0.14})`
        g.fill()
        g.beginPath()
        g.arc(x - size * 0.36, y - size * 0.38, Math.max(1, size * 0.18), 0, Math.PI * 2)
        g.fillStyle = `rgba(255,255,255,${a})`
        g.fill()
      } else {
        g.fillStyle = `rgba(232,246,255,${a * 0.85})`
        g.fill()
      }
    }
  }

  if (opts.reducedMotion) {
    draw(0, 0.6)
    return { stop: () => {}, setActive: (_on: boolean) => {} }
  }

  let raf = 0
  let active = true
  let energy = opts.getEnergy()
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame)
    energy += (opts.getEnergy() - energy) * 0.05
    draw(now / 1000, energy)
  }
  raf = requestAnimationFrame(frame)

  return {
    stop: () => cancelAnimationFrame(raf),
    setActive: (on: boolean) => {
      if (on === active) return
      active = on
      cancelAnimationFrame(raf)
      if (on) raf = requestAnimationFrame(frame)
    },
  }
}
