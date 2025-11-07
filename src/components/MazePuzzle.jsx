import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'

function MazePuzzle({ puzzle, onComplete, startTime }) {
  const [playerPos, setPlayerPos] = useState({ ...puzzle.start })
  const [completed, setCompleted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(puzzle.timeLimit)
  const [submitted, setSubmitted] = useState(false)
  const [bonusPoints, setBonusPoints] = useState(0)
  const [moves, setMoves] = useState(0)
  
  const addScore = useGameStore((state) => state.addScore)
  const playerScore = useGameStore((state) => state.player.score)
  const closePuzzle = useGameStore((state) => state.closePuzzle)
  
  // Handle keyboard input
  useEffect(() => {
    if (submitted || completed) return
    
    const handleKeyPress = (e) => {
      const { key } = e
      let newPos = { ...playerPos }
      
      switch (key) {
        case 'ArrowUp':
          newPos.y = Math.max(0, playerPos.y - 1)
          break
        case 'ArrowDown':
          newPos.y = Math.min(puzzle.height - 1, playerPos.y + 1)
          break
        case 'ArrowLeft':
          newPos.x = Math.max(0, playerPos.x - 1)
          break
        case 'ArrowRight':
          newPos.x = Math.min(puzzle.width - 1, playerPos.x + 1)
          break
        default:
          return
      }
      
      // Check if move is valid (not a wall)
      if (!puzzle.maze[newPos.y][newPos.x]) {
        setPlayerPos(newPos)
        setMoves(prev => prev + 1)
        
        // Check if reached the end
        if (newPos.x === puzzle.end.x && newPos.y === puzzle.end.y) {
          setCompleted(true)
          setSubmitted(true)
          
          // Calculate bonus if solved within 5 seconds
          const elapsedSeconds = startTime ? (Date.now() - startTime) / 1000 : 0
          const isQuickSolve = elapsedSeconds <= 5
          const bonus = isQuickSolve ? puzzle.points : 0
          setBonusPoints(bonus)
          
          // Award points
          addScore(puzzle.points + bonus)
          
          setTimeout(() => {
            onComplete(true)
          }, 1500)
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [playerPos, submitted, completed, puzzle, startTime, addScore, onComplete])
  
  // Timer countdown
  useEffect(() => {
    if (submitted || completed) return
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setSubmitted(true)
          setTimeout(() => {
            onComplete(false)
          }, 2000)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [submitted, completed, onComplete])
  
  const cellSize = Math.min(400 / puzzle.width, 400 / puzzle.height)
  
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#8e44ad',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Maze Puzzle • {puzzle.difficulty}
        </div>
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: timeRemaining <= 10 ? '#e74c3c' : '#fff',
          fontFamily: 'monospace'
        }}>
          ⏱ {timeRemaining}s
        </div>
      </div>
      
      <div style={{
        fontSize: '16px',
        color: '#fff',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        {puzzle.question}
      </div>
      
      <div style={{
        fontSize: '14px',
        color: '#f4d03f',
        marginBottom: '15px',
        textAlign: 'center'
      }}>
        Moves: {moves} • Use arrow keys to navigate
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${puzzle.width}, ${cellSize}px)`,
          gap: '0',
          border: '3px solid #8e44ad',
          background: '#2c3e50'
        }}>
          {puzzle.maze.map((row, rowIndex) =>
            row.map((isWall, colIndex) => {
              const isPlayer = playerPos.x === colIndex && playerPos.y === rowIndex
              const isEnd = puzzle.end.x === colIndex && puzzle.end.y === rowIndex
              const isPath = !isWall
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    background: isPlayer
                      ? '#3498db'
                      : isEnd && !isPlayer
                      ? '#e74c3c'
                      : isWall
                      ? '#34495e'
                      : '#ecf0f1',
                    border: isWall ? '1px solid #2c3e50' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: cellSize * 0.6,
                    position: 'relative'
                  }}
                >
                  {isPlayer && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        width: cellSize * 0.7,
                        height: cellSize * 0.7,
                        borderRadius: '50%',
                        background: '#3498db',
                        border: '2px solid #2980b9',
                        boxShadow: '0 0 10px rgba(52, 152, 219, 0.5)'
                      }}
                    />
                  )}
                  {isEnd && !isPlayer && (
                    <div
                      style={{
                        width: cellSize * 0.5,
                        height: cellSize * 0.5,
                        borderRadius: '50%',
                        background: '#e74c3c',
                        border: '2px solid #c0392b',
                        boxShadow: '0 0 10px rgba(231, 76, 60, 0.5)'
                      }}
                    />
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
      
      {!submitted && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            addScore(-10)
            closePuzzle()
          }}
          disabled={playerScore < 10}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#fff',
            background: playerScore >= 10
              ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
              : 'rgba(231, 76, 60, 0.5)',
            border: 'none',
            borderRadius: '12px',
            cursor: playerScore >= 10 ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            opacity: playerScore >= 10 ? 1 : 0.6
          }}
        >
          Skip Puzzle (-10 points)
        </motion.button>
      )}
      
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '20px',
            padding: '20px',
            borderRadius: '12px',
            background: completed
              ? 'rgba(78, 204, 163, 0.2)'
              : 'rgba(231, 76, 60, 0.2)',
            border: `2px solid ${completed ? '#4ecca3' : '#e74c3c'}`,
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '10px', color: '#fff' }}>
            {completed ? '✅ Maze Solved!' : '❌ Time\'s Up!'}
          </div>
          <div style={{ fontSize: '16px', color: '#fff', opacity: 0.9 }}>
            {completed ? (
              <>
                {bonusPoints > 0 ? (
                  <>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f4d03f', marginBottom: '5px' }}>
                      ⚡ Quick Solve Bonus!
                    </div>
                    <div>
                      You reached the center in {moves} moves!<br />
                      Base: {puzzle.points} points<br />
                      Bonus: +{bonusPoints} points<br />
                      <strong style={{ fontSize: '18px', color: '#4ecca3' }}>
                        Total: {puzzle.points + bonusPoints} points!
                      </strong>
                    </div>
                  </>
                ) : (
                  `You reached the center in ${moves} moves!`
                )}
              </>
            ) : (
              `You made ${moves} moves before time ran out.`
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default MazePuzzle

