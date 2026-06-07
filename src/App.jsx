import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Technologies from './components/Technologies'
import Projects from './components/Projects'
import Contact from './components/Contact'

const App = () => {
  return (
    <>
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Technologies />
        <Projects />
        <Contact />
      </main>
      <footer>
        <p>© 2024 <span>Alison Salas</span>. Hecho con ♥ desde Ambato, Ecuador.</p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          React · Three.js · GSAP
        </p>
      </footer>
    </>
  )
}

export default App
