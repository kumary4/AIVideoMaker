# AI Video Generation Platform

## Overview

This is a full-stack AI video generation platform built with React and Express. The application allows users to generate videos using AI based on text prompts, with subscription-based pricing tiers and credit systems. The platform integrates with Stripe for payment processing and uses PostgreSQL for data persistence.

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

### Video Generation System
- Credit-based video generation (credits deducted based on video duration)
- Multiple video styles and aspect ratios supported
- Status tracking (generating, completed, failed)
- Metadata storage including prompts, duration, and output URLs

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

## Changelog

```
Changelog:
- July 05, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```