import * as THREE from 'three'

// A 3D bottle built to match the product photo: same proportions, studio-lit brushed steel,
// glowing glass edges, and the photo's own water swirl flowing inside it.

type Pose = { p: number; x: number; y: number; s: number; rx: number; rz: number }

// Where the bottle sits at each point of the scroll (p runs 0 to 1 across the stage).
const WIDE: Pose[] = [
  { p: 0.0, x: 0, y: -3.22, s: 1.0, rx: 0, rz: 0 },
  { p: 0.17, x: 0, y: 0, s: 0.86, rx: 0, rz: 0 },
  { p: 0.3, x: 1.55, y: 0, s: 0.86, rx: 0, rz: -0.04 },
  { p: 0.42, x: 1.55, y: 0, s: 0.86, rx: 0, rz: -0.04 },
  { p: 0.53, x: -1.55, y: 0, s: 0.92, rx: 0.05, rz: 0.05 },
  { p: 0.64, x: -1.55, y: 0, s: 0.92, rx: 0.05, rz: 0.05 },
  { p: 0.75, x: 1.45, y: -1.3, s: 1.34, rx: 0.3, rz: -0.24 },
  { p: 0.85, x: 1.45, y: -1.3, s: 1.34, rx: 0.3, rz: -0.24 },
  { p: 0.95, x: 1.55, y: 0, s: 0.88, rx: 0, rz: 0 },
  { p: 1.0, x: 1.55, y: 0, s: 0.88, rx: 0, rz: 0 },
]

const NARROW: Pose[] = [
  { p: 0.0, x: 0, y: -2.05, s: 0.72, rx: 0, rz: 0 },
  { p: 0.17, x: 0, y: 0.7, s: 0.64, rx: 0, rz: 0 },
  { p: 0.42, x: 0, y: 0.7, s: 0.64, rx: 0, rz: -0.04 },
  { p: 0.53, x: 0, y: 0.66, s: 0.64, rx: 0.05, rz: 0.05 },
  { p: 0.64, x: 0, y: 0.66, s: 0.64, rx: 0.05, rz: 0.05 },
  { p: 0.75, x: 0.1, y: -0.1, s: 0.94, rx: 0.28, rz: -0.2 },
  { p: 0.85, x: 0.1, y: -0.1, s: 0.94, rx: 0.28, rz: -0.2 },
  { p: 0.95, x: 0, y: 0.7, s: 0.64, rx: 0, rz: 0 },
  { p: 1.0, x: 0, y: 0.7, s: 0.64, rx: 0, rz: 0 },
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

const seed = (n: number) => {
  const s = Math.sin(n * 127.1) * 43758.5453
  return s - Math.floor(s)
}

// ---------- textures made on the fly ----------

function glowTexture(inner: string, mid: string) {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  grad.addColorStop(0, inner)
  grad.addColorStop(0.35, mid)
  grad.addColorStop(1, 'rgba(10,40,90,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 256)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// Fine lines running around the steel, like a lathe-brushed finish.
function brushedTexture() {
  const c = document.createElement('canvas')
  c.width = 8
  c.height = 1024
  const g = c.getContext('2d')!
  for (let y = 0; y < c.height; y++) {
    const v = Math.round(84 + seed(y + 3) * 20 + seed(Math.floor(y / 9) + 900) * 10)
    g.fillStyle = `rgb(${v},${v},${v})`
    g.fillRect(0, y, c.width, 1)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(1, 2)
  return tex
}

function wordmarkTexture() {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 192
  const g = c.getContext('2d')!
  g.fillStyle = 'rgba(40,46,52,0.82)'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.font = '400 80px "Jost Variable", Futura, "Helvetica Neue", Arial, sans-serif'
  const text = 'OXYRA'
  const gap = 64
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

function powerButtonTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(110, 96, 10, 128, 128, 128)
  grad.addColorStop(0, '#d9dde0')
  grad.addColorStop(1, '#9aa1a7')
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 256)
  g.strokeStyle = '#5c646b'
  g.lineWidth = 13
  g.lineCap = 'round'
  g.beginPath()
  g.arc(128, 134, 52, -Math.PI / 2 + 0.62, -Math.PI / 2 - 0.62 + Math.PI * 2)
  g.stroke()
  g.beginPath()
  g.moveTo(128, 66)
  g.lineTo(128, 128)
  g.stroke()
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

// A photo studio for the steel and glass to reflect: tall soft lights on a dark set.
function studioEnvironment(renderer: THREE.WebGLRenderer) {
  const env = new THREE.Scene()
  env.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(60, 32, 16),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(0.012, 0.02, 0.035), side: THREE.BackSide }),
    ),
  )
  const light = (w: number, h: number, azimuth: number, y: number, r: number, gr: number, b: number) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(r, gr, b), side: THREE.DoubleSide }),
    )
    const a = (azimuth * Math.PI) / 180
    m.position.set(Math.sin(a) * 30, y, Math.cos(a) * 30)
    m.lookAt(0, y * 0.4, 0)
    env.add(m)
  }
  light(20, 46, -34, 4, 1.7, 1.74, 1.8) // broad key light, front left
  light(5, 46, 52, 4, 2.6, 2.7, 2.85) // narrow strip, front right
  light(9, 46, 8, 4, 0.32, 0.34, 0.37) // weak fill, straight on
  light(10, 46, 142, 2, 0.12, 0.5, 1.5) // blue rim light, behind right
  light(10, 46, -152, 2, 0.1, 0.4, 1.2) // blue rim light, behind left
  const top = new THREE.Mesh(
    new THREE.PlaneGeometry(34, 34),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0.75, 0.78, 0.82), side: THREE.DoubleSide }),
  )
  top.position.set(-4, 34, 10)
  top.lookAt(0, 0, 0)
  env.add(top)

  const pmrem = new THREE.PMREMGenerator(renderer)
  const tex = pmrem.fromScene(env, 0.015).texture
  pmrem.dispose()
  env.traverse((o) => {
    const mesh = o as THREE.Mesh
    mesh.geometry?.dispose?.()
    ;(mesh.material as THREE.Material | undefined)?.dispose?.()
  })
  return tex
}

// ---------- shaders ----------

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
  varying vec2 vUv;
  varying float vH;
  uniform float uBottom;
  uniform float uHeight;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalMatrix * normal;
    vV = -mv.xyz;
    vUv = uv;
    vH = clamp((position.y - uBottom) / uHeight, 0.0, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`

// The body of water: clear and dark in the middle, lit hard from the base, blue toward the walls.
const WATER_FRAG = /* glsl */ `
  uniform float uEnergy;
  varying vec3 vN;
  varying vec3 vV;
  varying float vH;
  void main() {
    float rim = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), 1.6);
    vec3 deep = vec3(0.0, 0.07, 0.3);
    vec3 wall = vec3(0.04, 0.34, 1.0);
    vec3 lit = vec3(0.55, 0.86, 1.0);
    float base = pow(1.0 - vH, 5.0) * (0.55 + 0.45 * uEnergy);
    float top = pow(vH, 9.0) * 0.5;
    vec3 col = mix(deep, wall, rim) + lit * base + wall * top;
    float alpha = 0.34 + rim * 0.5 + base * 0.5;
    gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.95));
  }
`

// The swirl from the product photo, wrapped inside the glass and kept moving.
const SWIRL_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTurn;
  uniform float uFlow;
  uniform float uGain;
  uniform float uTwist;
  varying vec3 vN;
  varying vec3 vV;
  varying vec2 vUv;
  void main() {
    vec2 uv = vec2(vUv.x * 2.0 + uTurn + vUv.y * uTwist, vUv.y - uFlow);
    vec3 c = texture2D(uMap, uv).rgb;
    float ends = smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
    // Fade where the surface turns edge-on, so it reads as water in a volume rather than a painted tube.
    float facing = abs(dot(normalize(vN), normalize(vV)));
    gl_FragColor = vec4(c * uGain * ends * smoothstep(0.12, 0.8, facing), 1.0);
  }
`

// Glass edges catching the light from the base: the bright cyan lines down each side.
const EDGE_FRAG = /* glsl */ `
  uniform float uEnergy;
  varying vec3 vN;
  varying vec3 vV;
  varying float vH;
  void main() {
    float rim = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), 3.4);
    float ends = smoothstep(0.0, 0.03, vH) * smoothstep(1.0, 0.95, vH);
    vec3 col = mix(vec3(0.1, 0.5, 1.0), vec3(0.75, 0.95, 1.0), rim) * rim * (0.75 + 0.6 * uEnergy);
    gl_FragColor = vec4(col * ends, 1.0);
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
  renderer.toneMappingExposure = 1.0
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  const envTex = studioEnvironment(renderer)
  scene.environment = envTex

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 60)
  camera.position.set(0, 0, 9.7)

  // ---------- bottle ----------
  // Measured from the photo: 3.9 tall, 1.24 across. Foot, base, glass, cap from the bottom up.
  const pivot = new THREE.Group() // position, scale, tilt
  const bottle = new THREE.Group() // spin
  pivot.add(bottle)
  scene.add(pivot)

  const brushed = brushedTexture()
  const steel = new THREE.MeshPhysicalMaterial({
    color: 0xb9bfc4,
    metalness: 1,
    roughness: 1,
    roughnessMap: brushed,
    anisotropy: 0.6,
    anisotropyRotation: Math.PI / 2,
    envMapIntensity: 1.0,
  })
  const v2 = (x: number, y: number) => new THREE.Vector2(x, y)

  const base = new THREE.Mesh(
    new THREE.LatheGeometry(
      [v2(0, -1.88), v2(0.595, -1.88), v2(0.62, -1.85), v2(0.62, -1.02), v2(0.605, -0.98), v2(0, -0.98)],
      128,
    ),
    steel,
  )
  const cap = new THREE.Mesh(
    new THREE.LatheGeometry(
      [
        v2(0, 1.4),
        v2(0.605, 1.4),
        v2(0.62, 1.42),
        v2(0.62, 1.8),
        v2(0.6, 1.87),
        v2(0.54, 1.935),
        v2(0.5, 1.95),
        v2(0, 1.95),
      ],
      128,
    ),
    steel,
  )
  const foot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.585, 0.07, 64),
    new THREE.MeshStandardMaterial({ color: 0x07090b, roughness: 0.85, metalness: 0 }),
  )
  foot.position.y = -1.915

  // The lit plate at the bottom of the glass.
  const plate = new THREE.Mesh(
    new THREE.CylinderGeometry(0.585, 0.585, 0.045, 64),
    new THREE.MeshBasicMaterial({ color: 0xd8f1ff }),
  )
  plate.position.y = -0.96

  const glassProfile = [v2(0.6, -0.98), v2(0.6, 1.3), v2(0.585, 1.36), v2(0.54, 1.4)]
  const glassGeo = new THREE.LatheGeometry(glassProfile, 128)
  const glass = new THREE.Mesh(
    glassGeo,
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      roughness: 0.03,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      envMapIntensity: 2.6,
      depthWrite: false,
    }),
  )
  glass.renderOrder = 5
  const edgeMat = new THREE.ShaderMaterial({
    vertexShader: SHELL_VERT,
    fragmentShader: EDGE_FRAG,
    uniforms: { uBottom: { value: -0.98 }, uHeight: { value: 2.38 }, uEnergy: { value: 0.4 } },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const glassEdge = new THREE.Mesh(glassGeo, edgeMat)
  glassEdge.renderOrder = 6

  const waterMat = new THREE.ShaderMaterial({
    vertexShader: SHELL_VERT,
    fragmentShader: WATER_FRAG,
    uniforms: { uBottom: { value: -0.94 }, uHeight: { value: 2.2 }, uEnergy: { value: 0.4 } },
    transparent: true,
    depthWrite: false,
  })
  const water = new THREE.Mesh(new THREE.CylinderGeometry(0.565, 0.565, 2.2, 96), waterMat)
  water.position.y = 0.16
  water.renderOrder = 1

  // Two layers of the photo's swirl turning against each other inside the water.
  const swirlTex = new THREE.TextureLoader().load('/images/water-swirl.jpg')
  swirlTex.wrapS = swirlTex.wrapT = THREE.MirroredRepeatWrapping
  swirlTex.colorSpace = THREE.SRGBColorSpace
  const swirlMaterial = (gain: number, twist: number) =>
    new THREE.ShaderMaterial({
      vertexShader: SHELL_VERT,
      fragmentShader: SWIRL_FRAG,
      uniforms: {
        uMap: { value: swirlTex },
        uTurn: { value: 0 },
        uFlow: { value: 0 },
        uGain: { value: gain },
        uTwist: { value: twist },
        uBottom: { value: 0 },
        uHeight: { value: 1 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  const swirlOuterMat = swirlMaterial(1.0, 0.18)
  const swirlInnerMat = swirlMaterial(1.0, -0.3)
  const swirlOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2.14, 96, 1, true), swirlOuterMat)
  const swirlInner = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 2.1, 64, 1, true), swirlInnerMat)
  swirlOuter.position.y = swirlInner.position.y = 0.14
  swirlOuter.renderOrder = swirlInner.renderOrder = 2

  const buttonTex = powerButtonTexture()
  const button = new THREE.Mesh(
    new THREE.CircleGeometry(0.115, 64),
    new THREE.MeshStandardMaterial({ map: buttonTex, metalness: 0.85, roughness: 0.38 }),
  )
  button.position.set(0, -1.52, 0.6235)
  const bezel = new THREE.Mesh(
    new THREE.TorusGeometry(0.119, 0.008, 12, 64),
    new THREE.MeshStandardMaterial({ color: 0x70787e, metalness: 1, roughness: 0.4 }),
  )
  bezel.position.set(0, -1.52, 0.622)

  const markTex = wordmarkTexture()
  const mark = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6225, 0.6225, 0.2, 48, 1, true, Math.PI - 0.6, 1.2),
    new THREE.MeshStandardMaterial({ map: markTex, transparent: true, metalness: 0.5, roughness: 0.55 }),
  )
  mark.position.y = -1.45

  // Blue light spilling from the glass onto the steel beside it.
  const lowLight = new THREE.PointLight(0x4aa8ff, 3, 2.2, 2)
  lowLight.position.set(0, -0.8, 0.9)
  const highLight = new THREE.PointLight(0x3a8cff, 1.5, 2, 2)
  highLight.position.set(0, 1.25, 0.9)

  bottle.add(base, cap, foot, plate, water, swirlOuter, swirlInner, glass, glassEdge, button, bezel, mark, lowLight, highLight)

  // ---------- hydrogen rising inside the glass ----------
  const INNER = 240
  const innerMesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1, 12, 12),
    new THREE.ShaderMaterial({
      vertexShader: BUBBLE_VERT,
      fragmentShader: BUBBLE_FRAG,
      uniforms: { uColor: { value: new THREE.Color(0xd8f0ff) }, uStrength: { value: 1.3 } },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    INNER,
  )
  innerMesh.renderOrder = 3
  innerMesh.frustumCulled = false
  bottle.add(innerMesh)
  const innerData = Array.from({ length: INNER }, (_, i) => ({
    a: seed(i + 1) * Math.PI * 2,
    h: seed(i + 31),
    speed: 0.1 + seed(i + 61) * 0.22,
    r: seed(i + 91),
    size: 0.006 + Math.pow(seed(i + 121), 2) * 0.024,
  }))

  // ---------- bubbles thrown off into the water around it ----------
  const OUTER = 130
  const outerMesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1, 20, 20),
    new THREE.ShaderMaterial({
      vertexShader: BUBBLE_VERT,
      fragmentShader: BUBBLE_FRAG,
      uniforms: { uColor: { value: new THREE.Color(0xa9dcff) }, uStrength: { value: 0.9 } },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    OUTER,
  )
  outerMesh.renderOrder = 7
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

  // ---------- the blue aura behind the bottle, and the hot glow at the base of the glass ----------
  const additive = (map: THREE.Texture, opacity: number) =>
    new THREE.MeshBasicMaterial({ map, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })
  const auraTex = glowTexture('rgba(70,160,255,0.85)', 'rgba(30,100,220,0.3)')
  const aura = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 7.5), additive(auraTex, 0.5))
  aura.position.z = -1.6
  aura.renderOrder = 0
  scene.add(aura)
  const flareTex = glowTexture('rgba(220,245,255,0.95)', 'rgba(90,180,255,0.35)')
  const flare = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.7), additive(flareTex, 0.3))
  flare.renderOrder = 8
  scene.add(flare)

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
  let flow = 0
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
    const energy = Math.min(1, 0.4 + cycle * 0.6 + velocity * 1.6)

    const pose = samplePose(narrow ? NARROW : WIDE, p)
    pivot.position.set(pose.x, pose.y, 0)
    pivot.scale.setScalar(pose.s)
    pivot.rotation.set(pose.rx, 0, pose.rz)
    if (!opts.reducedMotion) {
      spin += dt * 0.22
      flow += dt * (0.5 + energy)
    }
    // Scrolling turns the bottle; left alone, it keeps turning slowly.
    bottle.rotation.y = p * Math.PI * 6 + spin - 0.35

    // The water turns faster than the bottle and climbs, so it reads as a vortex.
    swirlOuterMat.uniforms.uTurn.value = flow * 0.05
    swirlOuterMat.uniforms.uFlow.value = flow * 0.035
    swirlOuterMat.uniforms.uGain.value = 0.75 + energy * 0.45
    swirlInnerMat.uniforms.uTurn.value = -flow * 0.09 + 0.37
    swirlInnerMat.uniforms.uFlow.value = flow * 0.06 + 0.5
    swirlInnerMat.uniforms.uGain.value = 0.7 + energy * 0.45

    aura.position.set(pose.x, pose.y + 0.15 * pose.s, -1.6)
    aura.scale.setScalar(pose.s * (0.9 + energy * 0.3))
    ;(aura.material as THREE.MeshBasicMaterial).opacity = 0.3 + energy * 0.4
    tmp.set(0, -0.93, 0)
    bottle.localToWorld(tmp)
    flare.position.set(tmp.x, tmp.y, tmp.z + 0.75 * pose.s)
    flare.scale.setScalar(pose.s)
    ;(flare.material as THREE.MeshBasicMaterial).opacity = 0.16 + energy * 0.2 + Math.sin(t * 1.4) * 0.04
    lowLight.intensity = 2 + energy * 3
    waterMat.uniforms.uEnergy.value = energy
    edgeMat.uniforms.uEnergy.value = energy

    // Column of fine bubbles rising in a slow helix.
    const shown = Math.floor(INNER * (0.35 + energy * 0.65))
    for (let i = 0; i < INNER; i++) {
      const d = innerData[i]
      if (i >= shown) {
        innerMesh.setMatrixAt(i, hidden)
        continue
      }
      const h = opts.reducedMotion ? d.h : (d.h + t * d.speed * (0.6 + energy)) % 1
      const ang = d.a + h * 7 + t * 0.5
      const rad = 0.05 + d.r * 0.34 + Math.sin(h * 9 + d.a) * 0.05
      const fade = Math.min(1, h * 8) * Math.min(1, (1 - h) * 10)
      tmp.set(Math.cos(ang) * rad, -0.9 + h * 2.1, Math.sin(ang) * rad)
      sc.setScalar(d.size * (0.6 + h * 0.8) * fade)
      innerMesh.setMatrixAt(i, m.compose(tmp, q, sc))
    }
    innerMesh.instanceMatrix.needsUpdate = true

    // Bubbles shaken loose around the cap. Scrolling throws off more of them.
    if (!opts.reducedMotion) {
      const visible = smooth(0.06, 0.16, p)
      spawnDebt += dt * visible * (1.5 + cycle * 9 + Math.min(velocity * 240, 60))
      while (spawnDebt >= 1) {
        spawnDebt -= 1
        const d = outerData[spawnCursor]
        spawnCursor = (spawnCursor + 1) % OUTER
        const a = Math.random() * Math.PI * 2
        d.pos.set(Math.cos(a) * 0.66, 1.36 + Math.random() * 0.1, Math.sin(a) * 0.66)
        bottle.localToWorld(d.pos)
        d.vel.set(Math.cos(a) * (0.25 + Math.random() * 0.5), 0.2 + Math.random() * 0.5, Math.sin(a) * 0.3)
        d.alive = true
        d.age = 0
        d.life = 2.6 + Math.random() * 2.4
        d.size = (0.012 + Math.pow(Math.random(), 2.4) * 0.065) * pose.s
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
      ;[brushed, swirlTex, buttonTex, markTex, auraTex, flareTex, envTex].forEach((x) => x.dispose())
      renderer.dispose()
    },
  }
}
