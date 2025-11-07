import { useMemo, useEffect, useRef, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../store/gameStore'
import { 
  generateChunk, 
  getChunkCoordinates, 
  shouldGenerateChunk,
  getVisibleChunks,
  TILE_SIZE
} from '../utils/boardGenerator'

// Separate component for player tile that animates
function PlayerTile({ tile }) {
  const meshRef = useRef()
  const materialRef = useRef()

  const color = useMemo(() => {
    if (tile.type === 'empty') return '#16213e'
    if (tile.type === 'space') return '#9b59b6' // Purple for space tiles
    if (tile.puzzleType === 'chess') return '#d4af37' // Gold for chess tiles
    if (tile.puzzleType === 'maze') return '#ff9800' // Orange for maze tiles
    if (tile.puzzleType === 'rhythm') return '#e91e63' // Pink for rhythm tiles
    switch (tile.difficulty) {
      case 'easy': return '#4ecca3'
      case 'medium': return '#f4d03f'
      case 'hard': return '#e74c3c'
      default: return '#16213e'
    }
  }, [tile.type, tile.difficulty, tile.puzzleType])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={[tile.x * TILE_SIZE, 0.05, tile.y * TILE_SIZE]}
      receiveShadow
      castShadow
    >
      <boxGeometry args={[TILE_SIZE * 0.9, 0.1, TILE_SIZE * 0.9]} />
      <meshStandardMaterial 
        ref={materialRef}
        color={color}
        emissive="#ffffff"
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

// Regular tile - no animation, fully memoized
const Tile = memo(({ tile }) => {
  const color = useMemo(() => {
    if (tile.type === 'empty') return '#16213e'
    if (tile.type === 'space') return '#9b59b6' // Purple for space tiles
    if (tile.puzzleType === 'chess') return '#d4af37' // Gold for chess tiles
    if (tile.puzzleType === 'maze') return '#ff9800' // Orange for maze tiles
    if (tile.puzzleType === 'rhythm') return '#e91e63' // Pink for rhythm tiles
    switch (tile.difficulty) {
      case 'easy': return '#4ecca3'
      case 'medium': return '#f4d03f'
      case 'hard': return '#e74c3c'
      default: return '#16213e'
    }
  }, [tile.type, tile.difficulty, tile.puzzleType])

  return (
    <mesh
      position={[tile.x * TILE_SIZE, 0.05, tile.y * TILE_SIZE]}
      receiveShadow
      castShadow
    >
      <boxGeometry args={[TILE_SIZE * 0.9, 0.1, TILE_SIZE * 0.9]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
})

Tile.displayName = 'Tile'

function PlayerTileLight({ position }) {
  const lightRef = useRef()
  
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 3) * 0.5
    }
  })

  return (
    <pointLight
      ref={lightRef}
      position={[position.x, 2, position.y]}
      color="#ffffff"
      intensity={1.5}
      distance={3}
      decay={2}
    />
  )
}

function Board() {
  const playerPosition = useGameStore((state) => state.player.animatedPosition)
  const tiles = useGameStore((state) => state.board.tiles)
  const exploredChunks = useGameStore((state) => state.board.exploredChunks)
  const addTiles = useGameStore((state) => state.addTiles)
  const markChunkExplored = useGameStore((state) => state.markChunkExplored)
  const targetPosition = useGameStore((state) => state.player.position)
  const boardReady = useGameStore((state) => state.boardReady)
  const setBoardReady = useGameStore((state) => state.setBoardReady)
  const gameStarted = useGameStore((state) => state.gameStarted)
  const initialGenerationDone = useRef(false)
  
  // Track initial board generation
  useEffect(() => {
    if (!gameStarted || boardReady) return
    
    // Mark board as ready when we have enough tiles for the initial area
    // Initial view needs about 100-150 tiles (10 chunks radius = ~121 chunks = ~1210 tiles max, but we need less)
    const minTilesForReady = 100
    
    if (tiles.size >= minTilesForReady) {
      // Add a small delay to ensure rendering is complete
      const timer = setTimeout(() => {
        setBoardReady(true)
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [tiles.size, gameStarted, boardReady, setBoardReady])

  // Force initial tile generation when game starts (for new games and loaded games)
  useEffect(() => {
    if (!gameStarted || boardReady || initialGenerationDone.current) return
    
    // Force generate tiles in a wide radius around player position
    // This ensures we have tiles even if chunks were marked as explored
    const forceGenerateRadius = 10 // Same as visible chunks radius
    const visibleChunks = getVisibleChunks(targetPosition.x, targetPosition.y, forceGenerateRadius)
    
    // Generate chunks with throttling to allow animations to run
    let chunkIndex = 0
    const generateChunksBatch = () => {
      const batchSize = 5 // Generate 5 chunks per frame to avoid blocking
      const endIndex = Math.min(chunkIndex + batchSize, visibleChunks.length)
      
      for (let i = chunkIndex; i < endIndex; i++) {
        const { chunkX: cx, chunkY: cy } = visibleChunks[i]
        // Always generate tiles for initial load, don't check exploredChunks
        const newTiles = generateChunk(cx, cy)
        addTiles(newTiles)
        markChunkExplored(cx, cy)
      }
      
      chunkIndex = endIndex
      
      if (chunkIndex < visibleChunks.length) {
        // Use requestAnimationFrame to allow animations to run between batches
        requestAnimationFrame(generateChunksBatch)
      } else {
        initialGenerationDone.current = true
      }
    }
    
    // Start generating chunks
    generateChunksBatch()
  }, [gameStarted, boardReady, targetPosition.x, targetPosition.y, addTiles, markChunkExplored])

  // Reset initial generation flag when game stops
  useEffect(() => {
    if (!gameStarted) {
      initialGenerationDone.current = false
    }
  }, [gameStarted])

  // Generate chunks proactively based on player position
  useEffect(() => {
    if (!gameStarted) return
    
    // Generate chunks in a larger radius around the player
    // 10 chunks = 100 tiles radius to ensure tiles are always available
    const visibleChunks = getVisibleChunks(targetPosition.x, targetPosition.y, 10)
    
    visibleChunks.forEach(({ chunkX: cx, chunkY: cy }) => {
      if (shouldGenerateChunk(cx, cy, exploredChunks)) {
        const newTiles = generateChunk(cx, cy)
        addTiles(newTiles)
        markChunkExplored(cx, cy)
      }
    })
  }, [targetPosition.x, targetPosition.y, exploredChunks, addTiles, markChunkExplored, gameStarted])

  // Also generate chunks based on animated position for smoother experience
  useEffect(() => {
    // Generate chunks around the animated position too, with larger radius
    const visibleChunks = getVisibleChunks(playerPosition.x, playerPosition.y, 8)
    
    visibleChunks.forEach(({ chunkX: cx, chunkY: cy }) => {
      if (shouldGenerateChunk(cx, cy, exploredChunks)) {
        const newTiles = generateChunk(cx, cy)
        addTiles(newTiles)
        markChunkExplored(cx, cy)
      }
    })
  }, [playerPosition.x, playerPosition.y, exploredChunks, addTiles, markChunkExplored])

  // Optimize visible tiles calculation
  const { visibleTiles, playerTile } = useMemo(() => {
    const viewDistance = 20 // Increased even more to ensure tiles are always visible
    const tilesArray = Array.from(tiles.values())
    const visible = []
    
    const centerX = targetPosition.x
    const centerY = targetPosition.y
    const playerTileX = Math.round(playerPosition.x)
    const playerTileY = Math.round(playerPosition.y)
    let playerTileData = null
    
    for (let i = 0; i < tilesArray.length; i++) {
      const tile = tilesArray[i]
      const dx = Math.abs(tile.x - centerX)
      const dy = Math.abs(tile.y - centerY)
      
      if (dx <= viewDistance && dy <= viewDistance) {
        if (tile.x === playerTileX && tile.y === playerTileY) {
          playerTileData = tile
        } else {
          visible.push(tile)
        }
      }
    }
    
    return { visibleTiles: visible, playerTile: playerTileData }
  }, [tiles, targetPosition.x, targetPosition.y, playerPosition.x, playerPosition.y])

  // Emergency tile generation if player is on a missing tile
  useEffect(() => {
    const playerTileX = Math.round(playerPosition.x)
    const playerTileY = Math.round(playerPosition.y)
    const currentTileKey = `${playerTileX},${playerTileY}`
    
    if (!tiles.has(currentTileKey)) {
      // Generate the current chunk immediately (even if already explored)
      const currentChunk = getChunkCoordinates(playerTileX, playerTileY)
      const newTiles = generateChunk(currentChunk.chunkX, currentChunk.chunkY)
      addTiles(newTiles)
      markChunkExplored(currentChunk.chunkX, currentChunk.chunkY)
      
      // Also generate surrounding chunks to ensure smooth movement
      const surroundingChunks = getVisibleChunks(playerTileX, playerTileY, 2)
      surroundingChunks.forEach(({ chunkX: cx, chunkY: cy }) => {
        if (shouldGenerateChunk(cx, cy, exploredChunks)) {
          const extraTiles = generateChunk(cx, cy)
          addTiles(extraTiles)
          markChunkExplored(cx, cy)
        }
      })
    }
  }, [playerPosition.x, playerPosition.y, tiles, exploredChunks, addTiles, markChunkExplored])

  // Cleanup old tiles periodically to prevent memory buildup
  const cleanupTiles = useGameStore((state) => state.cleanupTiles)
  
  useEffect(() => {
    // Cleanup tiles every 15 seconds, but keep a much larger buffer
    const cleanupDistance = 50 // Increased significantly to ensure tiles don't disappear too quickly
    
    const interval = setInterval(() => {
      if (tiles.size > 1200) { // Only cleanup if we have many tiles (increased threshold)
        cleanupTiles(cleanupDistance)
      }
    }, 15000) // Cleanup every 15 seconds (less frequent)
    
    return () => clearInterval(interval)
  }, [tiles.size, cleanupTiles])

  const playerTileX = Math.round(playerPosition.x)
  const playerTileY = Math.round(playerPosition.y)

  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#0f1419" />
      </mesh>

      {/* Regular Tiles */}
      {visibleTiles.map((tile) => (
        <Tile key={tile.id} tile={tile} />
      ))}

      {/* Player Tile - rendered separately with animation */}
      {playerTile && (
        <PlayerTile tile={playerTile} />
      )}

      {/* Glowing light above player tile */}
      <PlayerTileLight position={{ x: playerTileX, y: playerTileY }} />
    </>
  )
}

export default Board
