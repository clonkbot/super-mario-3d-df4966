import { RoundedBox } from '@react-three/drei'

interface PlatformProps {
  position: [number, number, number]
  width?: number
}

export default function Platform({ position, width = 3 }: PlatformProps) {
  const brickCount = Math.floor(width)

  return (
    <group position={position}>
      {/* Main platform */}
      <RoundedBox args={[width, 0.5, 1]} radius={0.05} castShadow receiveShadow>
        <meshStandardMaterial color="#C47135" />
      </RoundedBox>

      {/* Brick pattern */}
      {Array.from({ length: brickCount }).map((_, i) => (
        <group key={i}>
          {/* Horizontal line */}
          <mesh position={[(i - brickCount / 2 + 0.5) * (width / brickCount), 0.1, 0.51]}>
            <planeGeometry args={[width / brickCount - 0.05, 0.02]} />
            <meshStandardMaterial color="#A05A28" />
          </mesh>
          {/* Vertical lines */}
          <mesh position={[(i - brickCount / 2 + 0.5) * (width / brickCount) + 0.2, -0.05, 0.51]}>
            <planeGeometry args={[0.02, 0.2]} />
            <meshStandardMaterial color="#A05A28" />
          </mesh>
        </group>
      ))}
    </group>
  )
}
