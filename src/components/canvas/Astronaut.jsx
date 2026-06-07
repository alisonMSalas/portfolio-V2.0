import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const ORBIT_R = 2.9

// Draw the astronaut emoji onto a canvas texture so it always looks right
function makeTexture() {
  const size = 256
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')

  // Soft glow behind the astronaut
  const grd = ctx.createRadialGradient(128, 128, 20, 128, 128, 110)
  grd.addColorStop(0, 'rgba(201,168,232,0.45)')
  grd.addColorStop(1, 'rgba(201,168,232,0)')
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, size, size)

  // Astronaut emoji — large so it's crisp
  ctx.font = '180px serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('🧑‍🚀', 128, 138)

  return new THREE.CanvasTexture(c)
}

const Astronaut = () => {
  const spriteRef  = useRef(null)
  const mouseNDC   = useRef(new THREE.Vector2(0.4, 0.5))
  const curPos     = useRef(new THREE.Vector3(0, ORBIT_R, 0))
  const targetPos  = useRef(new THREE.Vector3(0, ORBIT_R, 0))
  const lastMove   = useRef(0)

  const { camera } = useThree()
  const raycaster  = useRef(new THREE.Raycaster())
  const hitSphere  = useRef(new THREE.Sphere(new THREE.Vector3(), ORBIT_R))
  const hitPoint   = useRef(new THREE.Vector3())

  const texture = useMemo(makeTexture, [])

  useEffect(() => {
    const onMove = (e) => {
      lastMove.current = Date.now()
      mouseNDC.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      )
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame((_, delta) => {
    if (!spriteRef.current) return

    // Raycast mouse onto virtual sphere
    raycaster.current.setFromCamera(mouseNDC.current, camera)
    const hit = raycaster.current.ray.intersectSphere(hitSphere.current, hitPoint.current)
    if (hit) {
      // ← FLEE: target = OPPOSITE side of where the mouse points
      targetPos.current.copy(hitPoint.current).negate().normalize().multiplyScalar(ORBIT_R)
    }

    // Fast lerp when running away (mouse moving), slow drift when stopped
    const isMoving = Date.now() - lastMove.current < 200
    const k = isMoving ? Math.min(1, delta * 4) : Math.min(1, delta * 0.4)
    curPos.current.lerp(targetPos.current, k)

    spriteRef.current.position.copy(curPos.current)
  })

  return (
    <sprite ref={spriteRef} scale={[0.7, 0.7, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        depthWrite={false}
        toneMapped={false}
        opacity={0.95}
      />
    </sprite>
  )
}

export default Astronaut
