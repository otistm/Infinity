# Character Creator Example

Complete character creator component for selecting game piece shape and color.

## Code

```jsx
import { useState } from 'react';
import './CharacterCreator.css';

function CharacterCreator({ onStart }) {
  const [shape, setShape] = useState('circle');
  const [color, setColor] = useState('red');

  const shapes = ['circle', 'square', 'triangle', 'star', 'hexagon'];
  const colors = ['red', 'blue', 'green', 'yellow', 'purple'];

  const handleStart = () => {
    onStart({ shape, color });
  };

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

      <button onClick={handleStart} className="start-button">
        Start Game
      </button>
    </div>
  );
}

function PiecePreview({ shape, color }) {
  return (
    <div 
      className={`preview-piece preview-${shape}`}
      style={{ backgroundColor: color }}
    />
  );
}

export default CharacterCreator;
```

## CSS

```css
.character-creator {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.options button {
  padding: 0.5rem 1rem;
  border: 2px solid transparent;
  cursor: pointer;
}

.options button.active {
  border-color: #3498db;
}

.preview-piece {
  width: 100px;
  height: 100px;
  margin: 2rem auto;
}

.preview-circle {
  border-radius: 50%;
}

.preview-square {
  border-radius: 4px;
}

.start-button {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
```

## Usage

```jsx
import CharacterCreator from './components/CharacterCreator';

function App() {
  const handleStart = (piece) => {
    console.log('Selected:', piece);
    // Start game with selected piece
  };

  return <CharacterCreator onStart={handleStart} />;
}
```

## Features

- Shape selection (5 options)
- Color selection (5 options)
- Live preview
- Clean UI
- Responsive design

