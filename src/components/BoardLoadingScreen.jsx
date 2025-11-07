import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'

function BoardLoadingScreen() {
  const [progress, setProgress] = useState(0)
  const boardReady = useGameStore((state) => state.boardReady)
  const tiles = useGameStore((state) => state.board.tiles)
  const gameStarted = useGameStore((state) => state.gameStarted)
  
  // Track loading progress based on initial tile generation
  useEffect(() => {
    if (boardReady || !gameStarted) return
    
    // Estimate progress based on tile count
    // Initial board needs around 100-150 tiles for the starting area
    const targetTiles = 150
    const currentTiles = tiles.size
    const calculatedProgress = Math.min(100, (currentTiles / targetTiles) * 100)
    
    // Smooth progress updates - increment gradually
    // Use requestAnimationFrame to ensure animations aren't blocked
    let animationFrameId
    const updateProgress = () => {
      setProgress(prev => {
        // Smoothly increase progress, but don't exceed calculated progress
        if (prev < calculatedProgress) {
          return Math.min(calculatedProgress, prev + 2)
        }
        return prev
      })
      
      if (!boardReady && gameStarted) {
        animationFrameId = requestAnimationFrame(updateProgress)
      }
    }
    
    animationFrameId = requestAnimationFrame(updateProgress)
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [tiles.size, boardReady, gameStarted])
  
  // Reset progress when game starts
  useEffect(() => {
    if (gameStarted) {
      setProgress(0)
    }
  }, [gameStarted])
  
  // Don't show if board is ready
  if (boardReady || !gameStarted) return null
  
  return (
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
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2500,
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        pointerEvents: 'none' // Allow clicks to pass through during loading
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          maxWidth: '500px',
          width: '90%'
        }}
      >
        {/* Spinner with CSS animation for better performance */}
        <div
          style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 2rem',
            border: '4px solid rgba(255, 255, 255, 0.1)',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            willChange: 'transform'
          }}
        />
        
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); opacity: 0.5; }
            50% { transform: translateY(-10px); opacity: 1; }
          }
        `}</style>
        
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Generating Board...
        </h2>
        
        <p style={{
          fontSize: '1.1rem',
          opacity: 0.8,
          marginBottom: '2rem'
        }}>
          Creating your infinite world
        </p>
        
        {/* Animated dots with CSS animation for better performance */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            marginTop: '2rem'
          }}
        >
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#667eea',
                animation: `bounce 0.6s ease-in-out infinite`,
                animationDelay: `${index * 0.2}s`,
                willChange: 'transform, opacity'
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default BoardLoadingScreen

