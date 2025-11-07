// Rhythm Puzzle Generator
// Generates rhythm-based typing puzzles where players type letters as a line moves across them

/**
 * Generate a rhythm puzzle
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 * @returns {Object} Puzzle object with sequence, speed, and metadata
 */
export function generateRhythmPuzzle(difficulty) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let sequenceLength
  let speed
  let points
  let timeLimit
  
  switch (difficulty) {
    case 'easy':
      sequenceLength = 8
      speed = 800 // milliseconds per letter (slower)
      points = 35
      timeLimit = 30
      break
    case 'medium':
      sequenceLength = 12
      speed = 600 // milliseconds per letter (medium)
      points = 55
      timeLimit = 35
      break
    case 'hard':
      sequenceLength = 16
      speed = 400 // milliseconds per letter (faster)
      points = 80
      timeLimit = 40
      break
    default:
      sequenceLength = 8
      speed = 800
      points = 35
      timeLimit = 30
  }
  
  // Generate a random sequence of letters
  const sequence = []
  for (let i = 0; i < sequenceLength; i++) {
    const randomLetter = letters[Math.floor(Math.random() * letters.length)]
    sequence.push(randomLetter)
  }
  
  return {
    type: 'rhythm',
    difficulty,
    sequence,
    speed, // milliseconds per letter
    timeLimit,
    points,
    question: 'Type the letters as the line passes over them! Press the keys when the line reaches each letter.'
  }
}

