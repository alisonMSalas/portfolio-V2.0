import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense } from 'react'
import ParticleSphere from './canvas/ParticleSphere'

const Hero = () => (
  <section id="hero">
    <div className="hero-canvas-wrapper">
      <Canvas
        camera={{ fov: 45, near: 0.1, far: 100, position: [0, 0, 6.5] }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
        gl={{ antialias: false, alpha: true }}
      >
        <Suspense fallback={null}>
          <ParticleSphere />
        </Suspense>
        <EffectComposer>
          <Bloom intensity={2.2} mipmapBlur threshold={0.0} radius={0.85} />
        </EffectComposer>
      </Canvas>
    </div>

    <div className="hero-gradient-overlay" />

    <div className="hero-content">
      <span className="hero-eyebrow">Hola, soy</span>
      <h1 className="hero-name">
        <span className="hero-name-row">
          <span className="hero-name-inner">ALISON</span>
        </span>
        <span className="hero-name-row">
          <span className="hero-name-inner">SALAS</span>
        </span>
      </h1>
      <p className="hero-subtitle">
        Desarrolladora Full-Stack apasionada por crear experiencias
        digitales hermosas e interactivas. UTA · Ingeniería en Software.
      </p>
      <a href="#proyectos" className="hero-cta">
        Ver Proyectos <span className="hero-cta-arrow">→</span>
      </a>
    </div>

    <div className="hero-scroll">
      <span>scroll</span>
      <div className="hero-scroll-line" />
    </div>
  </section>
)

export default Hero
