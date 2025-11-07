# State Management Example

Example of using Zustand for game state management.

## Installation

```bash
npm install zustand
```

## Code

```jsx
import create from 'zustand';

// Game Store
const useGameStore = create((set) => ({
  // State
  score: 0,
  playerPosition: { x: 0, y: 0 },
  gameState: 'menu', // 'menu' | 'playing' | 'paused'

  // Actions
  addScore: (points) => set((state) => ({
    score: state.score + points
  })),
  
  setPlayerPosition: (position) => set({ playerPosition: position }),
  
  setGameState: (state) => set({ gameState: state }),
  
  reset: () => set({
    score: 0,
    playerPosition: { x: 0, y: 0 },
    gameState: 'menu'
  })
}));

// Usage in Components
function ScoreDisplay() {
  // Only re-renders when score changes
  const score = useGameStore((state) => state.score);
  return <div>Score: {score}</div>;
}

function Game() {
  const score = useGameStore((state) => state.score);
  const addScore = useGameStore((state) => state.addScore);

  return (
    <div>
      <ScoreDisplay />
      <button onClick={() => addScore(10)}>Add Points</button>
    </div>
  );
}

export default Game;
```

## Complex State Example

```jsx
const useGameStore = create((set, get) => ({
  // Player state
  player: {
    piece: { shape: 'circle', color: 'red' },
    position: { x: 0, y: 0 },
    score: 0
  },

  // Board state
  board: {
    tiles: new Map(),
    exploredChunks: new Set()
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

  // Computed values
  getVisibleTiles: () => {
    const { board, player } = get();
    const visible = [];
    // Calculate visible tiles
    return visible;
  }
}));
```

## Usage

1. Create store with `create()` from Zustand
2. Define state and actions
3. Use in components with `useGameStore()`
4. Selectively subscribe to avoid unnecessary re-renders

## Benefits

- Small bundle size
- No providers needed
- Simple API
- Great performance
- TypeScript support

