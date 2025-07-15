import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  credits: integer("credits").default(0).notNull(),
  subscription: text("subscription").default("free").notNull(), // free, starter, pro, enterprise
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  avatar: text("avatar"),
  role: text("role").default("user").notNull(), // user, admin, team_lead
  createdAt: timestamp("created_at").defaultNow(),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  plan: text("plan").default("free").notNull(), // free, pro, enterprise
  maxMembers: integer("max_members").default(5).notNull(),
  settings: json("settings").$type<{
    allowGuestAccess: boolean;
    requireApproval: boolean;
    defaultVideoPermissions: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  role: text("role").default("member").notNull(), // owner, admin, member, viewer
  permissions: json("permissions").$type<{
    canCreateVideos: boolean;
    canEditVideos: boolean;
    canDeleteVideos: boolean;
    canManageMembers: boolean;
    canManageTeam: boolean;
  }>(),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdById: integer("created_by_id").references(() => users.id).notNull(),
  status: text("status").default("active").notNull(), // active, archived, completed
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  teamId: integer("team_id").references(() => teams.id),
  projectId: integer("project_id").references(() => projects.id),
  title: text("title").notNull(),
  prompt: text("prompt").notNull(),
  duration: integer("duration").notNull(), // in seconds
  style: text("style").notNull(),
  aspectRatio: text("aspect_ratio").notNull(),
  status: text("status").notNull(), // generating, completed, failed
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  creditsUsed: integer("credits_used").notNull(),
  visibility: text("visibility").default("team").notNull(), // private, team, public
  createdAt: timestamp("created_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  timestamp: integer("timestamp"), // timestamp in video (seconds)
  parentId: integer("parent_id").references(() => comments.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // team_invite, video_shared, comment_added, project_update
  title: text("title").notNull(),
  message: text("message").notNull(),
  data: json("data"), // additional data for the notification
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const teamInvites = pgTable("team_invites", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  email: text("email").notNull(),
  role: text("role").default("member").notNull(),
  invitedById: integer("invited_by_id").references(() => users.id).notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
}).extend({
  credits: z.number().optional(),
  subscription: z.string().optional(),
  stripeCustomerId: z.string().optional().nullable(),
  stripeSubscriptionId: z.string().optional().nullable(),
  avatar: z.string().optional(),
  role: z.string().optional(),
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertTeamInviteSchema = createInsertSchema(teamInvites).omit({
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
  teamId: z.number().optional(),
  projectId: z.number().optional(),
});

export const teamCreationSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().optional(),
  plan: z.string().optional(),
});

export const teamInviteSchema = z.object({
  email: z.string().email(),
  role: z.string().default("member"),
});

export const commentSchema = z.object({
  content: z.string().min(1).max(500),
  timestamp: z.number().optional(),
  parentId: z.number().optional(),
});

export const projectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  dueDate: z.date().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertTeamInvite = z.infer<typeof insertTeamInviteSchema>;
export type TeamInvite = typeof teamInvites.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type VideoGenerationData = z.infer<typeof videoGenerationSchema>;
export type TeamCreationData = z.infer<typeof teamCreationSchema>;
export type TeamInviteData = z.infer<typeof teamInviteSchema>;
export type CommentData = z.infer<typeof commentSchema>;
export type ProjectData = z.infer<typeof projectSchema>;
