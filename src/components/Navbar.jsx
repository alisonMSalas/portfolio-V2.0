import { useEffect, useRef } from 'react'

const Navbar = () => {
  const navRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      if (!navRef.current) return
      navRef.current.classList.toggle('is-scrolled', window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav ref={navRef} className="navbar">
      <a href="#hero" className="navbar-logo">AS.</a>
      <ul className="navbar-links">
        <li><a href="#sobre-mi">About</a></li>
        <li><a href="#tecnologias">Stack</a></li>
        <li><a href="#proyectos">Proyectos</a></li>
        <li><a href="#contacto">Contacto</a></li>
      </ul>
    </nav>
  )
}

export default Navbar
