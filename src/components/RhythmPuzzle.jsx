import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'

function RhythmPuzzle({ puzzle, onComplete, startTime }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [typedLetters, setTypedLetters] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [bonusPoints, setBonusPoints] = useState(0)
  const [score, setScore] = useState(0)
  const [missedCount, setMissedCount] = useState(0)
  
  const addScore = useGameStore((state) => state.addScore)
  const playerScore = useGameStore((state) => state.player.score)
  const closePuzzle = useGameStore((state) => state.closePuzzle)
  
  const linePositionRef = useRef(0)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)
  
  // Handle keyboard input
  useEffect(() => {
    if (!gameStarted || submitted || completed) return
    
    const handleKeyPress = (e) => {
      const key = e.key.toUpperCase()
      
      // Only accept letter keys
      if (!/[A-Z]/.test(key)) return
      
      const expectedLetter = puzzle.sequence[activeIndex]
      
      if (key === expectedLetter) {
        // Correct letter typed
        const newTypedLetters = [...typedLetters, { letter: key, index: activeIndex, correct: true }]
        setTypedLetters(newTypedLetters)
        setScore(prev => prev + 10)
        
        // Move to next letter
        if (activeIndex < puzzle.sequence.length - 1) {
          setActiveIndex(prev => prev + 1)
        } else {
          // Completed the sequence
          setCompleted(true)
          setSubmitted(true)
          
          // Calculate bonus if solved within 5 seconds
          const elapsedSeconds = startTime ? (Date.now() - startTime) / 1000 : 0
          const isQuickSolve = elapsedSeconds <= 5
          const bonus = isQuickSolve ? puzzle.points : 0
          setBonusPoints(bonus)
          
          // Award points (base + score bonus)
          const totalPoints = puzzle.points + bonus + Math.floor(score / 10)
          addScore(totalPoints)
          
          setTimeout(() => {
            onComplete(true)
          }, 1500)
        }
      } else {
        // Wrong letter - penalize
        setMissedCount(prev => prev + 1)
        setScore(prev => Math.max(0, prev - 5))
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameStarted, activeIndex, typedLetters, puzzle, submitted, completed, startTime, addScore, onComplete, score])
  
  // Auto-advance the line
  useEffect(() => {
    if (!gameStarted || submitted || completed) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }
    
    startTimeRef.current = Date.now()
    
    intervalRef.current = setInterval(() => {
      setActiveIndex(prev => {
        if (prev >= puzzle.sequence.length - 1) {
          // Time's up - didn't complete
          setSubmitted(true)
          setTimeout(() => {
            onComplete(false)
          }, 2000)
          return prev
        }
        return prev + 1
      })
    }, puzzle.speed)
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [gameStarted, submitted, completed, puzzle, onComplete])
  
  // Auto-start the game after a brief delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setGameStarted(true)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  const letterWidth = 40
  const letterGap = 10
  
  // Calculate line position based on centered layout
  // Letters are centered, so we need to calculate where each letter's center is
  const calculateLinePosition = (index) => {
    // Container max width is 600px, padding is 20px on each side
    const containerWidth = 600
    const padding = 20
    const totalContentWidth = (puzzle.sequence.length * letterWidth) + ((puzzle.sequence.length - 1) * letterGap)
    const startX = (containerWidth - totalContentWidth) / 2 + padding
    // Position line at the center of each letter
    return startX + (index * (letterWidth + letterGap)) + (letterWidth / 2) - 2 // -2 to center the 4px line
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
          color: '#e91e63',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Rhythm Puzzle • {puzzle.difficulty}
        </div>
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#fff',
          fontFamily: 'monospace'
        }}>
          Score: {score}
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
      
      {!gameStarted && (
        <div style={{
          fontSize: '20px',
          color: '#e91e63',
          textAlign: 'center',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          Get ready... {puzzle.sequence.length} letters coming!
        </div>
      )}
      
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto 30px',
        height: '120px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '12px',
        padding: '20px',
        overflow: 'hidden'
      }}>
        {/* Letters */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          position: 'relative',
          zIndex: 1,
          gap: '10px' // Fixed gap between letters
        }}>
          {puzzle.sequence.map((letter, index) => {
            const isActive = index === activeIndex && gameStarted
            const isTyped = typedLetters.some(t => t.index === index && t.correct)
            const isPast = index < activeIndex
            
            return (
              <motion.div
                key={index}
                animate={{
                  scale: isActive ? 1.3 : 1,
                  opacity: isPast ? 0.5 : isActive ? 1 : 0.7
                }}
                transition={{ duration: 0.2 }}
                style={{
                  width: letterWidth,
                  height: letterWidth,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: isTyped
                    ? '#4ecca3'
                    : isActive
                    ? '#e91e63'
                    : '#fff',
                  background: isActive
                    ? 'rgba(233, 30, 99, 0.3)'
                    : isTyped
                    ? 'rgba(78, 204, 163, 0.2)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: isActive
                    ? '3px solid #e91e63'
                    : isTyped
                    ? '2px solid #4ecca3'
                    : '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  position: 'relative',
                  flexShrink: 0
                }}
              >
                {letter}
                {isActive && (
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: puzzle.speed / 1000,
                      repeat: Infinity
                    }}
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#e91e63',
                      boxShadow: '0 0 10px rgba(233, 30, 99, 0.8)'
                    }}
                  />
                )}
              </motion.div>
            )
          })}
        </div>
        
        {/* Moving line indicator */}
        {gameStarted && (
          <motion.div
            initial={{ x: calculateLinePosition(0) }}
            animate={{
              x: calculateLinePosition(activeIndex)
            }}
            transition={{
              duration: puzzle.speed / 1000,
              ease: 'linear'
            }}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: '4px',
              background: 'linear-gradient(to bottom, transparent, #e91e63, transparent)',
              boxShadow: '0 0 20px rgba(233, 30, 99, 0.8)',
              zIndex: 2,
              pointerEvents: 'none'
            }}
          />
        )}
      </div>
      
      <div style={{
        fontSize: '14px',
        color: '#f4d03f',
        marginBottom: '15px',
        textAlign: 'center'
      }}>
        Progress: {typedLetters.length} / {puzzle.sequence.length} • Missed: {missedCount}
      </div>
      
      <div style={{
        fontSize: '12px',
        color: '#fff',
        opacity: 0.7,
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        Type the letters on your keyboard as the line reaches them!
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
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>
            {completed ? '✅ Perfect!' : '❌ Time\'s Up!'}
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
                      You typed {typedLetters.length} letters correctly!<br />
                      Base: {puzzle.points} points<br />
                      Bonus: +{bonusPoints} points<br />
                      Score Bonus: +{Math.floor(score / 10)} points<br />
                      <strong style={{ fontSize: '18px', color: '#4ecca3' }}>
                        Total: {puzzle.points + bonusPoints + Math.floor(score / 10)} points!
                      </strong>
                    </div>
                  </>
                ) : (
                  <>
                    You typed {typedLetters.length} letters correctly!<br />
                    Score: {score} points<br />
                    <strong style={{ fontSize: '18px', color: '#4ecca3' }}>
                      Total: {puzzle.points + Math.floor(score / 10)} points!
                    </strong>
                  </>
                )}
              </>
            ) : (
              `You typed ${typedLetters.length} of ${puzzle.sequence.length} letters before time ran out.`
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default RhythmPuzzle

