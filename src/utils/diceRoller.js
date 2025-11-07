import { rollDice } from '../constants/dicePatterns'

/**
 * Simulate dice rolling with animation delay
 * @param {number} rollDuration - Duration of roll animation in ms
 * @returns {Promise<Object>} Promise that resolves to dice result
 */
export function rollDiceWithAnimation(rollDuration = 1000) {
  return new Promise((resolve) => {
    // Simulate rolling animation
    setTimeout(() => {
      const result = rollDice()
      resolve(result)
    }, rollDuration)
  })
}

/**
 * Check if a dice roll requires direction selection
 * @param {Object} diceRoll - Dice roll result
 * @returns {boolean} True if direction selection is needed
 */
export function requiresDirection(diceRoll) {
  return diceRoll && diceRoll.type === 'number'
}

/**
 * Get movement direction from user input
 * @param {string} direction - Direction string ('up', 'down', 'left', 'right')
 * @returns {Object} Movement vector { x, y }
 */
export function getDirectionVector(direction) {
  const directions = {
    'up': { x: 0, y: -1 },
    'down': { x: 0, y: 1 },
    'left': { x: -1, y: 0 },
    'right': { x: 1, y: 0 },
    'north': { x: 0, y: -1 },
    'south': { x: 0, y: 1 },
    'west': { x: -1, y: 0 },
    'east': { x: 1, y: 0 }
  }
  
  return directions[direction.toLowerCase()] || { x: 0, y: 0 }
}

/**
 * Calculate new position after movement
 * @param {Object} currentPosition - Current position { x, y }
 * @param {Object} movement - Movement vector { x, y }
 * @returns {Object} New position { x, y }
 */
export function calculateNewPosition(currentPosition, movement) {
  return {
    x: currentPosition.x + movement.x,
    y: currentPosition.y + movement.y
  }
}

/**
 * Execute pattern movement sequence
 * @param {Object} startPosition - Starting position { x, y }
 * @param {Array} moves - Array of movement vectors [{ x, y }, ...]
 * @returns {Array} Array of positions [{ x, y }, ...]
 */
export function executePattern(startPosition, moves) {
  const positions = [startPosition]
  let currentPos = { ...startPosition }
  
  for (const move of moves) {
    currentPos = calculateNewPosition(currentPos, move)
    positions.push({ ...currentPos })
  }
  
  return positions
}

