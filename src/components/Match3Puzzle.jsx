import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'

function Match3Puzzle({ puzzle, onComplete, startTime }) {
  const [selectedCells, setSelectedCells] = useState([])
  const [foundMatches, setFoundMatches] = useState([])
  const [timeRemaining, setTimeRemaining] = useState(puzzle.timeLimit)
  const [submitted, setSubmitted] = useState(false)
  const [bonusPoints, setBonusPoints] = useState(0)
  const playerScore = useGameStore((state) => state.player.score)
  const addScore = useGameStore((state) => state.addScore)
  const closePuzzle = useGameStore((state) => state.closePuzzle)

  useEffect(() => {
    if (submitted) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [submitted])

  const handleCellClick = (row, col) => {
    if (submitted) return
    
    const cellKey = `${row},${col}`
    const index = selectedCells.findIndex(c => c === cellKey)
    
    if (index >= 0) {
      // Deselect
      setSelectedCells(selectedCells.filter(c => c !== cellKey))
    } else {
      // Select (max 3 in a row)
      const newSelected = [...selectedCells, cellKey]
      if (newSelected.length <= 3) {
        setSelectedCells(newSelected)
      }
    }
  }

  const checkMatch = () => {
    if (selectedCells.length < 3) return false
    
    // Get selected cells with coordinates
    const cells = selectedCells.map(key => {
      const [row, col] = key.split(',').map(Number)
      return { row, col, color: puzzle.grid[row][col] }
    })
    
    // Check if all same color
    const firstColor = cells[0].color
    const allSameColor = cells.every(c => c.color === firstColor)
    if (!allSameColor) return false
    
    // Sort cells by row first, then column
    cells.sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row
      return a.col - b.col
    })
    
    // Check if in a horizontal line (same row, consecutive columns)
    const isHorizontal = cells.every((c, i) => {
      if (i === 0) return true
      return c.row === cells[0].row && c.col === cells[i-1].col + 1
    })
    
    // Check if in a vertical line (same column, consecutive rows)
    const isVertical = cells.every((c, i) => {
      if (i === 0) return true
      return c.col === cells[0].col && c.row === cells[i-1].row + 1
    })
    
    return isHorizontal || isVertical
  }

  const handleSubmit = () => {
    if (selectedCells.length < 3) return
    
    const isMatch = checkMatch()
    
    if (isMatch) {
      const matchKey = selectedCells.sort().join('-')
      if (!foundMatches.includes(matchKey)) {
        setFoundMatches([...foundMatches, matchKey])
        setSelectedCells([])
        
        // Check if we found enough matches
        if (foundMatches.length + 1 >= puzzle.targetMatches) {
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
    } else {
      setSelectedCells([])
    }
  }

  const handleTimeout = () => {
    setSubmitted(true)
    setTimeout(() => {
      onComplete(foundMatches.length >= puzzle.targetMatches)
    }, 1500)
  }

  const isCellSelected = (row, col) => {
    return selectedCells.includes(`${row},${col}`)
  }

  const isCellInFoundMatch = (row, col) => {
    return foundMatches.some(match => match.includes(`${row},${col}`))
  }

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
          color: '#9b59b6',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Match-3 Puzzle • {puzzle.difficulty}
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
        Found: {foundMatches.length} / {puzzle.targetMatches} matches
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${puzzle.gridSize}, 1fr)`,
        gap: '8px',
        marginBottom: '20px',
        maxWidth: '400px',
        margin: '0 auto 20px'
      }}>
        {puzzle.grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const selected = isCellSelected(rowIndex, colIndex)
            const found = isCellInFoundMatch(rowIndex, colIndex)
            
            return (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                whileHover={!submitted ? { scale: 1.1 } : {}}
                whileTap={!submitted ? { scale: 0.9 } : {}}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={submitted || found}
                style={{
                  width: '50px',
                  height: '50px',
                  fontSize: '24px',
                  background: found
                    ? 'rgba(78, 204, 163, 0.3)'
                    : selected
                    ? 'rgba(102, 126, 234, 0.5)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: found
                    ? '2px solid #4ecca3'
                    : selected
                    ? '2px solid #667eea'
                    : '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  cursor: submitted || found ? 'not-allowed' : 'pointer',
                  opacity: found ? 0.5 : 1
                }}
              >
                {cell}
              </motion.button>
            )
          })
        )}
      </div>

      {!submitted && (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={selectedCells.length < 3}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#fff',
              background: selectedCells.length < 3
                ? 'rgba(255, 255, 255, 0.2)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '12px',
              cursor: selectedCells.length < 3 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: selectedCells.length < 3 ? 0.6 : 1,
              marginBottom: '10px'
            }}
          >
            Check Match ({selectedCells.length}/3)
          </motion.button>
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
        </>
      )}

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '20px',
            padding: '20px',
            borderRadius: '12px',
            background: foundMatches.length >= puzzle.targetMatches
              ? 'rgba(78, 204, 163, 0.2)'
              : 'rgba(231, 76, 60, 0.2)',
            border: `2px solid ${foundMatches.length >= puzzle.targetMatches ? '#4ecca3' : '#e74c3c'}`,
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>
            {foundMatches.length >= puzzle.targetMatches ? '✅ Success!' : '❌ Time\'s Up!'}
          </div>
          <div style={{ fontSize: '16px', color: '#fff', opacity: 0.9 }}>
            {foundMatches.length >= puzzle.targetMatches
              ? (
                <>
                  {bonusPoints > 0 ? (
                    <>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f4d03f', marginBottom: '5px' }}>
                        ⚡ Quick Solve Bonus!
                      </div>
                      <div>
                        You found {foundMatches.length} matches!<br />
                        Base: {puzzle.points} points<br />
                        Bonus: +{bonusPoints} points<br />
                        <strong style={{ fontSize: '18px', color: '#4ecca3' }}>
                          Total: {puzzle.points + bonusPoints} points!
                        </strong>
                      </div>
                    </>
                  ) : (
                    `You found ${foundMatches.length} matches!`
                  )}
                </>
              )
              : `You found ${foundMatches.length} of ${puzzle.targetMatches} matches.`}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Match3Puzzle

