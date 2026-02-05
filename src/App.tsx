import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Suspense } from 'react'
import Game from './components/Game'
import GameUI from './components/GameUI'
import { GameProvider } from './context/GameContext'

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
]

function App() {
  return (
    <GameProvider>
      <div className="w-screen h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 overflow-hidden relative">
        <KeyboardControls map={keyboardMap}>
          <Canvas
            shadows
            camera={{ position: [0, 8, 12], fov: 50 }}
            style={{ touchAction: 'none' }}
          >
            <Suspense fallback={null}>
              <Game />
            </Suspense>
          </Canvas>
        </KeyboardControls>

        <GameUI />

        {/* Footer */}
        <footer className="absolute bottom-2 left-0 right-0 text-center pointer-events-none z-50">
          <p className="text-[10px] md:text-xs text-sky-700/50 font-medium tracking-wide">
            Requested by <span className="text-sky-800/60">@theonlyvasudev</span> · Built by <span className="text-sky-800/60">@clonkbot</span>
          </p>
        </footer>
      </div>
    </GameProvider>
  )
}

export default App
