# React State Management for Games

Guide to managing game state using Zustand, Redux, and React's built-in state management.

## Table of Contents

- [State Management Overview](#state-management-overview)
- [Zustand (Recommended)](#zustand-recommended)
- [Redux Toolkit](#redux-toolkit)
- [Context API](#context-api)
- [Game State Patterns](#game-state-patterns)

## State Management Overview

For games, you need efficient state management that:
- Updates frequently without performance issues
- Handles complex game state
- Supports time-travel debugging (optional)
- Is easy to use and maintain

## Zustand (Recommended)

Zustand is a small, fast state management library perfect for games.

### Installation

```bash
npm install zustand
```

### Basic Store

```jsx
import create from 'zustand';

const useGameStore = create((set) => ({
  // State
  score: 0,
  playerPosition: { x: 0, y: 0 },
  gameState: 'menu', // 'menu' | 'playing' | 'paused'

  // Actions
  addScore: (points) => set((state) => ({ score: state.score + points })),
  
  setPlayerPosition: (position) => set({ playerPosition: position }),
  
  setGameState: (state) => set({ gameState: state }),
  
  reset: () => set({
    score: 0,
    playerPosition: { x: 0, y: 0 },
    gameState: 'menu'
  })
}));

// Usage in component
function Game() {
  const score = useGameStore((state) => state.score);
  const addScore = useGameStore((state) => state.addScore);

  return (
    <div>
      <p>Score: {score}</p>
      <button onClick={() => addScore(10)}>Add Points</button>
    </div>
  );
}
```

### Selective Subscriptions

```jsx
// Only re-render when score changes
function ScoreDisplay() {
  const score = useGameStore((state) => state.score);
  return <div>Score: {score}</div>;
}

// Only re-render when position changes
function PlayerPosition() {
  const position = useGameStore((state) => state.playerPosition);
  return <div>Position: ({position.x}, {position.y})</div>;
}
```

### Complex Game State

```jsx
import create from 'zustand';

const useGameStore = create((set, get) => ({
  // Player state
  player: {
    piece: { shape: 'circle', color: 'red' },
    position: { x: 0, y: 0 },
    score: 0,
    puzzlesSolved: 0
  },

  // Board state
  board: {
    tiles: new Map(),
    exploredChunks: new Set(),
    viewport: { centerX: 0, centerY: 0, width: 7, height: 7 }
  },

  // Dice state
  dice: {
    lastRoll: null,
    awaitingDirection: false,
    currentPattern: null
  },

  // Puzzle state
  puzzle: {
    active: false,
    type: null,
    question: '',
    answers: [],
    selectedAnswer: null
  },

  // Actions
  updatePlayerPosition: (position) => set((state) => ({
    player: { ...state.player, position }
  })),

  addScore: (points) => set((state) => ({
    player: {
      ...state.player,
      score: state.player.score + points
    }
  })),

  setDiceRoll: (roll) => set((state) => ({
    dice: {
      ...state.dice,
      lastRoll: roll,
      awaitingDirection: roll.type === 'number'
    }
  })),

  startPuzzle: (puzzle) => set((state) => ({
    puzzle: {
      ...state.puzzle,
      active: true,
      ...puzzle
    }
  })),

  // Computed values
  getVisibleTiles: () => {
    const state = get();
    const { centerX, centerY, width, height } = state.board.viewport;
    const visible = [];
    
    // Return tiles within viewport
    state.board.tiles.forEach((tile, key) => {
      const [x, y] = key.split(',').map(Number);
      if (
        x >= centerX - width / 2 &&
        x <= centerX + width / 2 &&
        y >= centerY - height / 2 &&
        y <= centerY + height / 2
      ) {
        visible.push(tile);
      }
    });
    
    return visible;
  }
}));
```

### Middleware

```jsx
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useGameStore = create(
  devtools(
    persist(
      (set) => ({
        score: 0,
        addScore: (points) => set((state) => ({ score: state.score + points }))
      }),
      {
        name: 'game-storage', // localStorage key
        partialize: (state) => ({ score: state.score }) // Only persist score
      }
    ),
    { name: 'GameStore' } // Redux DevTools name
  )
);
```

### Time-Travel Debugging

```jsx
import create from 'zustand';
import { devtools } from 'zustand/middleware';

const useGameStore = create(
  devtools(
    (set) => ({
      score: 0,
      addScore: (points) => set(
        (state) => ({ score: state.score + points }),
        false,
        'addScore' // Action name for DevTools
      )
    }),
    { name: 'GameStore' }
  )
);
```

## Redux Toolkit

For larger games or teams familiar with Redux.

### Installation

```bash
npm install @reduxjs/toolkit react-redux
```

### Store Setup

```jsx
import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Slice

```jsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameState {
  score: number;
  playerPosition: { x: number; y: number };
  gameState: 'menu' | 'playing' | 'paused';
}

const initialState: GameState = {
  score: 0,
  playerPosition: { x: 0, y: 0 },
  gameState: 'menu'
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    addScore: (state, action: PayloadAction<number>) => {
      state.score += action.payload;
    },
    setPlayerPosition: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.playerPosition = action.payload;
    },
    setGameState: (state, action: PayloadAction<GameState['gameState']>) => {
      state.gameState = action.payload;
    },
    reset: () => initialState
  }
});

export const { addScore, setPlayerPosition, setGameState, reset } = gameSlice.actions;
export default gameSlice.reducer;
```

### Usage

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { addScore, setPlayerPosition } from './gameSlice';

function Game() {
  const score = useSelector((state) => state.game.score);
  const dispatch = useDispatch();

  return (
    <div>
      <p>Score: {score}</p>
      <button onClick={() => dispatch(addScore(10))}>
        Add Points
      </button>
    </div>
  );
}
```

## Context API

For simpler games or when you want to avoid external dependencies.

### Game Context

```jsx
import { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [score, setScore] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [gameState, setGameState] = useState('menu');

  const addScore = useCallback((points) => {
    setScore(prev => prev + points);
  }, []);

  const value = {
    score,
    playerPosition,
    gameState,
    addScore,
    setPlayerPosition,
    setGameState
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
```

### Usage

```jsx
function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}

function Game() {
  const { score, addScore } = useGame();

  return (
    <div>
      <p>Score: {score}</p>
      <button onClick={() => addScore(10)}>Add Points</button>
    </div>
  );
}
```

## Game State Patterns

### State Machine Pattern

```jsx
import create from 'zustand';

const gameStates = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver'
};

const useGameStore = create((set) => ({
  state: gameStates.MENU,

  startGame: () => set({ state: gameStates.PLAYING }),
  
  pauseGame: () => set((currentState) => {
    if (currentState.state === gameStates.PLAYING) {
      return { state: gameStates.PAUSED };
    }
    return currentState;
  }),
  
  resumeGame: () => set((currentState) => {
    if (currentState.state === gameStates.PAUSED) {
      return { state: gameStates.PLAYING };
    }
    return currentState;
  }),
  
  gameOver: () => set({ state: gameStates.GAME_OVER }),
  
  reset: () => set({ state: gameStates.MENU })
}));
```

### Entity Management

```jsx
const useEntityStore = create((set, get) => ({
  entities: new Map(),

  addEntity: (id, entity) => set((state) => {
    const newEntities = new Map(state.entities);
    newEntities.set(id, entity);
    return { entities: newEntities };
  }),

  removeEntity: (id) => set((state) => {
    const newEntities = new Map(state.entities);
    newEntities.delete(id);
    return { entities: newEntities };
  }),

  updateEntity: (id, updates) => set((state) => {
    const newEntities = new Map(state.entities);
    const entity = newEntities.get(id);
    if (entity) {
      newEntities.set(id, { ...entity, ...updates });
    }
    return { entities: newEntities };
  }),

  getEntitiesInRange: (position, range) => {
    const { entities } = get();
    const inRange = [];
    
    entities.forEach((entity, id) => {
      const distance = Math.sqrt(
        Math.pow(entity.position.x - position.x, 2) +
        Math.pow(entity.position.y - position.y, 2)
      );
      if (distance <= range) {
        inRange.push({ id, ...entity });
      }
    });
    
    return inRange;
  }
}));
```

### Undo/Redo Pattern

```jsx
const useGameStore = create((set, get) => ({
  history: [],
  historyIndex: -1,
  score: 0,

  addScore: (points) => {
    const newScore = get().score + points;
    const history = get().history.slice(0, get().historyIndex + 1);
    
    set({
      score: newScore,
      history: [...history, { type: 'addScore', points, score: newScore }],
      historyIndex: history.length
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      set({
        score: previousState.score,
        historyIndex: historyIndex - 1
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      set({
        score: nextState.score,
        historyIndex: historyIndex + 1
      });
    }
  }
}));
```

---

**References:**
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Context API](https://react.dev/reference/react/useContext)

