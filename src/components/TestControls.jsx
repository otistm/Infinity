import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'

function TestControls({ zoomPercentage = 0, rotationAngle = 0 }) {
  const playerPosition = useGameStore((state) => state.player.position)
  const isMoving = useGameStore((state) => state.player.isMoving)
  const score = useGameStore((state) => state.player.score)
  const puzzlesSolved = useGameStore((state) => state.player.puzzlesSolved)
  const lastRoll = useGameStore((state) => state.dice.lastRoll)
  const saveGame = useGameStore((state) => state.saveGame)
  const loadGame = useGameStore((state) => state.loadGame)
  const hasSaveData = useGameStore((state) => state.hasSaveData)
  const resetGame = useGameStore((state) => state.resetGame)
  const deleteSaveData = useGameStore((state) => state.deleteSaveData)
  const keysPressed = useRef(new Set())

  const handleSave = () => {
    const success = saveGame()
    if (success) {
      alert('Game saved successfully!')
    } else {
      alert('Failed to save game')
    }
  }

  const handleLoad = () => {
    if (window.confirm('Load saved game? This will overwrite your current progress.')) {
      const success = loadGame()
      if (success) {
        alert('Game loaded successfully!')
        // Reload the page to refresh the board
        window.location.reload()
      } else {
        alert('Failed to load game')
      }
    }
  }

  const handleStartNewGame = () => {
    if (window.confirm('Start a new game? This will delete your current save and reset your progress.')) {
      console.log('Starting new game - deleting save data...')
      // Delete save data first
      const deleted = deleteSaveData()
      console.log('Save data deleted:', deleted)
      
      // Verify save data is gone - use getState to access the function
      const hasSave = useGameStore.getState().hasSaveData()
      console.log('Save data still exists after deletion:', hasSave)
      
      if (!hasSave) {
        // Reset game state
        console.log('Resetting game state...')
        resetGame()
        console.log('Game reset complete')
      } else {
        alert('Failed to delete save data. Please try again.')
      }
    }
  }

  const tileTypes = [
    { name: 'Empty', color: '#16213e' },
    { name: 'Rest', color: '#9b59b6' },
    { name: 'Chess', color: '#d4af37' },
    { name: 'Maze', color: '#ff9800' },
    { name: 'Rhythm', color: '#e91e63' },
    { name: 'Easy Math', color: '#4ecca3' },
    { name: 'Medium Math', color: '#f4d03f' },
    { name: 'Hard Math', color: '#e74c3c' }
  ]

  // Disable WASD controls when dice system is active
  // (Keeping for testing purposes, but will be replaced by dice movement)

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      left: 10,
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px 15px',
      borderRadius: '5px',
      fontSize: '14px',
      zIndex: 1000,
      pointerEvents: 'auto',
      fontFamily: 'monospace',
      maxWidth: '250px',
      maxHeight: 'calc(100vh - 20px)',
      overflowY: 'auto'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Evergreen</div>
      <div>Position: ({Math.round(playerPosition.x)}, {Math.round(playerPosition.y)})</div>
      <div>Zoom: {Math.round(zoomPercentage)}%</div>
      <div>Rotation: {Math.round(rotationAngle)}°</div>
      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        <div>Score: {score}</div>
        <div>Puzzles Solved: {puzzlesSolved}</div>
      </div>
      {lastRoll && (
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.2)', fontSize: '12px' }}>
          Last Roll: {lastRoll.type === 'number' ? lastRoll.value : lastRoll.name}
        </div>
      )}
      
      {/* Tile Legend */}
      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
          {tileTypes.map((tile) => (
            <div key={tile.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  background: tile.color,
                  borderRadius: '3px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  flexShrink: 0
                }}
              />
              <span>{tile.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Save/Load Buttons */}
      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#fff',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            💾 Save Game
          </motion.button>
          {hasSaveData() && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLoad}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#fff',
                background: 'linear-gradient(135deg, #4ecca3 0%, #2ecc71 100%)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              📂 Load Game
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartNewGame}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#fff',
              background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            🆕 Start New Game
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default TestControls
