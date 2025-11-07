import { useState, Suspense, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../store/gameStore'

const SHAPES = ['circle', 'square', 'triangle']
const GLB_MODELS = [
  { name: 'bunny', path: '/player_piece_bunny.glb', displayName: 'Bunny' },
  { name: 'sparrow', path: '/player_piece_sparrow.glb', displayName: 'Sparrow' },
  { name: 'panda', path: '/player_piece_panda.glb', displayName: 'Panda' }
]
const COLORS = [
  { name: 'red', hex: '#e74c3c' },
  { name: 'blue', hex: '#3498db' },
  { name: 'green', hex: '#2ecc71' },
  { name: 'yellow', hex: '#f39c12' },
  { name: 'purple', hex: '#9b59b6' }
]

// GLB Model Preview Component
function GLBPreview({ url }) {
  const { scene } = useGLTF(url)
  
  // Clone the scene to avoid mutating the cached model, memoized
  const clonedScene = useMemo(() => {
    const cloned = scene.clone()
    
    // Update matrix worlds to ensure accurate bounding box calculation
    cloned.updateMatrixWorld(true)
    
    // Center the model by computing its bounding box
    const box = new THREE.Box3().setFromObject(cloned)
    const center = box.getCenter(new THREE.Vector3())
    
    // Center the model fully at origin (0, 0, 0) for preview
    // This ensures it appears centered in the viewport
    cloned.position.x = -center.x
    cloned.position.y = -center.y  // Center vertically
    cloned.position.z = -center.z
    
    // Rotate 180 degrees around Y axis to face away from camera
    cloned.rotation.y = Math.PI
    
    // Update matrix world again after positioning
    cloned.updateMatrixWorld(true)
    
    // Enable shadows but don't modify colors (keep original model colors)
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
      }
    })
    
    return cloned
  }, [scene])
  
  return <primitive object={clonedScene} />
}

// 3D Preview Component
function PiecePreview3D({ shape, color, glbPath }) {
  const selectedColorHex = COLORS.find(c => c.name === color)?.hex || COLORS[0].hex
  
  if (glbPath) {
    return (
      <Suspense fallback={
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      }>
        <group position={[0, 0, 0]}>
          <GLBPreview url={glbPath} />
        </group>
      </Suspense>
    )
  }
  
  const getGeometry = () => {
    switch (shape) {
      case 'circle':
        return <sphereGeometry args={[0.4, 16, 16]} />
      case 'square':
        return <boxGeometry args={[0.8, 0.8, 0.8]} />
      case 'triangle':
        return <coneGeometry args={[0.4, 0.8, 3]} />
      default:
        return <boxGeometry args={[0.8, 0.8, 0.8]} />
    }
  }

  // For triangle (cone), offset it so center is at origin (cone base is at y=-height/2, center is at y=0)
  const position = shape === 'triangle' ? [0, 0.4, 0] : [0, 0, 0]

  return (
    <mesh position={position} rotation={[0.3, 0.5, 0]}>
      {getGeometry()}
      <meshStandardMaterial color={selectedColorHex} />
    </mesh>
  )
}

function CharacterCreator({ onStart }) {
  const [selectedShape, setSelectedShape] = useState('circle')
  const [selectedGlb, setSelectedGlb] = useState(null)
  const [selectedColor, setSelectedColor] = useState('red')
  const [showPieceSelection, setShowPieceSelection] = useState(false)
  const setPlayerPiece = useGameStore((state) => state.setPlayerPiece)
  const loadGame = useGameStore((state) => state.loadGame)
  const startGame = useGameStore((state) => state.startGame)
  const useGameStoreState = useGameStore

  // Check for save data on mount
  useEffect(() => {
    const hasSave = useGameStoreState.getState().hasSaveData()
    if (hasSave) {
      // If save exists, don't show piece selection initially
      setShowPieceSelection(false)
    } else {
      // If no save, show piece selection
      setShowPieceSelection(true)
    }
  }, [useGameStoreState])

  const handleStart = () => {
    // Check if save data exists - access directly from store
    const saveExists = useGameStoreState.getState().hasSaveData()
    console.log('Start Game clicked - Save exists:', saveExists, 'Show piece selection:', showPieceSelection)
    
    if (saveExists) {
      // Load saved game and start
      console.log('Loading saved game...')
      const success = loadGame()
      if (success) {
        // loadGame() already sets gameStarted: true, so no need to call startGame()
        // DO NOT reload - let React handle the state change
        console.log('Game loaded successfully')
      } else {
        alert('Failed to load saved game')
      }
    } else {
      // No save data - check if piece selection is shown
      if (!showPieceSelection) {
        // Show piece selection first
        console.log('Showing piece selection...')
        setShowPieceSelection(true)
        return
      }
      
      // Piece selection is shown - start new game with selected piece
      console.log('Starting new game with piece:', selectedGlb || { shape: selectedShape, color: selectedColor })
      const pieceData = {
        ...(selectedGlb 
          ? { glbPath: selectedGlb } 
          : { shape: selectedShape, color: selectedColor })
      }
      setPlayerPiece(pieceData)
      if (onStart) {
        console.log('Calling onStart...')
        onStart()
      }
      // DO NOT reload - let React handle the state change
    }
  }

  const selectedColorHex = COLORS.find(c => c.name === selectedColor)?.hex || COLORS[0].hex

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundImage: `
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f1419 100%)
      `,
      backgroundSize: '50px 50px, 50px 50px, 100% 100%',
      backgroundColor: '#0f1419',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          maxWidth: '800px',
          width: '90%',
          textAlign: 'center'
        }}
      >
        {/* Evergreen Title */}
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
          color: '#9b59b6',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          Evergreen
        </h1>

        {/* 3D Preview */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            width: '300px',
            height: '300px',
            margin: '0 auto 2rem',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Canvas camera={{ position: [0, 0, 3], fov: 50 }} style={{ width: '100%', height: '100%' }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <pointLight position={[-5, -5, -5]} intensity={0.5} />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={1}
              target={[0, 0, 0]}
            />
            <group position={[0, 0, 0]}>
              <PiecePreview3D 
                shape={selectedShape} 
                color={selectedColor}
                glbPath={selectedGlb}
              />
            </group>
          </Canvas>
        </motion.div>

        {/* Create Your Game Piece Heading - Only show if no save exists or piece selection is shown */}
        {showPieceSelection && (
          <>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              color: '#fff'
            }}>
              Create Your Game Piece
            </h2>

            {/* Shape/Model Selector - All in One Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                marginBottom: '2rem'
              }}
            >
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Shapes */}
            {SHAPES.map((shape) => (
              <motion.button
                key={shape}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedShape(shape)
                  setSelectedGlb(null)
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#fff',
                  background: !selectedGlb && selectedShape === shape
                    ? 'rgba(155, 89, 182, 0.8)'
                    : 'rgba(40, 40, 50, 0.8)',
                  border: !selectedGlb && selectedShape === shape
                    ? '2px solid rgba(155, 89, 182, 0.6)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.3s ease'
                }}
              >
                {shape}
              </motion.button>
            ))}
            
            {/* GLB Models */}
            {GLB_MODELS.map((model) => (
              <motion.button
                key={model.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedGlb(model.path)
                  setSelectedShape('circle') // Reset shape when selecting GLB
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#fff',
                  background: selectedGlb === model.path
                    ? 'rgba(155, 89, 182, 0.8)'
                    : 'rgba(40, 40, 50, 0.8)',
                  border: selectedGlb === model.path
                    ? '2px solid rgba(155, 89, 182, 0.6)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.3s ease'
                }}
              >
                {model.displayName}
              </motion.button>
            ))}
          </div>
        </motion.div>
          </>
        )}

        {/* Color Selector - Only show when a shape is selected, not a GLB model */}
        {showPieceSelection && !selectedGlb && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              marginBottom: '3rem'
            }}
          >
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {COLORS.map((color) => (
                <motion.button
                  key={color.name}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedColor(color.name)}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: color.hex,
                    border: 'none',
                    cursor: 'pointer',
                    outline: selectedColor === color.name
                      ? `3px solid ${color.hex === '#f39c12' ? '#ff9500' : (color.hex === '#e74c3c' ? '#ff6b5a' : color.hex)}`
                      : 'none',
                    outlineOffset: selectedColor === color.name ? '3px' : '0',
                    boxShadow: selectedColor === color.name
                      ? `0 0 15px ${color.hex === '#f39c12' ? '#ff9500' : (color.hex === '#e74c3c' ? '#ff6b5a' : color.hex)}`
                      : '0 4px 10px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Start Game Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          style={{
            padding: '1rem 3rem',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: '#fff',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '15px',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease'
          }}
        >
          Start Game
        </motion.button>
      </motion.div>
    </div>
  )
}

export default CharacterCreator
