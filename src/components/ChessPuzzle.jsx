import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { getAIMove, getAllLegalMoves, isKingInCheck } from '../utils/chessAI'

function ChessPuzzle({ puzzle, onComplete, onSkip, playerScore, startTime }) {
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [board, setBoard] = useState(puzzle.board)
  const [moves, setMoves] = useState([])
  const [timeRemaining, setTimeRemaining] = useState(puzzle.timeLimit)
  const [submitted, setSubmitted] = useState(false)
  const [isWhiteTurn, setIsWhiteTurn] = useState(true)
  const [isProcessingAIMove, setIsProcessingAIMove] = useState(false)
  const [bonusPoints, setBonusPoints] = useState(0)
  
  const addScore = useGameStore((state) => state.addScore)
  const isWhiteTurnRef = useRef(true)

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

  const handleSquareClick = (row, col) => {
    if (submitted || isProcessingAIMove || !isWhiteTurn) return

    const square = `${row},${col}`
    
    if (!selectedSquare) {
      // First click - select piece
      const piece = board[row][col]
      if (piece && isWhitePiece(piece)) {
        setSelectedSquare(square)
      }
    } else {
      // Second click - move piece
      const [fromRow, fromCol] = selectedSquare.split(',').map(Number)
      const piece = board[fromRow][fromCol]
      
      if (square === selectedSquare) {
        // Deselect
        setSelectedSquare(null)
      } else {
        // Make move
        const newBoard = board.map(r => [...r])
        newBoard[row][col] = piece
        newBoard[fromRow][fromCol] = null
        
        const moveNotation = getMoveNotation(piece, fromRow, fromCol, row, col)
        const newMoves = [...moves, moveNotation]
        
        setBoard(newBoard)
        setMoves(newMoves)
        setSelectedSquare(null)
        
        // Check for checkmate after White's move
        // For mate in 2: after White's 2nd move, Black should be in checkmate
        // For mate in 3: after White's 3rd move, Black should be in checkmate
        setTimeout(() => {
          const blackKingInCheck = isKingInCheck(newBoard, false)
          const blackLegalMoves = getAllLegalMoves(newBoard, false)
          
          // Only check for checkmate if we've made at least the minimum moves
          // For mate in 2: need at least 2 moves (White move 1, Black response)
          // For mate in 3: need at least 4 moves (White move 1, Black, White move 2, Black)
          const minMovesForCheckmate = puzzle.targetMoves * 2 - 1
          
          console.log('After White move:')
          console.log('  Moves:', newMoves.length, 'Min for checkmate:', minMovesForCheckmate)
          console.log('  Black king in check:', blackKingInCheck)
          console.log('  Black legal moves:', blackLegalMoves.length)
          
          if (blackKingInCheck && blackLegalMoves.length === 0 && newMoves.length >= minMovesForCheckmate) {
            // Checkmate! Puzzle solved
            console.log('Checkmate detected after White move!')
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
            return
          }
        }, 300)
        
        setIsWhiteTurn(false)
        isWhiteTurnRef.current = false
        
        // Trigger AI move after a short delay
        setTimeout(() => {
          console.log('Triggering AI move after White move, isWhiteTurn:', isWhiteTurnRef.current)
          makeAIMove(newBoard, newMoves)
        }, 800)
      }
    }
  }

  const isWhitePiece = (piece) => {
    return piece && piece === piece.toUpperCase()
  }

  const getMoveNotation = (piece, fromRow, fromCol, toRow, toCol) => {
    const files = 'abcdefgh'
    const pieceMap = { 'K': '', 'Q': 'Q', 'R': 'R', 'B': 'B', 'N': 'N', 'P': '' }
    const pieceChar = pieceMap[piece.toUpperCase()] || ''
    const fromFile = files[fromCol]
    const fromRank = 8 - fromRow
    const toFile = files[toCol]
    const toRank = 8 - toRow
    
    return `${pieceChar}${fromFile}${fromRank}-${toFile}${toRank}`
  }

  const checkSolution = (currentBoard, currentMoves) => {
    // First check if checkmate has been achieved
    // This should only be checked after White completes the mating move
    const blackKingInCheck = isKingInCheck(currentBoard, false)
    const blackLegalMoves = getAllLegalMoves(currentBoard, false)
    
    console.log('checkSolution called:')
    console.log('  Black king in check:', blackKingInCheck)
    console.log('  Black legal moves:', blackLegalMoves.length)
    console.log('  Current moves:', currentMoves.length)
    console.log('  Target moves:', puzzle.targetMoves * 2)
    
    // Only check for checkmate if we've made enough moves (at least White's mating move)
    // For mate in 2: need at least 2 moves (White move 1, Black response)
    // For mate in 3: need at least 4 moves (White move 1, Black, White move 2, Black)
    const minMovesForCheckmate = puzzle.targetMoves * 2 - 1
    
    if (blackKingInCheck && blackLegalMoves.length === 0 && currentMoves.length >= minMovesForCheckmate) {
      // Checkmate achieved!
      console.log('Checkmate detected in checkSolution!')
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
      }, 2000)
      return
    }
    
    // Otherwise, check if moves match solution pattern (for move-based puzzles)
    const solutionMoves = puzzle.solution.slice(0, puzzle.targetMoves * 2) // White and black moves
    
    // Check if our moves match the solution pattern
    let matches = 0
    for (let i = 0; i < Math.min(currentMoves.length, solutionMoves.length); i++) {
      if (currentMoves[i] && solutionMoves[i] && 
          currentMoves[i].includes(solutionMoves[i].replace(/[+#]/g, '').substring(0, 2))) {
        matches++
      }
    }
    
    if (currentMoves.length >= puzzle.targetMoves * 2 && matches >= puzzle.targetMoves) {
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
      }, 2000)
    } else if (currentMoves.length >= puzzle.targetMoves * 2) {
      // Wrong solution - enough moves but didn't achieve checkmate
      setSubmitted(true)
      setTimeout(() => {
        onComplete(false)
      }, 2000)
    }
  }

  const handleTimeout = () => {
    setSubmitted(true)
    setTimeout(() => {
      onComplete(false)
    }, 2000)
  }

  const resetPuzzle = () => {
    setBoard(puzzle.board)
    setMoves([])
    setSelectedSquare(null)
    setSubmitted(false)
    setIsWhiteTurn(true)
    isWhiteTurnRef.current = true
    setTimeRemaining(puzzle.timeLimit)
    setIsProcessingAIMove(false)
  }

  const makeAIMove = (currentBoard, currentMoves) => {
    // Check if puzzle is already submitted
    if (submitted) {
      console.log('AI move blocked: puzzle already submitted')
      return
    }
    
    // Check if it's actually Black's turn using ref to avoid stale closure
    if (isWhiteTurnRef.current) {
      console.log('AI move blocked: not Black\'s turn (ref check)')
      return
    }
    
    console.log('AI move called, checking for black pieces...')
    console.log('Current board state:', JSON.stringify(currentBoard))
    setIsProcessingAIMove(true)
    
    // Get AI move for Black
    const aiMove = getAIMove(currentBoard, puzzle.solution)
    
    if (!aiMove) {
      console.log('AI: No legal moves available for Black')
      // No legal moves - checkmate or stalemate
      setIsProcessingAIMove(false)
      
      // Check if Black is in check (checkmate) or not (stalemate)
      const blackKingInCheck = isKingInCheck(currentBoard, false)
      if (blackKingInCheck) {
        // Checkmate!
        console.log('Checkmate! Black has no legal moves and is in check')
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
      } else {
        // Stalemate - not a win
        console.log('Stalemate - Black has no legal moves but is not in check')
        setIsWhiteTurn(true)
        isWhiteTurnRef.current = true
      }
      return
    }
    
    console.log('AI move selected:', aiMove)
    
    // Execute AI move after a short delay for visual feedback
    setTimeout(() => {
      // Re-check if puzzle is still active
      if (submitted) {
        setIsProcessingAIMove(false)
        return
      }
      
      const newBoard = currentBoard.map(r => [...r])
      const piece = newBoard[aiMove.from.row][aiMove.from.col]
      
      if (!piece) {
        console.error('AI move error: piece not found at', aiMove.from)
        setIsProcessingAIMove(false)
        setIsWhiteTurn(true)
        isWhiteTurnRef.current = true
        return
      }
      
      console.log('AI executing move:', piece, 'from', aiMove.from, 'to', aiMove.to)
      
      newBoard[aiMove.to.row][aiMove.to.col] = piece
      newBoard[aiMove.from.row][aiMove.from.col] = null
      
      const aiMoveNotation = getMoveNotation(
        piece,
        aiMove.from.row,
        aiMove.from.col,
        aiMove.to.row,
        aiMove.to.col
      )
      
      const updatedMoves = [...currentMoves, aiMoveNotation]
      
      setBoard(newBoard)
      setMoves(updatedMoves)
      setIsWhiteTurn(true)
      isWhiteTurnRef.current = true
      setIsProcessingAIMove(false)
      
      // After Black's move, just check solution by move count
      // Checkmate should only be checked after White's move
      setTimeout(() => {
        checkSolution(newBoard, updatedMoves)
      }, 500)
    }, 600)
  }

  const getPieceDisplay = (piece) => {
    if (!piece) return ''
    const pieces = {
      'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
      'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
    }
    return pieces[piece] || ''
  }

  const isSelected = (row, col) => {
    if (!selectedSquare) return false
    const [r, c] = selectedSquare.split(',').map(Number)
    return r === row && c === col
  }

  const files = 'abcdefgh'
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1]

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
          color: '#d4af37',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Chess Puzzle • {puzzle.difficulty} • Mate in {puzzle.targetMoves}
        </div>
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: timeRemaining <= 30 ? '#e74c3c' : '#fff',
          fontFamily: 'monospace'
        }}>
          ⏱ {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
        </div>
      </div>

      <div style={{
        fontSize: '16px',
        color: '#fff',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        {puzzle.explanation}
      </div>

      {/* Chess board - row 0 is rank 8 (top), row 7 is rank 1 (bottom) */}
      {/* Display from rank 8 to rank 1 (normal chess orientation) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gap: '2px',
        marginBottom: '20px',
        maxWidth: '500px',
        margin: '0 auto 20px',
        border: '3px solid #d4af37',
        padding: '4px'
      }}>
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            // rowIndex 0 = rank 8 (top), rowIndex 7 = rank 1 (bottom)
            // For chess display: light square if rank+file is even
            const rank = 8 - rowIndex
            const file = colIndex + 1 // a=1, b=2, etc.
            const isLight = (rank + file) % 2 === 0
            const selected = isSelected(rowIndex, colIndex)
            
            return (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                whileHover={!submitted ? { scale: 1.1 } : {}}
                whileTap={!submitted ? { scale: 0.9 } : {}}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
                disabled={submitted || isProcessingAIMove || (!isWhiteTurn && !piece)}
                style={{
                  width: '50px',
                  height: '50px',
                  fontSize: '32px',
                  background: selected
                    ? 'rgba(212, 175, 55, 0.5)'
                    : isLight
                    ? '#f0d9b5'
                    : '#b58863',
                  border: selected ? '3px solid #d4af37' : '1px solid rgba(0,0,0,0.2)',
                  cursor: submitted ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                title={`${String.fromCharCode(97 + colIndex)}${rank}`}
              >
                {getPieceDisplay(piece)}
              </motion.button>
            )
          })
        )}
      </div>

      <div style={{
        fontSize: '14px',
        color: '#f4d03f',
        marginBottom: '15px',
        textAlign: 'center'
      }}>
        Moves: {moves.length} / {puzzle.targetMoves * 2} ({isWhiteTurn ? 'White' : 'Black'} to move)
        {isProcessingAIMove && (
          <span style={{ marginLeft: '10px', fontSize: '12px', opacity: 0.7 }}>
            (AI thinking...)
          </span>
        )}
      </div>

      {moves.length > 0 && (
        <div style={{
          fontSize: '12px',
          color: '#fff',
          opacity: 0.7,
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          {moves.join(' • ')}
        </div>
      )}

      {!submitted && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetPuzzle}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#fff',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Reset Puzzle
          </motion.button>
          {onSkip && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSkip}
              disabled={playerScore < 10}
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#fff',
                background: playerScore >= 10
                  ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'
                  : 'rgba(231, 76, 60, 0.5)',
                border: 'none',
                borderRadius: '8px',
                cursor: playerScore >= 10 ? 'pointer' : 'not-allowed',
                opacity: playerScore >= 10 ? 1 : 0.6
              }}
            >
              Skip (-10)
            </motion.button>
          )}
        </div>
      )}

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '20px',
            padding: '20px',
            borderRadius: '12px',
            background: moves.length >= puzzle.targetMoves
              ? 'rgba(78, 204, 163, 0.2)'
              : 'rgba(231, 76, 60, 0.2)',
            border: `2px solid ${moves.length >= puzzle.targetMoves ? '#4ecca3' : '#e74c3c'}`,
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>
            {moves.length >= puzzle.targetMoves ? '✅ Checkmate!' : '❌ Time\'s Up!'}
          </div>
          <div style={{ fontSize: '16px', color: '#fff', opacity: 0.9 }}>
            {moves.length >= puzzle.targetMoves
              ? (
                <>
                  {bonusPoints > 0 ? (
                    <>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f4d03f', marginBottom: '5px' }}>
                        ⚡ Quick Solve Bonus!
                      </div>
                      <div>
                        You solved it in {moves.length} moves!<br />
                        Base: {puzzle.points} points<br />
                        Bonus: +{bonusPoints} points<br />
                        <strong style={{ fontSize: '18px', color: '#4ecca3' }}>
                          Total: {puzzle.points + bonusPoints} points!
                        </strong>
                      </div>
                    </>
                  ) : (
                    `You solved it in ${moves.length} moves!`
                  )}
                </>
              )
              : `You made ${moves.length} moves.`}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ChessPuzzle

