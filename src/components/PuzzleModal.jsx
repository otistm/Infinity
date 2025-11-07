import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import Match3Puzzle from './Match3Puzzle'
import ChessPuzzle from './ChessPuzzle'
import MazePuzzle from './MazePuzzle'
import RhythmPuzzle from './RhythmPuzzle'

function PuzzleModal() {
  const puzzle = useGameStore((state) => state.puzzle.data)
  const isActive = useGameStore((state) => state.puzzle.active)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [bonusPoints, setBonusPoints] = useState(0)
  const [showReveal, setShowReveal] = useState(true)
  
  const addScore = useGameStore((state) => state.addScore)
  const closePuzzle = useGameStore((state) => state.closePuzzle)
  const incrementPuzzlesSolved = useGameStore((state) => state.incrementPuzzlesSolved)
  const playerScore = useGameStore((state) => state.player.score)

  // Get puzzle type display name
  const getPuzzleTypeName = (puzzleType) => {
    const typeNames = {
      math: 'Math Puzzle',
      geometry: 'Geometry Puzzle',
      match3: 'Match-3 Puzzle',
      trivia: 'Trivia Puzzle',
      chess: 'Chess Puzzle',
      maze: 'Maze Puzzle',
      rhythm: 'Rhythm Puzzle'
    }
    return typeNames[puzzleType] || 'Puzzle'
  }

  // Reset reveal state when puzzle changes
  useEffect(() => {
    if (puzzle && isActive) {
      setShowReveal(true)
      // Hide reveal after animation (1.5 seconds)
      const timer = setTimeout(() => {
        setShowReveal(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [puzzle, isActive])

  // Initialize timer when puzzle loads
  useEffect(() => {
    if (puzzle && isActive && !showReveal) {
      setTimeRemaining(puzzle.timeLimit)
      setSelectedAnswer(null)
      setSubmitted(false)
      setResult(null)
      setStartTime(Date.now()) // Track when puzzle starts
      setBonusPoints(0)
    }
  }, [puzzle, isActive, showReveal])

  // Timer countdown (only for non-match3, non-chess, non-maze, and non-rhythm puzzles)
  useEffect(() => {
    if (!puzzle || !isActive || showReveal || submitted || puzzle.type === 'match3' || puzzle.type === 'chess' || puzzle.type === 'maze' || puzzle.type === 'rhythm') return

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
  }, [puzzle, isActive, submitted, showReveal])

  const handleTimeout = () => {
    setSubmitted(true)
    setResult(false)
    setTimeout(() => {
      closePuzzle()
    }, 2000)
  }

  const handleSubmit = () => {
    if (selectedAnswer === null || submitted) return
    
    setSubmitted(true)
    const isCorrect = puzzle.answers[selectedAnswer].isCorrect
    
    if (isCorrect) {
      // Check if solved within 5 seconds
      const elapsedSeconds = startTime ? (Date.now() - startTime) / 1000 : 0
      const isQuickSolve = elapsedSeconds <= 5
      const bonus = isQuickSolve ? puzzle.points : 0 // 2x points for quick solve
      
      setBonusPoints(bonus)
      addScore(puzzle.points + bonus)
      incrementPuzzlesSolved()
      setResult(true)
    } else {
      setResult(false)
    }
    
    setTimeout(() => {
      closePuzzle()
    }, 2000)
  }

  const handleAnswerClick = (index) => {
    if (!submitted) {
      setSelectedAnswer(index)
    }
  }

  const handleMatch3Complete = (success) => {
    if (success) {
      // Bonus already calculated and displayed in Match3Puzzle component
      // Just update score here if needed
      incrementPuzzlesSolved()
    }
    setTimeout(() => {
      closePuzzle()
    }, 2000)
  }

  const handleChessComplete = (success) => {
    if (success) {
      // Bonus already calculated and displayed in ChessPuzzle component
      // Just update score here if needed
      incrementPuzzlesSolved()
    }
    setTimeout(() => {
      closePuzzle()
    }, 2000)
  }

  const handleMazeComplete = (success) => {
    if (success) {
      // Bonus already calculated and displayed in MazePuzzle component
      incrementPuzzlesSolved()
    }
    setTimeout(() => {
      closePuzzle()
    }, 2000)
  }

  const handleRhythmComplete = (success) => {
    if (success) {
      // Bonus already calculated and displayed in RhythmPuzzle component
      incrementPuzzlesSolved()
    }
    setTimeout(() => {
      closePuzzle()
    }, 2000)
  }

  const handleSkip = () => {
    if (submitted) return
    // Deduct 10 points for skipping
    addScore(-10)
    closePuzzle()
  }

  if (!isActive || !puzzle) return null

  const difficultyColors = {
    easy: '#4ecca3',
    medium: '#f4d03f',
    hard: '#e74c3c'
  }

  // Show puzzle reveal animation first
  if (showReveal) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            pointerEvents: 'auto'
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20
            }}
            style={{
              textAlign: 'center'
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: 'spring',
                stiffness: 300,
                damping: 15
              }}
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                background: `linear-gradient(135deg, ${difficultyColors[puzzle.difficulty]}, ${difficultyColors[puzzle.difficulty]}dd)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textTransform: 'uppercase',
                letterSpacing: '8px',
                marginBottom: '20px',
                textShadow: `0 0 40px ${difficultyColors[puzzle.difficulty]}88`
              }}
            >
              {getPuzzleTypeName(puzzle.type)}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                fontSize: '24px',
                color: '#fff',
                opacity: 0.8,
                textTransform: 'uppercase',
                letterSpacing: '4px',
                fontWeight: 'bold'
              }}
            >
              {puzzle.difficulty}
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
              style={{
                marginTop: '40px',
                fontSize: '48px',
                filter: `drop-shadow(0 0 20px ${difficultyColors[puzzle.difficulty]})`
              }}
            >
              ✨
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // Handle rhythm puzzles separately
  if (puzzle.type === 'rhythm') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            pointerEvents: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: '40px',
              borderRadius: '20px',
              maxWidth: '700px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              border: `3px solid ${difficultyColors[puzzle.difficulty]}`,
              position: 'relative'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              fontSize: '14px',
              color: '#f4d03f',
              fontWeight: 'bold'
            }}>
              +{puzzle.points} points
            </div>
            
            <RhythmPuzzle puzzle={puzzle} onComplete={handleRhythmComplete} startTime={startTime} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // Handle maze puzzles separately
  if (puzzle.type === 'maze') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            pointerEvents: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: '40px',
              borderRadius: '20px',
              maxWidth: '600px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              border: `3px solid ${difficultyColors[puzzle.difficulty]}`,
              position: 'relative'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              fontSize: '14px',
              color: '#f4d03f',
              fontWeight: 'bold'
            }}>
              +{puzzle.points} points
            </div>
            
            <MazePuzzle puzzle={puzzle} onComplete={handleMazeComplete} startTime={startTime} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // Handle chess puzzles separately
  if (puzzle.type === 'chess') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            pointerEvents: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: '40px',
              borderRadius: '20px',
              maxWidth: '700px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              border: `3px solid #d4af37`,
              position: 'relative'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              fontSize: '14px',
              color: '#f4d03f',
              fontWeight: 'bold'
            }}>
              +{puzzle.points} points
            </div>
            
            <ChessPuzzle puzzle={puzzle} onComplete={handleChessComplete} onSkip={handleSkip} playerScore={playerScore} startTime={startTime} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // Handle match-3 puzzles separately
  if (puzzle.type === 'match3') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            pointerEvents: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: '40px',
              borderRadius: '20px',
              maxWidth: '600px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              border: `3px solid ${difficultyColors[puzzle.difficulty]}`,
              position: 'relative'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              fontSize: '14px',
              color: '#f4d03f',
              fontWeight: 'bold'
            }}>
              +{puzzle.points} points
            </div>
            
            <Match3Puzzle puzzle={puzzle} onComplete={handleMatch3Complete} startTime={startTime} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // Handle regular multiple choice puzzles (math, geometry, trivia)
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          pointerEvents: 'auto'
        }}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: '40px',
            borderRadius: '20px',
            maxWidth: '600px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            border: `3px solid ${difficultyColors[puzzle.difficulty]}`,
            position: 'relative'
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: difficultyColors[puzzle.difficulty],
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {puzzle.difficulty} Puzzle • {puzzle.type}
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

          {/* Points */}
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            fontSize: '14px',
            color: '#f4d03f',
            fontWeight: 'bold'
          }}>
            +{puzzle.points} points
          </div>

          {/* Question */}
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: '30px',
            textAlign: 'center',
            lineHeight: '1.4'
          }}>
            {puzzle.question}
          </h2>
          
          {/* Answer Options */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '30px'
          }}>
            {puzzle.answers.map((answer, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = answer.isCorrect && submitted
              const isWrong = !answer.isCorrect && submitted && selectedAnswer === index
              
              return (
                <motion.button
                  key={index}
                  initial={{ scale: 1 }}
                  whileHover={!submitted ? { scale: 1.05 } : {}}
                  whileTap={!submitted ? { scale: 0.95 } : {}}
                  onClick={() => handleAnswerClick(index)}
                  disabled={submitted}
                  style={{
                    padding: '20px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#fff',
                    background: isCorrect
                      ? 'linear-gradient(135deg, #4ecca3 0%, #2ecc71 100%)'
                      : isWrong
                      ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
                      : isSelected
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: isSelected ? '2px solid #fff' : '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    cursor: submitted ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: submitted && !isCorrect && !isWrong ? 0.5 : 1,
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontWeight: 'bold', marginRight: '10px' }}>
                    {answer.letter})
                  </span>
                  {answer.text}
                </motion.button>
              )
            })}
          </div>

          {/* Skip Button */}
          {!submitted && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSkip}
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
                opacity: playerScore >= 10 ? 1 : 0.6,
                marginBottom: '10px',
                boxShadow: playerScore >= 10 ? '0 4px 15px rgba(231, 76, 60, 0.4)' : 'none'
              }}
              disabled={playerScore < 10}
            >
              Skip Puzzle (-10 points)
            </motion.button>
          )}

          {/* Submit Button */}
          {!submitted && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#fff',
                background: selectedAnswer === null
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '12px',
                cursor: selectedAnswer === null ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: selectedAnswer === null ? 0.6 : 1
              }}
            >
              Submit Answer
            </motion.button>
          )}

          {/* Result Feedback */}
          {submitted && result !== null && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: '20px',
                padding: '20px',
                borderRadius: '12px',
                background: result
                  ? 'rgba(78, 204, 163, 0.2)'
                  : 'rgba(231, 76, 60, 0.2)',
                border: `2px solid ${result ? '#4ecca3' : '#e74c3c'}`,
                textAlign: 'center'
              }}
            >
              <div style={{
                fontSize: '24px',
                marginBottom: '10px'
              }}>
                {result ? '✅ Correct!' : '❌ Time\'s Up!'}
              </div>
              <div style={{
                fontSize: '16px',
                color: '#fff',
                opacity: 0.9
              }}>
                {result
                  ? (
                    <>
                      {bonusPoints > 0 ? (
                        <>
                          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f4d03f', marginBottom: '5px' }}>
                            ⚡ Quick Solve Bonus!
                          </div>
                          <div>
                            Base: {puzzle.points} points<br />
                            Bonus: +{bonusPoints} points<br />
                            <strong style={{ fontSize: '18px', color: '#4ecca3' }}>
                              Total: {puzzle.points + bonusPoints} points!
                            </strong>
                          </div>
                        </>
                      ) : (
                        `You earned ${puzzle.points} points!`
                      )}
                    </>
                  )
                  : 'Better luck next time!'}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PuzzleModal

