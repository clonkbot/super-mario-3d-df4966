import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface GameContextType {
  coins: number
  score: number
  lives: number
  gameOver: boolean
  gameStarted: boolean
  collectCoin: () => void
  addScore: (points: number) => void
  loseLife: () => void
  startGame: () => void
  resetGame: () => void
}

const GameContext = createContext<GameContextType | null>(null)

export function useGame() {
  const context = useContext(GameContext)
  if (!context) throw new Error('useGame must be used within GameProvider')
  return context
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [coins, setCoins] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  const collectCoin = useCallback(() => {
    setCoins(c => c + 1)
    setScore(s => s + 100)
  }, [])

  const addScore = useCallback((points: number) => {
    setScore(s => s + points)
  }, [])

  const loseLife = useCallback(() => {
    setLives(l => {
      const newLives = l - 1
      if (newLives <= 0) setGameOver(true)
      return newLives
    })
  }, [])

  const startGame = useCallback(() => {
    setGameStarted(true)
    setGameOver(false)
  }, [])

  const resetGame = useCallback(() => {
    setCoins(0)
    setScore(0)
    setLives(3)
    setGameOver(false)
    setGameStarted(true)
  }, [])

  return (
    <GameContext.Provider value={{
      coins, score, lives, gameOver, gameStarted,
      collectCoin, addScore, loseLife, startGame, resetGame
    }}>
      {children}
    </GameContext.Provider>
  )
}
