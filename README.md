# AI Video Generation Platform

A professional AI-powered video generation platform built with React and Express, featuring multiple AI models, team collaboration, and subscription-based monetization.

## 🚀 Live Demo

- **Deployed App**: [ai-video-maker-shipdynamicssho.replit.app](https://ai-video-maker-shipdynamicssho.replit.app)
- **Replit Project**: [View on Replit](https://replit.com/@shipdynamicssho/ai-video-maker)

## ✨ Features

### 🎬 Video Generation
- **Multiple AI Models**: Kling AI, Runway ML, and other cutting-edge video generation models
- **Professional Templates**: Hundreds of pre-made templates for various industries
- **Custom Styling**: Complete control over visual style, aspect ratio, and duration
- **Real-time Preview**: Live preview of video generation progress

### 🎨 Advanced Editing
- **Timeline Editor**: Professional timeline-based video editing interface
- **Effects & Transitions**: Rich library of visual effects and smooth transitions
- **Multi-track Support**: Audio, video, and text track management
- **Export Options**: Multiple format and quality export options

### 👥 Team Collaboration
- **Team Workspaces**: Create and manage team projects
- **Member Management**: Invite team members with role-based permissions
- **Project Sharing**: Share videos and collaborate on projects
- **Real-time Updates**: Live collaboration features

### 💳 Monetization
- **Subscription Plans**: Multiple tiers (Starter, Professional, Enterprise)
- **Stripe Integration**: Secure payment processing
- **Credit System**: Pay-per-use model with credit allocation
- **Team Billing**: Centralized billing for team accounts

### 🎯 Smart Features
- **AI Recommendations**: Intelligent content and template suggestions
- **Cost Optimization**: Automatic API selection for best value
- **Mobile Responsive**: Fully responsive design for all devices
- **Dark Theme**: Professional dark theme with glass morphism effects

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **TanStack Query** for server state management
- **Wouter** for client-side routing
- **Framer Motion** for animations

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Drizzle ORM
- **Passport.js** for authentication
- **Stripe** for payment processing
- **WebSocket** for real-time features

### Infrastructure
- **Replit** for hosting and deployment
- **Neon PostgreSQL** for database
- **Vite** for build tooling
- **ESBuild** for server bundling

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Express backend
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Database operations
│   └── kling-ai.ts         # AI service integration
├── shared/                 # Shared TypeScript types
│   └── schema.ts           # Database schema and types
└── docs/                   # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe account for payments
- AI API keys (Kling AI, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/[username]/ai-video-generation-platform.git
   cd ai-video-generation-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Authentication
SESSION_SECRET=your-session-secret

# Stripe
STRIPE_SECRET_KEY=sk_...
VITE_STRIPE_PUBLIC_KEY=pk_...

# AI Services
PIAPI_KEY=your-piapi-key
KLING_AI_API_KEY=your-kling-api-key
```

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

### Video Generation
- `POST /api/videos/generate` - Generate new video
- `GET /api/videos` - List user videos
- `GET /api/videos/:id` - Get specific video
- `DELETE /api/videos/:id` - Delete video

### Team Management
- `POST /api/teams` - Create team
- `GET /api/teams` - List user teams
- `POST /api/teams/:id/members` - Add team member
- `DELETE /api/teams/:id/members/:userId` - Remove member

## 🎨 Design System

The platform uses a professional dark theme inspired by industry leaders like Veed.io and Higgsfield.ai:

- **Primary Color**: Purple gradient (#8B5CF6 to #C084FC)
- **Background**: Dark with subtle gradients
- **Glass Morphism**: Translucent cards with backdrop blur
- **Animations**: Smooth floating and fade effects
- **Typography**: Inter font family for readability

## 📊 Performance

- **Bundle Size**: Optimized with tree shaking and code splitting
- **Loading Speed**: Lazy loading for components and routes
- **API Efficiency**: Intelligent caching and request batching
- **Cost Optimization**: 90% cheaper than competitors (PiAPI vs Replicate)

## 🔒 Security

- **Authentication**: Secure session-based auth with Passport.js
- **Payment Security**: PCI-compliant Stripe integration
- **API Security**: Rate limiting and input validation
- **Data Protection**: Encrypted sensitive data storage

## 🚀 Deployment

### Replit Deployment (Recommended)
1. Import project to Replit
2. Configure environment variables
3. Click "Deploy" button
4. Your app will be live at `[app-name].replit.app`

### Manual Deployment
1. Build the project: `npm run build`
2. Set up PostgreSQL database
3. Configure environment variables
4. Start the server: `npm start`

## 📈 Roadmap

- [ ] Video editing timeline enhancements
- [ ] More AI model integrations
- [ ] Advanced team permissions
- [ ] API rate limiting dashboard
- [ ] Video analytics and insights
- [ ] Custom domain support
- [ ] White-label solutions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [View Docs](./docs/)
- **Issues**: [GitHub Issues](https://github.com/[username]/ai-video-generation-platform/issues)
- **Email**: support@[yourdomain].com

## 🌟 Acknowledgments

- **Kling AI** for video generation technology
- **Stripe** for payment processing
- **Replit** for hosting and deployment
- **shadcn/ui** for beautiful components
- **Tailwind CSS** for styling system

---

Built with ❤️ by [Your Name]