import { create } from 'zustand'

const SAVE_KEY = 'evergreen-game-save'

// Helper functions to serialize/deserialize Map and Set
function serializeGameState(state) {
  return {
    gameStarted: state.gameStarted,
    player: {
      piece: state.player.piece,
      position: state.player.position,
      animatedPosition: state.player.position, // Reset to position on load
      isMoving: false, // Reset to false on load
      score: state.player.score,
      puzzlesSolved: state.player.puzzlesSolved
    },
    board: {
      exploredChunks: Array.from(state.board.exploredChunks), // Convert Set to Array
      viewport: state.board.viewport
      // Don't save tiles - they'll be regenerated based on exploredChunks
    }
  }
}

function deserializeGameState(savedState) {
  return {
    gameStarted: true, // Always set to true when loading a save (game was started if save exists)
    boardReady: false, // Always reset to false on load
    player: {
      piece: savedState.player?.piece || { shape: 'circle', color: 'red' },
      position: savedState.player?.position || { x: 0, y: 0 },
      animatedPosition: savedState.player?.position || { x: 0, y: 0 },
      isMoving: false,
      score: savedState.player?.score || 0,
      puzzlesSolved: savedState.player?.puzzlesSolved || 0
    },
    board: {
      tiles: new Map(), // Will be regenerated
      exploredChunks: new Set(savedState.board?.exploredChunks || []), // Convert Array back to Set
      viewport: savedState.board?.viewport || { centerX: 0, centerY: 0, width: 7, height: 7 }
    },
    dice: {
      lastRoll: null,
      awaitingDirection: false,
      currentPattern: null,
      isRolling: false
    },
    puzzle: {
      active: false,
      data: null
    }
  }
}

export const useGameStore = create((set, get) => ({
  // Game state
  gameStarted: false,
  boardReady: false, // Tracks if initial board rendering is complete

  // Player state
  player: {
    piece: { shape: 'circle', color: 'red' },
    position: { x: 0, y: 0 }, // Target position
    animatedPosition: { x: 0, y: 0 }, // Current animated position
    isMoving: false,
    score: 0,
    puzzlesSolved: 0
  },

  // Board state - using Map for efficient lookups
  board: {
    tiles: new Map(), // Key: "x,y" -> Tile data
    exploredChunks: new Set(), // Key: "chunkX,chunkY"
    viewport: { centerX: 0, centerY: 0, width: 7, height: 7 }
  },

  // Actions
  setPlayerPosition: (position) => set((state) => ({
    player: { 
      ...state.player, 
      position, // Target position
      isMoving: true
    },
    board: {
      ...state.board,
      viewport: {
        ...state.board.viewport,
        centerX: position.x,
        centerY: position.y
      }
    }
  })),

  updateAnimatedPosition: (position) => set((state) => {
    const dx = Math.abs(position.x - state.player.position.x)
    const dy = Math.abs(position.y - state.player.position.y)
    const isStillMoving = dx > 0.01 || dy > 0.01
    
    return {
      player: {
        ...state.player,
        animatedPosition: position,
        isMoving: isStillMoving
      }
    }
  }),

  addScore: (points) => set((state) => ({
    player: {
      ...state.player,
      score: state.player.score + points
    }
  })),

  incrementPuzzlesSolved: () => set((state) => ({
    player: {
      ...state.player,
      puzzlesSolved: state.player.puzzlesSolved + 1
    }
  })),

  setPlayerPiece: (piece) => set((state) => ({
    player: { ...state.player, piece }
  })),

  startGame: () => set({ gameStarted: true, boardReady: false }),
  setBoardReady: (ready) => set({ boardReady: ready }),
  resetGame: () => set({
    gameStarted: false,
    boardReady: false,
    player: {
      piece: { shape: 'circle', color: 'red' },
      position: { x: 0, y: 0 },
      animatedPosition: { x: 0, y: 0 },
      isMoving: false,
      score: 0,
      puzzlesSolved: 0
    },
    board: {
      tiles: new Map(),
      exploredChunks: new Set(),
      viewport: { centerX: 0, centerY: 0, width: 7, height: 7 }
    },
    dice: {
      lastRoll: null,
      awaitingDirection: false,
      currentPattern: null,
      isRolling: false
    },
    puzzle: {
      active: false,
      data: null
    }
  }),

  // Board generation
  addTiles: (tiles) => set((state) => {
    const newTilesMap = new Map(state.board.tiles)
    tiles.forEach(tile => {
      const key = `${tile.x},${tile.y}`
      newTilesMap.set(key, tile)
    })
    return {
      board: {
        ...state.board,
        tiles: newTilesMap
      }
    }
  }),

  markChunkExplored: (chunkX, chunkY) => set((state) => {
    const newChunks = new Set(state.board.exploredChunks)
    newChunks.add(`${chunkX},${chunkY}`)
    return {
      board: {
        ...state.board,
        exploredChunks: newChunks
      }
    }
  }),

  // Cleanup distant tiles to prevent memory buildup
  cleanupTiles: (maxDistance = 30) => set((state) => {
    const cleaned = new Map()
    const centerX = state.player.position.x
    const centerY = state.player.position.y
    
    state.board.tiles.forEach((tile, key) => {
      const dx = Math.abs(tile.x - centerX)
      const dy = Math.abs(tile.y - centerY)
      
      if (dx <= maxDistance && dy <= maxDistance) {
        cleaned.set(key, tile)
      }
    })
    
    return {
      board: {
        ...state.board,
        tiles: cleaned
      }
    }
  }),

  // Dice state
  dice: {
    lastRoll: null,
    awaitingDirection: false,
    currentPattern: null,
    isRolling: false
  },

  setDiceRoll: (roll) => set((state) => ({
    dice: {
      ...state.dice,
      lastRoll: roll,
      awaitingDirection: roll?.type === 'number' ? true : false,
      currentPattern: roll?.type === 'pattern' ? roll : null,
      isRolling: false
    }
  })),

  setDiceRolling: (isRolling) => set((state) => ({
    dice: {
      ...state.dice,
      isRolling
    }
  })),

  clearDiceRoll: () => set((state) => ({
    dice: {
      ...state.dice,
      lastRoll: null,
      awaitingDirection: false,
      currentPattern: null
    }
  })),

  // Puzzle state
  puzzle: {
    active: false,
    data: null
  },

  startPuzzle: (puzzleData) => set({
    puzzle: {
      active: true,
      data: puzzleData
    }
  }),

  closePuzzle: () => set({
    puzzle: {
      active: false,
      data: null
    }
  }),

  // Save/Load functionality
  saveGame: () => {
    const state = get()
    const saveData = serializeGameState(state)
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData))
      console.log('Game saved successfully')
      return true
    } catch (error) {
      console.error('Error saving game:', error)
      return false
    }
  },

  loadGame: () => {
    try {
      const savedData = localStorage.getItem(SAVE_KEY)
      if (!savedData) {
        console.log('No save data found')
        return false
      }

      const parsedData = JSON.parse(savedData)
      const loadedState = deserializeGameState(parsedData)
      
      set(loadedState)
      console.log('Game loaded successfully')
      return true
    } catch (error) {
      console.error('Error loading game:', error)
      return false
    }
  },

  hasSaveData: () => {
    return localStorage.getItem(SAVE_KEY) !== null
  },

  deleteSaveData: () => {
    try {
      localStorage.removeItem(SAVE_KEY)
      console.log('Save data deleted')
      return true
    } catch (error) {
      console.error('Error deleting save data:', error)
      return false
    }
  }
}))

