# Basic Game Loop Example

Example of implementing a game loop in React using requestAnimationFrame.

## Code

```jsx
import { useEffect, useRef, useState } from 'react';

function useGameLoop(update, render) {
  const frameRef = useRef();
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const loop = (timestamp) => {
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Update game state
      update(deltaTime);

      // Render (handled by React)
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

// Usage Example
function Game() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const update = (deltaTime) => {
    // Update position based on delta time
    setPosition(prev => ({
      x: prev.x + deltaTime * 0.01,
      y: prev.y
    }));
  };

  const render = () => {
    // React handles rendering automatically
  };

  useGameLoop(update, render);

  return (
    <div>
      <div style={{ left: position.x, top: position.y }}>
        Player
      </div>
    </div>
  );
}

export default Game;
```

## Usage

1. Copy the `useGameLoop` hook to your project
2. Use it in your game component
3. Implement update and render functions
4. Component will update every frame

## Notes

- Delta time is in milliseconds
- Cleanup is automatic on unmount
- Update and render functions should be memoized if expensive

