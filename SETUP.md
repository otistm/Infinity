# Setup Instructions

## Step 1: Install Node.js

**Node.js is required to run this project.**

1. Download Node.js from: https://nodejs.org/
2. Install the LTS version (v18 or higher recommended)
3. Restart your terminal/command prompt after installation

**Verify installation:**
```bash
node --version
npm --version
```

You should see version numbers. If not, Node.js is not installed correctly.

## Step 2: Install Dependencies

Once Node.js is installed:

```bash
npm install
```

This will install all required packages:
- React
- React Three Fiber
- Three.js
- Zustand
- Framer Motion
- Vite (build tool)

## Step 3: Start Development Server

```bash
npm run dev
```

This will:
- Start Vite dev server on `http://localhost:3000`
- Open your browser automatically
- Enable hot module replacement (instant updates)

## Step 4: See Live Updates

1. **Keep the dev server running** (don't close the terminal)
2. **Edit any file** in `src/` folder
3. **Save the file**
4. **Browser updates instantly** - no refresh needed!

## Troubleshooting

**"npm is not recognized"**
- Install Node.js from nodejs.org
- Restart terminal after installation
- Make sure Node.js is in your PATH

**Port already in use**
- Kill process on port 3000: `npx kill-port 3000`
- Or use different port: Modify `vite.config.js`

**Module not found**
- Run `npm install` again
- Delete `node_modules` folder and `package-lock.json`, then `npm install`

**Browser not updating**
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Check browser console (F12) for errors
- Restart dev server

## What You'll See

When you run `npm run dev` and open the browser, you should see:
- 3D board with tiles
- Color-coded puzzle tiles (green/yellow/red)
- Proper lighting
- Camera controls (drag to rotate, scroll to zoom)

**Try editing `src/components/Board.jsx`** - Change colors, tile size, or add features, and see updates instantly!



