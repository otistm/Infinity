# React UI Guide for Games

Comprehensive guide to building user interfaces for web-based games using React.

## Table of Contents

- [UI Component Patterns](#ui-component-patterns)
- [Styling Approaches](#styling-approaches)
- [Game UI Components](#game-ui-components)
- [Animations](#animations)
- [Responsive Design](#responsive-design)
- [Performance](#performance)

## UI Component Patterns

### HUD Component

```jsx
function HUD({ score, position, health }) {
  return (
    <div className="hud">
      <div className="hud-top">
        <div className="score">Score: {score}</div>
        <div className="position">
          Position: ({position.x}, {position.y})
        </div>
      </div>
      <div className="hud-bottom">
        <div className="health">Health: {health}</div>
      </div>
    </div>
  );
}
```

### Modal/Dialog Component

```jsx
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
```

### Button Component

```jsx
function GameButton({ children, onClick, variant = 'primary', disabled }) {
  return (
    <button
      className={`game-button game-button--${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

## Styling Approaches

### CSS Modules

```css
/* HUD.module.css */
.hud {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1000;
}

.hudTop {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  color: white;
  font-size: 18px;
}

.score {
  font-weight: bold;
}
```

```jsx
import styles from './HUD.module.css';

function HUD({ score }) {
  return (
    <div className={styles.hud}>
      <div className={styles.hudTop}>
        <div className={styles.score}>Score: {score}</div>
      </div>
    </div>
  );
}
```

### Styled Components

```jsx
import styled from 'styled-components';

const HUDContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1000;
`;

const ScoreDisplay = styled.div`
  padding: 20px;
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

function HUD({ score }) {
  return (
    <HUDContainer>
      <ScoreDisplay>Score: {score}</ScoreDisplay>
    </HUDContainer>
  );
}
```

### Tailwind CSS

```jsx
function HUD({ score }) {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none z-50">
      <div className="flex justify-between p-5 text-white text-lg">
        <div className="font-bold">Score: {score}</div>
      </div>
    </div>
  );
}
```

## Game UI Components

### Character Creator

```jsx
function CharacterCreator({ onStart }) {
  const [shape, setShape] = useState('circle');
  const [color, setColor] = useState('red');

  const shapes = ['circle', 'square', 'triangle', 'star', 'hexagon'];
  const colors = ['red', 'blue', 'green', 'yellow', 'purple'];

  return (
    <div className="character-creator">
      <h1>Create Your Piece</h1>
      
      <div className="shape-selector">
        <h2>Shape</h2>
        <div className="options">
          {shapes.map(s => (
            <button
              key={s}
              className={shape === s ? 'active' : ''}
              onClick={() => setShape(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="color-selector">
        <h2>Color</h2>
        <div className="options">
          {colors.map(c => (
            <button
              key={c}
              className={color === c ? 'active' : ''}
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="preview">
        <PiecePreview shape={shape} color={color} />
      </div>

      <button onClick={() => onStart({ shape, color })}>
        Start Game
      </button>
    </div>
  );
}
```

### Puzzle Modal

```jsx
function PuzzleModal({ puzzle, onAnswer, onClose }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(puzzle.timeLimit);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onAnswer(null); // Timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      onAnswer(selectedAnswer);
    }
  };

  return (
    <div className="puzzle-modal">
      <div className="puzzle-content">
        <div className="timer">Time: {timeRemaining}s</div>
        <h2>{puzzle.question}</h2>
        
        <div className="answers">
          {puzzle.answers.map((answer, index) => (
            <button
              key={index}
              className={selectedAnswer === index ? 'selected' : ''}
              onClick={() => setSelectedAnswer(index)}
            >
              {answer.letter}) {answer.text}
            </button>
          ))}
        </div>

        <button onClick={handleSubmit} disabled={selectedAnswer === null}>
          Submit
        </button>
      </div>
    </div>
  );
}
```

### Dice Display

```jsx
function DiceDisplay({ result, onRoll }) {
  const [rolling, setRolling] = useState(false);

  const handleRoll = () => {
    setRolling(true);
    setTimeout(() => {
      setRolling(false);
      onRoll();
    }, 1000);
  };

  return (
    <div className="dice-display">
      <div className={`dice ${rolling ? 'rolling' : ''}`}>
        {result ? (
          result.type === 'number' ? (
            <div className="dice-number">{result.value}</div>
          ) : (
            <div className="dice-pattern">{result.name}</div>
          )
        ) : (
          <div>Ready to roll</div>
        )}
      </div>
      <button onClick={handleRoll} disabled={rolling}>
        Roll Dice
      </button>
    </div>
  );
}
```

### Direction Chooser

```jsx
function DirectionChooser({ onSelect }) {
  return (
    <div className="direction-chooser">
      <h3>Choose Direction</h3>
      <div className="direction-grid">
        <button onClick={() => onSelect({ x: 0, y: -1 })}>↑</button>
        <button onClick={() => onSelect({ x: -1, y: 0 })}>←</button>
        <button onClick={() => onSelect({ x: 0, y: 1 })}>↓</button>
        <button onClick={() => onSelect({ x: 1, y: 0 })}>→</button>
      </div>
    </div>
  );
}
```

## Animations

### Framer Motion

```jsx
import { motion } from 'framer-motion';

function AnimatedButton({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
}
```

### CSS Animations

```css
@keyframes slideIn {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-content {
  animation: slideIn 0.3s ease-out;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.score {
  animation: pulse 2s infinite;
}
```

### React Spring

```jsx
import { useSpring, animated } from '@react-spring/web';

function AnimatedScore({ score }) {
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: score },
    config: { tension: 120, friction: 14 }
  });

  return (
    <animated.div>
      {number.to(n => Math.floor(n))}
    </animated.div>
  );
}
```

## Responsive Design

### Media Queries

```css
.hud {
  font-size: 16px;
}

@media (max-width: 768px) {
  .hud {
    font-size: 14px;
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .hud {
    font-size: 12px;
    padding: 5px;
  }
}
```

### Responsive Hooks

```jsx
function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: windowSize.width < 768,
    isTablet: windowSize.width >= 768 && windowSize.width < 1024,
    isDesktop: windowSize.width >= 1024,
    ...windowSize
  };
}

function HUD({ score }) {
  const { isMobile } = useResponsive();

  return (
    <div className={`hud ${isMobile ? 'mobile' : ''}`}>
      <div>Score: {score}</div>
    </div>
  );
}
```

## Performance

### Memoization

```jsx
import { memo } from 'react';

const ScoreDisplay = memo(({ score }) => {
  return <div>Score: {score}</div>;
});
```

### Virtual Scrolling

```jsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef();

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: virtualItem.size,
              transform: `translateY(${virtualItem.start}px)`
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

**References:**
- [React Component Patterns](https://react.dev/learn)
- [Framer Motion](https://www.framer.com/motion/)
- [React Spring](https://www.react-spring.dev/)
- [Styled Components](https://styled-components.com/)

