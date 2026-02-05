import { useGame } from '../context/GameContext'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function GameUI() {
  const { coins, score, lives, gameOver, gameStarted, startGame, resetGame } = useGame()
  const frameRef = useRef<number>(0)

  // Expose player position to window for collision detection
  useEffect(() => {
    const updatePlayerPos = () => {
      frameRef.current = requestAnimationFrame(updatePlayerPos)
      // This is updated by the Player component
    }

    // Initialize player position
    (window as unknown as { playerPosition?: THREE.Vector3 }).playerPosition = new THREE.Vector3(0, 0.5, 5)

    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  // Update player position from scene
  useEffect(() => {
    const interval = setInterval(() => {
      const canvas = document.querySelector('canvas')
      if (canvas) {
        // Player position is managed by the Player component
      }
    }, 16)
    return () => clearInterval(interval)
  }, [])

  if (!gameStarted) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-40">
        <div className="text-center p-6 md:p-10 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-3xl shadow-2xl border-4 border-white/30 mx-4 max-w-sm md:max-w-md">
          <h1
            className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg"
            style={{ fontFamily: '"Press Start 2P", cursive', textShadow: '4px 4px 0 #c41e00' }}
          >
            SUPER
          </h1>
          <h1
            className="text-4xl md:text-6xl font-bold text-red-600 mb-6 md:mb-8 drop-shadow-lg"
            style={{ fontFamily: '"Press Start 2P", cursive', textShadow: '4px 4px 0 #8B0000' }}
          >
            MARIO 3D
          </h1>

          <div className="space-y-2 md:space-y-3 mb-6 md:mb-8 text-[10px] md:text-xs text-white/90" style={{ fontFamily: '"Press Start 2P", cursive' }}>
            <p>WASD or Arrows to Move</p>
            <p>SPACE to Jump</p>
            <p className="text-[8px] md:text-[10px] opacity-70">Touch: Tap screen areas</p>
          </div>

          <button
            onClick={startGame}
            className="px-6 md:px-10 py-3 md:py-4 bg-green-500 hover:bg-green-400 text-white text-sm md:text-lg font-bold rounded-2xl
                       shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200
                       border-b-4 border-green-700 hover:border-green-600 active:border-b-0 active:translate-y-1 min-h-[48px]"
            style={{ fontFamily: '"Press Start 2P", cursive' }}
          >
            START GAME
          </button>
        </div>
      </div>
    )
  }

  if (gameOver) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-40">
        <div className="text-center p-6 md:p-10 bg-gradient-to-b from-gray-700 to-gray-900 rounded-3xl shadow-2xl border-4 border-red-500/50 mx-4 max-w-sm md:max-w-md">
          <h1
            className="text-3xl md:text-5xl font-bold text-red-500 mb-4 md:mb-6"
            style={{ fontFamily: '"Press Start 2P", cursive', textShadow: '3px 3px 0 #4a0000' }}
          >
            GAME OVER
          </h1>

          <div className="space-y-2 md:space-y-3 mb-6 md:mb-8" style={{ fontFamily: '"Press Start 2P", cursive' }}>
            <p className="text-yellow-400 text-lg md:text-2xl">SCORE: {score}</p>
            <p className="text-yellow-300 text-base md:text-xl">COINS: {coins}</p>
          </div>

          <button
            onClick={resetGame}
            className="px-6 md:px-10 py-3 md:py-4 bg-red-500 hover:bg-red-400 text-white text-sm md:text-lg font-bold rounded-2xl
                       shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200
                       border-b-4 border-red-700 hover:border-red-600 active:border-b-0 active:translate-y-1 min-h-[48px]"
            style={{ fontFamily: '"Press Start 2P", cursive' }}
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute top-0 left-0 right-0 p-3 md:p-4 pointer-events-none z-30">
      <div className="flex justify-between items-start max-w-4xl mx-auto">
        {/* Score */}
        <div
          className="bg-black/50 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 md:px-5 py-2 md:py-3 border-2 border-white/20"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
        >
          <p className="text-[8px] md:text-[10px] text-white/60 mb-0.5 md:mb-1">SCORE</p>
          <p className="text-sm md:text-xl text-white">{score.toString().padStart(6, '0')}</p>
        </div>

        {/* Coins */}
        <div
          className="bg-black/50 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 md:px-5 py-2 md:py-3 border-2 border-yellow-400/30 flex items-center gap-2 md:gap-3"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
        >
          <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-lg flex items-center justify-center">
            <span className="text-yellow-800 text-[8px] md:text-xs font-bold">$</span>
          </div>
          <p className="text-base md:text-xl text-yellow-400">x{coins}</p>
        </div>

        {/* Lives */}
        <div
          className="bg-black/50 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 md:px-5 py-2 md:py-3 border-2 border-red-400/30 flex items-center gap-1 md:gap-2"
          style={{ fontFamily: '"Press Start 2P", cursive' }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`w-5 h-5 md:w-7 md:h-7 rounded-full transition-all duration-300 ${
                i < lives
                  ? 'bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/50'
                  : 'bg-gray-700/50'
              }`}
            >
              {i < lives && (
                <div className="w-full h-full flex items-center justify-center text-[8px] md:text-xs text-white">
                  ♥
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile controls hint */}
      <div className="md:hidden mt-4 text-center">
        <p className="text-[8px] text-white/40" style={{ fontFamily: '"Press Start 2P", cursive' }}>
          TAP LEFT/RIGHT TO MOVE · TAP TOP TO JUMP
        </p>
      </div>
    </div>
  )
}
