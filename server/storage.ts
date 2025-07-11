import { users, videos, type User, type InsertUser, type Video, type InsertVideo } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCredits(userId: number, credits: number): Promise<User>;
  updateUserSubscription(userId: number, subscription: string): Promise<User>;
  updateStripeCustomerId(userId: number, customerId: string): Promise<User>;
  updateUserStripeInfo(userId: number, info: { customerId: string; subscriptionId: string }): Promise<User>;
  
  // Video methods
  createVideo(video: InsertVideo): Promise<Video>;
  getVideosByUserId(userId: number): Promise<Video[]>;
  getVideo(id: number): Promise<Video | undefined>;
  updateVideoStatus(id: number, status: string, videoUrl?: string): Promise<Video>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private videos: Map<number, Video>;
  private currentUserId: number;
  private currentVideoId: number;

  constructor() {
    this.users = new Map();
    this.videos = new Map();
    this.currentUserId = 1;
    this.currentVideoId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      credits: insertUser.credits || 0,
      subscription: insertUser.subscription || "free",
      stripeCustomerId: insertUser.stripeCustomerId || null,
      stripeSubscriptionId: insertUser.stripeSubscriptionId || null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserCredits(userId: number, credits: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    user.credits = credits;
    this.users.set(userId, user);
    return user;
  }

  async updateUserSubscription(userId: number, subscription: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    user.subscription = subscription;
    this.users.set(userId, user);
    return user;
  }

  async updateStripeCustomerId(userId: number, customerId: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    user.stripeCustomerId = customerId;
    this.users.set(userId, user);
    return user;
  }

  async updateUserStripeInfo(userId: number, info: { customerId: string; subscriptionId: string }): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    user.stripeCustomerId = info.customerId;
    user.stripeSubscriptionId = info.subscriptionId;
    this.users.set(userId, user);
    return user;
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = this.currentVideoId++;
    const video: Video = {
      ...insertVideo,
      id,
      videoUrl: insertVideo.videoUrl || null,
      thumbnailUrl: insertVideo.thumbnailUrl || null,
      createdAt: new Date()
    };
    this.videos.set(id, video);
    return video;
  }

  async getVideosByUserId(userId: number): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(
      (video) => video.userId === userId
    );
  }

  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async updateVideoStatus(id: number, status: string, videoUrl?: string): Promise<Video> {
    const video = this.videos.get(id);
    if (!video) throw new Error("Video not found");
    video.status = status;
    if (videoUrl) video.videoUrl = videoUrl;
    this.videos.set(id, video);
    return video;
  }
}

export const storage = new MemStorage();
