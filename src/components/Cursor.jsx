import { useEffect, useRef } from 'react'

const Cursor = () => {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const rafId = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top = `${e.clientY}px`
      }
    }

    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.1
      pos.current.y += (target.current.y - pos.current.y) * 0.1
      if (ringRef.current) {
        ringRef.current.style.left = `${pos.current.x}px`
        ringRef.current.style.top = `${pos.current.y}px`
      }
      rafId.current = requestAnimationFrame(loop)
    }

    const onEnter = () => ringRef.current?.classList.add('is-hovering')
    const onLeave = () => ringRef.current?.classList.remove('is-hovering')

    window.addEventListener('mousemove', onMove)
    rafId.current = requestAnimationFrame(loop)

    const setupHovers = () => {
      document.querySelectorAll('a, button, [data-cursor]').forEach((el) => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }

    setupHovers()
    const observer = new MutationObserver(setupHovers)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId.current)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}

export default Cursor
