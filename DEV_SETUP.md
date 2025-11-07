# React Game Development - Quick Start

## Development Setup

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

This will:
- Start Vite development server on `http://localhost:3000`
- Open browser automatically
- Enable hot module replacement (HMR) for instant updates
- Watch for file changes and reload automatically

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── main.jsx          # Entry point
├── App.jsx           # Main app component
├── App.css           # App styles
├── index.css         # Global styles
└── components/
    └── Board.jsx     # 3D board component
```

## Live Updates

The development server uses Vite's HMR (Hot Module Replacement):
- **Save any file** → Browser updates instantly
- **No page refresh needed** for most changes
- **State preserved** during updates
- **Fast reload** for quick iteration

## Making Changes

1. Edit any file in `src/`
2. Save the file
3. See changes instantly in browser
4. Console shows update status

## Troubleshooting

**Port already in use:**
```bash
# Kill process on port 3000
npx kill-port 3000
```

**Module not found:**
```bash
npm install
```

**Browser not updating:**
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Check browser console for errors
- Restart dev server: Stop (Ctrl+C) and run `npm run dev` again

## Next Steps

- Edit `src/components/Board.jsx` to customize the board
- Add more components in `src/components/`
- Modify colors, sizes, or add features
- See changes instantly in browser!



