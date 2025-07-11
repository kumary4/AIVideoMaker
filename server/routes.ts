import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, videoGenerationSchema } from "@shared/schema";
import { klingAI } from "./kling-ai";
import Stripe from "stripe";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      email: string;
      credits: number;
      subscription: string;
      stripeCustomerId: string | null;
      stripeSubscriptionId: string | null;
    }
  }
}

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Enhanced Kling AI integration with proper error handling
async function generateVideoWithKlingAI(video: any, videoData: any) {
  try {
    console.log(`Starting video generation for video ID ${video.id}`);
    
    // Call Kling AI service
    const response = await klingAI.generateVideo({
      prompt: videoData.prompt,
      duration: videoData.duration,
      style: videoData.style,
      aspectRatio: videoData.aspectRatio
    });

    if (response.status === 'completed') {
      // Video completed immediately (unlikely but possible)
      await storage.updateVideoStatus(video.id, "completed", response.videoUrl);
      console.log(`Video ${video.id} completed immediately`);
    } else if (response.status === 'processing') {
      // Start polling for completion
      pollVideoCompletion(video.id, response.taskId);
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
    
  } catch (error) {
    console.error(`Kling AI generation failed for video ${video.id}:`, error);
    await storage.updateVideoStatus(video.id, "failed");
  }
}

// Poll for video completion status (background)
async function pollVideoCompletion(videoId: number, taskId: string) {
  const maxPollingTime = 300000; // 5 minutes
  const pollingInterval = 10000; // 10 seconds
  const startTime = Date.now();

  const poll = async () => {
    try {
      if (Date.now() - startTime > maxPollingTime) {
        console.log(`Polling timeout for video ${videoId}`);
        await storage.updateVideoStatus(videoId, "failed");
        return;
      }

      const status = await klingAI.checkTaskStatus(taskId);
      
      if (status.status === 'completed') {
        await storage.updateVideoStatus(videoId, "completed", status.videoUrl);
        console.log(`Video ${videoId} completed successfully`);
      } else if (status.status === 'failed') {
        await storage.updateVideoStatus(videoId, "failed");
        console.log(`Video ${videoId} generation failed`);
      } else {
        // Continue polling
        setTimeout(poll, pollingInterval);
      }
    } catch (error) {
      console.error(`Polling error for video ${videoId}:`, error);
      await storage.updateVideoStatus(videoId, "failed");
    }
  };

  // Start polling after initial delay
  setTimeout(poll, pollingInterval);
}

// Synchronous polling for immediate response
async function pollVideoCompletionSync(videoId: number, taskId: string, res: any) {
  const maxPollingTime = 120000; // 2 minutes for sync
  const pollingInterval = 5000; // 5 seconds
  const startTime = Date.now();

  while (Date.now() - startTime < maxPollingTime) {
    try {
      const status = await klingAI.checkTaskStatus(taskId);
      
      if (status.status === 'completed') {
        const updatedVideo = await storage.updateVideoStatus(videoId, "completed", status.videoUrl);
        console.log(`Video ${videoId} completed successfully`);
        return res.json(updatedVideo);
      } else if (status.status === 'failed') {
        await storage.updateVideoStatus(videoId, "failed");
        console.log(`Video ${videoId} generation failed`);
        return res.status(500).json({ message: "Video generation failed" });
      }
      
      // Wait before next check
      await new Promise(resolve => setTimeout(resolve, pollingInterval));
    } catch (error) {
      console.error(`Polling error for video ${videoId}:`, error);
      await storage.updateVideoStatus(videoId, "failed");
      return res.status(500).json({ message: "Video generation failed" });
    }
  }

  // Timeout - continue with background polling
  console.log(`Sync polling timeout for video ${videoId}, continuing in background`);
  pollVideoCompletion(videoId, taskId);
  
  const video = await storage.getVideo(videoId);
  res.json(video);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true in production with HTTPS
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Passport configuration - support both username and email login
  passport.use(new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    async (usernameOrEmail, password, done) => {
      try {
        // Try to find user by username first, then by email
        let user = await storage.getUserByUsername(usernameOrEmail);
        if (!user) {
          user = await storage.getUserByEmail(usernameOrEmail);
        }
        
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid password' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Auth routes
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;

      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed" });
        }
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/me", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = req.user!;
    const { password, ...userWithoutPassword } = user as any;
    res.json(userWithoutPassword);
  });

  // Video generation routes
  app.post("/api/generate-video", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const videoData = videoGenerationSchema.parse(req.body);
      const user = req.user!;

      // Calculate credits needed based on duration
      const creditsNeeded = Math.ceil(videoData.duration / 30);
      
      if (user.credits < creditsNeeded) {
        return res.status(400).json({ message: "Insufficient credits" });
      }

      // Create video record
      const video = await storage.createVideo({
        userId: user.id,
        title: `Video from "${videoData.prompt.substring(0, 50)}..."`,
        prompt: videoData.prompt,
        duration: videoData.duration,
        style: videoData.style,
        aspectRatio: videoData.aspectRatio,
        status: "generating",
        videoUrl: null,
        thumbnailUrl: null,
        creditsUsed: creditsNeeded
      });

      // Deduct credits
      await storage.updateUserCredits(user.id, user.credits - creditsNeeded);

      // Integrate with Kling AI API and wait for completion
      try {
        const response = await klingAI.generateVideo({
          prompt: videoData.prompt,
          duration: videoData.duration,
          style: videoData.style,
          aspectRatio: videoData.aspectRatio,
        });

        if (response.status === 'completed') {
          // Video completed immediately
          const updatedVideo = await storage.updateVideoStatus(video.id, "completed", response.videoUrl);
          res.json(updatedVideo);
        } else {
          // Start polling for completion
          const taskId = response.taskId;
          await pollVideoCompletionSync(video.id, taskId, res);
        }
      } catch (error) {
        console.error('Kling AI integration error:', error);
        await storage.updateVideoStatus(video.id, "failed");
        res.status(500).json({ message: "Video generation failed" });
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/videos", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const videos = await storage.getVideosByUserId(req.user!.id);
      res.json(videos);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/videos/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const video = await storage.getVideo(parseInt(req.params.id));
      if (!video || video.userId !== req.user!.id) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Subscription routes
  app.post('/api/get-or-create-subscription', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    let user = req.user!;
    const { priceId } = req.body;

    // For now, return a success message for subscription setup
    // In production, you would need to set up actual Stripe Price IDs
    try {
      // Simulate subscription creation for development
      console.log(`Creating subscription for user ${user.username} with price ${priceId}`);
      
      // Return a mock response for development
      res.json({
        message: "Subscription feature is in development mode",
        redirectUrl: "/dashboard",
        success: true
      });
      
    } catch (error: any) {
      console.error('Subscription error:', error);
      res.status(400).json({ 
        message: "Subscription feature is currently in development. Please check back later or contact support.",
        redirectUrl: "/dashboard"
      });
    }
  });

  // Stripe webhook for handling subscription updates
  app.post('/api/stripe-webhook', async (req, res) => {
    const event = req.body;

    try {
      switch (event.type) {
        case 'invoice.payment_succeeded':
          const subscription = await stripe.subscriptions.retrieve(event.data.object.subscription);
          // Update user subscription status and credits
          // Implementation depends on your pricing tiers
          break;
        
        case 'customer.subscription.deleted':
          // Handle subscription cancellation
          break;
        
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
