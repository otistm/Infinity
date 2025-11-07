import React, { useState, useRef, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import Board from './components/Board'
import PlayerPiece from './components/PlayerPiece'
import TestControls from './components/TestControls'
import DiceDisplay from './components/DiceDisplay'
import DirectionChooser from './components/DirectionChooser'
import PuzzleModal from './components/PuzzleModal'
import PuzzleTrigger from './components/PuzzleTrigger'
import CharacterCreator from './components/CharacterCreator'
import BoardLoadingScreen from './components/BoardLoadingScreen'
import { useGameStore } from './store/gameStore'
import './App.css'

function CameraFollow({ onZoomChange, onRotationChange }) {
  const animatedPosition = useGameStore((state) => state.player.animatedPosition)
  const gameStarted = useGameStore((state) => state.gameStarted)
  const controlsRef = useRef()
  const { camera } = useThree()
  const isUserInteracting = useRef(false)
  const initialCameraAngle = useRef(null)
  const cameraTargetRef = useRef({ x: animatedPosition.x, z: animatedPosition.y })
  const cameraInitialized = useRef(false)

  // Store initial camera angle relative to player
  useEffect(() => {
    if (controlsRef.current && !cameraInitialized.current && gameStarted) {
      // Initial settings: 90 degree rotation, 8% zoom
      const minDistance = 10
      const maxDistance = 30
      const zoomPercentage = 8
      const initialDistance = minDistance + (zoomPercentage / 100) * (maxDistance - minDistance)
      
      // 90 degrees rotation (azimuth) in radians
      const initialAzimuth = (90 * Math.PI) / 180
      
      // Calculate elevation from default camera position
      const defaultElevation = Math.asin(15 / Math.sqrt(15 * 15 + 15 * 15))
      
      initialCameraAngle.current = { 
        distance: initialDistance, 
        azimuth: initialAzimuth, 
        elevation: defaultElevation
      }
      cameraTargetRef.current = { x: animatedPosition.x, z: animatedPosition.y }
      
      // Set initial camera position centered on player
      camera.position.x = animatedPosition.x + initialDistance * Math.cos(defaultElevation) * Math.cos(initialAzimuth)
      camera.position.z = animatedPosition.y + initialDistance * Math.cos(defaultElevation) * Math.sin(initialAzimuth)
      camera.position.y = initialDistance * Math.sin(defaultElevation)
      
      controlsRef.current.target.x = animatedPosition.x
      controlsRef.current.target.z = animatedPosition.y
      controlsRef.current.target.y = 0
      controlsRef.current.update()
      
      cameraInitialized.current = true
      
      // Update initial state callbacks
      if (onZoomChange) onZoomChange(zoomPercentage)
      if (onRotationChange) onRotationChange(90)
    }
  }, [camera, animatedPosition, onZoomChange, onRotationChange, gameStarted])

  // Reset camera initialization when game starts (for loading saved games)
  useEffect(() => {
    if (!gameStarted) {
      cameraInitialized.current = false
    }
  }, [gameStarted])

  // Track when user is interacting with controls
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    const handleStart = () => {
      isUserInteracting.current = true
    }

    const handleEnd = () => {
      setTimeout(() => {
        isUserInteracting.current = false
        // Update angle reference when user finishes rotating
        if (initialCameraAngle.current) {
          const dx = camera.position.x - animatedPosition.x
          const dz = camera.position.z - animatedPosition.y
          const dy = camera.position.y
          
          const distance = Math.sqrt(dx * dx + dz * dz + dy * dy)
          const azimuth = Math.atan2(dz, dx)
          const elevation = Math.asin(dy / distance)
          
          initialCameraAngle.current = { distance, azimuth, elevation }
        }
      }, 100)
    }

    controls.addEventListener('start', handleStart)
    controls.addEventListener('end', handleEnd)

    return () => {
      controls.removeEventListener('start', handleStart)
      controls.removeEventListener('end', handleEnd)
    }
  }, [camera, animatedPosition])

  useFrame((state, delta) => {
    if (controlsRef.current && initialCameraAngle.current) {
      // Calculate zoom percentage and rotation
      const minDistance = 10
      const maxDistance = 30
      const currentDistance = camera.position.distanceTo(controlsRef.current.target)
      const zoomPercentage = ((currentDistance - minDistance) / (maxDistance - minDistance)) * 100
      
      // Calculate rotation angle (azimuth) in degrees
      const dx = camera.position.x - cameraTargetRef.current.x
      const dz = camera.position.z - cameraTargetRef.current.z
      const rotationAngle = (Math.atan2(dz, dx) * 180) / Math.PI

      // Update callbacks
      if (onZoomChange) onZoomChange(Math.max(0, Math.min(100, zoomPercentage)))
      if (onRotationChange) onRotationChange(rotationAngle)

      // Smoothly follow animated position every frame
      if (!isUserInteracting.current) {
        // Smooth interpolation for camera target
        const lerpSpeed = 8.0 // Follow speed
        const targetX = animatedPosition.x
        const targetZ = animatedPosition.y

        cameraTargetRef.current.x += (targetX - cameraTargetRef.current.x) * Math.min(1, lerpSpeed * delta)
        cameraTargetRef.current.z += (targetZ - cameraTargetRef.current.z) * Math.min(1, lerpSpeed * delta)

        // Update OrbitControls target
        controlsRef.current.target.x = cameraTargetRef.current.x
        controlsRef.current.target.z = cameraTargetRef.current.z
        controlsRef.current.target.y = 0

        // Maintain camera angle by updating position relative to animated position
        const angle = initialCameraAngle.current
        camera.position.x = cameraTargetRef.current.x + angle.distance * Math.cos(angle.elevation) * Math.cos(angle.azimuth)
        camera.position.z = cameraTargetRef.current.z + angle.distance * Math.cos(angle.elevation) * Math.sin(angle.azimuth)
        camera.position.y = angle.distance * Math.sin(angle.elevation)

        controlsRef.current.update()
      }
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={10}
      maxDistance={30}
      target={[cameraTargetRef.current.x, 0, cameraTargetRef.current.z]}
      enableDamping={true}
      dampingFactor={0.05}
    />
  )
}

function App() {
  const [zoomPercentage, setZoomPercentage] = useState(8)
  const [rotationAngle, setRotationAngle] = useState(90)
  const gameStarted = useGameStore((state) => state.gameStarted)
  const boardReady = useGameStore((state) => state.boardReady)
  const startGame = useGameStore((state) => state.startGame)
  const loadGame = useGameStore((state) => state.loadGame)
  const saveGame = useGameStore((state) => state.saveGame)
  const playerPosition = useGameStore((state) => state.player.position)
  const score = useGameStore((state) => state.player.score)
  const puzzlesSolved = useGameStore((state) => state.player.puzzlesSolved)

  // Load game on startup if save exists
  useEffect(() => {
    const hasSave = useGameStore.getState().hasSaveData()
    if (hasSave && !gameStarted) {
      console.log('Save data found, but waiting for user to choose to continue...')
    }
  }, [gameStarted])

  // Auto-save every 30 seconds when game is active
  useEffect(() => {
    if (!gameStarted || !boardReady) return

    const autoSaveInterval = setInterval(() => {
      saveGame()
      console.log('Auto-saved game')
    }, 30000) // 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [gameStarted, boardReady, saveGame])

  // Auto-save on important events (position changes, score changes, puzzles solved)
  useEffect(() => {
    if (!gameStarted || !boardReady) return

    // Debounce auto-save to avoid too frequent saves
    const saveTimeout = setTimeout(() => {
      saveGame()
    }, 2000) // Save 2 seconds after changes

    return () => clearTimeout(saveTimeout)
  }, [playerPosition.x, playerPosition.y, score, puzzlesSolved, gameStarted, boardReady, saveGame])

  // Save before page unload
  useEffect(() => {
    if (!gameStarted) return

    const handleBeforeUnload = (e) => {
      saveGame()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [gameStarted, saveGame])

  // Show character creator if game hasn't started
  if (!gameStarted) {
    return <CharacterCreator onStart={startGame} />
  }

  return (
    <div className="app" style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      {/* Show loading screen while board is rendering */}
      {!boardReady && <BoardLoadingScreen />}
      
      <PuzzleTrigger />
      <TestControls zoomPercentage={zoomPercentage} rotationAngle={rotationAngle} />
      <DiceDisplay />
      <DirectionChooser />
      <PuzzleModal />
      <div className="canvas-container" style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
        <Canvas
          camera={{ position: [0, 15, 15], fov: 60 }}
          shadows
          gl={{ 
            antialias: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: false
          }}
          onCreated={({ gl }) => {
            // Handle WebGL context loss
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault()
              console.warn('WebGL context lost - attempting recovery...')
            })
            
            gl.domElement.addEventListener('webglcontextrestored', () => {
              console.log('WebGL context restored')
            })
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.2}
            castShadow
          />
          
          <CameraFollow 
            onZoomChange={setZoomPercentage}
            onRotationChange={setRotationAngle}
          />
          
          <Board />
          <PlayerPiece />
        </Canvas>
      </div>
    </div>
  )
}

export default App
