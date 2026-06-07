import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ParticleSphere = () => {
  const pointsRef = useRef(null)
  const groupRef  = useRef(null)
  const mouse     = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const geometry = useMemo(() => {
    const count   = 5000
    const radius  = 2.4
    const positions = new Float32Array(count * 3)
    const colors    = new Float32Array(count * 3)

    const pink     = new THREE.Color(2.1, 0.55, 0.95)
    const lavender = new THREE.Color(1.1, 0.75, 2.1)
    const peach    = new THREE.Color(2.1, 1.15, 0.65)

    for (let i = 0; i < count; i++) {
      const phi   = Math.acos(1 - 2 * (i + 0.5) / count)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const x = Math.sin(phi) * Math.cos(theta)
      const y = Math.cos(phi)
      const z = Math.sin(phi) * Math.sin(theta)

      positions[i * 3]     = x * radius
      positions[i * 3 + 1] = y * radius
      positions[i * 3 + 2] = z * radius

      const t = (y + 1) / 2
      let c
      if (t > 0.66)      c = pink.clone().lerp(lavender, (t - 0.66) * 2.94)
      else if (t > 0.33) c = lavender.clone().lerp(peach, (t - 0.33) * 2.94)
      else               c = peach.clone().lerp(pink, (0.33 - t) * 3.03)

      colors[i * 3]     = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3))
    return geo
  }, [])

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current || !groupRef.current) return

    // Sphere rotation + mouse tilt
    const mesh = pointsRef.current
    mesh.rotation.y += delta * 0.07
    mesh.rotation.x += (mouse.current.y * 0.35 - mesh.rotation.x) * 0.04

    // Breathing scale
    const breathe = 1 + Math.sin(clock.elapsedTime * 0.6) * 0.025
    mesh.scale.setScalar(breathe)

    // Scroll parallax: moves right as user scrolls past hero
    const scrollProgress = Math.min(1, window.scrollY / window.innerHeight)
    const targetX = scrollProgress * 4.5
    const targetOpacity = 1 - scrollProgress * 0.75
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.06
    mesh.material.opacity += (targetOpacity - mesh.material.opacity) * 0.06
  })

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          size={0.016}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.92}
          toneMapped={false}
        />
      </points>
    </group>
  )
}

export default ParticleSphere
