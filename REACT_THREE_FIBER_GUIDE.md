# React Three Fiber Guide for 3D Games

Complete guide to building 3D games using React Three Fiber (R3F), a React renderer for Three.js.

## Table of Contents

- [Introduction](#introduction)
- [Setup and Installation](#setup-and-installation)
- [Core Concepts](#core-concepts)
- [3D Objects](#3d-objects)
- [Lighting and Materials](#lighting-and-materials)
- [Camera Controls](#camera-controls)
- [Animations](#animations)
- [Performance Optimization](#performance-optimization)
- [Game Patterns](#game-patterns)

## Introduction

React Three Fiber (R3F) is a React renderer for Three.js that allows you to build 3D experiences declaratively using React components.

**Key Benefits:**
- Declarative 3D scene graph
- React hooks for Three.js objects
- Automatic cleanup and resource management
- React DevTools support
- TypeScript support

## Setup and Installation

### Installation

```bash
npm install @react-three/fiber three
```

### Optional Dependencies

```bash
# For camera controls
npm install @react-three/drei

# For physics
npm install @react-three/rapier

# For post-processing
npm install @react-three/postprocessing
```

### Basic Setup

```jsx
import { Canvas } from '@react-three/fiber';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        {/* Your 3D scene here */}
      </Canvas>
    </div>
  );
}
```

## Core Concepts

### Canvas Component

The `<Canvas>` component creates a WebGL context and renders your 3D scene.

```jsx
import { Canvas } from '@react-three/fiber';

function Game() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ antialias: true }}
      shadows
    >
      {/* Scene content */}
    </Canvas>
  );
}
```

**Canvas Props:**
- `camera` - Camera configuration
- `gl` - WebGL renderer options
- `shadows` - Enable shadows
- `frameloop` - 'always' | 'demand' | 'never'
- `onCreated` - Callback when scene is created

### Scene Graph

R3F uses JSX to create a scene graph:

```jsx
<Canvas>
  <ambientLight intensity={0.5} />
  <directionalLight position={[10, 10, 5]} />
  <mesh position={[0, 0, 0]}>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="orange" />
  </mesh>
</Canvas>
```

## 3D Objects

### Meshes

Basic 3D objects:

```jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function RotatingCube() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta;
    meshRef.current.rotation.y += delta;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}
```

### Geometry Types

```jsx
// Box
<boxGeometry args={[width, height, depth]} />

// Sphere
<sphereGeometry args={[radius, widthSegments, heightSegments]} />

// Plane
<planeGeometry args={[width, height]} />

// Cylinder
<cylinderGeometry args={[radiusTop, radiusBottom, height, segments]} />

// Torus (donut)
<torusGeometry args={[radius, tube, radialSegments, tubularSegments]} />
```

### Positioning and Transformations

```jsx
<mesh
  position={[x, y, z]}        // Position
  rotation={[x, y, z]}        // Rotation in radians
  scale={[x, y, z]}           // Scale
>
  <boxGeometry />
  <meshStandardMaterial />
</mesh>
```

## Lighting and Materials

### Lights

```jsx
// Ambient light (fills entire scene)
<ambientLight intensity={0.5} />

// Directional light (sun-like)
<directionalLight
  position={[10, 10, 5]}
  intensity={1}
  castShadow
/>

// Point light (lamp-like)
<pointLight position={[0, 10, 0]} intensity={1} />

// Spot light (flashlight)
<spotLight
  position={[10, 10, 10]}
  angle={0.15}
  penumbra={1}
  intensity={1}
  castShadow
/>
```

### Materials

```jsx
// Standard material (PBR)
<meshStandardMaterial
  color="orange"
  metalness={0.5}
  roughness={0.5}
/>

// Phong material (shiny)
<meshPhongMaterial
  color="blue"
  shininess={100}
/>

// Basic material (flat colors)
<meshBasicMaterial color="red" />

// Physical material (realistic)
<meshPhysicalMaterial
  color="gold"
  metalness={1}
  roughness={0.1}
  clearcoat={1}
/>
```

### Materials with Textures

```jsx
import { useTexture } from '@react-three/drei';

function TexturedBox() {
  const texture = useTexture('/texture.jpg');

  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
```

## Camera Controls

### OrbitControls

```jsx
import { OrbitControls } from '@react-three/drei';

function Scene() {
  return (
    <Canvas>
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
      />
      {/* Scene content */}
    </Canvas>
  );
}
```

### First Person Controls

```jsx
import { PointerLockControls } from '@react-three/drei';

function Scene() {
  return (
    <Canvas>
      <PointerLockControls />
      {/* Scene content */}
    </Canvas>
  );
}
```

### Custom Camera Movement

```jsx
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';

function CameraController({ target }) {
  const { camera } = useThree();
  const cameraRef = useRef();

  useFrame(() => {
    if (target) {
      camera.position.lerp(target, 0.1);
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}
```

## Animations

### useFrame Hook

Update objects every frame:

```jsx
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function AnimatedBox() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    // Rotate based on time
    meshRef.current.rotation.x += delta;
    meshRef.current.rotation.y += delta * 0.5;

    // Bounce up and down
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}
```

### Spring Animations

```jsx
import { useSpring, animated } from '@react-spring/three';

function AnimatedBox({ position }) {
  const { pos } = useSpring({
    pos: position,
    config: { tension: 200, friction: 20 }
  });

  return (
    <animated.mesh position={pos}>
      <boxGeometry />
      <meshStandardMaterial />
    </animated.mesh>
  );
}
```

### GSAP Animations

```jsx
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

function GSAPAnimatedBox() {
  const meshRef = useRef();

  useEffect(() => {
    gsap.to(meshRef.current.position, {
      y: 2,
      duration: 1,
      yoyo: true,
      repeat: -1,
      ease: 'power2.inOut'
    });
  }, []);

  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial color="cyan" />
    </mesh>
  );
}
```

## Performance Optimization

### Instancing

Render many objects efficiently:

```jsx
import { InstancedMesh } from '@react-three/drei';
import { useMemo } from 'react';

function ManyBoxes({ count = 1000 }) {
  const instances = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ],
        rotation: [Math.random(), Math.random(), Math.random()]
      });
    }
    return temp;
  }, [count]);

  return (
    <InstancedMesh args={[null, null, count]}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial color="orange" />
    </InstancedMesh>
  );
}
```

### Level of Detail (LOD)

```jsx
import { LOD } from '@react-three/drei';

function AdaptiveBox({ position }) {
  return (
    <LOD>
      <mesh position={position}>
        <boxGeometry args={[1, 1, 1, 32, 32, 32]} />
        <meshStandardMaterial />
      </mesh>
      <mesh position={position} distance={10}>
        <boxGeometry args={[1, 1, 1, 16, 16, 16]} />
        <meshStandardMaterial />
      </mesh>
      <mesh position={position} distance={20}>
        <boxGeometry args={[1, 1, 1, 8, 8, 8]} />
        <meshStandardMaterial />
      </mesh>
    </LOD>
  );
}
```

### Frustum Culling

Only render visible objects:

```jsx
import { useThree } from '@react-three/fiber';

function CulledBox({ position }) {
  const { camera } = useThree();
  const [visible, setVisible] = useState(true);

  useFrame(() => {
    // Check if object is in camera frustum
    const distance = camera.position.distanceTo(new Vector3(...position));
    setVisible(distance < 50);
  });

  if (!visible) return null;

  return (
    <mesh position={position}>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}
```

## Game Patterns

### Board Tile Component

```jsx
function BoardTile({ position, type, onClick }) {
  const getColor = () => {
    switch (type) {
      case 'easy': return '#4ecca3';
      case 'medium': return '#f4d03f';
      case 'hard': return '#e74c3c';
      default: return '#16213e';
    }
  };

  return (
    <mesh
      position={position}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      <boxGeometry args={[1, 0.1, 1]} />
      <meshStandardMaterial color={getColor()} />
    </mesh>
  );
}
```

### Player Piece Component

```jsx
function PlayerPiece({ position, shape, color }) {
  const getGeometry = () => {
    switch (shape) {
      case 'circle':
        return <sphereGeometry args={[0.4, 16, 16]} />;
      case 'square':
        return <boxGeometry args={[0.8, 0.8, 0.8]} />;
      case 'triangle':
        return <coneGeometry args={[0.4, 0.8, 3]} />;
      default:
        return <boxGeometry args={[0.8, 0.8, 0.8]} />;
    }
  };

  return (
    <mesh position={[position[0], position[1] + 0.5, position[2]]}>
      {getGeometry()}
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
```

### Infinite Board Generation

```jsx
function InfiniteBoard({ playerPosition, chunkSize = 10 }) {
  const [chunks, setChunks] = useState(new Map());

  useEffect(() => {
    const playerChunkX = Math.floor(playerPosition.x / chunkSize);
    const playerChunkY = Math.floor(playerPosition.z / chunkSize);

    // Generate surrounding chunks
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const chunkX = playerChunkX + dx;
        const chunkY = playerChunkY + dy;
        const chunkKey = `${chunkX},${chunkY}`;

        if (!chunks.has(chunkKey)) {
          const newChunk = generateChunk(chunkX, chunkY, chunkSize);
          setChunks(prev => new Map(prev).set(chunkKey, newChunk));
        }
      }
    }
  }, [playerPosition]);

  return (
    <>
      {Array.from(chunks.values()).map(chunk => (
        <Chunk key={chunk.key} tiles={chunk.tiles} />
      ))}
    </>
  );
}
```

### Raycasting for Interactions

```jsx
import { useThree } from '@react-three/fiber';
import { useRef } from 'react';

function InteractiveBoard() {
  const { camera, raycaster, mouse } = useThree();
  const boardRef = useRef();

  useFrame(() => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(boardRef.current);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      // Handle hover/click
    }
  });

  return (
    <group ref={boardRef}>
      {/* Board tiles */}
    </group>
  );
}
```

---

**References:**
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Documentation](https://threejs.org/docs/)
- [Drei Library](https://github.com/pmndrs/drei)

