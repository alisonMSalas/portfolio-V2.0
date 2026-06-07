import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

const techs = [
  { name: 'Angular',     color: '#DD0031', pos: [-3.8, 1.4,  -0.5], scale: 1.1,  speed: 1.4 },
  { name: 'React',       color: '#61DAFB', pos: [-2.0, 2.0,   0.3], scale: 1.0,  speed: 1.1 },
  { name: 'Vue.js',      color: '#4FC08D', pos: [ 0.2, 1.8,  -0.8], scale: 0.95, speed: 1.6 },
  { name: 'TypeScript',  color: '#3178C6', pos: [ 2.2, 1.6,   0.4], scale: 1.0,  speed: 1.3 },
  { name: 'Java',        color: '#F89820', pos: [ 3.8, 0.6,  -0.3], scale: 1.05, speed: 1.0 },
  { name: 'Spring Boot', color: '#6DB33F', pos: [ 3.2, -1.0,  0.6], scale: 0.9,  speed: 1.7 },
  { name: 'MySQL',       color: '#00758F', pos: [ 1.0, -1.6,  0.2], scale: 0.95, speed: 1.2 },
  { name: 'Ionic',       color: '#3880FF', pos: [-0.8, -1.4, -0.6], scale: 0.9,  speed: 1.5 },
  { name: 'Power BI',    color: '#F2C811', pos: [-2.8, -0.8,  0.5], scale: 0.9,  speed: 1.8 },
  { name: 'HTML5',       color: '#E34F26', pos: [-3.5, 0.2,   0.8], scale: 0.85, speed: 1.3 },
  { name: 'CSS3',        color: '#1572B6', pos: [-1.2, 0.4,   1.2], scale: 0.85, speed: 1.6 },
  { name: 'JavaScript',  color: '#F7DF1E', pos: [ 1.4, 0.0,  -1.2], scale: 0.85, speed: 1.1 },
  { name: 'Git',         color: '#F05032', pos: [ 0.0, -0.4,  1.6], scale: 0.8,  speed: 1.4 },
]

const TechOrb = ({ name, color, pos, scale = 1, speed = 1.2 }) => {
  const meshRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  const hdrColor = new THREE.Color(color)
  hdrColor.multiplyScalar(2.5)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += delta * 0.3
    meshRef.current.rotation.z += delta * 0.2
  })

  return (
    <Float
      speed={speed}
      rotationIntensity={0.3}
      floatIntensity={0.6}
    >
      <group position={pos} scale={hovered ? scale * 1.35 : scale}>
        <mesh
          ref={meshRef}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <icosahedronGeometry args={[0.38, 1]} />
          <meshStandardMaterial
            color={color}
            emissive={hdrColor}
            emissiveIntensity={hovered ? 0.9 : 0.45}
            roughness={0.05}
            metalness={0.9}
            toneMapped={false}
          />
        </mesh>
        <Text
          position={[0, -0.62, 0]}
          fontSize={0.155}
          color={hovered ? '#ffffff' : '#9e8fa8'}
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {name}
        </Text>
      </group>
    </Float>
  )
}

const TechScene = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.5} />
      <pointLight position={[-5, -5, -3]} intensity={0.3} color="#c9a8e8" />
      <Environment preset="night" />

      {techs.map((t) => (
        <TechOrb key={t.name} {...t} />
      ))}

      <EffectComposer>
        <Bloom intensity={1.8} mipmapBlur threshold={0.0} radius={0.75} />
      </EffectComposer>
    </>
  )
}

export default TechScene
