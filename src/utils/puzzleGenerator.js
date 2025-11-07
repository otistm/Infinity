// Puzzle generator - creates math, geometry, match-3, trivia, chess, maze, and rhythm puzzles
// Supports Easy, Medium, and Hard difficulty levels

import { generateTriviaPuzzle } from './triviaGenerator'
import { generateMatch3Puzzle } from './match3Generator'
import { generateChessPuzzle } from './chessPuzzleGenerator'
import { generateMazePuzzle } from './mazeGenerator'
import { generateRhythmPuzzle } from './rhythmGenerator'

/**
 * Generate a puzzle based on difficulty and type
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 * @param {string} puzzleType - 'match3', 'trivia', 'chess', 'maze', 'rhythm', or null for math/geometry
 * @returns {Object} Puzzle object with question, answers, correctIndex, timeLimit, points
 */
export function generatePuzzle(difficulty, puzzleType = null) {
  // Handle specific puzzle types
  if (puzzleType === 'match3') {
    return generateMatch3Puzzle(difficulty)
  }
  
  if (puzzleType === 'trivia') {
    return generateTriviaPuzzle(difficulty)
  }
  
  if (puzzleType === 'chess') {
    return generateChessPuzzle(difficulty)
  }
  
  if (puzzleType === 'maze') {
    return generateMazePuzzle(difficulty)
  }
  
  if (puzzleType === 'rhythm') {
    return generateRhythmPuzzle(difficulty)
  }
  
  // Default to math or geometry
  const puzzleType2 = Math.random() < 0.5 ? 'math' : 'geometry'
  
  switch (difficulty) {
    case 'easy':
      return puzzleType2 === 'math' ? generateEasyMath() : generateEasyGeometry()
    case 'medium':
      return puzzleType2 === 'math' ? generateMediumMath() : generateMediumGeometry()
    case 'hard':
      return puzzleType2 === 'math' ? generateHardMath() : generateHardGeometry()
    default:
      return generateEasyMath()
  }
}

// Easy Math Puzzles (addition/subtraction with numbers 0-20)
function generateEasyMath() {
  const a = Math.floor(Math.random() * 11) + 1
  const b = Math.floor(Math.random() * 11) + 1
  const operation = Math.random() < 0.5 ? 'add' : 'subtract'
  
  let question, correctAnswer
  if (operation === 'add') {
    question = `${a} + ${b} = ?`
    correctAnswer = a + b
  } else {
    const max = Math.max(a, b)
    const min = Math.min(a, b)
    question = `${max} - ${min} = ?`
    correctAnswer = max - min
  }
  
  const answers = generateAnswers(correctAnswer, 0, 25)
  
  return {
    type: 'math',
    difficulty: 'easy',
    question,
    answers,
    correctIndex: answers.findIndex(a => a.isCorrect),
    timeLimit: 30,
    points: 10
  }
}

// Medium Math Puzzles (multiplication/division with numbers 1-12)
function generateMediumMath() {
  const operation = Math.random() < 0.5 ? 'multiply' : 'divide'
  
  let question, correctAnswer
  if (operation === 'multiply') {
    const a = Math.floor(Math.random() * 10) + 2
    const b = Math.floor(Math.random() * 10) + 2
    question = `${a} × ${b} = ?`
    correctAnswer = a * b
  } else {
    // Division: generate a division problem that results in a whole number
    const divisor = Math.floor(Math.random() * 8) + 2
    const quotient = Math.floor(Math.random() * 8) + 2
    const dividend = divisor * quotient
    question = `${dividend} ÷ ${divisor} = ?`
    correctAnswer = quotient
  }
  
  const answers = generateAnswers(correctAnswer, 0, 144)
  
  return {
    type: 'math',
    difficulty: 'medium',
    question,
    answers,
    correctIndex: answers.findIndex(a => a.isCorrect),
    timeLimit: 45,
    points: 25
  }
}

// Hard Math Puzzles (multi-step problems)
function generateHardMath() {
  const problemType = Math.floor(Math.random() * 3)
  
  let question, correctAnswer
  if (problemType === 0) {
    // Two-step addition/subtraction
    const a = Math.floor(Math.random() * 20) + 5
    const b = Math.floor(Math.random() * 15) + 5
    const c = Math.floor(Math.random() * 10) + 5
    question = `${a} + ${b} - ${c} = ?`
    correctAnswer = a + b - c
  } else if (problemType === 1) {
    // Order of operations
    const a = Math.floor(Math.random() * 5) + 2
    const b = Math.floor(Math.random() * 5) + 2
    const c = Math.floor(Math.random() * 10) + 1
    question = `${a} × ${b} + ${c} = ?`
    correctAnswer = a * b + c
  } else {
    // Percentage
    const percent = [10, 20, 25, 50, 75][Math.floor(Math.random() * 5)]
    const number = Math.floor(Math.random() * 10) * 10 + 20
    question = `${percent}% of ${number} = ?`
    correctAnswer = Math.round((percent / 100) * number)
  }
  
  const answers = generateAnswers(correctAnswer, 0, 200)
  
  return {
    type: 'math',
    difficulty: 'hard',
    question,
    answers,
    correctIndex: answers.findIndex(a => a.isCorrect),
    timeLimit: 60,
    points: 50
  }
}

// Easy Geometry Puzzles (basic shapes and angles)
function generateEasyGeometry() {
  const problemType = Math.floor(Math.random() * 3)
  
  let question, correctAnswer
  if (problemType === 0) {
    // Number of sides
    const shapes = [
      { name: 'triangle', sides: 3 },
      { name: 'square', sides: 4 },
      { name: 'pentagon', sides: 5 },
      { name: 'hexagon', sides: 6 }
    ]
    const shape = shapes[Math.floor(Math.random() * shapes.length)]
    question = `How many sides does a ${shape.name} have?`
    correctAnswer = shape.sides
  } else if (problemType === 1) {
    // Right angle
    question = `How many degrees in a right angle?`
    correctAnswer = 90
  } else {
    // Sum of angles in triangle
    question = `What is the sum of angles in a triangle (degrees)?`
    correctAnswer = 180
  }
  
  const answers = generateAnswers(correctAnswer, 0, 360)
  
  return {
    type: 'geometry',
    difficulty: 'easy',
    question,
    answers,
    correctIndex: answers.findIndex(a => a.isCorrect),
    timeLimit: 30,
    points: 10
  }
}

// Medium Geometry Puzzles (area and perimeter)
function generateMediumGeometry() {
  const problemType = Math.floor(Math.random() * 3)
  
  let question, correctAnswer
  if (problemType === 0) {
    // Area of rectangle
    const width = Math.floor(Math.random() * 8) + 3
    const height = Math.floor(Math.random() * 8) + 3
    question = `What is the area of a rectangle ${width} × ${height}?`
    correctAnswer = width * height
  } else if (problemType === 1) {
    // Perimeter of square
    const side = Math.floor(Math.random() * 10) + 2
    question = `What is the perimeter of a square with side length ${side}?`
    correctAnswer = side * 4
  } else {
    // Area of triangle
    const base = Math.floor(Math.random() * 8) + 3
    const height = Math.floor(Math.random() * 8) + 3
    question = `What is the area of a triangle with base ${base} and height ${height}?`
    correctAnswer = Math.round((base * height) / 2)
  }
  
  const answers = generateAnswers(correctAnswer, 0, 200)
  
  return {
    type: 'geometry',
    difficulty: 'medium',
    question,
    answers,
    correctIndex: answers.findIndex(a => a.isCorrect),
    timeLimit: 45,
    points: 25
  }
}

// Hard Geometry Puzzles (advanced concepts)
function generateHardGeometry() {
  const problemType = Math.floor(Math.random() * 3)
  
  let question, correctAnswer
  if (problemType === 0) {
    // Area of circle (using π ≈ 3.14)
    const radius = Math.floor(Math.random() * 5) + 2
    question = `What is the area of a circle with radius ${radius}? (Use π ≈ 3.14)`
    correctAnswer = Math.round(3.14 * radius * radius)
  } else if (problemType === 1) {
    // Volume of cube
    const side = Math.floor(Math.random() * 5) + 2
    question = `What is the volume of a cube with side length ${side}?`
    correctAnswer = side * side * side
  } else {
    // Sum of angles in polygon
    const sides = [5, 6, 7, 8][Math.floor(Math.random() * 4)]
    question = `What is the sum of interior angles in a ${sides}-sided polygon?`
    correctAnswer = (sides - 2) * 180
  }
  
  const answers = generateAnswers(correctAnswer, 0, 500)
  
  return {
    type: 'geometry',
    difficulty: 'hard',
    question,
    answers,
    correctIndex: answers.findIndex(a => a.isCorrect),
    timeLimit: 60,
    points: 50
  }
}

/**
 * Generate answer choices with distractors
 * @param {number} correct - The correct answer
 * @param {number} min - Minimum value for distractors
 * @param {number} max - Maximum value for distractors
 * @returns {Array} Array of answer objects with letter, text, and isCorrect
 */
function generateAnswers(correct, min, max) {
  const answers = [correct]
  
  // Generate distractors
  while (answers.length < 4) {
    // Create distractors that are close to the correct answer
    const offset = Math.floor(Math.random() * 5) + 1
    const sign = Math.random() < 0.5 ? 1 : -1
    const distractor = correct + (offset * sign)
    
    // Ensure distractor is within bounds and not duplicate
    if (distractor !== correct && distractor >= min && distractor <= max) {
      if (!answers.includes(distractor)) {
        answers.push(distractor)
      }
    } else {
      // If we can't generate a good distractor, try a simpler one
      const simpleDistractor = correct + (Math.floor(Math.random() * 3) - 1)
      if (simpleDistractor !== correct && simpleDistractor >= min && simpleDistractor <= max) {
        if (!answers.includes(simpleDistractor)) {
          answers.push(simpleDistractor)
        }
      }
    }
    
    // Prevent infinite loop
    if (answers.length === 1 && answers.length < 4) {
      // Fallback: add any valid numbers
      for (let i = min; i <= max && answers.length < 4; i++) {
        if (!answers.includes(i)) {
          answers.push(i)
        }
      }
      break
    }
  }
  
  // Shuffle answers
  answers.sort(() => Math.random() - 0.5)
  
  // Format as answer objects
  return answers.map((value, index) => ({
    letter: String.fromCharCode(65 + index), // A, B, C, D
    text: String(value),
    value: value,
    isCorrect: value === correct
  }))
}

