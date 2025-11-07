import { useFrame } from '@react-three/fiber'
import { useRef, useEffect, Suspense, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../store/gameStore'

// Load GLB model (if it exists)
function GLBModel({ url }) {
  const { scene } = useGLTF(url)
  const modelRef = useRef()
  
  // Clone and position the model
  const clonedScene = useMemo(() => {
    if (!scene) return null
    
    const cloned = scene.clone()
    
    // Compute bounding box to center the model
    const box = new THREE.Box3().setFromObject(cloned)
    const min = box.min
    const max = box.max
    const center = box.getCenter(new THREE.Vector3())
    
    // Position model so its bottom sits at Y=0 (relative to parent mesh)
    // The parent mesh is at Y=0.5, so we offset by -0.5 to get to ground level
    // Then subtract the min.y to position the bottom at ground
    cloned.position.x = -center.x
    cloned.position.y = -min.y - 0.5  // Position bottom at Y=0 relative to ground
    cloned.position.z = -center.z
    
    // Rotate 180 degrees around Y axis to face away from camera
    cloned.rotation.y = Math.PI
    
    // Enable shadows but don't modify colors (keep original model colors)
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
      }
    })
    
    return cloned
  }, [scene])
  
  useEffect(() => {
    if (clonedScene && modelRef.current) {
      // Clear existing children and add cloned scene
      while (modelRef.current.children.length > 0) {
        modelRef.current.remove(modelRef.current.children[0])
      }
      modelRef.current.add(clonedScene)
    }
  }, [clonedScene])
  
  return <group ref={modelRef} />
}

function PlayerPiece() {
  const position = useGameStore((state) => state.player.position)
  const updateAnimatedPosition = useGameStore((state) => state.updateAnimatedPosition)
  const piece = useGameStore((state) => state.player.piece)
  const meshRef = useRef()
  const currentPosRef = useRef({ x: 0, y: 0 })
  const lastUpdateTime = useRef(0)

  // Initialize position on mount
  useEffect(() => {
    if (meshRef.current) {
      currentPosRef.current = { x: position.x, y: position.y }
      meshRef.current.position.set(position.x, 0.5, position.y)
    }
  }, [])

  // Smooth animation between positions with easing
  useFrame((state, delta) => {
    if (meshRef.current) {
      const targetX = position.x
      const targetZ = position.y
      const currentX = currentPosRef.current.x
      const currentZ = currentPosRef.current.y

      // Calculate distance to target
      const dx = targetX - currentX
      const dz = targetZ - currentZ
      const distance = Math.sqrt(dx * dx + dz * dz)

      // Only update if we're not already at the target
      if (distance > 0.001) {
        // Frame-rate independent lerp speed (units per second)
        const moveSpeed = 3.0 // tiles per second
        const lerpFactor = Math.min(1, (moveSpeed * delta) / distance)
        
        // Smooth easing function (ease-out)
        const easedFactor = 1 - Math.pow(1 - lerpFactor, 3)

        const newX = currentX + dx * easedFactor
        const newZ = currentZ + dz * easedFactor

        currentPosRef.current.x = newX
        currentPosRef.current.y = newZ

        meshRef.current.position.x = newX
        meshRef.current.position.z = newZ

        // Update store less frequently to reduce re-renders
        const now = state.clock.elapsedTime
        if (now - lastUpdateTime.current > 0.05) { // Update store every 50ms
          updateAnimatedPosition({ x: newX, y: newZ })
          lastUpdateTime.current = now
        }
      } else {
        // Snap to target if very close
        currentPosRef.current.x = targetX
        currentPosRef.current.y = targetZ
        meshRef.current.position.x = targetX
        meshRef.current.position.z = targetZ
        // Ensure isMoving is set to false when we reach the target
        updateAnimatedPosition({ x: targetX, y: targetZ })
      }
    }
  })

  // Get color based on selection
  const getColor = () => {
    const colors = {
      red: '#e74c3c',
      blue: '#3498db',
      green: '#2ecc71',
      yellow: '#f39c12',
      purple: '#9b59b6'
    }
    return colors[piece.color] || colors.red
  }

  // Check if piece has a custom GLB model path
  const glbPath = piece.glbPath

  return (
    <mesh
      ref={meshRef}
      castShadow
    >
      {glbPath ? (
        // Use GLB model if provided (no color applied - uses original model colors)
        <Suspense fallback={
          <boxGeometry args={[0.6, 0.6, 0.6]}>
            <meshStandardMaterial color="#ffffff" />
          </boxGeometry>
        }>
          <GLBModel url={glbPath} />
        </Suspense>
      ) : (
        // Use default geometry shapes
        <>
          {getGeometry()}
          <meshStandardMaterial color={getColor()} />
        </>
      )}
    </mesh>
  )
  
  // Get geometry based on shape (for fallback/default shapes)
  function getGeometry() {
    switch (piece.shape) {
      case 'circle':
        return <sphereGeometry args={[0.3, 16, 16]} />
      case 'square':
        return <boxGeometry args={[0.6, 0.6, 0.6]} />
      case 'triangle':
        return <coneGeometry args={[0.3, 0.6, 3]} />
      case 'star':
        return <boxGeometry args={[0.6, 0.6, 0.6]} />
      case 'hexagon':
        return <cylinderGeometry args={[0.3, 0.3, 0.6, 6]} />
      default:
        return <boxGeometry args={[0.6, 0.6, 0.6]} />
    }
  }
}

export default PlayerPiece
