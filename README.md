# Infinite Board Game - React

Welcome to the Infinite Board Game project! A web-based puzzle board game built with React and React Three Fiber.

## Quick Start

### Install Dependencies

```bash
npm install
```

### Start Development Server (with Live Updates)

```bash
npm run dev
```

This will:
- Start the development server on `http://localhost:3000`
- Open your browser automatically
- Enable **hot module replacement** - changes update instantly!
- Watch for file changes and reload automatically

### Making Changes

1. Edit any file in `src/`
2. Save the file
3. **See changes instantly in browser** - no refresh needed!

## Project Structure

```
src/
├── main.jsx          # Entry point
├── App.jsx           # Main app component
├── components/
│   └── Board.jsx     # 3D board component
└── ...
```

## Current Features

- ✅ 3D board rendering with React Three Fiber
- ✅ Procedurally generated tiles
- ✅ Color-coded puzzle tiles (Green=Easy, Yellow=Medium, Red=Hard)
- ✅ Proper lighting and shadows
- ✅ Camera controls (drag to rotate, scroll to zoom)
- ✅ Live browser updates with Vite HMR

## Documentation Overview

This documentation is organized into several key sections:

### [React Game API Reference](REACT_GAME_API_REFERENCE.md)
Complete reference for React hooks and patterns for game development, including:
- Core React hooks (useState, useEffect, useRef)
- Game loop patterns
- Animation hooks
- Performance optimization
- Event handling

### [React Three Fiber Guide](REACT_THREE_FIBER_GUIDE.md)
Comprehensive guide to 3D graphics using React Three Fiber:
- Canvas setup
- 3D objects and meshes
- Lighting and materials
- Camera controls
- Animations
- Performance optimization

### [React UI Guide](REACT_UI_GUIDE.md)
Guide to building user interfaces for games:
- UI component patterns
- Styling approaches
- Game UI components (HUD, Modals, Buttons)
- Animations with Framer Motion
- Responsive design

### [React State Management](REACT_STATE_MANAGEMENT.md)
State management patterns for games:
- Zustand (recommended)
- Redux Toolkit
- Context API
- Game state patterns

### [React Game Loop](REACT_GAME_LOOP.md)
Game loops, animations, and performance:
- requestAnimationFrame patterns
- Game loop hooks
- Performance optimization
- Memory management

### [React Networking](REACT_NETWORKING.md)
Networking for React games:
- HTTP requests with Fetch API
- WebSocket connections
- API integration patterns
- Game-specific networking

## API Reference

See [REACT_GAME_API_REFERENCE.md](REACT_GAME_API_REFERENCE.md) for detailed React patterns including:
- Hook signatures
- Usage examples
- Best practices
- Performance tips

**Key Hooks for Game Development:**
- `useState` - Component state
- `useEffect` - Side effects and lifecycle
- `useRef` - Mutable values and DOM references
- `useCallback` - Memoized callbacks
- `useMemo` - Memoized values
- `useReducer` - Complex state logic

## 3D Graphics

See [REACT_THREE_FIBER_GUIDE.md](REACT_THREE_FIBER_GUIDE.md) for complete 3D graphics guide.

**Key Technologies:**
- React Three Fiber (@react-three/fiber)
- Three.js
- Drei (@react-three/drei) - Helpers and utilities

**Common 3D Patterns:**
- 3D board rendering
- Player pieces
- Camera controls
- Lighting setup
- Material customization

## UI Development

See [REACT_UI_GUIDE.md](REACT_UI_GUIDE.md) for comprehensive UI development guide.

**Common UI Patterns:**
- Character creators
- Game HUDs
- Puzzle modals
- Dice displays
- Direction choosers
- Responsive layouts

## State Management

See [REACT_STATE_MANAGEMENT.md](REACT_STATE_MANAGEMENT.md) for state management patterns.

**Recommended:**
- Zustand - Small, fast, and simple
- Redux Toolkit - For larger projects
- Context API - For simpler needs

## Game Loops

See [REACT_GAME_LOOP.md](REACT_GAME_LOOP.md) for game loop implementation.

**Key Concepts:**
- requestAnimationFrame
- Delta time calculation
- Performance optimization
- Animation patterns

## Networking

See [REACT_NETWORKING.md](REACT_NETWORKING.md) for networking implementation details.

**Web Networking Features:**
- Fetch API for HTTP requests
- WebSocket for real-time communication
- Custom hooks for API calls
- Error handling patterns

## Examples

Complete working examples are available in the `react-examples/` directory:

- **[Game Loop](react-examples/game-loop/)** - requestAnimationFrame patterns
- **[3D Board](react-examples/3d-board/)** - 3D board rendering
- **[Character Creator](react-examples/character-creator/)** - Character selection UI
- **[State Management](react-examples/state-management/)** - Zustand examples

See [react-examples/README.md](react-examples/README.md) for a complete list with descriptions.

## Prerequisites

**Node.js must be installed first!**

If you see "npm is not recognized", install Node.js:
1. Download from: https://nodejs.org/
2. Install the LTS version
3. Restart your terminal

See [SETUP.md](SETUP.md) for detailed setup instructions.

## Project Implementation Guides

- **[Infinite Board Game - React Implementation](INFINITE_BOARD_GAME_REACT.md)** - Complete guide for building a web-based infinite board game with procedural generation, dice mechanics, and puzzle-solving gameplay using React and React Three Fiber

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.

**Quick Deploy:**
1. Build: `npm run build`
2. Deploy to Vercel/Netlify/GitHub Pages
3. Done!

## Resources

### Official Documentation
- [React Documentation](https://react.dev/)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Documentation](https://threejs.org/docs/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

### Version Information
- **React 18+**: Latest React with hooks and concurrent features
- **React Three Fiber**: Latest version with R3F
- **Three.js**: r150+ recommended

### Best Practices
- Keep bundle sizes optimized (code splitting, lazy loading)
- Test in multiple browsers before deployment
- Use React DevTools for debugging
- Implement proper error boundaries
- Optimize 3D scenes for performance
- Consider mobile device compatibility

## Contributing

When adding new examples or updating documentation:
1. Follow the existing documentation structure
2. Include both code snippets and complete examples
3. Test examples in modern browsers
4. Document any dependencies or requirements

## License

This documentation is provided as a reference guide for React web game development. Refer to official React and Three.js documentation for authoritative API information.

---

**Last Updated**: Based on React 18+ and React Three Fiber latest
**Maintained For**: Web-based game development with React
