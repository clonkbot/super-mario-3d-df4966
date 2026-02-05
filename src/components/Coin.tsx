import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGame } from '../context/GameContext'

interface CoinProps {
  position: [number, number, number]
}

export default function Coin({ position }: CoinProps) {
  const ref = useRef<THREE.Mesh>(null)
  const [collected, setCollected] = useState(false)
  const [collecting, setCollecting] = useState(false)
  const collectProgress = useRef(0)
  const { collectCoin, gameStarted } = useGame()

  useFrame((state, delta) => {
    if (!ref.current) return

    // Rotate coin
    ref.current.rotation.y += delta * 3

    // Bobbing animation
    const bob = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1
    ref.current.position.y = position[1] + bob

    // Collection animation
    if (collecting) {
      collectProgress.current += delta * 5
      ref.current.position.y += collectProgress.current
      ref.current.scale.setScalar(Math.max(0, 1 - collectProgress.current))

      if (collectProgress.current >= 1) {
        setCollected(true)
      }
    }

    // Simple collision with player (assumes player is around [0, 0.5, 5] moving around)
    if (!collecting && !collected && gameStarted) {
      // Get player position from window (hacky but simple)
      const playerPos = (window as unknown as { playerPosition?: THREE.Vector3 }).playerPosition
      if (playerPos) {
        const dist = ref.current.position.distanceTo(playerPos)
        if (dist < 0.8) {
          setCollecting(true)
          collectCoin()
        }
      }
    }
  })

  if (collected) return null

  return (
    <mesh ref={ref} position={position} castShadow>
      <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
      <meshStandardMaterial
        color="#FFD700"
        metalness={0.8}
        roughness={0.2}
        emissive="#FFD700"
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}
