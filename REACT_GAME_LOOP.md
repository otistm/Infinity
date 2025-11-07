# React Game Loop and Performance Guide

Guide to implementing game loops, animations, and performance optimization in React games.

## Table of Contents

- [Game Loop Fundamentals](#game-loop-fundamentals)
- [requestAnimationFrame](#requestanimationframe)
- [Performance Optimization](#performance-optimization)
- [Animation Patterns](#animation-patterns)
- [Memory Management](#memory-management)

## Game Loop Fundamentals

A game loop continuously updates game state and renders the scene.

### Basic Game Loop Hook

```jsx
import { useEffect, useRef } from 'react';

function useGameLoop(update, render) {
  const frameRef = useRef();
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const loop = (timestamp) => {
      // Calculate delta time
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Update game state
      update(deltaTime);

      // Render
      render();

      // Schedule next frame
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
```

### Usage

```jsx
function Game() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const update = (deltaTime) => {
    // Update game logic
    setPosition(prev => ({
      x: prev.x + deltaTime * 0.01,
      y: prev.y
    }));
  };

  const render = () => {
    // Render is handled by React
  };

  useGameLoop(update, render);

  return <div style={{ left: position.x }}>Player</div>;
}
```

## requestAnimationFrame

### Basic Pattern

```jsx
import { useEffect, useRef } from 'react';

function Game() {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef();
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const gameLoop = (timestamp) => {
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Update
      updateGame(deltaTime);

      // Render
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      renderGame(ctx);

      // Next frame
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} width={800} height={600} />;
}
```

### FPS Limiting

```jsx
function useGameLoop(update, targetFPS = 60) {
  const frameRef = useRef();
  const lastTimeRef = useRef(0);
  const frameInterval = 1000 / targetFPS;

  useEffect(() => {
    const loop = (timestamp) => {
      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= frameInterval) {
        const deltaTime = elapsed / 1000; // Convert to seconds
        lastTimeRef.current = timestamp - (elapsed % frameInterval);

        update(deltaTime);
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [update, targetFPS]);
}
```

### Pausable Game Loop

```jsx
function useGameLoop(update, isPaused = false) {
  const frameRef = useRef();
  const lastTimeRef = useRef(0);

  useEffect(() => {
    if (isPaused) return;

    const loop = (timestamp) => {
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      update(deltaTime);

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [update, isPaused]);
}
```

## Performance Optimization

### Memoization

```jsx
import { memo, useMemo } from 'react';

// Memoize expensive components
const ExpensiveComponent = memo(({ data }) => {
  const processed = useMemo(() => {
    // Expensive computation
    return processData(data);
  }, [data]);

  return <div>{processed}</div>;
});
```

### Virtualization

```jsx
import { useMemo } from 'react';

function GameBoard({ tiles, viewport }) {
  // Only render visible tiles
  const visibleTiles = useMemo(() => {
    return tiles.filter(tile => {
      const distance = Math.sqrt(
        Math.pow(tile.x - viewport.centerX, 2) +
        Math.pow(tile.y - viewport.centerY, 2)
      );
      return distance <= viewport.radius;
    });
  }, [tiles, viewport]);

  return (
    <div>
      {visibleTiles.map(tile => (
        <Tile key={tile.id} {...tile} />
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

function useDebounce(callback, delay) {
  const timeoutRef = useRef();

  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}
```

### Web Workers

```jsx
// worker.js
self.onmessage = function(e) {
  const { tiles, playerPosition } = e.data;
  
  // Expensive computation
  const visibleTiles = tiles.filter(tile => {
    const distance = Math.sqrt(
      Math.pow(tile.x - playerPosition.x, 2) +
      Math.pow(tile.y - playerPosition.y, 2)
    );
    return distance <= 5;
  });

  self.postMessage({ visibleTiles });
};

// Component
function Game() {
  const [visibleTiles, setVisibleTiles] = useState([]);
  const workerRef = useRef();

  useEffect(() => {
    workerRef.current = new Worker('/worker.js');
    
    workerRef.current.onmessage = (e) => {
      setVisibleTiles(e.data.visibleTiles);
    };

    return () => {
      workerRef.current.terminate();
    };
  }, []);

  const updateVisibleTiles = (tiles, playerPosition) => {
    workerRef.current.postMessage({ tiles, playerPosition });
  };

  return <div>Game content</div>;
}
```

## Animation Patterns

### Interpolation Hook

```jsx
function useInterpolation(start, end, duration) {
  const [value, setValue] = useState(start);
  const frameRef = useRef();
  const startTimeRef = useRef();

  useEffect(() => {
    startTimeRef.current = Date.now();
    const difference = end - start;

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-in-out)
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setValue(start + difference * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
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
  const frameRef = useRef();

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
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, duration]);

  return value;
}
```

### Spring Animation

```jsx
function useSpring(target, tension = 200, friction = 20) {
  const [value, setValue] = useState(target);
  const velocityRef = useRef(0);
  const frameRef = useRef();

  useEffect(() => {
    const animate = () => {
      const distance = target - value;
      const springForce = distance * tension;
      const dampingForce = velocityRef.current * friction;
      const acceleration = (springForce - dampingForce) / 100;

      velocityRef.current += acceleration;
      setValue(prev => prev + velocityRef.current);

      if (Math.abs(distance) > 0.01 || Math.abs(velocityRef.current) > 0.01) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, value, tension, friction]);

  return value;
}
```

## Memory Management

### Cleanup Patterns

```jsx
function Game() {
  const listenersRef = useRef([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Handle key press
    };

    const handleResize = () => {
      // Handle resize
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    listenersRef.current = [
      { element: window, event: 'keydown', handler: handleKeyDown },
      { element: window, event: 'resize', handler: handleResize }
    ];

    return () => {
      listenersRef.current.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
    };
  }, []);
}
```

### Object Pooling

```jsx
class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
    this.active = new Set();

    for (let i = 0; i < initialSize; i++) {
      this.pool.push(createFn());
    }
  }

  acquire() {
    let obj = this.pool.pop();
    if (!obj) {
      obj = this.createFn();
    }
    this.active.add(obj);
    return obj;
  }

  release(obj) {
    if (this.active.has(obj)) {
      this.active.delete(obj);
      this.resetFn(obj);
      this.pool.push(obj);
    }
  }
}

// Usage
const tilePool = new ObjectPool(
  () => ({ x: 0, y: 0, type: null }),
  (tile) => { tile.x = 0; tile.y = 0; tile.type = null; }
);
```

---

**References:**
- [requestAnimationFrame API](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)

