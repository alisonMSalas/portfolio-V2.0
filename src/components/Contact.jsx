import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const Contact = () => {
  const sectionRef = useRef(null)

  useGSAP(() => {
    const ease = 'power3.out'
    const st = (trigger) => ({
      scrollTrigger: { trigger, start: 'top 82%', toggleActions: 'play none none none' },
    })

    gsap.fromTo('.contact .section-label',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease, ...st('.contact .section-label') }
    )
    gsap.fromTo('.contact-title',
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.1, ease: 'power4.out', ...st('.contact-title') }
    )
    gsap.fromTo('.contact-form-wrapper',
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 1.1, ease: 'power4.out', ...st('.contact-form-wrapper') }
    )
    gsap.fromTo('.contact-detail-item',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.8, ease, stagger: 0.15, ...st('.contact-info-aside') }
    )
  }, { scope: sectionRef })

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.target
    const mailto = `mailto:alisonsalas0319@gmail.com?subject=${encodeURIComponent(form.subject.value)}&body=${encodeURIComponent(`De: ${form.name.value} <${form.email.value}>\n\n${form.message.value}`)}`
    window.location.href = mailto
  }

  return (
    <section id="contacto" ref={sectionRef} className="contact" style={{ display: 'block', padding: '140px 52px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="section-label">Contacto</div>

        <h2 className="contact-title">
          ¿Creamos algo<br />
          <em>juntos?</em>
        </h2>

        <div className="contact-grid" style={{ marginTop: 56 }}>
          {/* Form */}
          <div className="contact-form-wrapper">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Nombre</label>
                  <input id="name" name="name" type="text" placeholder="Tu nombre" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" placeholder="tu@email.com" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="subject">Asunto</label>
                <input id="subject" name="subject" type="text" placeholder="¿De qué se trata?" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Mensaje</label>
                <textarea id="message" name="message" rows={5} placeholder="Cuéntame sobre tu proyecto..." required />
              </div>
              <button type="submit" className="btn-submit" data-cursor>
                Enviar mensaje →
              </button>
            </form>
          </div>

          {/* Contact info */}
          <div className="contact-info-aside">
            <div className="contact-detail-item">
              <div className="contact-detail-icon">✉</div>
              <div>
                <div className="contact-detail-label">Email</div>
                <div className="contact-detail-value">alisonsalas0319@gmail.com</div>
              </div>
            </div>

            <div className="contact-detail-item">
              <div className="contact-detail-icon">📍</div>
              <div>
                <div className="contact-detail-label">Ubicación</div>
                <div className="contact-detail-value">Ambato, Ecuador</div>
              </div>
            </div>

            <div className="contact-detail-item">
              <div className="contact-detail-icon">📱</div>
              <div>
                <div className="contact-detail-label">WhatsApp</div>
                <a
                  href="https://wa.me/593998386869"
                  className="contact-detail-value"
                  style={{ color: 'var(--pink)', textDecoration: 'none' }}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor
                >
                  +593 998 386 869
                </a>
              </div>
            </div>

            <div className="contact-detail-item" style={{ flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
              {[
                { label: 'GH', href: 'https://github.com/alisonMSalas', title: 'GitHub' },
                { label: 'LI', href: 'https://www.linkedin.com/in/alison-salas', title: 'LinkedIn' },
                { label: 'IG', href: 'https://www.instagram.com/mikasalas_23', title: 'Instagram' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="social-link"
                  title={s.title}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor
                >
                  {s.label}
                </a>
              ))}
            </div>

            <div className="contact-detail-item">
              <a
                href="/src/docs/Curriculum Alison Salas.pdf"
                className="contact-cv-link"
                download
                data-cursor
              >
                ↓ Descargar CV
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
