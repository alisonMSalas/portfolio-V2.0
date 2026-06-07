import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { gsap } from 'gsap'
import * as THREE from 'three'

// ── Tech data ────────────────────────────────────────────────────────────────
export const RING_R = { 1: 2.2, 2: 3.8, 3: 5.6 }

export const techData = [
  // Ring 1 — web fundamentals
  { name: 'HTML5',       ring: 1, angleDeg: 0,   color: '#E34F26', percent: 90, category: 'Frontend',  desc: 'Estructura semántica, accesibilidad, formularios y APIs web.' },
  { name: 'CSS3',        ring: 1, angleDeg: 90,  color: '#1572B6', percent: 88, category: 'Frontend',  desc: 'Animaciones, Flexbox, Grid, diseño responsivo y variables CSS.' },
  { name: 'JavaScript',  ring: 1, angleDeg: 180, color: '#F7DF1E', percent: 82, category: 'Language',  desc: 'ES6+, async/await, DOM, closures y programación funcional.' },
  { name: 'TypeScript',  ring: 1, angleDeg: 270, color: '#3178C6', percent: 82, category: 'Language',  desc: 'Tipado estático, interfaces, generics, decoradores y strict mode.' },
  // Ring 2 — frameworks
  { name: 'React 19',    ring: 2, angleDeg: 0,   color: '#61DAFB', percent: 80, category: 'Frontend',  desc: 'Hooks, Server Components, Context API. Usado en app de RRHH en CiAuto.' },
  { name: 'Angular',     ring: 2, angleDeg: 72,  color: '#DD0031', percent: 85, category: 'Frontend',  desc: 'SPAs, componentes, servicios, RxJS, testing con Karma/Jasmine.' },
  { name: 'Node.js',     ring: 2, angleDeg: 144, color: '#68A063', percent: 76, category: 'Backend',   desc: 'Express 5, APIs REST, middlewares, autenticación JWT, Swagger/OpenAPI.' },
  { name: 'Spring Boot', ring: 2, angleDeg: 216, color: '#6DB33F', percent: 78, category: 'Backend',   desc: 'APIs REST, microservicios, seguridad, reportes PDF/Excel con Apache POI.' },
  { name: 'Tailwind',    ring: 2, angleDeg: 288, color: '#38BDF8', percent: 82, category: 'Frontend',  desc: 'Utility-first CSS, diseño responsivo rápido y design systems.' },
  // Ring 3 — data, tools & integration
  { name: 'PostgreSQL',  ring: 3, angleDeg: 0,   color: '#336791', percent: 80, category: 'Database',       desc: 'BD relacional: diseño, migraciones con TypeORM, consultas complejas.' },
  { name: 'Java',        ring: 3, angleDeg: 72,  color: '#F89820', percent: 72, category: 'Backend',        desc: 'POO, Spring Boot, reportes Excel/PDF con Apache POI e iText7.' },
  { name: 'TypeORM',     ring: 3, angleDeg: 144, color: '#E83524', percent: 74, category: 'Database',       desc: 'ORM para TypeScript/Node.js: entidades, relaciones, migraciones.' },
  { name: 'n8n',         ring: 3, angleDeg: 216, color: '#EA4B71', percent: 70, category: 'Automatización', desc: 'Flujos de automatización: envío masivo de emails, clasificación de transacciones bancarias y webhooks desde Spring Boot.' },
  { name: 'Git',         ring: 3, angleDeg: 288, color: '#F05032', percent: 80, category: 'Tools',          desc: 'Control de versiones, branching, pull requests y trabajo en equipo.' },
]

function getPlanetPos(tech) {
  const r = RING_R[tech.ring]
  const a = tech.angleDeg * (Math.PI / 180)
  return new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r)
}

function getCamForStation(station) {
  if (station === 0) {
    return {
      pos:    new THREE.Vector3(0, 9, 13),
      target: new THREE.Vector3(0, 0, 0),
    }
  }
  const tech  = techData[station - 1]
  const pPos  = getPlanetPos(tech)
  const angle = Math.atan2(pPos.z, pPos.x)
  const camR  = RING_R[tech.ring] + 2.8
  return {
    pos:    new THREE.Vector3(Math.cos(angle) * camR, 2.4, Math.sin(angle) * camR),
    target: pPos.clone(),
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────
const Sun = () => (
  <group>
    {/* Core */}
    <mesh>
      <sphereGeometry args={[0.55, 32, 32]} />
      <meshStandardMaterial
        color="#FFF8DC"
        emissive={new THREE.Color(3.0, 1.8, 0.2)}
        emissiveIntensity={1}
        toneMapped={false}
      />
    </mesh>
    {/* Inner corona */}
    <mesh>
      <sphereGeometry args={[0.85, 32, 32]} />
      <meshStandardMaterial
        color="#FF9900"
        emissive={new THREE.Color(2.5, 0.8, 0.0)}
        emissiveIntensity={0.4}
        transparent
        opacity={0.18}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
    {/* Outer corona */}
    <mesh>
      <sphereGeometry args={[1.3, 32, 32]} />
      <meshStandardMaterial
        color="#FFB347"
        emissive={new THREE.Color(1.5, 0.5, 0.0)}
        emissiveIntensity={0.2}
        transparent
        opacity={0.07}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  </group>
)

const OrbitRing = ({ radius }) => (
  <mesh rotation={[Math.PI / 2, 0, 0]}>
    <torusGeometry args={[radius, 0.008, 8, 160]} />
    <meshBasicMaterial color="#f5a8cb" transparent opacity={0.08} depthWrite={false} />
  </mesh>
)

const Planet = ({ tech, index, stationRef }) => {
  const groupRef    = useRef(null)
  const meshRef     = useRef(null)
  const scaleProxy  = useRef({ v: 0 })
  const emitProxy   = useRef({ v: 0 })
  const bobOffset   = useRef(Math.random() * Math.PI * 2)

  const basePos = getPlanetPos(tech)
  const hdrColor = useMemo(() => new THREE.Color(tech.color).multiplyScalar(2.5), [tech.color])

  useFrame(({ clock }, delta) => {
    if (!groupRef.current || !meshRef.current) return

    const station  = stationRef.current
    const isUnlocked = index < station       // planet has been revealed
    const isActive   = index === station - 1 // currently focused

    // ── Appear / disappear ────────────────────────
    const targetScale = isUnlocked ? (isActive ? 1.55 : 1.0) : 0
    const targetEmit  = isUnlocked ? (isActive ? 1.6  : 0.3) : 0
    scaleProxy.current.v += (targetScale - scaleProxy.current.v) * Math.min(1, delta * 5)
    emitProxy.current.v  += (targetEmit  - emitProxy.current.v)  * Math.min(1, delta * 4)

    groupRef.current.scale.setScalar(Math.max(0.001, scaleProxy.current.v))
    meshRef.current.material.emissiveIntensity = emitProxy.current.v

    // ── Bobbing ───────────────────────────────────
    const bob = Math.sin(clock.elapsedTime * 0.7 + bobOffset.current) * 0.12
    groupRef.current.position.set(basePos.x, bob, basePos.z)

    // ── Slow self-rotation ────────────────────────
    meshRef.current.rotation.y += delta * 0.4
  })

  return (
    <group ref={groupRef} position={[basePos.x, 0, basePos.z]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.27, 32, 32]} />
        <meshStandardMaterial
          color={tech.color}
          emissive={hdrColor}
          emissiveIntensity={0}
          roughness={0.2}
          metalness={0.6}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

// ── Camera controller ─────────────────────────────────────────────────────────
// Uses GSAP tweens on station change → instant-feel response, no "catching up"
const CameraController = ({ scrollRef, stationRef, onStationChange }) => {
  const { camera } = useThree()
  const lookAt      = useRef(new THREE.Vector3(0, 0, 0))
  const prevStation = useRef(-1)

  useFrame(() => {
    const progress = scrollRef.current
    // floor + small threshold: reacts as soon as you cross 30% into the next station
    const raw     = progress * techData.length
    const station = Math.min(Math.floor(raw + 0.3), techData.length)

    if (station !== prevStation.current) {
      prevStation.current = station
      stationRef.current  = station
      onStationChange(station)

      const { pos, target } = getCamForStation(station)

      // Tween camera position (GSAP handles easing, no per-frame drift)
      gsap.to(camera.position, {
        x: pos.x, y: pos.y, z: pos.z,
        duration: 0.65,
        ease: 'power2.inOut',
        overwrite: 'auto',
      })

      // Tween lookAt target
      gsap.to(lookAt.current, {
        x: target.x, y: target.y, z: target.z,
        duration: 0.65,
        ease: 'power2.inOut',
        overwrite: 'auto',
      })
    }

    // Apply lookAt every frame (the target is being tweened by GSAP)
    camera.up.set(0, 1, 0)
    camera.lookAt(lookAt.current)
  })

  return null
}

// ── Main scene ────────────────────────────────────────────────────────────────
const SolarSystem = ({ scrollRef, stationRef, onStationChange }) => (
  <>
    <ambientLight intensity={0.15} />
    <pointLight position={[0, 0, 0]} intensity={8} distance={12} color="#FFE4A0" />
    <pointLight position={[0, 4, 0]} intensity={1} color="#c9a8e8" />

    <Stars radius={120} depth={60} count={6000} factor={3.5} saturation={0.4} fade speed={0.3} />

    <Sun />

    {Object.values(RING_R).map((r) => (
      <OrbitRing key={r} radius={r} />
    ))}

    {techData.map((tech, i) => (
      <Planet key={tech.name} tech={tech} index={i} stationRef={stationRef} />
    ))}

    <CameraController
      scrollRef={scrollRef}
      stationRef={stationRef}
      onStationChange={onStationChange}
    />

    <EffectComposer>
      <Bloom intensity={2.5} mipmapBlur threshold={0.0} radius={0.9} />
    </EffectComposer>
  </>
)

export default SolarSystem
