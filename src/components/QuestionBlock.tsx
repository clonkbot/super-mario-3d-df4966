import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useGame } from '../context/GameContext'

interface QuestionBlockProps {
  position: [number, number, number]
}

export default function QuestionBlock({ position }: QuestionBlockProps) {
  const ref = useRef<THREE.Group>(null)
  const [hit, setHit] = useState(false)
  const [bouncing, setBouncing] = useState(false)
  const bounceProgress = useRef(0)
  const { addScore, gameStarted } = useGame()

  useFrame((_, delta) => {
    if (!ref.current) return

    // Bounce animation when hit
    if (bouncing) {
      bounceProgress.current += delta * 8
      const bounce = Math.sin(bounceProgress.current * Math.PI) * 0.3
      ref.current.position.y = position[1] + bounce

      if (bounceProgress.current >= 1) {
        setBouncing(false)
        bounceProgress.current = 0
        ref.current.position.y = position[1]
      }
    }

    // Check for player hitting from below
    if (!hit && gameStarted) {
      const playerPos = (window as unknown as { playerPosition?: THREE.Vector3 }).playerPosition
      if (playerPos) {
        const dx = Math.abs(playerPos.x - position[0])
        const dz = Math.abs(playerPos.z - position[2])
        const dy = position[1] - playerPos.y

        if (dx < 0.7 && dz < 0.7 && dy > 0 && dy < 1.2) {
          setHit(true)
          setBouncing(true)
          addScore(200)
        }
      }
    }
  })

  return (
    <group ref={ref} position={position}>
      <RoundedBox args={[1, 1, 1]} radius={0.05} castShadow receiveShadow>
        <meshStandardMaterial
          color={hit ? '#8B5A2B' : '#FFB800'}
          metalness={hit ? 0 : 0.3}
          roughness={hit ? 0.8 : 0.4}
        />
      </RoundedBox>
      {!hit && (
        <Text
          position={[0, 0, 0.52]}
          fontSize={0.5}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff2"
        >
          ?
        </Text>
      )}
      {/* Bottom rivet details */}
      {!hit && [[-0.3, -0.51, 0.3], [0.3, -0.51, 0.3], [-0.3, -0.51, -0.3], [0.3, -0.51, -0.3]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 8]} />
          <meshStandardMaterial color="#E5A000" />
        </mesh>
      ))}
    </group>
  )
}
