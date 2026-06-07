import { useRef, useState, useCallback, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import imgCiAutoRRHH  from '../assets/appciauto.png'
import imgCiAutoAuto  from '../assets/automatizacionesciauto.png'
import imgSeguro    from '../assets/seguro.png'
import imgFinanzas  from '../assets/finanzas.png'
import imgReservas  from '../assets/reservas.png'
import imgForo      from '../assets/foro.jpg'
import imgSpa       from '../assets/spa.jpg'
import imgSalud     from '../assets/salud.png'
import imgPagina    from '../assets/pagina.png'
import imgMath      from '../assets/math.png'
import imgTask      from '../assets/task.png'
import imgPortfolio from '../assets/portafolio.png'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const projects = [
  {
    tag: 'CiAuto · RRHH',
    name: 'App de Gestión RRHH',
    img: imgCiAutoRRHH,
    emoji: '👥',
    gradient: 'linear-gradient(135deg, #0a0d1a 0%, #101830 100%)',
    tech: ['React 19', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'TypeORM', 'JWT'],
    github: null,
    desc: 'Aplicación full-stack para gestión de RRHH con roles (Admin, Empleado, Firmante, Oficial): gestión de empleados y accesos, certificados laborales con generación .docx, control de vacaciones, reportes exportables a Excel y autenticación JWT. API REST documentada con Swagger.',
  },
  {
    tag: 'CiAuto · Automatización',
    name: 'CIAuto Automation System',
    img: imgCiAutoAuto,
    emoji: '🏭',
    gradient: 'linear-gradient(135deg, #0d1010 0%, #152020 100%)',
    tech: ['Java', 'Spring Boot', 'Angular', 'PostgreSQL', 'JWT', 'n8n'],
    github: null,
    desc: 'Sistema full-stack para automatización de procesos financieros de una empresa automotriz: Cuentas por Cobrar, aging de cartera, reportes Excel/PDF, procesamiento de estados de cuenta bancarios, módulo de Riesgo de Clientes, catálogo de vehículos con importación XML/Excel y flujos automatizados con n8n.',
  },
  { tag: 'Web App',      name: 'Gestor de Seguros',          img: imgSeguro,    tech: ['Angular','Karma','Jasmine','TypeScript'], github: 'https://github.com/alisonMSalas/insurance-manager-front',  desc: 'Plataforma para gestión de seguros con pruebas automatizadas. Componentes, servicios y validaciones con Angular + testing con Karma/Jasmine.' },
  { tag: 'Web App',      name: 'Finanzas Personales',        img: imgFinanzas,  tech: ['Angular','TypeScript','Chart.js'],        github: 'https://github.com/alisonMSalas/finance-management-back',  desc: 'App para gestionar finanzas: metas de ahorro, control de gastos, automatización de pagos y reportes visuales interactivos.' },
  { tag: 'Reservas',     name: 'Reserva de Aulas — UTA',     img: imgReservas,  tech: ['React','Bootstrap','JavaScript'],         github: 'https://github.com/FreddyA12/reservas-aulas-front',        desc: 'Sistema implementado en la UTA para gestión de reservas de aulas y laboratorios. Utilizado activamente por la facultad.' },
  { tag: 'App Móvil',    name: 'Foro Académico',             img: imgForo,      tech: ['Vue.js','Ionic'],                         github: 'https://github.com/rafaelsoriano04/uta-forum-front',       desc: 'Aplicación móvil para foros académicos: publicaciones, comentarios, gestión de perfil y sistema de strikes.' },
  { tag: 'Web App',      name: 'Spa Manage',                 img: imgSpa,       tech: ['Angular'],                               github: 'https://github.com/alisonMSalas/Therapy-management',        desc: 'Sistema CRUD para administrar salas, citas y clientes de un spa. Enfoque en eficiencia de flujos.' },
  { tag: 'Web App',      name: 'Sistema de Salud',           img: imgSalud,     tech: ['Java','MySQL','Swing'],                   github: 'https://github.com/rafaelsoriano04/gestor-centro-de-salud', desc: 'Sistema completo para la gestión administrativa y clínica de centros de salud.' },
  { tag: 'Hotel',        name: 'Hotel Agave Website',        img: imgPagina,    tech: ['HTML5','CSS3','JavaScript'],              github: null,                                                        desc: 'Plataforma web moderna para reservas e información del hotel.' },
  { tag: 'App Móvil',    name: 'MathMaster Challenge',       img: imgMath,      tech: ['Java','Android'],                         github: null,                                                        desc: 'Juego educativo interactivo para mejorar habilidades matemáticas.' },
  { tag: 'Productividad',name: 'Task Master',                img: imgTask,      tech: ['Java','MySQL','Swing'],                   github: null,                                                        desc: 'Aplicación para organización y gestión de tareas diarias.' },
  { tag: 'Diseño',       name: 'Portafolio Personal',        img: imgPortfolio, tech: ['HTML5','CSS3','JavaScript'],              github: 'https://github.com/alisonMSalas/alisonMSalas.github.io',   desc: 'Diseño y desarrollo de mi portafolio web personal.' },
]

const pad = (n) => String(n).padStart(2, '0')

const Projects = () => {
  const sectionRef  = useRef(null)
  const contentRef  = useRef(null)
  const busy        = useRef(false)
  const [idx, setIdx] = useState(0)

  // ── Entrance animation ─────────────────────────────────────────────────────
  useGSAP(() => {
    const st = { scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' } }
    gsap.fromTo('.projects .section-label', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', ...st })
    gsap.fromTo('.projects-title',          { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power4.out', ...st })
    gsap.fromTo('.console-wrapper',         { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', ...st })
  }, { scope: sectionRef })

  // ── Navigation ─────────────────────────────────────────────────────────────
  const goTo = useCallback((newIdx, dir) => {
    if (busy.current) return
    busy.current = true

    const el = contentRef.current
    const tl = gsap.timeline({ onComplete: () => { busy.current = false } })

    tl.to(el,  { x: dir * -50, opacity: 0, duration: 0.2, ease: 'power2.in' })
      .call(() => setIdx(newIdx))
      .set(el,  { x: dir * 50, opacity: 0 })
      .to(el,   { x: 0, opacity: 1, duration: 0.28, ease: 'power2.out' })
  }, [])

  const goNext = useCallback(() => goTo((idx + 1) % projects.length,  1), [idx, goTo])
  const goPrev = useCallback(() => goTo((idx - 1 + projects.length) % projects.length, -1), [idx, goTo])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft')  goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  const p = projects[idx]

  return (
    <section id="proyectos" ref={sectionRef} className="projects">
      <div className="projects-header">
        <div className="section-label">Mi trabajo</div>
        <h2 className="projects-title">Proyectos <em>destacados</em></h2>
      </div>

      {/* ── Space console ── */}
      <div className="console-wrapper">
        {/* Corner decorations */}
        <span className="cc tl" /><span className="cc tr" />
        <span className="cc bl" /><span className="cc br" />

        {/* Status bar */}
        <div className="console-bar">
          <span className="console-status">
            <span className="console-dot-blink" />
            SISTEMA ONLINE
          </span>
          <span className="console-id">ID-{pad(idx + 1)} / {pad(projects.length)}</span>
          <span className="console-tag-label">[{p.tag.toUpperCase()}]</span>
        </div>

        {/* Main area */}
        <div className="console-main" ref={contentRef}>
          {/* Image */}
          <div
            className="console-img-area"
            style={!p.img ? { background: p.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}}
          >
            {p.img
              ? <img src={p.img} alt={p.name} />
              : <span style={{ fontSize: 72, lineHeight: 1 }}>{p.emoji}</span>
            }
            <div className="console-scanlines" />
            <div className="console-img-overlay" />
          </div>

          {/* Info */}
          <div className="console-info-area">
            <p className="console-mission">▸ MISIÓN ACTUAL</p>
            <h3 className="console-proj-name">{p.name}</h3>
            <p className="console-proj-desc">{p.desc}</p>

            <div className="console-tech-row">
              {p.tech.map((t) => <span key={t} className="console-tech-tag">{t}</span>)}
            </div>

            {p.github ? (
              <a
                href={p.github}
                className="console-link"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor
              >
                ▸ ACCEDER AL REPOSITORIO
              </a>
            ) : (
              <span className="console-link-disabled">▸ REPOSITORIO PRIVADO</span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="console-controls">
          <button className="console-nav-btn" onClick={goPrev} data-cursor>
            ◀ ANTERIOR
          </button>

          <div className="console-center-controls">
            <span className="console-counter">
              {pad(idx + 1)}<span className="counter-sep"> / </span>
              <span className="counter-total">{pad(projects.length)}</span>
            </span>
            <div className="console-dots-row">
              {projects.map((_, i) => (
                <button
                  key={i}
                  className={`console-dot-btn${i === idx ? ' active' : ''}`}
                  onClick={() => goTo(i, i > idx ? 1 : -1)}
                  data-cursor
                />
              ))}
            </div>
          </div>

          <button className="console-nav-btn" onClick={goNext} data-cursor>
            SIGUIENTE ▶
          </button>
        </div>
      </div>

      <p className="console-hint">← → para navegar con el teclado</p>
    </section>
  )
}

export default Projects
