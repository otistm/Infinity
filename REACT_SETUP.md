# React Game Development Setup Guide

Complete guide to setting up a React project for web-based game development.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Initialization](#project-initialization)
- [Essential Dependencies](#essential-dependencies)
- [Project Structure](#project-structure)
- [Development Tools](#development-tools)

## Prerequisites

### Required Software

- **Node.js** (v16 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Includes npm (Node Package Manager)

- **Code Editor**
  - Visual Studio Code (recommended)
  - Or any editor with React support

- **Modern Browser**
  - Chrome, Firefox, Edge, or Safari
  - For testing and debugging

## Project Initialization

### Create React App

```bash
npx create-react-app infinite-board-game
cd infinite-board-game
```

### Vite (Faster Alternative)

```bash
npm create vite@latest infinite-board-game -- --template react
cd infinite-board-game
npm install
```

### TypeScript Support (Optional)

```bash
npx create-react-app infinite-board-game --template typescript
```

## Essential Dependencies

### Core Dependencies

```bash
# React Three Fiber for 3D graphics
npm install @react-three/fiber three

# Zustand for state management
npm install zustand

# React Router (if needed for navigation)
npm install react-router-dom

# Framer Motion for animations
npm install framer-motion
```

### Development Dependencies

```bash
# ESLint and Prettier
npm install --save-dev eslint prettier eslint-config-prettier

# Additional useful libraries
npm install --save-dev @types/three  # TypeScript types for Three.js
```

### Optional Dependencies

```bash
# React Three Fiber helpers
npm install @react-three/drei

# Physics engine
npm install @react-three/rapier

# Post-processing effects
npm install @react-three/postprocessing

# UI styling
npm install styled-components
# OR
npm install tailwindcss

# HTTP client
npm install axios
```

## Project Structure

### Recommended Structure

```
infinite-board-game/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       ├── images/
│       └── sounds/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── HUD.jsx
│   │   ├── game/
│   │   │   ├── Board.jsx
│   │   │   ├── Tile.jsx
│   │   │   └── PlayerPiece.jsx
│   │   └── CharacterCreator.jsx
│   ├── hooks/
│   │   ├── useGameLoop.js
│   │   ├── useKeyboard.js
│   │   └── useWebSocket.js
│   ├── store/
│   │   └── gameStore.js
│   ├── utils/
│   │   ├── puzzleGenerator.js
│   │   └── diceRoller.js
│   ├── styles/
│   │   ├── index.css
│   │   └── components/
│   ├── App.jsx
│   └── index.js
├── package.json
└── README.md
```

## Development Tools

### VS Code Extensions

Recommended extensions:
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**

### Package.json Scripts

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

### Environment Variables

Create `.env` file:

```env
REACT_APP_API_URL=https://api.example.com
REACT_APP_WS_URL=wss://ws.example.com
```

Access in code:
```jsx
const apiUrl = process.env.REACT_APP_API_URL;
```

## Quick Start

### 1. Initialize Project

```bash
npx create-react-app infinite-board-game
cd infinite-board-game
```

### 2. Install Dependencies

```bash
npm install @react-three/fiber three zustand framer-motion
```

### 3. Create Basic Structure

```bash
mkdir -p src/components/game src/hooks src/store src/utils
```

### 4. Start Development Server

```bash
npm start
```

Opens `http://localhost:3000` automatically.

### 5. Build for Production

```bash
npm run build
```

Creates optimized build in `build/` folder.

## Configuration

### ESLint Configuration

Create `.eslintrc.json`:

```json
{
  "extends": [
    "react-app",
    "prettier"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off"
  }
}
```

### Prettier Configuration

Create `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### Git Configuration

Create `.gitignore`:

```
node_modules/
build/
dist/
.env
.env.local
.DS_Store
*.log
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm start
```

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Clear build cache
rm -rf build/
npm run build
```

---

**Next Steps:**
- See [REACT_GAME_API_REFERENCE.md](REACT_GAME_API_REFERENCE.md) for React patterns
- See [REACT_THREE_FIBER_GUIDE.md](REACT_THREE_FIBER_GUIDE.md) for 3D setup
- See [INFINITE_BOARD_GAME_REACT.md](INFINITE_BOARD_GAME_REACT.md) for implementation guide

