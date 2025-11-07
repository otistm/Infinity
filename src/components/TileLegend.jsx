import { motion } from 'framer-motion'

function TileLegend() {
  const tileTypes = [
    { 
      name: 'Empty', 
      color: '#16213e', 
      description: 'Safe space'
    },
    { 
      name: 'Space', 
      color: '#9b59b6', 
      description: 'Free space tile'
    },
    { 
      name: 'Chess', 
      color: '#d4af37', 
      description: 'Chess puzzle'
    },
    { 
      name: 'Maze', 
      color: '#ff9800', 
      description: 'Maze puzzle'
    },
    { 
      name: 'Rhythm', 
      color: '#e91e63', 
      description: 'Rhythm puzzle'
    },
    { 
      name: 'Easy Puzzle', 
      color: '#4ecca3', 
      description: 'Easy difficulty'
    },
    { 
      name: 'Medium Puzzle', 
      color: '#f4d03f', 
      description: 'Medium difficulty'
    },
    { 
      name: 'Hard Puzzle', 
      color: '#e74c3c', 
      description: 'Hard difficulty'
    }
  ]

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      style={{
        position: 'fixed',
        left: '20px',
        top: '20px',
        maxHeight: 'calc(100vh - 40px)',
        overflowY: 'auto',
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        padding: '20px',
        borderRadius: '15px',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        zIndex: 1000,
        minWidth: '200px',
        maxWidth: '220px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
      }}
    >
      <h3 style={{
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: '15px',
        textAlign: 'center',
        borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
        paddingBottom: '10px'
      }}>
        Tile Legend
      </h3>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {tileTypes.map((tile, index) => (
          <motion.div
            key={tile.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                background: tile.color,
                borderRadius: '6px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                flexShrink: 0,
                boxShadow: `0 0 10px ${tile.color}40`
              }}
            />
            <div style={{
              flex: 1,
              minWidth: 0
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#fff',
                marginBottom: '2px'
              }}>
                {tile.name}
              </div>
              <div style={{
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                {tile.description}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default TileLegend

