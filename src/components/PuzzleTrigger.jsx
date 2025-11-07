import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { generatePuzzle } from '../utils/puzzleGenerator'
import * as diceRoller from '../utils/diceRoller'

/**
 * Component that monitors player position and triggers puzzles when landing on puzzle tiles
 * Also automatically rolls dice when landing on empty spaces
 * Only triggers when player has actually stopped moving, not when crossing over tiles
 */
function PuzzleTrigger() {
  const playerPosition = useGameStore((state) => state.player.position) // Target position
  const animatedPosition = useGameStore((state) => state.player.animatedPosition) // Actual animated position
  const isMoving = useGameStore((state) => state.player.isMoving)
  const tiles = useGameStore((state) => state.board.tiles)
  const puzzleActive = useGameStore((state) => state.puzzle.active)
  const startPuzzle = useGameStore((state) => state.startPuzzle)
  const setDiceRoll = useGameStore((state) => state.setDiceRoll)
  const lastRoll = useGameStore((state) => state.dice.lastRoll)
  const awaitingDirection = useGameStore((state) => state.dice.awaitingDirection)
  const isRolling = useGameStore((state) => state.dice.isRolling)
  const lastTriggeredTile = useRef(null)
  const lastAnimatedPosition = useRef({ x: 0, y: 0 })
  const stopTimerRef = useRef(null)

  useEffect(() => {
    // Clear any pending timer when movement starts
    if (isMoving) {
      if (stopTimerRef.current) {
        clearTimeout(stopTimerRef.current)
        stopTimerRef.current = null
      }
      // Reset last triggered tile when movement starts
      lastTriggeredTile.current = null
      return
    }

    // Only trigger when puzzle is not already active
    if (puzzleActive) return

    // Use the animated position (where player actually is) instead of target position
    // Round to nearest tile coordinates
    const currentTileX = Math.round(animatedPosition.x)
    const currentTileY = Math.round(animatedPosition.y)
    const tileKey = `${currentTileX},${currentTileY}`

    // Check if position has actually changed (prevent duplicate triggers)
    const posChanged = 
      currentTileX !== lastAnimatedPosition.current.x || 
      currentTileY !== lastAnimatedPosition.current.y

    if (!posChanged) return

    // Update last animated position
    lastAnimatedPosition.current = { x: currentTileX, y: currentTileY }

    // Prevent triggering on the same tile multiple times
    if (lastTriggeredTile.current === tileKey) return

    // Clear any existing timer
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current)
    }

    // Add a delay after stopping to ensure player has fully stopped on the tile
    stopTimerRef.current = setTimeout(async () => {
      const tile = tiles.get(tileKey)

      // Only proceed if tile exists
      if (!tile) {
        stopTimerRef.current = null
        return
      }

      // Explicitly check tile type - space tiles should do nothing
      if (tile.type === 'space') {
        // Space tiles (rest tiles) should not trigger anything
        lastTriggeredTile.current = tileKey
        stopTimerRef.current = null
        return
      }

      // Check if we're on a puzzle tile (must be type 'puzzle' AND have difficulty)
      if (tile.type === 'puzzle' && tile.difficulty) {
        // Generate puzzle based on tile difficulty and puzzle type
        const puzzleData = generatePuzzle(tile.difficulty, tile.puzzleType)
        startPuzzle(puzzleData)
        lastTriggeredTile.current = tileKey
      }
      // Check if we're on an empty space and automatically roll dice
      else if (tile.type === 'empty') {
        // Only roll if dice is not already rolling, not awaiting direction, and no puzzle is active
        // Also check that we haven't already triggered on this tile (prevent duplicate rolls)
        if (!isRolling && !awaitingDirection && !puzzleActive && lastTriggeredTile.current !== tileKey) {
          try {
            const result = await diceRoller.rollDiceWithAnimation(1000)
            setDiceRoll(result)
            lastTriggeredTile.current = tileKey
          } catch (error) {
            console.error('Error auto-rolling dice:', error)
          }
        }
      }
      
      stopTimerRef.current = null
    }, 200) // 200ms delay after stopping to ensure full stop

    return () => {
      if (stopTimerRef.current) {
        clearTimeout(stopTimerRef.current)
        stopTimerRef.current = null
      }
    }
  }, [animatedPosition.x, animatedPosition.y, isMoving, tiles, puzzleActive, startPuzzle, setDiceRoll, isRolling, awaitingDirection, lastRoll])

  return null // This component doesn't render anything
}

export default PuzzleTrigger

