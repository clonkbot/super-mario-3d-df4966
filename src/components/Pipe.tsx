import { RoundedBox } from '@react-three/drei'

interface PipeProps {
  position: [number, number, number]
  height?: number
}

export default function Pipe({ position, height = 2 }: PipeProps) {
  return (
    <group position={[position[0], position[1] + height / 2, position[2]]}>
      {/* Pipe body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.7, height, 16]} />
        <meshStandardMaterial color="#3AA54C" />
      </mesh>

      {/* Pipe rim */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.85, 0.85, 0.4, 16]} />
        <meshStandardMaterial color="#3AA54C" />
      </mesh>

      {/* Inner hole */}
      <mesh position={[0, height / 2 + 0.15, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 16]} />
        <meshStandardMaterial color="#1a4a25" />
      </mesh>

      {/* Highlight stripe */}
      <mesh position={[0.5, 0, 0]} castShadow>
        <RoundedBox args={[0.15, height - 0.1, 0.15]} radius={0.05}>
          <meshStandardMaterial color="#5FD068" />
        </RoundedBox>
      </mesh>
    </group>
  )
}
