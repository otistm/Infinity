import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { executePattern } from '../utils/diceRoller'

function DirectionChooser() {
  const currentPattern = useGameStore((state) => state.dice.currentPattern)
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition)
  const clearDiceRoll = useGameStore((state) => state.clearDiceRoll)
  const isMoving = useGameStore((state) => state.player.isMoving)
  const patternExecutingRef = useRef(false)

  // Execute pattern moves sequentially
  useEffect(() => {
    if (currentPattern && currentPattern.type === 'pattern' && !isMoving && !patternExecutingRef.current) {
      patternExecutingRef.current = true
      
      // Get current position from store at the moment pattern starts
      const currentPos = useGameStore.getState().player.position
      const startPosition = { ...currentPos }
      const positions = executePattern(startPosition, currentPattern.moves)
      let currentIndex = 0

      const executeNextMove = () => {
        if (currentIndex < positions.length - 1) {
          currentIndex++
          setPlayerPosition(positions[currentIndex])
          setTimeout(executeNextMove, 400) // Animation delay between moves
        } else {
          // Pattern complete
          patternExecutingRef.current = false
          clearDiceRoll()
        }
      }

      // Start executing after a short delay for visual feedback
      const timer = setTimeout(() => {
        executeNextMove()
      }, 500)
      
      return () => {
        clearTimeout(timer)
        patternExecutingRef.current = false
      }
    }
  }, [currentPattern, isMoving, setPlayerPosition, clearDiceRoll])

  // Only show pattern execution message, direction buttons are now in DiceDisplay
  if (!currentPattern) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0, 0, 0, 0.9)',
      padding: '20px 30px',
      borderRadius: '15px',
      zIndex: 1000,
      minWidth: '250px',
      textAlign: 'center',
      border: '2px solid rgba(255, 255, 255, 0.2)'
    }}>
      <div style={{
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: '10px'
      }}>
        Executing Pattern...
      </div>
      <div style={{
        fontSize: '14px',
        color: '#fff',
        opacity: 0.8
      }}>
        {currentPattern.name}
      </div>
    </div>
  )
}

export default DirectionChooser
