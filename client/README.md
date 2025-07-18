# Client (Frontend) Directory

This directory contains the React frontend application for the AI Video Generation Platform.

## Key Components

### Core Pages
- `pages/landing.tsx` - Main landing page with hero section and showcase
- `pages/premium-dashboard.tsx` - Main dashboard for authenticated users
- `pages/teams.tsx` - Team collaboration interface

### Main Components
- `components/enhanced-video-generator.tsx` - Advanced video creation interface
- `components/advanced-video-editor.tsx` - Timeline-based video editor
- `components/ai-model-selector.tsx` - AI model selection interface
- `components/video-showcase-gallery.tsx` - Video gallery with filtering
- `components/dynamic-hero.tsx` - Animated landing page hero

### UI Components
The `components/ui/` directory contains 40+ shadcn/ui components providing:
- Form controls (Button, Input, Select, etc.)
- Layout components (Card, Sheet, Dialog, etc.)
- Data display (Table, Chart, Progress, etc.)
- Feedback components (Toast, Alert, etc.)

## Structure

```
client/
├── src/
│   ├── components/        # Reusable components
│   │   ├── ui/           # shadcn/ui component library
│   │   └── *.tsx         # Custom application components
│   ├── pages/            # Page components for routing
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and configurations
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles and theme
├── index.html            # HTML template
└── README.md            # This file
```

## Key Features

- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first styling with custom design system
- **React Query**: Server state management and caching
- **Wouter**: Lightweight client-side routing
- **Responsive Design**: Mobile-first approach with breakpoints
- **Dark Theme**: Professional dark theme with glass morphism effects

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The client is configured to work with the Express backend on the same port via Vite proxy configuration.