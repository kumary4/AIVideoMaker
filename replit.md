# AI Video Generation Platform

## Overview

This is a full-stack AI video generation platform similar to InVideo, built with React and Express. The application allows users to generate professional videos using Kling AI technology based on text prompts, with subscription-based pricing tiers and credit systems. The platform integrates with Stripe for payment processing and includes comprehensive monetization features.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with local strategy and express-session
- **Payment Processing**: Stripe integration for subscriptions
- **Password Security**: bcrypt for password hashing

### Database Design
- **Users Table**: Stores user credentials, credits, subscription status, and Stripe customer information
- **Videos Table**: Tracks video generation requests with metadata like prompts, status, and URLs
- **ORM**: Drizzle ORM for type-safe database operations with PostgreSQL dialect

## Key Components

### Authentication System
- Local authentication using Passport.js
- Session-based authentication with express-session
- Password hashing with bcrypt
- User registration and login endpoints

### Kling AI Video Generation System
- **Kling AI Integration**: Professional video generation using Kling AI API
- **Simulation Mode**: Development-friendly mode with mock generation for testing
- **Production Mode**: Real Kling AI API integration when credentials are provided
- **Async Processing**: Videos generated asynchronously with automatic status polling
- **Credit System**: Credits deducted based on video duration (1 credit = 30 seconds)
- **Multiple Styles**: Cinematic, documentary, animation, commercial, educational, creative
- **Aspect Ratios**: 16:9, 9:16, 1:1, 4:3 for different platforms
- **Duration Control**: 15 seconds to 3 minutes
- **Status Tracking**: Real-time status updates (generating, completed, failed)
- **Error Handling**: Automatic fallback to simulation if API fails

### Subscription Management
- Stripe integration for payment processing
- Multiple subscription tiers (free, starter, pro, enterprise)
- Credit allocation based on subscription level
- Customer and subscription ID tracking

### UI Component Library
- Complete shadcn/ui component library implementation
- Responsive design with Tailwind CSS
- Dark mode support with CSS variables
- Accessible components using Radix UI primitives

## Data Flow

1. **User Registration/Login**: Users create accounts or authenticate through Passport.js
2. **Video Generation Request**: Authenticated users submit prompts with generation parameters
3. **Credit Validation**: System checks user credits before processing
4. **Video Processing**: Request queued for AI processing (integration point for AI services)
5. **Status Updates**: Video status tracked through completion
6. **Subscription Management**: Stripe webhooks handle subscription updates and credit allocation

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL (via @neondatabase/serverless)
- **Payment Processing**: Stripe (client and server SDKs)
- **UI Components**: Radix UI primitives for accessibility
- **Authentication**: Passport.js ecosystem

### Development Tools
- **Database Migrations**: Drizzle Kit for schema management
- **Type Safety**: TypeScript with strict configuration
- **Build Process**: Vite with React plugin and ESBuild for server bundling

## Deployment Strategy

### Build Process
- Frontend: Vite builds client assets to `dist/public`
- Backend: ESBuild bundles server code to `dist/index.js`
- Database: Drizzle migrations applied via `db:push` command

### Environment Configuration
- Development: `NODE_ENV=development` with Vite dev server
- Production: `NODE_ENV=production` with static file serving
- Required environment variables:
  - `DATABASE_URL`: PostgreSQL connection string
  - `STRIPE_SECRET_KEY`: Stripe server-side key
  - `VITE_STRIPE_PUBLIC_KEY`: Stripe client-side key
  - `SESSION_SECRET`: Session encryption key

### Server Architecture
- Express server handles both API routes and static file serving
- Development: Vite middleware for hot module replacement
- Production: Static file serving from `dist/public`
- API routes prefixed with `/api` for clear separation

## Cost Analysis & Recommendations

### Video Generation API Costs (per 5-second video):
- **Replicate Kling AI**: $1.40 (extremely expensive)
- **PiAPI Kling**: $0.13 (90% cheaper than Replicate)
- **Hailuo AI**: $0.015 (93x cheaper than Replicate)
- **Direct Kling AI**: $6.99/month subscription

### Recommendation: 
Switch to Hailuo AI for production use - offers best cost-efficiency at $0.015 per video with unlimited free trial period.

## Changelog

```
Changelog:
- July 05, 2025. Initial setup
- July 05, 2025. Completed AI video generation platform with Kling AI integration
  * Built complete InVideo-style interface with professional design
  * Integrated Kling AI API with simulation and production modes
  * Added comprehensive user authentication and credit system
  * Implemented Stripe payment processing for subscriptions
  * Created dashboard for video management and analytics
  * Added error handling and user guidance for authentication flow
  * Set up proper TypeScript types and async video processing
- July 05, 2025. Successfully tested real video generation via Replicate
  * Fixed API integration issues and achieved real video generation
  * Discovered Replicate pricing is extremely expensive ($1.40 per 5-second video)
  * Researched cost-effective alternatives (Hailuo AI 93x cheaper)
  * Platform fully functional and ready for alternative API integration
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```