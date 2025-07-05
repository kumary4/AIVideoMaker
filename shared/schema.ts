import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  credits: integer("credits").default(5).notNull(),
  subscription: text("subscription").default("free").notNull(), // free, starter, pro, enterprise
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  prompt: text("prompt").notNull(),
  duration: integer("duration").notNull(), // in seconds
  style: text("style").notNull(),
  aspectRatio: text("aspect_ratio").notNull(),
  status: text("status").notNull(), // generating, completed, failed
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  creditsUsed: integer("credits_used").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  credits: true,
  createdAt: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const videoGenerationSchema = z.object({
  prompt: z.string().min(10).max(1000),
  duration: z.number().min(5).max(10), // Kling AI supports 5 or 10 seconds
  style: z.string(),
  aspectRatio: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type VideoGenerationData = z.infer<typeof videoGenerationSchema>;
