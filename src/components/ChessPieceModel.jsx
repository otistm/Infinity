import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three-stdlib'
import { useMemo, Suspense } from 'react'

function ChessPieceModel({ position }) {
  const obj = useLoader(OBJLoader, '/knife_chess_piece.obj')
  
  const clonedMesh = useMemo(() => {
    if (!obj) return null
    
    // Clone the mesh to avoid mutating the original
    const cloned = obj.clone()
    
    // Scale and position
    cloned.scale.set(0.3, 0.3, 0.3)
    cloned.position.set(position.x, 0.3, position.y)
    cloned.rotation.y = Math.PI / 4
    
    return cloned
  }, [obj, position])
  
  if (!clonedMesh) return null
  
  return (
    <primitive 
      object={clonedMesh} 
      position={[position.x, 0.3, position.y]}
      scale={[0.3, 0.3, 0.3]}
      rotation={[0, Math.PI / 4, 0]}
    />
  )
}

function ChessPieceModelWrapper({ position }) {
  return (
    <Suspense fallback={
      <mesh position={[position.x, 0.3, position.y]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#d4af37" />
      </mesh>
    }>
      <ChessPieceModel position={position} />
    </Suspense>
  )
}

export default ChessPieceModelWrapper

