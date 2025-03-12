import { pgTable, text, serial, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Venture idea model
export const ventureIdeas = pgTable("venture_ideas", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  currentStage: integer("current_stage").notNull().default(1),
  isCompleted: boolean("is_completed").notNull().default(false),
  // Sharing fields
  shareToken: text("share_token").unique(),
  isPublic: boolean("is_public").notNull().default(false),
  cardStyle: text("card_style").default("default"),
  cardTheme: text("card_theme").default("light"),
  cardDescription: text("card_description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertVentureIdeaSchema = createInsertSchema(ventureIdeas).pick({
  userId: true,
  title: true,
  currentStage: true,
  isCompleted: true,
});

// Schema for sharing updates
export const shareVentureSchema = z.object({
  isPublic: z.boolean().optional(),
  cardStyle: z.enum(["default", "minimal", "gradient", "modern"]).optional(),
  cardTheme: z.enum(["light", "dark", "blue", "purple", "green"]).optional(),
  cardDescription: z.string().max(200).optional(),
});

export type InsertVentureIdea = z.infer<typeof insertVentureIdeaSchema>;
export type VentureIdea = typeof ventureIdeas.$inferSelect;

// Stages definition
export const stageSchema = z.enum([
  "initialIdea",
  "smartRefinement",
  "opportunityAnalysis",
  "ventureThesis",
  "viabilityAssessment",
  "gtmStrategy",
  "pitchReport"
]);

export type Stage = z.infer<typeof stageSchema>;

export const stageLabels: Record<Stage, string> = {
  initialIdea: "Initial Idea",
  smartRefinement: "SMART Refinement",
  opportunityAnalysis: "Opportunity Analysis",
  ventureThesis: "Venture Thesis",
  viabilityAssessment: "Viability Assessment",
  gtmStrategy: "GTM Strategy",
  pitchReport: "Pitch & Report"
};

export const stageOrder: Record<Stage, number> = {
  initialIdea: 1,
  smartRefinement: 2,
  opportunityAnalysis: 3,
  ventureThesis: 4,
  viabilityAssessment: 5,
  gtmStrategy: 6,
  pitchReport: 7
};

// Stage content model
export const stageContents = pgTable("stage_contents", {
  id: serial("id").primaryKey(),
  ventureId: integer("venture_id").notNull(),
  stage: text("stage").notNull(),
  content: jsonb("content").notNull(),
  aiAnalysis: jsonb("ai_analysis"),
  isCompleted: boolean("is_completed").notNull().default(false),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertStageContentSchema = createInsertSchema(stageContents).pick({
  ventureId: true,
  stage: true,
  content: true,
  aiAnalysis: true,
  isCompleted: true,
});

export type InsertStageContent = z.infer<typeof insertStageContentSchema>;
export type StageContent = typeof stageContents.$inferSelect;

// Chat messages model for AI assistant interactions
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  ventureId: integer("venture_id").notNull(),
  stage: text("stage").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  ventureId: true,
  stage: true,
  role: true,
  content: true,
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Report output model
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  ventureId: integer("venture_id").notNull(),
  title: text("title").notNull(),
  fullReport: jsonb("full_report").notNull(),
  pitchDeck: jsonb("pitch_deck").notNull(),
  elevatorPitch: text("elevator_pitch").notNull(),
  fullPitch: text("full_pitch").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReportSchema = createInsertSchema(reports).pick({
  ventureId: true,
  title: true,
  fullReport: true,
  pitchDeck: true,
  elevatorPitch: true,
  fullPitch: true,
});

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;
