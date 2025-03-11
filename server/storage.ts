import { 
  User, InsertUser, users,
  VentureIdea, InsertVentureIdea, ventureIdeas, 
  StageContent, InsertStageContent, stageContents,
  ChatMessage, InsertChatMessage, chatMessages,
  Report, InsertReport, reports, Stage
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Venture idea management
  getVentureIdeas(userId: number): Promise<VentureIdea[]>;
  getVentureIdea(id: number): Promise<VentureIdea | undefined>;
  createVentureIdea(idea: InsertVentureIdea): Promise<VentureIdea>;
  updateVentureIdea(id: number, updates: Partial<VentureIdea>): Promise<VentureIdea | undefined>;
  deleteVentureIdea(id: number): Promise<boolean>;
  
  // Stage content management
  getStageContent(ventureId: number, stage: string): Promise<StageContent | undefined>;
  getAllStageContents(ventureId: number): Promise<StageContent[]>;
  createStageContent(content: InsertStageContent): Promise<StageContent>;
  updateStageContent(id: number, updates: Partial<StageContent>): Promise<StageContent | undefined>;
  
  // Chat messages
  getChatMessages(ventureId: number, stage: string): Promise<ChatMessage[]>;
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Reports
  getReport(ventureId: number): Promise<Report | undefined>;
  createReport(report: InsertReport): Promise<Report>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private ventureIdeas: Map<number, VentureIdea>;
  private stageContents: Map<string, StageContent>; // key is ventureId:stage
  private chatMessages: Map<string, ChatMessage[]>; // key is ventureId:stage
  private reports: Map<number, Report>; // key is ventureId
  
  private userCurrentId: number;
  private ventureCurrentId: number;
  private stageContentCurrentId: number;
  private chatMessageCurrentId: number;
  private reportCurrentId: number;

  constructor() {
    this.users = new Map();
    this.ventureIdeas = new Map();
    this.stageContents = new Map();
    this.chatMessages = new Map();
    this.reports = new Map();
    
    this.userCurrentId = 1;
    this.ventureCurrentId = 1;
    this.stageContentCurrentId = 1;
    this.chatMessageCurrentId = 1;
    this.reportCurrentId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Venture idea methods
  async getVentureIdeas(userId: number): Promise<VentureIdea[]> {
    return Array.from(this.ventureIdeas.values()).filter(
      (idea) => idea.userId === userId
    );
  }

  async getVentureIdea(id: number): Promise<VentureIdea | undefined> {
    return this.ventureIdeas.get(id);
  }

  async createVentureIdea(idea: InsertVentureIdea): Promise<VentureIdea> {
    const id = this.ventureCurrentId++;
    const now = new Date();
    const ventureIdea: VentureIdea = { 
      ...idea, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.ventureIdeas.set(id, ventureIdea);
    return ventureIdea;
  }

  async updateVentureIdea(id: number, updates: Partial<VentureIdea>): Promise<VentureIdea | undefined> {
    const ventureIdea = this.ventureIdeas.get(id);
    if (!ventureIdea) return undefined;
    
    const updatedIdea = { 
      ...ventureIdea, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.ventureIdeas.set(id, updatedIdea);
    return updatedIdea;
  }

  async deleteVentureIdea(id: number): Promise<boolean> {
    return this.ventureIdeas.delete(id);
  }

  // Stage content methods
  async getStageContent(ventureId: number, stage: string): Promise<StageContent | undefined> {
    const key = `${ventureId}:${stage}`;
    return this.stageContents.get(key);
  }

  async getAllStageContents(ventureId: number): Promise<StageContent[]> {
    return Array.from(this.stageContents.values()).filter(
      (content) => content.ventureId === ventureId
    );
  }

  async createStageContent(content: InsertStageContent): Promise<StageContent> {
    const id = this.stageContentCurrentId++;
    const now = new Date();
    
    const stageContent: StageContent = {
      ...content,
      id,
      updatedAt: now
    };
    
    const key = `${content.ventureId}:${content.stage}`;
    this.stageContents.set(key, stageContent);
    return stageContent;
  }

  async updateStageContent(id: number, updates: Partial<StageContent>): Promise<StageContent | undefined> {
    // First find the content by id
    const allContents = Array.from(this.stageContents.values());
    const contentIndex = allContents.findIndex(content => content.id === id);
    
    if (contentIndex === -1) return undefined;
    
    const content = allContents[contentIndex];
    const key = `${content.ventureId}:${content.stage}`;
    
    const updatedContent: StageContent = {
      ...content,
      ...updates,
      updatedAt: new Date()
    };
    
    this.stageContents.set(key, updatedContent);
    return updatedContent;
  }

  // Chat message methods
  async getChatMessages(ventureId: number, stage: string): Promise<ChatMessage[]> {
    const key = `${ventureId}:${stage}`;
    return this.chatMessages.get(key) || [];
  }

  async addChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageCurrentId++;
    const now = new Date();
    
    const chatMessage: ChatMessage = {
      ...message,
      id,
      timestamp: now
    };
    
    const key = `${message.ventureId}:${message.stage}`;
    const existingMessages = this.chatMessages.get(key) || [];
    this.chatMessages.set(key, [...existingMessages, chatMessage]);
    
    return chatMessage;
  }

  // Report methods
  async getReport(ventureId: number): Promise<Report | undefined> {
    return this.reports.get(ventureId);
  }

  async createReport(report: InsertReport): Promise<Report> {
    const id = this.reportCurrentId++;
    const now = new Date();
    
    const newReport: Report = {
      ...report,
      id,
      createdAt: now
    };
    
    this.reports.set(report.ventureId, newReport);
    return newReport;
  }
}

export const storage = new MemStorage();
