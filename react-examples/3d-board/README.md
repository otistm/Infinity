# 3D Board Example

Example of rendering a 3D board using React Three Fiber.

## Code

```jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Tile({ position, color }) {
  return (
    <mesh position={position} receiveShadow castShadow>
      <boxGeometry args={[0.9, 0.1, 0.9]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Board() {
  const tiles = [
    { position: [0, 0, 0], color: '#4ecca3' },
    { position: [1, 0, 0], color: '#16213e' },
    { position: [0, 0, 1], color: '#f4d03f' },
    // Add more tiles...
  ];

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 10, 10], fov: 60 }} shadows>
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.2}
          castShadow
        />
        
        <OrbitControls />
        
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#16213e" />
        </mesh>

        {/* Tiles */}
        {tiles.map((tile, index) => (
          <Tile key={index} {...tile} />
        ))}
      </Canvas>
    </div>
  );
}

export default Board;
```

## Installation

```bash
npm install @react-three/fiber three @react-three/drei
```

## Usage

1. Copy the Board component
2. Customize tiles array
3. Adjust lighting and camera as needed
4. Add more 3D objects as needed

## Customization

- Change tile colors
- Adjust camera position
- Modify lighting
- Add player piece
- Add animations

