import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Sky, Cloud } from '@react-three/drei'
import * as THREE from 'three'
import Player from './Player'
import Ground from './Ground'
import Coin from './Coin'
import QuestionBlock from './QuestionBlock'
import Pipe from './Pipe'
import Platform from './Platform'
import Goomba from './Goomba'
import { useGame } from '../context/GameContext'

export default function Game() {
  const { gameStarted } = useGame()
  const cameraTarget = useRef(new THREE.Vector3(0, 2, 0))
  const playerRef = useRef<THREE.Group>(null)
  const { camera } = useThree()

  useFrame(() => {
    if (playerRef.current && gameStarted) {
      const playerPos = playerRef.current.position
      cameraTarget.current.lerp(
        new THREE.Vector3(playerPos.x, playerPos.y + 4, playerPos.z + 10),
        0.05
      )
      camera.position.lerp(cameraTarget.current, 0.1)
      camera.lookAt(playerPos.x, playerPos.y + 1, playerPos.z)
    }
  })

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <hemisphereLight args={['#87CEEB', '#8B4513', 0.3]} />

      {/* Sky */}
      <Sky sunPosition={[100, 20, 100]} />
      <Cloud position={[-10, 12, -20]} speed={0.2} opacity={0.8} />
      <Cloud position={[10, 15, -25]} speed={0.3} opacity={0.6} />
      <Cloud position={[0, 10, -15]} speed={0.1} opacity={0.7} />

      {/* Ground */}
      <Ground />

      {/* Player */}
      <Player ref={playerRef} />

      {/* Coins - spread around the level */}
      <Coin position={[-3, 1.5, 0]} />
      <Coin position={[0, 1.5, -3]} />
      <Coin position={[3, 1.5, 0]} />
      <Coin position={[5, 3, -5]} />
      <Coin position={[-5, 3, -5]} />
      <Coin position={[0, 5, -8]} />
      <Coin position={[-2, 4, -10]} />
      <Coin position={[2, 4, -10]} />

      {/* Question Blocks */}
      <QuestionBlock position={[0, 3, 0]} />
      <QuestionBlock position={[4, 3, -6]} />
      <QuestionBlock position={[-4, 3, -6]} />
      <QuestionBlock position={[0, 5, -12]} />

      {/* Pipes */}
      <Pipe position={[-6, 0, 2]} height={2} />
      <Pipe position={[6, 0, -4]} height={3} />
      <Pipe position={[-8, 0, -8]} height={1.5} />

      {/* Floating Platforms */}
      <Platform position={[3, 2, -4]} width={3} />
      <Platform position={[-3, 2.5, -7]} width={2.5} />
      <Platform position={[0, 4, -10]} width={4} />
      <Platform position={[5, 3.5, -12]} width={2} />
      <Platform position={[-5, 4, -14]} width={3} />

      {/* Goombas */}
      <Goomba position={[2, 0.5, -2]} />
      <Goomba position={[-4, 0.5, -5]} />
      <Goomba position={[0, 4.5, -10]} />
    </>
  )
}
