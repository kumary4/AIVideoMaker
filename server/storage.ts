import { 
  users, 
  videos, 
  teams, 
  teamMembers, 
  projects, 
  comments, 
  notifications, 
  teamInvites,
  type User, 
  type InsertUser, 
  type Video, 
  type InsertVideo,
  type Team,
  type InsertTeam,
  type TeamMember,
  type InsertTeamMember,
  type Project,
  type InsertProject,
  type Comment,
  type InsertComment,
  type Notification,
  type InsertNotification,
  type TeamInvite,
  type InsertTeamInvite
} from "@shared/schema";

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
  
  // Team methods
  createTeam(team: InsertTeam): Promise<Team>;
  getTeam(id: number): Promise<Team | undefined>;
  getTeamsByUserId(userId: number): Promise<Team[]>;
  updateTeam(id: number, updates: Partial<InsertTeam>): Promise<Team>;
  deleteTeam(id: number): Promise<void>;
  
  // Team member methods
  addTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  getTeamMembers(teamId: number): Promise<TeamMember[]>;
  getTeamMember(teamId: number, userId: number): Promise<TeamMember | undefined>;
  updateTeamMember(teamId: number, userId: number, updates: Partial<InsertTeamMember>): Promise<TeamMember>;
  removeTeamMember(teamId: number, userId: number): Promise<void>;
  
  // Project methods
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByTeamId(teamId: number): Promise<Project[]>;
  updateProject(id: number, updates: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;
  
  // Video methods
  createVideo(video: InsertVideo): Promise<Video>;
  getVideosByUserId(userId: number): Promise<Video[]>;
  getVideosByTeamId(teamId: number): Promise<Video[]>;
  getVideosByProjectId(projectId: number): Promise<Video[]>;
  getVideo(id: number): Promise<Video | undefined>;
  updateVideoStatus(id: number, status: string, videoUrl?: string): Promise<Video>;
  updateVideo(id: number, updates: Partial<InsertVideo>): Promise<Video>;
  deleteVideo(id: number): Promise<void>;
  
  // Comment methods
  createComment(comment: InsertComment): Promise<Comment>;
  getCommentsByVideoId(videoId: number): Promise<Comment[]>;
  updateComment(id: number, content: string): Promise<Comment>;
  deleteComment(id: number): Promise<void>;
  
  // Notification methods
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByUserId(userId: number): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<void>;
  deleteNotification(id: number): Promise<void>;
  
  // Team invite methods
  createTeamInvite(invite: InsertTeamInvite): Promise<TeamInvite>;
  getTeamInviteByToken(token: string): Promise<TeamInvite | undefined>;
  getTeamInvitesByTeamId(teamId: number): Promise<TeamInvite[]>;
  acceptTeamInvite(token: string): Promise<TeamInvite>;
  deleteTeamInvite(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private videos: Map<number, Video>;
  private teams: Map<number, Team>;
  private teamMembers: Map<number, TeamMember>;
  private projects: Map<number, Project>;
  private comments: Map<number, Comment>;
  private notifications: Map<number, Notification>;
  private teamInvites: Map<number, TeamInvite>;
  private currentUserId: number;
  private currentVideoId: number;
  private currentTeamId: number;
  private currentTeamMemberId: number;
  private currentProjectId: number;
  private currentCommentId: number;
  private currentNotificationId: number;
  private currentTeamInviteId: number;

  constructor() {
    this.users = new Map();
    this.videos = new Map();
    this.teams = new Map();
    this.teamMembers = new Map();
    this.projects = new Map();
    this.comments = new Map();
    this.notifications = new Map();
    this.teamInvites = new Map();
    this.currentUserId = 1;
    this.currentVideoId = 1;
    this.currentTeamId = 1;
    this.currentTeamMemberId = 1;
    this.currentProjectId = 1;
    this.currentCommentId = 1;
    this.currentNotificationId = 1;
    this.currentTeamInviteId = 1;
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
      avatar: insertUser.avatar || null,
      role: insertUser.role || "user",
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
      teamId: insertVideo.teamId || null,
      projectId: insertVideo.projectId || null,
      videoUrl: insertVideo.videoUrl || null,
      thumbnailUrl: insertVideo.thumbnailUrl || null,
      visibility: insertVideo.visibility || "team",
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

  // Team methods
  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const id = this.currentTeamId++;
    const team: Team = {
      ...insertTeam,
      id,
      plan: insertTeam.plan || "free",
      maxMembers: insertTeam.maxMembers || 5,
      settings: insertTeam.settings || null,
      createdAt: new Date(),
    };
    this.teams.set(id, team);
    
    // Add owner as admin member
    await this.addTeamMember({
      teamId: id,
      userId: insertTeam.ownerId,
      role: "owner",
      permissions: {
        canCreateVideos: true,
        canEditVideos: true,
        canDeleteVideos: true,
        canManageMembers: true,
        canManageTeam: true,
      },
    });
    
    return team;
  }

  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }

  async getTeamsByUserId(userId: number): Promise<Team[]> {
    const userTeamMemberships = Array.from(this.teamMembers.values()).filter(
      (member) => member.userId === userId
    );
    const teams: Team[] = [];
    for (const membership of userTeamMemberships) {
      const team = this.teams.get(membership.teamId);
      if (team) teams.push(team);
    }
    return teams;
  }

  async updateTeam(id: number, updates: Partial<InsertTeam>): Promise<Team> {
    const team = this.teams.get(id);
    if (!team) throw new Error("Team not found");
    
    Object.assign(team, updates);
    this.teams.set(id, team);
    return team;
  }

  async deleteTeam(id: number): Promise<void> {
    this.teams.delete(id);
    // Remove all team members
    const membersToRemove = Array.from(this.teamMembers.values()).filter(
      (member) => member.teamId === id
    );
    for (const member of membersToRemove) {
      this.teamMembers.delete(member.id);
    }
    // Remove all projects
    const projectsToRemove = Array.from(this.projects.values()).filter(
      (project) => project.teamId === id
    );
    for (const project of projectsToRemove) {
      this.projects.delete(project.id);
    }
  }

  // Team member methods
  async addTeamMember(insertTeamMember: InsertTeamMember): Promise<TeamMember> {
    const id = this.currentTeamMemberId++;
    const teamMember: TeamMember = {
      ...insertTeamMember,
      id,
      role: insertTeamMember.role || "member",
      permissions: insertTeamMember.permissions || {
        canCreateVideos: true,
        canEditVideos: false,
        canDeleteVideos: false,
        canManageMembers: false,
        canManageTeam: false,
      },
      joinedAt: new Date(),
    };
    this.teamMembers.set(id, teamMember);
    return teamMember;
  }

  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values()).filter(
      (member) => member.teamId === teamId
    );
  }

  async getTeamMember(teamId: number, userId: number): Promise<TeamMember | undefined> {
    return Array.from(this.teamMembers.values()).find(
      (member) => member.teamId === teamId && member.userId === userId
    );
  }

  async updateTeamMember(teamId: number, userId: number, updates: Partial<InsertTeamMember>): Promise<TeamMember> {
    const member = await this.getTeamMember(teamId, userId);
    if (!member) throw new Error("Team member not found");
    
    Object.assign(member, updates);
    this.teamMembers.set(member.id, member);
    return member;
  }

  async removeTeamMember(teamId: number, userId: number): Promise<void> {
    const member = await this.getTeamMember(teamId, userId);
    if (member) {
      this.teamMembers.delete(member.id);
    }
  }

  // Project methods
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const project: Project = {
      ...insertProject,
      id,
      status: insertProject.status || "active",
      dueDate: insertProject.dueDate || null,
      createdAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByTeamId(teamId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.teamId === teamId
    );
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project> {
    const project = this.projects.get(id);
    if (!project) throw new Error("Project not found");
    
    Object.assign(project, updates);
    this.projects.set(id, project);
    return project;
  }

  async deleteProject(id: number): Promise<void> {
    this.projects.delete(id);
  }

  // Enhanced video methods
  async getVideosByTeamId(teamId: number): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(
      (video) => video.teamId === teamId
    );
  }

  async getVideosByProjectId(projectId: number): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(
      (video) => video.projectId === projectId
    );
  }

  async updateVideo(id: number, updates: Partial<InsertVideo>): Promise<Video> {
    const video = this.videos.get(id);
    if (!video) throw new Error("Video not found");
    
    Object.assign(video, updates);
    this.videos.set(id, video);
    return video;
  }

  async deleteVideo(id: number): Promise<void> {
    this.videos.delete(id);
  }

  // Comment methods
  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentCommentId++;
    const comment: Comment = {
      ...insertComment,
      id,
      timestamp: insertComment.timestamp || null,
      parentId: insertComment.parentId || null,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);
    return comment;
  }

  async getCommentsByVideoId(videoId: number): Promise<Comment[]> {
    return Array.from(this.comments.values()).filter(
      (comment) => comment.videoId === videoId
    );
  }

  async updateComment(id: number, content: string): Promise<Comment> {
    const comment = this.comments.get(id);
    if (!comment) throw new Error("Comment not found");
    
    comment.content = content;
    this.comments.set(id, comment);
    return comment;
  }

  async deleteComment(id: number): Promise<void> {
    this.comments.delete(id);
  }

  // Notification methods
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.currentNotificationId++;
    const notification: Notification = {
      ...insertNotification,
      id,
      data: insertNotification.data || null,
      read: insertNotification.read || false,
      createdAt: new Date(),
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(
      (notification) => notification.userId === userId
    );
  }

  async markNotificationAsRead(id: number): Promise<void> {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.read = true;
      this.notifications.set(id, notification);
    }
  }

  async deleteNotification(id: number): Promise<void> {
    this.notifications.delete(id);
  }

  // Team invite methods
  async createTeamInvite(insertTeamInvite: InsertTeamInvite): Promise<TeamInvite> {
    const id = this.currentTeamInviteId++;
    const teamInvite: TeamInvite = {
      ...insertTeamInvite,
      id,
      role: insertTeamInvite.role || "member",
      acceptedAt: insertTeamInvite.acceptedAt || null,
      createdAt: new Date(),
    };
    this.teamInvites.set(id, teamInvite);
    return teamInvite;
  }

  async getTeamInviteByToken(token: string): Promise<TeamInvite | undefined> {
    return Array.from(this.teamInvites.values()).find(
      (invite) => invite.token === token
    );
  }

  async getTeamInvitesByTeamId(teamId: number): Promise<TeamInvite[]> {
    return Array.from(this.teamInvites.values()).filter(
      (invite) => invite.teamId === teamId
    );
  }

  async acceptTeamInvite(token: string): Promise<TeamInvite> {
    const invite = await this.getTeamInviteByToken(token);
    if (!invite) throw new Error("Team invite not found");
    
    invite.acceptedAt = new Date();
    this.teamInvites.set(invite.id, invite);
    return invite;
  }

  async deleteTeamInvite(id: number): Promise<void> {
    this.teamInvites.delete(id);
  }
}

export const storage = new MemStorage();
