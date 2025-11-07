# React Game Development API Reference

Comprehensive reference for building web-based games with React, covering hooks, patterns, and core concepts for game development.

## Table of Contents

- [Core React Hooks for Games](#core-react-hooks-for-games)
- [Game Patterns](#game-patterns)
- [Performance Optimization](#performance-optimization)
- [Event Handling](#event-handling)
- [Animation Patterns](#animation-patterns)
- [Component Patterns](#component-patterns)

## Core React Hooks for Games

### useState

**Purpose:** Manage component-local state that changes over time.

**Game Use Cases:**
- Player position
- Score
- Game status (playing, paused, game over)
- UI state (menu visibility, selected options)

**Example:**
```jsx
import { useState } from 'react';

function Game() {
  const [score, setScore] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [gameState, setGameState] = useState('menu'); // 'menu' | 'playing' | 'paused'

  const addScore = (points) => {
    setScore(prev => prev + points);
  };

  return (
    <div>
      <p>Score: {score}</p>
      <p>Position: ({playerPosition.x}, {playerPosition.y})</p>
    </div>
  );
}
```

### useEffect

**Purpose:** Handle side effects, lifecycle events, and cleanup.

**Game Use Cases:**
- Setting up event listeners
- Starting/stopping game loops
- Cleanup on unmount
- Fetching data

**Example:**
```jsx
import { useEffect, useState } from 'react';

function Game() {
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    // Game loop
    let animationFrameId;
    const gameLoop = () => {
      // Update game state
      updateGame();
      
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    // Cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isRunning]);

  return <div>Game content</div>;
}
```

### useRef

**Purpose:** Store mutable values that don't trigger re-renders.

**Game Use Cases:**
- Storing previous values
- Accessing DOM elements
- Keeping animation frame IDs
- Storing game objects

**Example:**
```jsx
import { useRef, useEffect } from 'react';

function Game() {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const lastFrameTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const gameLoop = (timestamp) => {
      const deltaTime = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;

      // Update and render
      update(deltaTime);
      render(ctx);

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} width={800} height={600} />;
}
```

### useCallback

**Purpose:** Memoize functions to prevent unnecessary re-renders.

**Game Use Cases:**
- Event handlers passed to child components
- Callback functions in game loops
- Optimization for frequently called functions

**Example:**
```jsx
import { useState, useCallback } from 'react';

function Game() {
  const [score, setScore] = useState(0);

  // Memoized callback won't change unless dependencies change
  const handleScoreUpdate = useCallback((points) => {
    setScore(prev => prev + points);
  }, []);

  return <ScoreDisplay onScoreUpdate={handleScoreUpdate} />;
}
```

### useMemo

**Purpose:** Memoize expensive calculations.

**Game Use Cases:**
- Expensive computations (pathfinding, collision detection)
- Filtering/sorting game entities
- Derived state calculations

**Example:**
```jsx
import { useMemo } from 'react';

function GameBoard({ tiles, playerPosition }) {
  // Only recalculate visible tiles when dependencies change
  const visibleTiles = useMemo(() => {
    return tiles.filter(tile => {
      const distance = Math.sqrt(
        Math.pow(tile.x - playerPosition.x, 2) +
        Math.pow(tile.y - playerPosition.y, 2)
      );
      return distance <= 5; // View distance
    });
  }, [tiles, playerPosition]);

  return (
    <div>
      {visibleTiles.map(tile => (
        <Tile key={tile.id} {...tile} />
      ))}
    </div>
  );
}
```

### useReducer

**Purpose:** Manage complex state logic with reducers.

**Game Use Cases:**
- Complex game state (inventory, quests, character stats)
- State machines (game phases, character states)
- Undo/redo functionality

**Example:**
```jsx
import { useReducer } from 'react';

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'MOVE_PLAYER':
      return {
        ...state,
        playerPosition: action.position
      };
    case 'ADD_SCORE':
      return {
        ...state,
        score: state.score + action.points
      };
    case 'GAME_OVER':
      return {
        ...state,
        gameState: 'gameOver',
        finalScore: state.score
      };
    default:
      return state;
  }
};

function Game() {
  const [state, dispatch] = useReducer(gameReducer, {
    playerPosition: { x: 0, y: 0 },
    score: 0,
    gameState: 'playing'
  });

  const movePlayer = (x, y) => {
    dispatch({ type: 'MOVE_PLAYER', position: { x, y } });
  };

  return <div>Game content</div>;
}
```

## Game Patterns

### Game Loop Pattern

**Using requestAnimationFrame:**

```jsx
import { useEffect, useRef } from 'react';

function useGameLoop(update, render) {
  const frameRef = useRef();
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const loop = (timestamp) => {
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Update game state
      update(deltaTime);
      
      // Render
      render();

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [update, render]);
}

// Usage
function Game() {
  const update = (deltaTime) => {
    // Update game logic
  };

  const render = () => {
    // Render game
  };

  useGameLoop(update, render);

  return <div>Game</div>;
}
```

### Entity Component System Pattern

```jsx
// Entity system for managing game objects
function useEntitySystem() {
  const [entities, setEntities] = useState([]);

  const addEntity = (entity) => {
    setEntities(prev => [...prev, entity]);
  };

  const removeEntity = (id) => {
    setEntities(prev => prev.filter(e => e.id !== id));
  };

  const updateEntity = (id, updates) => {
    setEntities(prev =>
      prev.map(e => e.id === id ? { ...e, ...updates } : e)
    );
  };

  return { entities, addEntity, removeEntity, updateEntity };
}
```

### Observer Pattern with Custom Hooks

```jsx
// Event system for game events
function useGameEvents() {
  const listenersRef = useRef({});

  const on = (event, callback) => {
    if (!listenersRef.current[event]) {
      listenersRef.current[event] = [];
    }
    listenersRef.current[event].push(callback);

    // Return unsubscribe function
    return () => {
      listenersRef.current[event] = listenersRef.current[event].filter(
        cb => cb !== callback
      );
    };
  };

  const emit = (event, data) => {
    if (listenersRef.current[event]) {
      listenersRef.current[event].forEach(callback => callback(data));
    }
  };

  return { on, emit };
}
```

## Performance Optimization

### Memoization

```jsx
import { memo, useMemo } from 'react';

// Memoize expensive components
const ExpensiveTile = memo(({ tile }) => {
  // Expensive rendering logic
  return <div>{tile.content}</div>;
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.tile.id === nextProps.tile.id;
});
```

### Virtualization

```jsx
// Only render visible items
function VirtualizedList({ items, itemHeight, containerHeight }) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight),
      items.length
    );
    return items.slice(start, end);
  }, [items, scrollTop, itemHeight, containerHeight]);

  return (
    <div onScroll={(e) => setScrollTop(e.target.scrollTop)}>
      {visibleItems.map(item => (
        <Item key={item.id} {...item} />
      ))}
    </div>
  );
}
```

### Debouncing and Throttling

```jsx
import { useRef, useCallback } from 'react';

function useThrottle(callback, delay) {
  const lastRunRef = useRef(0);

  return useCallback((...args) => {
    const now = Date.now();
    if (now - lastRunRef.current >= delay) {
      callback(...args);
      lastRunRef.current = now;
    }
  }, [callback, delay]);
}

// Usage
function Game() {
  const handleInput = useThrottle((input) => {
    // Process input
  }, 100); // Throttle to 100ms

  return <input onChange={(e) => handleInput(e.target.value)} />;
}
```

## Event Handling

### Keyboard Input

```jsx
import { useEffect } from 'react';

function useKeyboardInput() {
  const keysRef = useRef({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.key] = true;
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const isKeyPressed = (key) => keysRef.current[key] || false;

  return { isKeyPressed };
}
```

### Mouse/Touch Input

```jsx
function usePointerInput() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const handleMove = (e) => {
      const x = e.clientX || e.touches?.[0]?.clientX;
      const y = e.clientY || e.touches?.[0]?.clientY;
      setPosition({ x, y });
    };

    const handleDown = () => setIsPressed(true);
    const handleUp = () => setIsPressed(false);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchstart', handleDown);
    window.addEventListener('touchend', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchstart', handleDown);
      window.removeEventListener('touchend', handleUp);
    };
  }, []);

  return { position, isPressed };
}
```

## Animation Patterns

### Interpolation

```jsx
function useInterpolation(start, end, duration) {
  const [value, setValue] = useState(start);

  useEffect(() => {
    const startTime = Date.now();
    const difference = end - start;

    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-in-out)
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setValue(start + difference * eased);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    update();
  }, [start, end, duration]);

  return value;
}
```

### Tween Hook

```jsx
function useTween(target, duration = 300) {
  const [value, setValue] = useState(target);
  const startRef = useRef(value);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (target === value) return;

    startRef.current = value;
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(startRef.current + (target - startRef.current) * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return value;
}
```

## Component Patterns

### Container/Presenter Pattern

```jsx
// Container (logic)
function GameContainer() {
  const [score, setScore] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });

  const handleMove = (x, y) => {
    setPlayerPosition({ x, y });
  };

  return (
    <GamePresenter
      score={score}
      playerPosition={playerPosition}
      onMove={handleMove}
    />
  );
}

// Presenter (presentation)
function GamePresenter({ score, playerPosition, onMove }) {
  return (
    <div>
      <ScoreDisplay score={score} />
      <GameBoard position={playerPosition} onMove={onMove} />
    </div>
  );
}
```

### Higher-Order Components for Games

```jsx
function withGameLoop(Component) {
  return function GameLoopWrapper(props) {
    const [deltaTime, setDeltaTime] = useState(0);
    const lastTimeRef = useRef(0);

    useEffect(() => {
      const loop = (timestamp) => {
        const delta = timestamp - lastTimeRef.current;
        lastTimeRef.current = timestamp;
        setDeltaTime(delta);
        requestAnimationFrame(loop);
      };

      requestAnimationFrame(loop);
    }, []);

    return <Component {...props} deltaTime={deltaTime} />;
  };
}
```

---

**References:**
- [React Hooks Documentation](https://react.dev/reference/react)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [requestAnimationFrame API](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

