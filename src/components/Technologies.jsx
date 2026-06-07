import { useRef, useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SolarSystem, { techData } from './canvas/SolarSystem'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Circular SVG progress ring
const ProgressRing = ({ percent, color, size = 90 }) => {
  const r      = size / 2 - 7
  const circum = 2 * Math.PI * r
  const offset = circum - (circum * percent) / 100
  const cx     = size / 2
  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={4} />
      <circle
        cx={cx} cy={cx} r={r}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeDasharray={circum}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cx})`}
        style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
      />
      <text x={cx} y={cx + 5} textAnchor="middle" fill="white" fontSize="15" fontFamily="DM Sans" fontWeight="500">
        {percent}%
      </text>
    </svg>
  )
}

// Info panel that appears at each planet station
const InfoPanel = ({ station }) => {
  const visible = station > 0
  const tech    = visible ? techData[station - 1] : null

  return (
    <div className={`solar-info-panel${visible ? ' is-visible' : ''}`}>
      {tech && (
        <>
          <span className="solar-category" style={{ borderColor: tech.color + '44', color: tech.color }}>
            {tech.category}
          </span>
          <h3 className="solar-tech-name" style={{ color: tech.color }}>
            {tech.name}
          </h3>
          <div className="solar-ring-wrap">
            <ProgressRing percent={tech.percent} color={tech.color} />
            <span className="solar-skill-label">conocimiento</span>
          </div>
          <p className="solar-tech-desc">{tech.desc}</p>
          <div className="solar-counter">
            <span style={{ color: tech.color }}>{station}</span> / {techData.length}
          </div>
        </>
      )}
    </div>
  )
}

// Station dots nav on the right
const StationDots = ({ station }) => (
  <div className="solar-dots">
    {techData.map((t, i) => (
      <div
        key={t.name}
        className={`solar-dot${i < station ? ' passed' : ''}${i === station - 1 ? ' active' : ''}`}
        style={{ '--dot-color': t.color }}
        title={t.name}
      />
    ))}
  </div>
)

const Technologies = () => {
  const sectionRef  = useRef(null)
  const scrollRef   = useRef(0)
  const stationRef  = useRef(0)
  const [station, setStation] = useState(0)

  // Track scroll progress through the tall section
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: false,
      onUpdate: (self) => { scrollRef.current = self.progress },
    })

    // Entrance animation for the header text
    gsap.fromTo('.tech-header .section-label',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.tech-header', start: 'top 85%', toggleActions: 'play none none none' } }
    )
    gsap.fromTo('.tech-title',
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.1, ease: 'power4.out',
        scrollTrigger: { trigger: '.tech-title', start: 'top 85%', toggleActions: 'play none none none' } }
    )
  }, { scope: sectionRef })

  return (
    <section
      id="tecnologias"
      ref={sectionRef}
      style={{ height: `calc(100vh + ${techData.length * 45}vh)`, position: 'relative' }}
    >
      {/* Sticky canvas + overlay */}
      <div className="tech-sticky">
        {/* Header — only visible before scroll starts */}
        <div className="tech-header tech-header-overlay">
          <div className="section-label">Stack</div>
          <h2 className="tech-title">
            Mi galaxia<br /><em>tecnológica</em>
          </h2>
        </div>

        <Canvas
          camera={{ fov: 50, near: 0.1, far: 300, position: [0, 9, 13] }}
          dpr={[1, 2]}
          gl={{ antialias: false, alpha: false }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: '#0d0b14' }}
        >
          <Suspense fallback={null}>
            <SolarSystem
              scrollRef={scrollRef}
              stationRef={stationRef}
              onStationChange={setStation}
            />
          </Suspense>
        </Canvas>

        <InfoPanel station={station} />
        <StationDots station={station} />

        {/* Scroll hint */}
        <div className={`solar-scroll-hint${station > 0 ? ' hidden' : ''}`}>
          <span>scroll para explorar</span>
          <div className="hero-scroll-line" />
        </div>
      </div>
    </section>
  )
}

export default Technologies
