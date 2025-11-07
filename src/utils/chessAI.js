// Chess AI and Move Generator
// Handles move generation and AI logic for chess puzzles

/**
 * Get all possible moves for a piece at a given position
 * Simplified chess move generation for puzzle purposes
 */
export function getPossibleMoves(board, row, col) {
  const piece = board[row][col]
  if (!piece) return []
  
  const moves = []
  const isWhite = piece === piece.toUpperCase()
  
  // Pawn moves
  if (piece.toLowerCase() === 'p') {
    if (isWhite) {
      // White pawns move up (decreasing row)
      if (row > 0 && !board[row - 1][col]) {
        moves.push({ row: row - 1, col })
      }
      // Initial double move
      if (row === 6 && !board[row - 1][col] && !board[row - 2][col]) {
        moves.push({ row: row - 2, col })
      }
      // Capture diagonally
      if (row > 0 && col > 0 && board[row - 1][col - 1] && board[row - 1][col - 1] === board[row - 1][col - 1].toLowerCase()) {
        moves.push({ row: row - 1, col: col - 1 })
      }
      if (row > 0 && col < 7 && board[row - 1][col + 1] && board[row - 1][col + 1] === board[row - 1][col + 1].toLowerCase()) {
        moves.push({ row: row - 1, col: col + 1 })
      }
    } else {
      // Black pawns move down (increasing row)
      if (row < 7 && !board[row + 1][col]) {
        moves.push({ row: row + 1, col })
      }
      if (row === 1 && !board[row + 1][col] && !board[row + 2][col]) {
        moves.push({ row: row + 2, col })
      }
      if (row < 7 && col > 0 && board[row + 1][col - 1] && board[row + 1][col - 1] === board[row + 1][col - 1].toUpperCase()) {
        moves.push({ row: row + 1, col: col - 1 })
      }
      if (row < 7 && col < 7 && board[row + 1][col + 1] && board[row + 1][col + 1] === board[row + 1][col + 1].toUpperCase()) {
        moves.push({ row: row + 1, col: col + 1 })
      }
    }
  }
  
  // Rook moves (horizontal and vertical)
  if (piece.toLowerCase() === 'r') {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
    for (const [dr, dc] of directions) {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i
        const newCol = col + dc * i
        if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break
        const targetPiece = board[newRow][newCol]
        if (!targetPiece) {
          moves.push({ row: newRow, col: newCol })
        } else {
          const targetIsWhite = targetPiece === targetPiece.toUpperCase()
          if (targetIsWhite !== isWhite) {
            moves.push({ row: newRow, col: newCol })
          }
          break
        }
      }
    }
  }
  
  // Bishop moves (diagonal)
  if (piece.toLowerCase() === 'b') {
    const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]]
    for (const [dr, dc] of directions) {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i
        const newCol = col + dc * i
        if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break
        const targetPiece = board[newRow][newCol]
        if (!targetPiece) {
          moves.push({ row: newRow, col: newCol })
        } else {
          const targetIsWhite = targetPiece === targetPiece.toUpperCase()
          if (targetIsWhite !== isWhite) {
            moves.push({ row: newRow, col: newCol })
          }
          break
        }
      }
    }
  }
  
  // Queen moves (rook + bishop)
  if (piece.toLowerCase() === 'q') {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]
    for (const [dr, dc] of directions) {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i
        const newCol = col + dc * i
        if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break
        const targetPiece = board[newRow][newCol]
        if (!targetPiece) {
          moves.push({ row: newRow, col: newCol })
        } else {
          const targetIsWhite = targetPiece === targetPiece.toUpperCase()
          if (targetIsWhite !== isWhite) {
            moves.push({ row: newRow, col: newCol })
          }
          break
        }
      }
    }
  }
  
  // King moves (one square in any direction)
  if (piece.toLowerCase() === 'k') {
    const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
    for (const [dr, dc] of directions) {
      const newRow = row + dr
      const newCol = col + dc
      if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
        const targetPiece = board[newRow][newCol]
        if (!targetPiece || (targetPiece && (targetPiece === targetPiece.toUpperCase()) !== isWhite)) {
          moves.push({ row: newRow, col: newCol })
        }
      }
    }
  }
  
  // Knight moves (L-shape)
  if (piece.toLowerCase() === 'n') {
    const moves_knight = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]
    for (const [dr, dc] of moves_knight) {
      const newRow = row + dr
      const newCol = col + dc
      if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
        const targetPiece = board[newRow][newCol]
        if (!targetPiece || (targetPiece && (targetPiece === targetPiece.toUpperCase()) !== isWhite)) {
          moves.push({ row: newRow, col: newCol })
        }
      }
    }
  }
  
  return moves
}

/**
 * Check if a square is under attack
 */
export function isSquareUnderAttack(board, row, col, attackerIsWhite) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c]
      if (piece && (piece === piece.toUpperCase()) === attackerIsWhite) {
        const moves = getPossibleMoves(board, r, c)
        if (moves.some(m => m.row === row && m.col === col)) {
          return true
        }
      }
    }
  }
  return false
}

/**
 * Check if the king is in check
 */
export function isKingInCheck(board, isWhite) {
  // Find the king
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c]
      if (piece && piece.toLowerCase() === 'k' && (piece === piece.toUpperCase()) === isWhite) {
        return isSquareUnderAttack(board, r, c, !isWhite)
      }
    }
  }
  return false
}

/**
 * Check if a move is legal (doesn't leave king in check)
 */
export function isMoveLegal(board, fromRow, fromCol, toRow, toCol) {
  // Make the move temporarily
  const newBoard = board.map(r => [...r])
  const piece = newBoard[fromRow][fromCol]
  const isWhite = piece === piece.toUpperCase()
  
  newBoard[toRow][toCol] = piece
  newBoard[fromRow][fromCol] = null
  
  // Check if this move leaves the king in check
  return !isKingInCheck(newBoard, isWhite)
}

/**
 * Get all legal moves for a piece
 */
export function getLegalMoves(board, row, col) {
  const allMoves = getPossibleMoves(board, row, col)
  return allMoves.filter(move => isMoveLegal(board, row, col, move.row, move.col))
}

/**
 * Get all legal moves for all pieces of a color
 */
export function getAllLegalMoves(board, isWhite) {
  const allMoves = []
  
  console.log('getAllLegalMoves called, isWhite:', isWhite)
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c]
      if (piece) {
        const pieceIsWhite = piece === piece.toUpperCase()
        if (pieceIsWhite === isWhite) {
          console.log(`Found ${pieceIsWhite ? 'white' : 'black'} piece at [${r},${c}]:`, piece)
          const moves = getLegalMoves(board, r, c)
          console.log(`  Legal moves for ${piece}:`, moves.length)
          for (const move of moves) {
            allMoves.push({
              from: { row: r, col: c },
              to: { row: move.row, col: move.col },
              piece
            })
          }
        }
      }
    }
  }
  
  console.log(`Total legal moves for ${isWhite ? 'white' : 'black'}:`, allMoves.length)
  return allMoves
}

/**
 * Simple AI: Selects a move for black
 * For puzzles, tries to avoid checkmate but allows puzzle solution paths
 */
export function getAIMove(board, puzzleSolution = null) {
  console.log('getAIMove called, board:', board)
  const blackMoves = getAllLegalMoves(board, false) // false = black
  console.log('Black moves found:', blackMoves.length)
  
  if (blackMoves.length === 0) {
    console.log('No legal moves for black')
    return null // No legal moves - checkmate or stalemate
  }
  
  // Simple heuristic: prefer moves that:
  // 1. Capture pieces
  // 2. Move pieces away from danger
  // 3. Avoid obvious traps
  
  // Score each move
  const scoredMoves = blackMoves.map(move => {
    let score = 0
    
    // Check if move captures a piece
    const targetPiece = board[move.to.row][move.to.col]
    if (targetPiece) {
      const pieceValues = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 100 }
      score += pieceValues[targetPiece.toLowerCase()] || 0
    }
    
    // Prefer moves that get pieces out of danger
    if (isSquareUnderAttack(board, move.from.row, move.from.col, true)) {
      score += 2
    }
    
    // Prefer moves that don't put pieces in danger
    if (!isSquareUnderAttack(board, move.to.row, move.to.col, true)) {
      score += 1
    }
    
    // Prefer moves that check the opponent
    const tempBoard = board.map(r => [...r])
    tempBoard[move.to.row][move.to.col] = move.piece
    tempBoard[move.from.row][move.from.col] = null
    if (isKingInCheck(tempBoard, true)) {
      score += 5
    }
    
    return { move, score }
  })
  
  // Sort by score and pick a random move from the top moves
  scoredMoves.sort((a, b) => b.score - a.score)
  
  // Pick randomly from top 3 moves (or all if less than 3)
  const topMoves = scoredMoves.slice(0, Math.min(3, scoredMoves.length))
  const selected = topMoves[Math.floor(Math.random() * topMoves.length)]
  
  return selected.move
}

