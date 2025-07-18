# Claude AI Sharing Guide

This guide helps you share this project with Claude AI efficiently, avoiding size limitations.

## Option 1: Share Core Files Only (Recommended)

Instead of sharing the entire repository, share these essential files:

### Core Architecture Files
```
📁 Essential Files for Claude AI
├── replit.md                     # Project overview and architecture
├── README.md                     # Complete project documentation
├── package.json                  # Dependencies and scripts
├── shared/schema.ts              # Database schema and types
├── server/routes.ts              # API routes and business logic
├── server/storage.ts             # Database operations
├── server/kling-ai.ts           # AI service integration
└── .env.example                  # Environment variables template
```

### Key Frontend Components (Select 3-5)
```
├── client/src/App.tsx                           # Main app structure
├── client/src/pages/landing.tsx                 # Landing page
├── client/src/components/enhanced-video-generator.tsx  # Main generator
├── client/src/components/advanced-video-editor.tsx     # Video editor
└── client/src/index.css                         # Styling and theme
```

## Option 2: Create Focused Repository

Create a smaller repository with just the core functionality:

1. **Create new repository** with these folders:
   - `core/` (essential backend files)
   - `frontend-samples/` (key React components)
   - `docs/` (documentation)

2. **Total size**: ~50KB instead of 700KB+

## Option 3: GitHub Gist Approach

For specific features, create GitHub Gists:

- **Database Schema**: `shared/schema.ts`
- **API Routes**: `server/routes.ts` 
- **Main Component**: `client/src/components/enhanced-video-generator.tsx`
- **Project Overview**: `replit.md`

## What to Exclude for Claude AI

❌ **Too Large / Unnecessary:**
- `client/src/components/ui/` (40+ UI components)
- `node_modules/` (dependencies)
- Build artifacts and cache files
- Test files and development assets

✅ **Essential for Understanding:**
- Project architecture documentation
- Database schema and types
- API route definitions
- Core business logic
- 2-3 main React components
- Environment configuration

## Quick Commands

```bash
# Create minimal core files archive
tar -czf project-core.tar.gz \
  replit.md README.md package.json \
  shared/ server/ \
  client/src/App.tsx \
  client/src/pages/landing.tsx \
  client/src/components/enhanced-video-generator.tsx \
  client/src/index.css

# Check archive size (should be < 100KB)
ls -lh project-core.tar.gz
```

## Claude AI Instructions

When sharing with Claude AI, provide this context:

```
This is an AI video generation platform built with:
- React + TypeScript frontend
- Express + PostgreSQL backend  
- Stripe payments + Kling AI integration
- Team collaboration features

Key files included:
- replit.md: Complete project overview
- shared/schema.ts: Database schema
- server/routes.ts: API endpoints
- [list specific components shared]

Please help me with: [specific request]
```

This approach ensures Claude AI can understand your project without hitting size limitations!