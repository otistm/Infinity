// Board generation utilities
const CHUNK_SIZE = 10
const TILE_SIZE = 1

export function generateChunk(chunkX, chunkY) {
  const tiles = []
  const startX = chunkX * CHUNK_SIZE
  const startY = chunkY * CHUNK_SIZE

  for (let x = startX; x < startX + CHUNK_SIZE; x++) {
    for (let y = startY; y < startY + CHUNK_SIZE; y++) {
      const rand = Math.random()
      let tileType = 'empty'
      let difficulty = null
      let puzzleType = null
      
      if (rand < 0.15) {
        // 15% chance for space tile
        tileType = 'space'
      } else if (rand < 0.20) {
        // 5% chance for chess puzzle
        tileType = 'puzzle'
        difficulty = getRandomDifficulty()
        puzzleType = 'chess'
      } else if (rand < 0.30) {
        // 10% chance for match-3 puzzle
        tileType = 'puzzle'
        difficulty = getRandomDifficulty()
        puzzleType = 'match3'
      } else if (rand < 0.40) {
        // 10% chance for pop culture trivia
        tileType = 'puzzle'
        difficulty = getRandomDifficulty()
        puzzleType = 'trivia'
      } else if (rand < 0.50) {
        // 10% chance for maze puzzle
        tileType = 'puzzle'
        difficulty = getRandomDifficulty()
        puzzleType = 'maze'
      } else if (rand < 0.60) {
        // 10% chance for rhythm puzzle
        tileType = 'puzzle'
        difficulty = getRandomDifficulty()
        puzzleType = 'rhythm'
      } else if (rand < 0.70) {
        // 10% chance for math/geometry puzzle
        tileType = 'puzzle'
        difficulty = getRandomDifficulty()
        puzzleType = null // Will be randomly chosen in puzzle generator
      }
      
      const tile = {
        x,
        y,
        id: `${x},${y}`,
        type: tileType,
        difficulty,
        puzzleType
      }
      tiles.push(tile)
    }
  }

  return tiles
}

function getRandomDifficulty() {
  const rand = Math.random()
  if (rand < 0.33) return 'easy'
  if (rand < 0.66) return 'medium'
  return 'hard'
}

export function getChunkCoordinates(x, y) {
  // Handle negative coordinates correctly
  // Math.floor works correctly for negative numbers already
  // For example: Math.floor(-11 / 10) = Math.floor(-1.1) = -2 (correct)
  const chunkX = Math.floor(x / CHUNK_SIZE)
  const chunkY = Math.floor(y / CHUNK_SIZE)
  return { chunkX, chunkY }
}

export function shouldGenerateChunk(chunkX, chunkY, exploredChunks) {
  const key = `${chunkX},${chunkY}`
  return !exploredChunks.has(key)
}

export function getVisibleChunks(centerX, centerY, viewDistance = 2) {
  const centerChunk = getChunkCoordinates(centerX, centerY)
  const chunks = []

  for (let dx = -viewDistance; dx <= viewDistance; dx++) {
    for (let dy = -viewDistance; dy <= viewDistance; dy++) {
      chunks.push({
        chunkX: centerChunk.chunkX + dx,
        chunkY: centerChunk.chunkY + dy
      })
    }
  }

  return chunks
}

/**
 * Clean up tiles that are far from the player position
 * @param {Map} tiles - Map of all tiles
 * @param {number} centerX - Player X position
 * @param {number} centerY - Player Y position
 * @param {number} maxDistance - Maximum distance to keep tiles
 * @returns {Map} Filtered map of tiles
 */
export function cleanupDistantTiles(tiles, centerX, centerY, maxDistance = 30) {
  const cleaned = new Map()
  
  tiles.forEach((tile, key) => {
    const dx = Math.abs(tile.x - centerX)
    const dy = Math.abs(tile.y - centerY)
    
    if (dx <= maxDistance && dy <= maxDistance) {
      cleaned.set(key, tile)
    }
  })
  
  return cleaned
}

export { CHUNK_SIZE, TILE_SIZE }

