import { useRef } from 'react'
import * as THREE from 'three'

export default function Ground() {
  const groundRef = useRef<THREE.Mesh>(null)

  return (
    <group>
      {/* Main ground */}
      <mesh
        ref={groundRef}
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, -5]}
      >
        <planeGeometry args={[30, 40]} />
        <meshStandardMaterial color="#7CBA5F" />
      </mesh>

      {/* Ground blocks pattern */}
      {Array.from({ length: 15 }).map((_, i) =>
        Array.from({ length: 20 }).map((_, j) => {
          const isAlternate = (i + j) % 2 === 0
          return (
            <mesh
              key={`${i}-${j}`}
              position={[i * 2 - 14, -0.05, j * 2 - 15]}
              receiveShadow
            >
              <boxGeometry args={[2, 0.1, 2]} />
              <meshStandardMaterial color={isAlternate ? '#7CBA5F' : '#6AAF4D'} />
            </mesh>
          )
        })
      )}

      {/* Underground bricks visible at edges */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh key={`brick-${i}`} position={[i * 2 - 14, -0.6, 10]} castShadow>
          <boxGeometry args={[2, 1, 1]} />
          <meshStandardMaterial color="#C47135" />
        </mesh>
      ))}
    </group>
  )
}
