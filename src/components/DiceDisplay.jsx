import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { getDirectionVector } from '../utils/diceRoller'
import * as diceRoller from '../utils/diceRoller'

function DiceDisplay() {
  const [rolling, setRolling] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const lastRoll = useGameStore((state) => state.dice.lastRoll)
  const setDiceRoll = useGameStore((state) => state.setDiceRoll)
  const awaitingDirection = useGameStore((state) => state.dice.awaitingDirection)
  const playerPosition = useGameStore((state) => state.player.position)
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition)
  const clearDiceRoll = useGameStore((state) => state.clearDiceRoll)
  const isMoving = useGameStore((state) => state.player.isMoving)

  const handleRoll = async () => {
    if (rolling || awaitingDirection) return

    setRolling(true)
    setShowResult(false)

    try {
      const result = await diceRoller.rollDiceWithAnimation(1000)
      setDiceRoll(result)
      setRolling(false)
      setShowResult(true)
    } catch (error) {
      console.error('Error rolling dice:', error)
      setRolling(false)
    }
  }

  const handleDirectionChoice = (direction) => {
    if (!lastRoll || lastRoll.type !== 'number' || isMoving) return

    const directionVector = getDirectionVector(direction)
    const movement = {
      x: directionVector.x * lastRoll.value,
      y: directionVector.y * lastRoll.value
    }

    const newPosition = {
      x: playerPosition.x + movement.x,
      y: playerPosition.y + movement.y
    }

    setPlayerPosition(newPosition)
    clearDiceRoll()
  }

  // Show direction buttons when awaiting direction, hide dice display
  if (awaitingDirection && lastRoll) {
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
          marginBottom: '15px',
          color: '#fff'
        }}>
          Choose Direction
        </div>
        <div style={{
          fontSize: '14px',
          color: '#fff',
          opacity: 0.8,
          marginBottom: '15px'
        }}>
          Move {lastRoll.value} spaces
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          maxWidth: '200px',
          margin: '0 auto'
        }}>
          <button
            onClick={() => handleDirectionChoice('up')}
            disabled={isMoving}
            style={{
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#fff',
              background: isMoving ? 'rgba(255, 255, 255, 0.2)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              cursor: isMoving ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: isMoving ? 0.6 : 1
            }}
          >
            ↑ Up
          </button>
          <button
            onClick={() => handleDirectionChoice('down')}
            disabled={isMoving}
            style={{
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#fff',
              background: isMoving ? 'rgba(255, 255, 255, 0.2)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              cursor: isMoving ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: isMoving ? 0.6 : 1
            }}
          >
            ↓ Down
          </button>
          <button
            onClick={() => handleDirectionChoice('left')}
            disabled={isMoving}
            style={{
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#fff',
              background: isMoving ? 'rgba(255, 255, 255, 0.2)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              cursor: isMoving ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: isMoving ? 0.6 : 1
            }}
          >
            ← Left
          </button>
          <button
            onClick={() => handleDirectionChoice('right')}
            disabled={isMoving}
            style={{
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#fff',
              background: isMoving ? 'rgba(255, 255, 255, 0.2)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              cursor: isMoving ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: isMoving ? 0.6 : 1
            }}
          >
            Right →
          </button>
        </div>
      </div>
    )
  }

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
      minWidth: '200px',
      textAlign: 'center',
      border: '2px solid rgba(255, 255, 255, 0.2)'
    }}>
      <div style={{
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '15px',
        color: '#fff'
      }}>
        Dice
      </div>

      {/* Dice Display */}
      <div style={{
        width: '80px',
        height: '80px',
        margin: '0 auto 15px',
        background: rolling
          ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
          : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#fff',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease'
      }}>
        <AnimatePresence mode="wait">
          {rolling ? (
            <motion.div
              key="rolling"
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, repeat: Infinity }}
              style={{ fontSize: '32px' }}
            >
              🎲
            </motion.div>
          ) : lastRoll ? (
            <motion.div
              key="result"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {lastRoll.type === 'number' ? (
                <div style={{ fontSize: '32px' }}>{lastRoll.value}</div>
              ) : (
                <div style={{ fontSize: '14px', lineHeight: '1.2' }}>
                  {lastRoll.name}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ fontSize: '20px', opacity: 0.7 }}
            >
              ?
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Result Display */}
      {showResult && lastRoll && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginBottom: '15px',
            fontSize: '14px',
            color: '#fff',
            minHeight: '20px'
          }}
        >
          {lastRoll.type === 'number' ? (
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                Move {lastRoll.value} spaces
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>
                Choose direction →
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                {lastRoll.name}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>
                {lastRoll.description}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Roll Button */}
      <button
        onClick={handleRoll}
        disabled={rolling || awaitingDirection}
        style={{
          width: '100%',
          padding: '12px 20px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#fff',
          background: rolling || awaitingDirection
            ? 'rgba(255, 255, 255, 0.2)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '8px',
          cursor: rolling || awaitingDirection ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: rolling || awaitingDirection
            ? 'none'
            : '0 4px 15px rgba(102, 126, 234, 0.4)'
        }}
        onMouseEnter={(e) => {
          if (!rolling && !awaitingDirection) {
            e.target.style.transform = 'scale(1.05)'
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)'
        }}
      >
        {rolling ? 'Rolling...' : awaitingDirection ? 'Choose Direction' : 'Roll Dice'}
      </button>
    </div>
  )
}

export default DiceDisplay
