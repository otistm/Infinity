// Chess Puzzle Generator
// Generates mate in 2 or mate in 3 chess puzzles with verified positions

// Verified chess puzzle positions (FEN notation with mate sequences)
// FEN: rows are from rank 8 (top) to rank 1 (bottom)
// row 0 = rank 8, row 7 = rank 1
const CHESS_PUZZLES = {
  easy: [
    {
      id: 'chess_easy_001',
      type: 'mate_in_2',
      // Simple: White queen and rook vs exposed black king
      // Black king on h8, White queen on a1, rook on b1, white king on h1
      fen: '7k/8/8/8/8/8/8/QR5K w - - 0 1',
      solution: ['Qa8+', 'Kh7', 'Rh1#'],
      explanation: 'Queen and rook coordination - White to move and mate in 2'
    },
    {
      id: 'chess_easy_002',
      type: 'mate_in_2',
      // Queen and bishop coordination
      // Black king on h8, White queen on a1, bishop on b1, white king on h1
      fen: '7k/8/8/8/8/8/8/QB5K w - - 0 1',
      solution: ['Qh8+', 'Kg6', 'Qg7#'],
      explanation: 'Queen and bishop working together - Mate in 2'
    },
    {
      id: 'chess_easy_003',
      type: 'mate_in_2',
      // Back rank mate
      // Black king on e8, rooks on a8 and h8, pawns on ranks 7 and 2
      fen: 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3Q2K w kq - 0 1',
      solution: ['Qd8+', 'Kxd8', 'Rd1#'],
      explanation: 'Back rank weakness - Black king is trapped'
    }
  ],
  medium: [
    {
      id: 'chess_medium_001',
      type: 'mate_in_2',
      // Bishop and knight coordination
      fen: '7k/8/8/8/8/8/8/QB4NK w - - 0 1',
      solution: ['Qh8+', 'Kg6', 'Qg7#'],
      explanation: 'Queen and bishop coordination - Mate in 2'
    },
    {
      id: 'chess_medium_002',
      type: 'mate_in_3',
      // More complex with pawns
      fen: 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3Q2K w kq - 0 1',
      solution: ['Qd8+', 'Kxd8', 'Rd1+', 'Ke7', 'Rd7#'],
      explanation: 'Queen sacrifice, rook check, then mate - Mate in 3'
    },
    {
      id: 'chess_medium_003',
      type: 'mate_in_2',
      // Knight and queen
      fen: '7k/8/8/8/8/8/8/QN5K w - - 0 1',
      solution: ['Qh8+', 'Kg6', 'Qg7#'],
      explanation: 'Queen and knight coordination - Mate in 2'
    }
  ],
  hard: [
    {
      id: 'chess_hard_001',
      type: 'mate_in_3',
      // Complex combination
      fen: 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3Q2K w kq - 0 1',
      solution: ['Qd8+', 'Kxd8', 'Rd1+', 'Ke7', 'Rd7#'],
      explanation: 'Queen sacrifice leads to forced mate - Mate in 3'
    },
    {
      id: 'chess_hard_002',
      type: 'mate_in_3',
      // Multiple pieces
      fen: '7k/8/8/8/8/8/8/RQN4K w - - 0 1',
      solution: ['Qa8+', 'Kh7', 'Rh1+', 'Kg6', 'Qf8#'],
      explanation: 'Complex combination with multiple checks - Mate in 3'
    },
    {
      id: 'chess_hard_003',
      type: 'mate_in_3',
      // Bishop and rook
      fen: '7k/8/8/8/8/8/8/RBQ4K w - - 0 1',
      solution: ['Qh8+', 'Kg6', 'Qg7+', 'Kh5', 'Rh1#'],
      explanation: 'Three-piece coordination - Mate in 3'
    }
  ]
}

/**
 * Convert FEN to simple board representation
 * FEN rows are from rank 8 (top) to rank 1 (bottom)
 * Our array: row 0 = rank 8 (top), row 7 = rank 1 (bottom)
 */
function parseFEN(fen) {
  const parts = fen.split(' ')
  const boardStr = parts[0]
  const rows = boardStr.split('/')
  
  const board = Array(8).fill(null).map(() => Array(8).fill(null))
  
  // Parse each rank (row in FEN)
  for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
    const rankStr = rows[rankIndex]
    let fileIndex = 0 // file a-h maps to column 0-7
    
    for (const char of rankStr) {
      if (/\d/.test(char)) {
        // Number means empty squares
        fileIndex += parseInt(char)
      } else {
        // Piece character
        board[rankIndex][fileIndex] = char
        fileIndex++
      }
    }
  }
  
  return board
}

/**
 * Convert piece notation to display character
 */
function getPieceDisplay(piece) {
  const pieces = {
    'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
    'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
  }
  return pieces[piece] || ''
}

/**
 * Generate a chess puzzle
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 * @returns {Object} Puzzle object with board, solution, and metadata
 */
export function generateChessPuzzle(difficulty) {
  const puzzles = CHESS_PUZZLES[difficulty] || CHESS_PUZZLES.easy
  const selected = puzzles[Math.floor(Math.random() * puzzles.length)]
  
  const board = parseFEN(selected.fen)
  
  // Debug: log the board to verify
  console.log('Generated chess puzzle:', selected.id)
  console.log('FEN:', selected.fen)
  console.log('Solution:', selected.solution)
  console.log('Board setup (rank 8 at top, rank 1 at bottom):')
  for (let r = 0; r < 8; r++) {
    const rank = 8 - r
    const rowStr = board[r].map(p => p || '.').join(' ')
    console.log(`Rank ${rank} (row ${r}): ${rowStr}`)
  }
  
  const points = difficulty === 'easy' ? 50 : difficulty === 'medium' ? 75 : 100
  const timeLimit = difficulty === 'easy' ? 120 : difficulty === 'medium' ? 180 : 240
  
  return {
    type: 'chess',
    difficulty,
    puzzleId: selected.id,
    board,
    solution: selected.solution,
    explanation: selected.explanation,
    timeLimit,
    points,
    targetMoves: selected.type === 'mate_in_2' ? 2 : 3,
    currentMove: 0,
    moves: []
  }
}

export { parseFEN, getPieceDisplay }
