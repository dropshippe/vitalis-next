import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

// The bottle is modelled from the product's real proportions (roughly 9.25in tall, 2.76in wide):
// brushed steel base with the power button, a borosilicate glass body, and a steel cap.

type Pose = { p: number; x: number; y: number; s: number; rx: number; rz: number }

// Where the bottle sits at each point of the scroll (p runs 0 to 1 across the stage).
const WIDE: Pose[] = [
  { p: 0.0, x: 0, y: -3.42, s: 1.0, rx: 0, rz: 0 },
  { p: 0.17, x: 0, y: 0, s: 0.8, rx: 0, rz: 0 },
  { p: 0.3, x: 1.55, y: 0, s: 0.8, rx: 0, rz: -0.05 },
  { p: 0.42, x: 1.55, y: 0, s: 0.8, rx: 0, rz: -0.05 },
  { p: 0.53, x: -1.55, y: -0.05, s: 1.0, rx: 0.06, rz: 0.06 },
  { p: 0.64, x: -1.55, y: -0.05, s: 1.0, rx: 0.06, rz: 0.06 },
  { p: 0.75, x: 1.45, y: -1.35, s: 1.3, rx: 0.3, rz: -0.26 },
  { p: 0.85, x: 1.45, y: -1.35, s: 1.3, rx: 0.3, rz: -0.26 },
  { p: 0.95, x: 1.55, y: 0, s: 0.82, rx: 0, rz: 0 },
  { p: 1.0, x: 1.55, y: 0, s: 0.82, rx: 0, rz: 0 },
]

const NARROW: Pose[] = [
  { p: 0.0, x: 0, y: -2.05, s: 0.72, rx: 0, rz: 0 },
  { p: 0.17, x: 0, y: 0.7, s: 0.6, rx: 0, rz: 0 },
  { p: 0.42, x: 0, y: 0.7, s: 0.6, rx: 0, rz: -0.04 },
  { p: 0.53, x: 0, y: 0.6, s: 0.66, rx: 0.05, rz: 0.05 },
  { p: 0.64, x: 0, y: 0.6, s: 0.66, rx: 0.05, rz: 0.05 },
  { p: 0.75, x: 0.1, y: -0.1, s: 0.9, rx: 0.28, rz: -0.22 },
  { p: 0.85, x: 0.1, y: -0.1, s: 0.9, rx: 0.28, rz: -0.22 },
  { p: 0.95, x: 0, y: 0.7, s: 0.6, rx: 0, rz: 0 },
  { p: 1.0, x: 0, y: 0.7, s: 0.6, rx: 0, rz: 0 },
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
  return {
    p,
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    s: lerp(a.s, b.s, t),
    rx: lerp(a.rx, b.rx, t),
    rz: lerp(a.rz, b.rz, t),
  }
}

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  grad.addColorStop(0, 'rgba(90,180,255,0.9)')
  grad.addColorStop(0.35, 'rgba(40,120,220,0.32)')
  grad.addColorStop(1, 'rgba(10,40,90,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 256)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function wordmarkTexture() {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 192
  const g = c.getContext('2d')!
  g.clearRect(0, 0, c.width, c.height)
  g.fillStyle = 'rgba(28,34,40,0.9)'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.font = '500 84px "Instrument Sans Variable", "Helvetica Neue", Arial, sans-serif'
  const text = 'OXYRA'
  // Letter-spaced by hand so it works in every browser.
  const gap = 58
  const widths = [...text].map((ch) => g.measureText(ch).width)
  const total = widths.reduce((a, b) => a + b, 0) + gap * (text.length - 1)
  let x = (c.width - total) / 2
  ;[...text].forEach((ch, i) => {
    g.fillText(ch, x + widths[i] / 2, c.height / 2 + 6)
    x += widths[i] + gap
  })
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

const BUBBLE_VERT = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    #ifdef USE_INSTANCING
      mat4 im = instanceMatrix;
    #else
      mat4 im = mat4(1.0);
    #endif
    vec4 mv = modelViewMatrix * im * vec4(position, 1.0);
    vN = normalMatrix * mat3(im) * normal;
    vV = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`

// A bubble is mostly its edge: bright rim, clear centre, one small highlight.
const BUBBLE_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec3 n = normalize(vN);
    vec3 v = normalize(vV);
    float rim = pow(1.0 - max(dot(n, v), 0.0), 2.4);
    float spec = pow(max(dot(reflect(-normalize(vec3(0.45, 0.8, 0.55)), n), v), 0.0), 48.0);
    vec3 col = uColor * (rim * 0.95 + 0.035) + vec3(spec * 0.9);
    gl_FragColor = vec4(col * uStrength, 1.0);
  }
`

const SHELL_VERT = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  varying float vH;
  uniform float uBottom;
  uniform float uHeight;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalMatrix * normal;
    vV = -mv.xyz;
    vH = clamp((position.y - uBottom) / uHeight, 0.0, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`

// Water lit from the base: bright cyan at the bottom, deep blue toward the top.
const WATER_FRAG = /* glsl */ `
  uniform float uEnergy;
  varying vec3 vN;
  varying vec3 vV;
  varying float vH;
  void main() {
    float rim = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), 2.0);
    vec3 deep = vec3(0.02, 0.16, 0.56);
    vec3 lit = vec3(0.22, 0.68, 1.0);
    float lift = pow(1.0 - vH, 2.6) * (0.45 + 0.55 * uEnergy);
    vec3 col = mix(deep, lit, lift) + rim * vec3(0.05, 0.25, 0.6) * (0.5 + 0.5 * uEnergy);
    gl_FragColor = vec4(col, 0.5 + rim * 0.28);
  }
`

// Glass reads through its edges and two tall reflections that stay put while the bottle turns.
const GLASS_FRAG = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  varying float vH;
  void main() {
    vec3 n = normalize(vN);
    float rim = pow(1.0 - max(dot(n, normalize(vV)), 0.0), 3.2);
    float a = exp(-pow((n.x + 0.56) / 0.07, 2.0)) * 0.42;
    float b = exp(-pow((n.x - 0.74) / 0.035, 2.0)) * 0.3;
    float ends = smoothstep(0.0, 0.04, vH) * smoothstep(1.0, 0.96, vH);
    vec3 col = vec3(0.78, 0.9, 1.0) * (rim * 0.7 + (a + b) * ends);
    gl_FragColor = vec4(col, 1.0);
  }
`

export type BottleScene = {
  setActive: (on: boolean) => void
  dispose: () => void
}

export function createBottleScene(
  canvas: HTMLCanvasElement,
  opts: {
    getTarget: () => number
    onFrame: (p: number) => void
    reducedMotion: boolean
  },
): BottleScene {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' })
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.95
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = envTex
  scene.environmentIntensity = 0.7

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 60)
  camera.position.set(0, 0, 9)

  const key = new THREE.DirectionalLight(0xffffff, 2.2)
  key.position.set(3.5, 5, 6)
  scene.add(key)
  const rim = new THREE.PointLight(0x3b9cff, 60, 0, 2)
  rim.position.set(-4, 1.5, -3)
  scene.add(rim)

  // ---------- bottle ----------
  const pivot = new THREE.Group() // position, scale, tilt
  const bottle = new THREE.Group() // spin
  pivot.add(bottle)
  scene.add(pivot)

  const steel = new THREE.MeshPhysicalMaterial({
    color: 0xaeb5ba,
    metalness: 1,
    roughness: 0.34,
    anisotropy: 0.75,
    anisotropyRotation: Math.PI / 2,
  })
  const v2 = (x: number, y: number) => new THREE.Vector2(x, y)

  const base = new THREE.Mesh(
    new THREE.LatheGeometry(
      [v2(0, -2.015), v2(0.585, -2.015), v2(0.62, -1.975), v2(0.62, -0.965), v2(0.6, -0.925), v2(0, -0.925)],
      96,
    ),
    steel,
  )
  const cap = new THREE.Mesh(
    new THREE.LatheGeometry(
      [v2(0, 1.325), v2(0.61, 1.325), v2(0.64, 1.36), v2(0.64, 1.96), v2(0.6, 2.05), v2(0.54, 2.075), v2(0, 2.075)],
      96,
    ),
    steel,
  )
  const foot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.585, 0.06, 64),
    new THREE.MeshStandardMaterial({ color: 0x0c0f12, roughness: 0.9, metalness: 0 }),
  )
  foot.position.y = -2.045

  const glowMat = new THREE.MeshBasicMaterial({ color: 0x66c2ff })
  const glowRing = new THREE.Mesh(new THREE.CylinderGeometry(0.602, 0.602, 0.05, 64), glowMat)
  glowRing.position.y = -0.9

  const glass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 2.2, 96, 1, true),
    new THREE.ShaderMaterial({
      vertexShader: SHELL_VERT,
      fragmentShader: GLASS_FRAG,
      uniforms: { uBottom: { value: -1.1 }, uHeight: { value: 2.2 } },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  )
  glass.position.y = 0.225
  glass.renderOrder = 3

  const waterMat = new THREE.ShaderMaterial({
    vertexShader: SHELL_VERT,
    fragmentShader: WATER_FRAG,
    uniforms: { uBottom: { value: -1.01 }, uHeight: { value: 2.02 }, uEnergy: { value: 0.3 } },
    transparent: true,
    depthWrite: false,
  })
  const water = new THREE.Mesh(new THREE.CylinderGeometry(0.555, 0.555, 2.02, 64), waterMat)
  water.position.y = 0.135
  water.renderOrder = 1

  const button = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.13, 0.02, 48),
    new THREE.MeshPhysicalMaterial({ color: 0xd6dbde, metalness: 1, roughness: 0.22 }),
  )
  button.rotation.x = Math.PI / 2
  button.position.set(0, -1.56, 0.612)
  const buttonRing = new THREE.Mesh(new THREE.TorusGeometry(0.072, 0.007, 12, 48), glowMat)
  buttonRing.position.set(0, -1.56, 0.625)

  const markTex = wordmarkTexture()
  const mark = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6225, 0.6225, 0.22, 48, 1, true, Math.PI - 0.6, 1.2),
    new THREE.MeshStandardMaterial({ map: markTex, transparent: true, metalness: 0.4, roughness: 0.6 }),
  )
  mark.position.y = -1.5

  const inner = new THREE.PointLight(0x4aa8ff, 4, 6, 2)
  inner.position.set(0, -0.6, 0)

  bottle.add(base, cap, foot, glowRing, water, glass, button, buttonRing, mark, inner)

  // ---------- hydrogen column inside the glass ----------
  const INNER = 260
  const innerMesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1, 12, 12),
    new THREE.ShaderMaterial({
      vertexShader: BUBBLE_VERT,
      fragmentShader: BUBBLE_FRAG,
      uniforms: { uColor: { value: new THREE.Color(0xd8f0ff) }, uStrength: { value: 1.25 } },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    INNER,
  )
  innerMesh.renderOrder = 2
  innerMesh.frustumCulled = false
  bottle.add(innerMesh)
  const seed = (n: number) => {
    const s = Math.sin(n * 127.1) * 43758.5453
    return s - Math.floor(s)
  }
  const innerData = Array.from({ length: INNER }, (_, i) => ({
    a: seed(i + 1) * Math.PI * 2,
    h: seed(i + 31),
    speed: 0.1 + seed(i + 61) * 0.22,
    r: seed(i + 91),
    size: 0.006 + Math.pow(seed(i + 121), 2) * 0.022,
  }))

  // ---------- bubbles that escape into the water around it ----------
  const OUTER = 150
  const outerMesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1, 20, 20),
    new THREE.ShaderMaterial({
      vertexShader: BUBBLE_VERT,
      fragmentShader: BUBBLE_FRAG,
      uniforms: { uColor: { value: new THREE.Color(0xa9dcff) }, uStrength: { value: 0.95 } },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    OUTER,
  )
  outerMesh.renderOrder = 4
  outerMesh.frustumCulled = false
  scene.add(outerMesh)
  const outerData = Array.from({ length: OUTER }, () => ({
    alive: false,
    age: 0,
    life: 0,
    size: 0,
    wob: 0,
    pos: new THREE.Vector3(),
    vel: new THREE.Vector3(),
  }))
  let spawnCursor = 0
  let spawnDebt = 0

  // ---------- light behind the bottle ----------
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(7.5, 7.5),
    new THREE.MeshBasicMaterial({
      map: glowTexture(),
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  )
  glow.position.z = -1.6
  glow.renderOrder = 0
  scene.add(glow)

  // ---------- sizing ----------
  let narrow = false
  const resize = () => {
    const w = canvas.clientWidth || 1
    const h = canvas.clientHeight || 1
    narrow = w / h < 0.9
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, narrow ? 1.75 : 2))
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  // ---------- frame loop ----------
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const sc = new THREE.Vector3()
  const tmp = new THREE.Vector3()
  const hidden = new THREE.Matrix4().makeScale(0, 0, 0)
  for (let i = 0; i < OUTER; i++) outerMesh.setMatrixAt(i, hidden)

  let p = opts.getTarget()
  let velocity = 0
  let spin = 0
  let last = performance.now()
  let raf = 0
  let active = true
  let disposed = false

  const frame = (now: number) => {
    if (disposed) return
    raf = requestAnimationFrame(frame)
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    const t = now / 1000

    const target = opts.getTarget()
    const prev = p
    p += (target - p) * Math.min(1, dt * 7)
    const rawVel = Math.abs(p - prev) / Math.max(dt, 0.001)
    velocity += (rawVel - velocity) * Math.min(1, dt * 6)
    opts.onFrame(p)

    // How hard the bottle is working: strongest while a cycle is being described.
    const cycle = smooth(0.14, 0.3, p) * (1 - smooth(0.66, 0.78, p))
    const energy = Math.min(1, 0.28 + cycle * 0.72 + velocity * 1.6)

    const pose = samplePose(narrow ? NARROW : WIDE, p)
    pivot.position.set(pose.x, pose.y, 0)
    pivot.scale.setScalar(pose.s)
    pivot.rotation.set(pose.rx, 0, pose.rz)
    if (!opts.reducedMotion) spin += dt * 0.14
    bottle.rotation.y = p * Math.PI * 5 + spin - 0.5

    glow.position.x = pose.x
    glow.position.y = pose.y + 0.2 * pose.s
    glow.scale.setScalar(pose.s * (0.9 + energy * 0.35))
    ;(glow.material as THREE.MeshBasicMaterial).opacity = 0.22 + energy * 0.5
    inner.intensity = 2 + energy * 9
    waterMat.uniforms.uEnergy.value = energy

    // Column of fine bubbles rising in a slow helix.
    const shown = Math.floor(INNER * (0.3 + energy * 0.7))
    for (let i = 0; i < INNER; i++) {
      const d = innerData[i]
      if (i >= shown) {
        innerMesh.setMatrixAt(i, hidden)
        continue
      }
      const h = opts.reducedMotion ? d.h : (d.h + t * d.speed * (0.6 + energy)) % 1
      const ang = d.a + h * 7 + t * 0.5
      const rad = 0.05 + d.r * 0.3 + Math.sin(h * 9 + d.a) * 0.05
      const fade = Math.min(1, h * 8) * Math.min(1, (1 - h) * 10)
      tmp.set(Math.cos(ang) * rad, -0.86 + h * 1.98, Math.sin(ang) * rad)
      sc.setScalar(d.size * (0.6 + h * 0.8) * fade)
      innerMesh.setMatrixAt(i, m.compose(tmp, q, sc))
    }
    innerMesh.instanceMatrix.needsUpdate = true

    // Bubbles thrown off the cap seam. Scrolling shakes more of them loose.
    if (!opts.reducedMotion) {
      const visible = smooth(0.06, 0.16, p)
      spawnDebt += dt * visible * (2 + cycle * 14 + Math.min(velocity * 260, 70))
      while (spawnDebt >= 1) {
        spawnDebt -= 1
        const d = outerData[spawnCursor]
        spawnCursor = (spawnCursor + 1) % OUTER
        const a = Math.random() * Math.PI * 2
        d.pos.set(Math.cos(a) * 0.66, 1.3 + Math.random() * 0.1, Math.sin(a) * 0.66)
        bottle.localToWorld(d.pos)
        d.vel.set(Math.cos(a) * (0.25 + Math.random() * 0.5), 0.2 + Math.random() * 0.5, Math.sin(a) * 0.3)
        d.alive = true
        d.age = 0
        d.life = 2.6 + Math.random() * 2.4
        d.size = (0.014 + Math.pow(Math.random(), 2.2) * 0.075) * pose.s
        d.wob = Math.random() * 10
      }
    }
    for (let i = 0; i < OUTER; i++) {
      const d = outerData[i]
      if (!d.alive) continue
      d.age += dt
      if (d.age > d.life) {
        d.alive = false
        outerMesh.setMatrixAt(i, hidden)
        continue
      }
      d.vel.y += (1.05 - d.vel.y) * dt * 1.4
      d.vel.x *= 1 - dt * 1.2
      d.vel.z *= 1 - dt * 1.2
      d.pos.addScaledVector(d.vel, dt)
      d.pos.x += Math.sin(t * 3.1 + d.wob) * dt * 0.12
      const grow = Math.min(1, d.age * 5)
      const out = 1 - smooth(d.life - 0.5, d.life, d.age)
      sc.setScalar(d.size * grow * out)
      outerMesh.setMatrixAt(i, m.compose(d.pos, q, sc))
    }
    outerMesh.instanceMatrix.needsUpdate = true

    renderer.render(scene, camera)
  }
  raf = requestAnimationFrame(frame)

  return {
    setActive(on: boolean) {
      if (disposed || on === active) return
      active = on
      cancelAnimationFrame(raf)
      if (on) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    },
    dispose() {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh
        mesh.geometry?.dispose?.()
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
        else mat?.dispose?.()
      })
      markTex.dispose()
      envTex.dispose()
      pmrem.dispose()
      renderer.dispose()
    },
  }
}
