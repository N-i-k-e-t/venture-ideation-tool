import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { 
  insertVentureIdeaSchema, 
  insertStageContentSchema,
  insertChatMessageSchema,
  insertReportSchema,
  stageSchema
} from "@shared/schema";
import { analyzeInitialIdea, analyzeSMARTRefinement, analyzeMarketOpportunity, generateReport } from "./lib/analysis";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Error handler middleware
  app.use((err: any, req: Request, res: Response, next: any) => {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ error: validationError.message });
    }
    next(err);
  });

  // ======================
  // Venture Idea Routes
  // ======================
  
  // Get all venture ideas for a user
  app.get("/api/ventures", async (req, res) => {
    // In a real app, get userId from authenticated session
    const userId = parseInt(req.query.userId as string) || 1;
    const ideas = await storage.getVentureIdeas(userId);
    res.json(ideas);
  });

  // Get a specific venture idea
  app.get("/api/ventures/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const idea = await storage.getVentureIdea(id);
    
    if (!idea) {
      return res.status(404).json({ error: "Venture idea not found" });
    }
    
    res.json(idea);
  });

  // Create a new venture idea
  app.post("/api/ventures", async (req, res) => {
    const validatedData = insertVentureIdeaSchema.parse(req.body);
    const venture = await storage.createVentureIdea(validatedData);
    
    // Initialize first stage with welcome message
    const initialChatMessage = {
      ventureId: venture.id,
      stage: "initialIdea",
      role: "assistant",
      content: "Hello! I'm excited to help you develop your venture idea. Please tell me about your initial concept. Be as detailed as possible about the problem you're solving and your approach."
    };
    
    await storage.addChatMessage(initialChatMessage);
    
    res.status(201).json(venture);
  });

  // Update a venture idea
  app.patch("/api/ventures/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const updates = req.body;
    
    const updatedVenture = await storage.updateVentureIdea(id, updates);
    
    if (!updatedVenture) {
      return res.status(404).json({ error: "Venture idea not found" });
    }
    
    res.json(updatedVenture);
  });

  // Delete a venture idea
  app.delete("/api/ventures/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteVentureIdea(id);
    
    if (!success) {
      return res.status(404).json({ error: "Venture idea not found" });
    }
    
    res.status(204).send();
  });

  // ======================
  // Stage Content Routes
  // ======================
  
  // Get content for a specific stage
  app.get("/api/ventures/:ventureId/stages/:stage", async (req, res) => {
    const ventureId = parseInt(req.params.ventureId);
    const stage = req.params.stage;
    
    // Validate stage
    try {
      stageSchema.parse(stage);
    } catch (error) {
      return res.status(400).json({ error: "Invalid stage" });
    }
    
    const content = await storage.getStageContent(ventureId, stage);
    
    if (!content) {
      return res.status(404).json({ error: "Stage content not found" });
    }
    
    res.json(content);
  });

  // Get all stage contents for a venture
  app.get("/api/ventures/:ventureId/stages", async (req, res) => {
    const ventureId = parseInt(req.params.ventureId);
    const contents = await storage.getAllStageContents(ventureId);
    res.json(contents);
  });

  // Create or update stage content
  app.post("/api/ventures/:ventureId/stages/:stage", async (req, res) => {
    const ventureId = parseInt(req.params.ventureId);
    const stage = req.params.stage;
    
    // Validate stage
    try {
      stageSchema.parse(stage);
    } catch (error) {
      return res.status(400).json({ error: "Invalid stage" });
    }
    
    const validatedData = insertStageContentSchema.parse({
      ...req.body,
      ventureId,
      stage
    });
    
    // Check if content already exists
    const existingContent = await storage.getStageContent(ventureId, stage);
    
    let content;
    if (existingContent) {
      content = await storage.updateStageContent(existingContent.id, validatedData);
    } else {
      content = await storage.createStageContent(validatedData);
    }
    
    res.status(201).json(content);
  });

  // ======================
  // Chat Message Routes
  // ======================
  
  // Get chat messages for a specific stage
  app.get("/api/ventures/:ventureId/stages/:stage/messages", async (req, res) => {
    const ventureId = parseInt(req.params.ventureId);
    const stage = req.params.stage;
    
    // Validate stage
    try {
      stageSchema.parse(stage);
    } catch (error) {
      return res.status(400).json({ error: "Invalid stage" });
    }
    
    const messages = await storage.getChatMessages(ventureId, stage);
    res.json(messages);
  });

  // Add a new chat message and get AI response
  app.post("/api/ventures/:ventureId/stages/:stage/messages", async (req, res) => {
    const ventureId = parseInt(req.params.ventureId);
    const stage = req.params.stage;
    
    // Validate stage
    try {
      stageSchema.parse(stage);
    } catch (error) {
      return res.status(400).json({ error: "Invalid stage" });
    }
    
    const validatedData = insertChatMessageSchema.parse({
      ...req.body,
      ventureId,
      stage
    });
    
    // Save user message
    const userMessage = await storage.addChatMessage(validatedData);
    
    // Generate AI response based on stage and message content
    let aiResponse = "I'm processing your input...";
    let aiAnalysis = null;
    
    // Get all previous messages for context
    const previousMessages = await storage.getChatMessages(ventureId, stage);
    
    try {
      if (stage === "initialIdea") {
        const analysis = await analyzeInitialIdea(userMessage.content, previousMessages);
        aiResponse = analysis.response;
        aiAnalysis = analysis.analysis;
      } else if (stage === "smartRefinement") {
        const analysis = await analyzeSMARTRefinement(userMessage.content, previousMessages);
        aiResponse = analysis.response;
        aiAnalysis = analysis.analysis;
      } else if (stage === "opportunityAnalysis") {
        const analysis = await analyzeMarketOpportunity(userMessage.content, previousMessages);
        aiResponse = analysis.response;
        aiAnalysis = analysis.analysis;
      } else {
        // Default response for other stages
        aiResponse = "Thank you for your input. I'm analyzing this information and will provide feedback shortly.";
      }
    } catch (error) {
      console.error("AI analysis error:", error);
      aiResponse = "I apologize, but I encountered an error processing your request. Please try again.";
    }
    
    // Save AI response
    const assistantMessage = await storage.addChatMessage({
      ventureId,
      stage,
      role: "assistant",
      content: aiResponse
    });
    
    // If we have analysis, save/update it in the stage content
    if (aiAnalysis) {
      const existingContent = await storage.getStageContent(ventureId, stage);
      if (existingContent) {
        await storage.updateStageContent(existingContent.id, {
          aiAnalysis
        });
      } else {
        await storage.createStageContent({
          ventureId,
          stage,
          content: {},
          aiAnalysis,
          isCompleted: false
        });
      }
    }
    
    res.json({
      userMessage,
      assistantMessage,
      aiAnalysis
    });
  });

  // ======================
  // Report Routes
  // ======================
  
  // Generate and retrieve a report for a venture
  app.post("/api/ventures/:ventureId/report", async (req, res) => {
    const ventureId = parseInt(req.params.ventureId);
    
    // Get venture idea
    const venture = await storage.getVentureIdea(ventureId);
    if (!venture) {
      return res.status(404).json({ error: "Venture idea not found" });
    }
    
    // Get all stage contents
    const stageContents = await storage.getAllStageContents(ventureId);
    
    // Check if all required stages are completed
    const requiredStages = ["initialIdea", "smartRefinement", "opportunityAnalysis", "ventureThesis", "viabilityAssessment", "gtmStrategy"];
    
    const completedStages = stageContents.filter(content => content.isCompleted);
    const completedStageNames = completedStages.map(content => content.stage);
    
    const missingStages = requiredStages.filter(stage => !completedStageNames.includes(stage));
    
    if (missingStages.length > 0) {
      return res.status(400).json({
        error: "Cannot generate report. The following stages are incomplete: " + missingStages.join(", ")
      });
    }
    
    try {
      // Generate report using AI
      const reportData = await generateReport(venture, stageContents);
      
      // Save report
      const report = await storage.createReport({
        ventureId,
        title: venture.title,
        fullReport: reportData.fullReport,
        pitchDeck: reportData.pitchDeck,
        elevatorPitch: reportData.elevatorPitch,
        fullPitch: reportData.fullPitch
      });
      
      // Update venture as completed
      await storage.updateVentureIdea(ventureId, {
        isCompleted: true
      });
      
      res.json(report);
    } catch (error) {
      console.error("Report generation error:", error);
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  // Get an existing report
  app.get("/api/ventures/:ventureId/report", async (req, res) => {
    const ventureId = parseInt(req.params.ventureId);
    const report = await storage.getReport(ventureId);
    
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    
    res.json(report);
  });

  return httpServer;
}
