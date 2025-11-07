import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../store/gameStore'

function CameraController() {
  const playerPosition = useGameStore((state) => state.player.position)

  // This component will be used to update OrbitControls target
  // The actual camera following is handled by updating OrbitControls target
  return null
}

export default CameraController
