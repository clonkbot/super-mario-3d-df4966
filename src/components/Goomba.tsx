import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGame } from '../context/GameContext'

interface GoombaProps {
  position: [number, number, number]
}

export default function Goomba({ position }: GoombaProps) {
  const ref = useRef<THREE.Group>(null)
  const [squished, setSquished] = useState(false)
  const [direction, setDirection] = useState(1)
  const startX = useRef(position[0])
  const { addScore, loseLife, gameStarted } = useGame()

  useFrame((state, delta) => {
    if (!ref.current || squished) return

    // Waddle movement
    const waddle = Math.sin(state.clock.elapsedTime * 10) * 0.1
    ref.current.rotation.z = waddle

    // Move back and forth
    if (gameStarted) {
      ref.current.position.x += direction * delta * 1.5

      if (ref.current.position.x > startX.current + 2) setDirection(-1)
      if (ref.current.position.x < startX.current - 2) setDirection(1)

      // Collision with player
      const playerPos = (window as unknown as { playerPosition?: THREE.Vector3 }).playerPosition
      if (playerPos) {
        const dx = Math.abs(playerPos.x - ref.current.position.x)
        const dz = Math.abs(playerPos.z - ref.current.position.z)
        const dy = playerPos.y - ref.current.position.y

        if (dx < 0.6 && dz < 0.6) {
          // Player jumping on top
          if (dy > 0.3 && dy < 1.5) {
            setSquished(true)
            addScore(100)
          } else if (Math.abs(dy) < 0.5) {
            // Player hits from side
            loseLife()
            // Push player back
            if (playerPos.x < ref.current.position.x) {
              (window as unknown as { playerPosition?: THREE.Vector3 }).playerPosition!.x -= 2
            } else {
              (window as unknown as { playerPosition?: THREE.Vector3 }).playerPosition!.x += 2
            }
          }
        }
      }
    }
  })

  if (squished) {
    return (
      <mesh position={[position[0], position[1] - 0.3, position[2]]}>
        <cylinderGeometry args={[0.4, 0.4, 0.1, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    )
  }

  return (
    <group ref={ref} position={position}>
      {/* Body */}
      <mesh castShadow>
        <sphereGeometry args={[0.4, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#D2691E" />
      </mesh>

      {/* Eyebrows */}
      <mesh position={[-0.12, 0.4, 0.28]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.2, 0.06, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.12, 0.4, 0.28]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.2, 0.06, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.12, 0.32, 0.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.12, 0.32, 0.3]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-0.12, 0.32, 0.35]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.12, 0.32, 0.35]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Feet */}
      <mesh position={[-0.2, -0.35, 0.1]} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.2, -0.35, 0.1]} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  )
}
