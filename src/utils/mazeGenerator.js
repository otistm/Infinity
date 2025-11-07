// Maze Puzzle Generator
// Generates procedural mazes using recursive backtracking algorithm

/**
 * Generate a maze using recursive backtracking
 * @param {number} width - Width of the maze
 * @param {number} height - Height of the maze
 * @returns {Object} Maze object with walls array and path information
 */
function generateMaze(width, height) {
  // Create a grid where true = wall, false = path
  // Start with all walls
  const maze = Array(height).fill(null).map(() => Array(width).fill(true))
  
  // Start position (top-left, always a path)
  const startX = 1
  const startY = 1
  
  // End position (center)
  const endX = Math.floor(width / 2)
  const endY = Math.floor(height / 2)
  
  // Carve paths using recursive backtracking
  const stack = []
  const visited = new Set()
  
  // Start carving from start position
  maze[startY][startX] = false
  stack.push({ x: startX, y: startY })
  visited.add(`${startX},${startY}`)
  
  // Directions: up, right, down, left
  const directions = [
    { dx: 0, dy: -2 }, // up
    { dx: 2, dy: 0 }, // right
    { dx: 0, dy: 2 }, // down
    { dx: -2, dy: 0 } // left
  ]
  
  while (stack.length > 0) {
    const current = stack[stack.length - 1]
    const neighbors = []
    
    // Find unvisited neighbors
    for (const dir of directions) {
      const newX = current.x + dir.dx
      const newY = current.y + dir.dy
      
      if (
        newX > 0 && newX < width - 1 &&
        newY > 0 && newY < height - 1 &&
        !visited.has(`${newX},${newY}`)
      ) {
        neighbors.push({ x: newX, y: newY, dir })
      }
    }
    
    if (neighbors.length > 0) {
      // Choose random neighbor
      const next = neighbors[Math.floor(Math.random() * neighbors.length)]
      
      // Carve path to neighbor
      const wallX = current.x + next.dir.dx / 2
      const wallY = current.y + next.dir.dy / 2
      maze[wallY][wallX] = false
      maze[next.y][next.x] = false
      
      visited.add(`${next.x},${next.y}`)
      stack.push({ x: next.x, y: next.y })
    } else {
      // Backtrack
      stack.pop()
    }
  }
  
  // Ensure end position is accessible
  maze[endY][endX] = false
  
  // Ensure there's a path from start to end by checking neighbors
  const endNeighbors = [
    { x: endX - 1, y: endY },
    { x: endX + 1, y: endY },
    { x: endX, y: endY - 1 },
    { x: endX, y: endY + 1 }
  ]
  
  // If end is surrounded by walls, create an opening
  let hasOpening = false
  for (const neighbor of endNeighbors) {
    if (neighbor.x >= 0 && neighbor.x < width && neighbor.y >= 0 && neighbor.y < height) {
      if (!maze[neighbor.y][neighbor.x]) {
        hasOpening = true
        break
      }
    }
  }
  
  if (!hasOpening && endNeighbors.length > 0) {
    const randomNeighbor = endNeighbors[Math.floor(Math.random() * endNeighbors.length)]
    if (randomNeighbor.x >= 0 && randomNeighbor.x < width && 
        randomNeighbor.y >= 0 && randomNeighbor.y < height) {
      maze[randomNeighbor.y][randomNeighbor.x] = false
    }
  }
  
  return {
    maze,
    start: { x: startX, y: startY },
    end: { x: endX, y: endY },
    width,
    height
  }
}

/**
 * Generate a maze puzzle
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 * @returns {Object} Puzzle object with maze, start, end, and metadata
 */
export function generateMazePuzzle(difficulty) {
  let size
  let points
  let timeLimit
  
  switch (difficulty) {
    case 'easy':
      size = 11 // Small maze
      points = 30
      timeLimit = 60
      break
    case 'medium':
      size = 15 // Medium maze
      points = 50
      timeLimit = 90
      break
    case 'hard':
      size = 21 // Large maze
      points = 75
      timeLimit = 120
      break
    default:
      size = 11
      points = 30
      timeLimit = 60
  }
  
  const mazeData = generateMaze(size, size)
  
  return {
    type: 'maze',
    difficulty,
    maze: mazeData.maze,
    start: mazeData.start,
    end: mazeData.end,
    width: mazeData.width,
    height: mazeData.height,
    timeLimit,
    points,
    question: 'Navigate through the maze to reach the center! Use arrow keys to move.'
  }
}

export { generateMaze }

