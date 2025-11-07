# Deployment Guide for React Games

Complete guide to building and deploying React games to production.

## Table of Contents

- [Build Process](#build-process)
- [Hosting Options](#hosting-options)
- [Performance Optimization](#performance-optimization)
- [Environment Configuration](#environment-configuration)
- [Continuous Deployment](#continuous-deployment)

## Build Process

### Production Build

```bash
npm run build
```

Creates optimized production build in `build/` folder.

### Build Output

```
build/
├── index.html
├── static/
│   ├── css/
│   │   └── main.[hash].css
│   ├── js/
│   │   ├── main.[hash].js
│   │   └── [chunk].[hash].js
│   └── media/
│       └── [assets].[hash].[ext]
```

### Build Optimization

React automatically:
- Minifies JavaScript and CSS
- Optimizes images
- Code splitting
- Tree shaking

### Custom Build Config

For advanced configuration, create `craco.config.js`:

```js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Custom webpack config
      return webpackConfig;
    }
  }
};
```

## Hosting Options

### Vercel (Recommended)

**Installation:**
```bash
npm install -g vercel
```

**Deploy:**
```bash
vercel
```

Or connect GitHub repository:
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Deploy automatically on push

**Configuration File (`vercel.json`):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Netlify

**Installation:**
```bash
npm install -g netlify-cli
```

**Deploy:**
```bash
netlify deploy --prod --dir=build
```

**Configuration File (`netlify.toml`):**
```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages

**Installation:**
```bash
npm install --save-dev gh-pages
```

**Package.json:**
```json
{
  "homepage": "https://username.github.io/infinite-board-game",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

**Deploy:**
```bash
npm run deploy
```

### Static Hosting

**AWS S3 + CloudFront:**
1. Create S3 bucket
2. Upload `build/` contents
3. Configure static website hosting
4. Set up CloudFront distribution

**Azure Static Web Apps:**
```bash
npm install -g @azure/static-web-apps-cli
swa deploy build
```

## Performance Optimization

### Code Splitting

```jsx
import { lazy, Suspense } from 'react';

const CharacterCreator = lazy(() => import('./components/CharacterCreator'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CharacterCreator />
    </Suspense>
  );
}
```

### Asset Optimization

**Image Optimization:**
- Use WebP format
- Compress images
- Implement lazy loading

```jsx
<img
  src={imageSrc}
  loading="lazy"
  alt="Game asset"
/>
```

**Bundle Analysis:**
```bash
npm install --save-dev @next/bundle-analyzer
npm run build -- --analyze
```

### Compression

**Gzip/Brotli:**
Most hosting platforms compress automatically. For manual:

```bash
npm install --save-dev compression-webpack-plugin
```

### CDN Configuration

For static assets:
```jsx
const CDN_URL = 'https://cdn.example.com';

function Image({ src, ...props }) {
  return <img src={`${CDN_URL}${src}`} {...props} />;
}
```

## Environment Configuration

### Environment Variables

**Development (`.env.development`):**
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=development
```

**Production (`.env.production`):**
```env
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENV=production
```

**Usage:**
```jsx
const apiUrl = process.env.REACT_APP_API_URL;
```

### Build-Time Configuration

```jsx
// config.js
const config = {
  development: {
    apiUrl: 'http://localhost:3001'
  },
  production: {
    apiUrl: 'https://api.example.com'
  }
};

export default config[process.env.NODE_ENV];
```

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.API_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### GitLab CI/CD

Create `.gitlab-ci.yml`:

```yaml
image: node:16

stages:
  - build
  - deploy

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - build/

deploy:
  stage: deploy
  script:
    - npm install -g vercel
    - vercel --prod --token $VERCEL_TOKEN
  only:
    - main
```

## Testing Deployment

### Local Production Build

```bash
# Build
npm run build

# Serve locally
npx serve -s build -l 3000
```

### Preview Deployment

**Vercel:**
```bash
vercel --prod
```

**Netlify:**
```bash
netlify deploy --prod --dir=build
```

## Monitoring

### Error Tracking

**Sentry:**
```bash
npm install @sentry/react
```

```jsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: process.env.NODE_ENV
});
```

### Analytics

**Google Analytics:**
```jsx
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');

function App() {
  useEffect(() => {
    ReactGA.send('pageview');
  }, []);
  
  return <div>App</div>;
}
```

---

**References:**
- [Vercel Deployment](https://vercel.com/docs)
- [Netlify Deployment](https://docs.netlify.com/)
- [GitHub Pages](https://pages.github.com/)

