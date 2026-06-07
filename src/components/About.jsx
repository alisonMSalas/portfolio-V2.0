import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import fotomia from '../assets/fotomia.png'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const Counter = ({ target, suffix, label }) => {
  const [val, setVal] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      const obj = { v: 0 }
      gsap.to(obj, {
        v: target,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: () => setVal(Math.round(obj.v)),
      })
      obs.disconnect()
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])

  return (
    <div ref={ref} className="about-number-item">
      <span className="num">{val}{suffix}</span>
      <span className="desc">{label}</span>
    </div>
  )
}

const skills = [
  'React 19', 'Angular', 'TypeScript', 'JavaScript',
  'Node.js', 'Express', 'Spring Boot', 'Java',
  'PostgreSQL', 'MySQL', 'TypeORM',
  'Tailwind CSS', 'PrimeReact',
  'JWT', 'Swagger / OpenAPI',
  'Git', 'Figma',
]

const About = () => {
  const sectionRef = useRef(null)

  useGSAP(() => {
    const ease = 'power4.out'

    gsap.fromTo('.about .section-label',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.about .section-label', start: 'top 85%', toggleActions: 'play none none none' } }
    )
    gsap.fromTo('.about-word',
      { yPercent: 110 },
      { yPercent: 0, duration: 1.1, ease, stagger: 0.12,
        scrollTrigger: { trigger: '.about-title', start: 'top 82%', toggleActions: 'play none none none' } }
    )
    gsap.fromTo('.about-accent-line',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.9, ease: 'power3.out', transformOrigin: 'left center',
        scrollTrigger: { trigger: '.about-accent-line', start: 'top 85%', toggleActions: 'play none none none' } }
    )
    gsap.fromTo('.about-bio',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out', stagger: 0.2,
        scrollTrigger: { trigger: '.about-bio', start: 'top 82%', toggleActions: 'play none none none' } }
    )
    gsap.fromTo('.skill-tag',
      { opacity: 0, scale: 0.7, y: 12 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.8)', stagger: 0.04,
        scrollTrigger: { trigger: '.skills-grid', start: 'top 84%', toggleActions: 'play none none none' } }
    )
    gsap.fromTo('.about-image-side',
      { opacity: 0, scale: 0.88, x: 50 },
      { opacity: 1, scale: 1, x: 0, duration: 1.3, ease: 'power4.out',
        scrollTrigger: { trigger: '.about-image-side', start: 'top 84%', toggleActions: 'play none none none' } }
    )
    gsap.fromTo('.photo-wipe',
      { scaleX: 1 },
      { scaleX: 0, duration: 1.0, ease: 'power3.inOut', transformOrigin: 'right center',
        scrollTrigger: { trigger: '.about-image-side', start: 'top 84%', toggleActions: 'play none none none' } }
    )
    gsap.fromTo('.about-numbers',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-numbers', start: 'top 85%', toggleActions: 'play none none none' } }
    )
  }, { scope: sectionRef })

  return (
    <section id="sobre-mi" ref={sectionRef} className="about">
      <div className="section-label">Sobre mí</div>

      <div className="about-grid">
        <div>
          <h2 className="about-title">
            <span className="about-word-row"><span className="about-word">Creando el web</span></span>
            <span className="about-word-row"><span className="about-word">que <em>imagino</em></span></span>
          </h2>

          <div className="about-accent-line" />

          <p className="about-bio">
            Soy <strong>Alison Salas</strong>, desarrolladora Full-Stack con
            experiencia en aplicaciones empresariales completas. Actualmente
            realizando <strong>pasantías en CiAuto</strong>, donde construyo
            soluciones para la gestión de RRHH y la automatización de procesos
            financieros.
          </p>
          <p className="about-bio">
            Mi experiencia abarca <strong>frontend</strong> con React 19,
            Angular y TypeScript, <strong>backend</strong> con Node.js/Express y
            Spring Boot, bases de datos <strong>PostgreSQL</strong> y MySQL, y
            arquitecturas completas: autenticación JWT, generación de reportes
            Word/Excel, APIs REST documentadas con Swagger.
          </p>
          <p className="about-bio">
            Basada en <strong>Ambato, Ecuador</strong>. Disponible para
            proyectos freelance y oportunidades de trabajo.
          </p>

          <p className="skills-label">Tech stack</p>
          <div className="skills-grid">
            {skills.map((s) => (
              <span key={s} className="skill-tag" data-cursor>{s}</span>
            ))}
          </div>
        </div>

        <div className="about-image-side">
          <div className="about-image-frame">
            <img src={fotomia} alt="Alison Salas" />
            <div className="photo-wipe" />
          </div>

          <div className="about-numbers">
            <Counter target={2}  suffix="+" label="Años experiencia" />
            <Counter target={12} suffix="+" label="Proyectos"        />
            <div className="about-number-item">
              <span className="num" style={{ fontSize: '1.1rem', letterSpacing: '0.5px', color: 'var(--peach)' }}>
                CiAuto
              </span>
              <span className="desc">Pasantías activas</span>
            </div>
            <div className="about-number-item">
              <span className="num">∞</span>
              <span className="desc">Café bebido</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
