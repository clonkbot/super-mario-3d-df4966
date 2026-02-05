import { forwardRef, useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'
import { useGame } from '../context/GameContext'

const SPEED = 5
const JUMP_FORCE = 8
const GRAVITY = 20

const Player = forwardRef<THREE.Group>((_, ref) => {
  const { gameStarted, gameOver } = useGame()
  const meshRef = useRef<THREE.Mesh>(null)
  const velocity = useRef(new THREE.Vector3(0, 0, 0))
  const isGrounded = useRef(true)
  const [isJumping, setIsJumping] = useState(false)

  const [, getKeys] = useKeyboardControls()

  // Touch controls state
  const touchControls = useRef({ forward: false, backward: false, left: false, right: false, jump: false })

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      const x = touch.clientX
      const y = touch.clientY

      // Left third = left, right third = right, middle = forward
      if (x < screenWidth / 3) touchControls.current.left = true
      else if (x > (screenWidth * 2) / 3) touchControls.current.right = true

      // Top half = forward/jump, bottom half = backward
      if (y < screenHeight / 2) {
        touchControls.current.forward = true
        touchControls.current.jump = true
      } else {
        touchControls.current.backward = true
      }
    }

    const handleTouchEnd = () => {
      touchControls.current = { forward: false, backward: false, left: false, right: false, jump: false }
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  useFrame((_, delta) => {
    if (!ref || typeof ref === 'function' || !ref.current || !gameStarted || gameOver) return

    const keys = getKeys()
    const group = ref.current
    const pos = group.position

    // Combine keyboard and touch controls
    const forward = keys.forward || touchControls.current.forward
    const backward = keys.backward || touchControls.current.backward
    const left = keys.left || touchControls.current.left
    const right = keys.right || touchControls.current.right
    const jump = keys.jump || touchControls.current.jump

    // Horizontal movement
    const moveX = (right ? 1 : 0) - (left ? 1 : 0)
    const moveZ = (backward ? 1 : 0) - (forward ? 1 : 0)

    velocity.current.x = moveX * SPEED
    velocity.current.z = moveZ * SPEED

    // Jump
    if (jump && isGrounded.current) {
      velocity.current.y = JUMP_FORCE
      isGrounded.current = false
      setIsJumping(true)
    }

    // Gravity
    velocity.current.y -= GRAVITY * delta

    // Apply velocity
    pos.x += velocity.current.x * delta
    pos.y += velocity.current.y * delta
    pos.z += velocity.current.z * delta

    // Ground collision
    if (pos.y <= 0.5) {
      pos.y = 0.5
      velocity.current.y = 0
      isGrounded.current = true
      setIsJumping(false)
    }

    // Platform collision (simplified)
    const platforms = [
      { pos: [3, 2, -4], width: 3 },
      { pos: [-3, 2.5, -7], width: 2.5 },
      { pos: [0, 4, -10], width: 4 },
      { pos: [5, 3.5, -12], width: 2 },
      { pos: [-5, 4, -14], width: 3 },
    ]

    platforms.forEach(({ pos: pPos, width }) => {
      const [px, py, pz] = pPos
      if (
        Math.abs(pos.x - px) < width / 2 + 0.3 &&
        Math.abs(pos.z - pz) < 0.8 &&
        pos.y >= py + 0.25 &&
        pos.y <= py + 0.8 &&
        velocity.current.y <= 0
      ) {
        pos.y = py + 0.75
        velocity.current.y = 0
        isGrounded.current = true
        setIsJumping(false)
      }
    })

    // Boundaries
    pos.x = Math.max(-12, Math.min(12, pos.x))
    pos.z = Math.max(-20, Math.min(10, pos.z))

    // Reset if fallen
    if (pos.y < -5) {
      pos.set(0, 0.5, 5)
      velocity.current.set(0, 0, 0)
    }

    // Update global player position for collision detection
    (window as unknown as { playerPosition?: THREE.Vector3 }).playerPosition = pos.clone()

    // Rotate player based on movement
    if (moveX !== 0 || moveZ !== 0) {
      const angle = Math.atan2(moveX, moveZ)
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, angle, 0.2)
    }

    // Squash and stretch
    if (meshRef.current) {
      const targetScaleY = isJumping ? (velocity.current.y > 0 ? 1.2 : 0.8) : 1
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScaleY, 0.2)
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1 / Math.sqrt(meshRef.current.scale.y), 0.2)
      meshRef.current.scale.z = meshRef.current.scale.x
    }
  })

  return (
    <group ref={ref} position={[0, 0.5, 5]}>
      <mesh ref={meshRef} castShadow>
        {/* Body */}
        <capsuleGeometry args={[0.3, 0.4, 8, 16]} />
        <meshStandardMaterial color="#E52521" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#FFB8A0" />
      </mesh>
      {/* Hat */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.3, 0.15, 16]} />
        <meshStandardMaterial color="#E52521" />
      </mesh>
      {/* Hat brim */}
      <mesh position={[0, 0.68, 0.15]} castShadow>
        <boxGeometry args={[0.2, 0.08, 0.25]} />
        <meshStandardMaterial color="#E52521" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.08, 0.58, 0.2]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.08, 0.58, 0.2]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Mustache */}
      <mesh position={[0, 0.45, 0.22]}>
        <boxGeometry args={[0.2, 0.05, 0.05]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>
    </group>
  )
})

Player.displayName = 'Player'
export default Player
