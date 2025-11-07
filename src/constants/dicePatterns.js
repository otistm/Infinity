// D20 Dice Patterns - 10 numbers + 10 directional patterns

export const DICE_PATTERNS = [
  // Numbers (10 faces) - Move X spaces in chosen direction
  { type: 'number', value: 1, face: 1 },
  { type: 'number', value: 2, face: 2 },
  { type: 'number', value: 3, face: 3 },
  { type: 'number', value: 4, face: 4 },
  { type: 'number', value: 5, face: 5 },
  { type: 'number', value: 6, face: 6 },
  { type: 'number', value: 7, face: 7 },
  { type: 'number', value: 8, face: 8 },
  { type: 'number', value: 9, face: 9 },
  { type: 'number', value: 10, face: 10 },
  
  // Patterns (10 faces) - Move in specific pattern
  { 
    type: 'pattern', 
    name: 'L-Right', 
    description: 'Move 2 right, then 1 up',
    moves: [{ x: 2, y: 0 }, { x: 0, y: -1 }],
    face: 11
  },
  { 
    type: 'pattern', 
    name: 'L-Left', 
    description: 'Move 2 left, then 1 up',
    moves: [{ x: -2, y: 0 }, { x: 0, y: -1 }],
    face: 12
  },
  { 
    type: 'pattern', 
    name: 'L-Up', 
    description: 'Move 2 up, then 1 right',
    moves: [{ x: 0, y: -2 }, { x: 1, y: 0 }],
    face: 13
  },
  { 
    type: 'pattern', 
    name: 'L-Down', 
    description: 'Move 2 down, then 1 right',
    moves: [{ x: 0, y: 2 }, { x: 1, y: 0 }],
    face: 14
  },
  { 
    type: 'pattern', 
    name: 'T-Shape', 
    description: 'Move right, then up and down',
    moves: [{ x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }],
    face: 15
  },
  { 
    type: 'pattern', 
    name: 'Diagonal-NE', 
    description: 'Move 2 diagonal (NE)',
    moves: [{ x: 1, y: -1 }, { x: 1, y: -1 }],
    face: 16
  },
  { 
    type: 'pattern', 
    name: 'Diagonal-SE', 
    description: 'Move 2 diagonal (SE)',
    moves: [{ x: 1, y: 1 }, { x: 1, y: 1 }],
    face: 17
  },
  { 
    type: 'pattern', 
    name: 'Zigzag', 
    description: 'Move in zigzag pattern',
    moves: [{ x: 2, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }],
    face: 18
  },
  { 
    type: 'pattern', 
    name: 'Backwards-L', 
    description: 'Move left, then 2 up',
    moves: [{ x: -1, y: 0 }, { x: 0, y: -2 }],
    face: 19
  },
  { 
    type: 'pattern', 
    name: 'Knight-Move', 
    description: 'Move like a chess knight',
    moves: [{ x: 2, y: 0 }, { x: 0, y: -1 }],
    face: 20
  }
]

/**
 * Roll the D20 dice
 * @returns {Object} Dice result with type, value (for numbers) or moves (for patterns)
 */
export function rollDice() {
  const randomIndex = Math.floor(Math.random() * DICE_PATTERNS.length)
  return DICE_PATTERNS[randomIndex]
}

/**
 * Get a specific dice face by number (1-20)
 * @param {number} faceNumber - Face number (1-20)
 * @returns {Object} Dice face object
 */
export function getDiceFace(faceNumber) {
  if (faceNumber < 1 || faceNumber > 20) {
    throw new Error('Face number must be between 1 and 20')
  }
  return DICE_PATTERNS[faceNumber - 1]
}

/**
 * Get all number faces
 * @returns {Array} Array of number dice faces
 */
export function getNumberFaces() {
  return DICE_PATTERNS.filter(face => face.type === 'number')
}

/**
 * Get all pattern faces
 * @returns {Array} Array of pattern dice faces
 */
export function getPatternFaces() {
  return DICE_PATTERNS.filter(face => face.type === 'pattern')
}

