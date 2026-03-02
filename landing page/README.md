# Sentinals - Inventory Risk Intelligence

**Know before it costs you.** Trust matters more than speed.

Sentinals is an inventory risk intelligence platform that surfaces what matters early—so you can act with clarity, not urgency.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Local Development

```sh
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📦 Building for Production

```sh
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist` folder.

## 🚢 Deployment

### Deploy to Vercel (Recommended)

#### Option 1: Vercel CLI

```sh
# Install Vercel CLI globally
npm install -g vercel

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

#### Option 2: GitHub Integration

1. Push your code to a GitHub repository
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will automatically detect the Vite configuration
5. Click "Deploy"

Your site will be live with automatic deployments on every push!

### Deploy to Netlify

```sh
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Deploy to Other Platforms

This is a standard Vite + React application. To deploy to any hosting platform:

1. Build the project: `npm run build`
2. Upload the contents of the `dist` folder to your hosting provider
3. Ensure your server is configured to redirect all routes to `index.html` (for SPA routing)

## 🛠️ Tech Stack

- **Framework**: [Vite](https://vitejs.dev/) - Next generation frontend tooling
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **UI Library**: [React 18](https://react.dev/) - Component-based UI
- **Components**: [shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- **Routing**: [React Router](https://reactrouter.com/) - Client-side routing
- **State Management**: [TanStack Query](https://tanstack.com/query) - Server state management

## 📁 Project Structure

```
sentinals-landing/
├── public/              # Static assets
│   ├── favicon.ico      # Sentinals favicon
│   ├── favicon-192.png  # PWA icon (192x192)
│   ├── favicon-512.png  # PWA icon (512x512)
│   ├── favicon.svg      # SVG favicon
│   ├── og-image.png     # Open Graph/social media image
│   └── manifest.json    # PWA manifest
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── lib/            # Utilities
│   └── App.tsx         # Main app component
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
└── vercel.json         # Vercel deployment config
```

## 🧪 Testing

```sh
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint
```

## 📝 License

Copyright © 2026 Sentinals. All rights reserved.

## 🔗 Links

- **Website**: [Coming Soon]
- **Documentation**: [Coming Soon]
- **Support**: [Coming Soon]
