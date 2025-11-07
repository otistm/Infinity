// Match-3 Puzzle Generator
// Creates a match-3 style puzzle where players need to find matches

/**
 * Generate a match-3 puzzle
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 * @returns {Object} Puzzle object with grid, matches, and instructions
 */
export function generateMatch3Puzzle(difficulty) {
  const gridSize = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 5 : 6
  const colors = ['🔴', '🟢', '🔵', '🟡', '🟣', '🟠']
  const numColors = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5
  
  // Generate a grid with guaranteed matches
  const grid = []
  const matches = []
  
  // Create a grid with some guaranteed matches
  for (let row = 0; row < gridSize; row++) {
    grid[row] = []
    for (let col = 0; col < gridSize; col++) {
      // Create patterns that guarantee matches
      if (row < 2 && col < 2) {
        grid[row][col] = colors[0] // Create a match in top-left
      } else if (row >= gridSize - 2 && col >= gridSize - 2) {
        grid[row][col] = colors[1] // Create a match in bottom-right
      } else {
        grid[row][col] = colors[Math.floor(Math.random() * numColors)]
      }
    }
  }
  
  // Add some random matches
  const matchCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5
  for (let i = 0; i < matchCount; i++) {
    const color = colors[Math.floor(Math.random() * numColors)]
    const row = Math.floor(Math.random() * (gridSize - 2))
    const col = Math.floor(Math.random() * (gridSize - 2))
    
    // Create a horizontal match
    if (col < gridSize - 2) {
      grid[row][col] = color
      grid[row][col + 1] = color
      grid[row][col + 2] = color
      matches.push({ type: 'horizontal', row, col, color })
    }
  }
  
  // Find all matches in the grid
  const foundMatches = findMatches(grid)
  
  const points = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 40 : 70
  const timeLimit = difficulty === 'easy' ? 45 : difficulty === 'medium' ? 60 : 90
  
  return {
    type: 'match3',
    difficulty,
    grid,
    gridSize,
    matches: foundMatches,
    targetMatches: matchCount,
    timeLimit,
    points,
    question: `Find ${matchCount} matches of 3 or more in a row!`
  }
}

/**
 * Find all matches in a grid
 * @param {Array} grid - 2D array of colors
 * @returns {Array} Array of match objects
 */
function findMatches(grid) {
  const matches = []
  const gridSize = grid.length
  
  // Check horizontal matches
  for (let row = 0; row < gridSize; row++) {
    let count = 1
    let currentColor = grid[row][0]
    
    for (let col = 1; col < gridSize; col++) {
      if (grid[row][col] === currentColor) {
        count++
      } else {
        if (count >= 3) {
          matches.push({
            type: 'horizontal',
            row,
            startCol: col - count,
            endCol: col - 1,
            color: currentColor,
            length: count
          })
        }
        count = 1
        currentColor = grid[row][col]
      }
    }
    
    if (count >= 3) {
      matches.push({
        type: 'horizontal',
        row,
        startCol: gridSize - count,
        endCol: gridSize - 1,
        color: currentColor,
        length: count
      })
    }
  }
  
  // Check vertical matches
  for (let col = 0; col < gridSize; col++) {
    let count = 1
    let currentColor = grid[0][col]
    
    for (let row = 1; row < gridSize; row++) {
      if (grid[row][col] === currentColor) {
        count++
      } else {
        if (count >= 3) {
          matches.push({
            type: 'vertical',
            col,
            startRow: row - count,
            endRow: row - 1,
            color: currentColor,
            length: count
          })
        }
        count = 1
        currentColor = grid[row][col]
      }
    }
    
    if (count >= 3) {
      matches.push({
        type: 'vertical',
        col,
        startRow: gridSize - count,
        endRow: gridSize - 1,
        color: currentColor,
        length: count
      })
    }
  }
  
  return matches
}


