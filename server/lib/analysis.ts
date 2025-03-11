import { analyzeTextStructured, generateChatResponse } from "./openai";
import { ChatMessage } from "@shared/schema";

// Interface for initial idea analysis
interface InitialIdeaAnalysis {
  keywords: string[];
  problemSolutionFit: number; // 0-100 percentage
  suggestedAspects: string[];
  entities: {
    problems: string[];
    solutions: string[];
    customers: string[];
    market: string[];
  };
}

// Interface for SMART analysis
interface SMARTAnalysis {
  specific: {
    score: number; // 0-100
    feedback: string;
  };
  measurable: {
    score: number; // 0-100
    feedback: string;
  };
  achievable: {
    score: number; // 0-100
    feedback: string;
  };
  relevant: {
    score: number; // 0-100
    feedback: string;
  };
  timeBound: {
    score: number; // 0-100
    feedback: string;
  };
  overallScore: number; // 0-100
  nextSteps: string[];
}

// Interface for market opportunity analysis
interface MarketAnalysis {
  marketSize: {
    tam: string; // Total Addressable Market
    sam: string; // Serviceable Addressable Market
    som: string; // Serviceable Obtainable Market
    description: string;
  };
  growthPotential: {
    rate: string;
    factors: string[];
  };
  competitiveLandscape: {
    directCompetitors: string[];
    indirectCompetitors: string[];
    advantages: string[];
    threats: string[];
  };
  opportunityScore: number; // 0-100
  marketInsights: string[];
}

// Interface for the analysis return type
interface AnalysisResult<T> {
  response: string;
  analysis: T;
}

// Interface for report generation
interface ReportData {
  fullReport: any;
  pitchDeck: any;
  elevatorPitch: string;
  fullPitch: string;
}

// Function to convert messages to chat format for OpenAI
function formatMessagesForChat(messages: ChatMessage[]): Array<{ role: string; content: string }> {
  return messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));
}

// Analyze initial idea
export async function analyzeInitialIdea(
  message: string,
  previousMessages: ChatMessage[]
): Promise<AnalysisResult<InitialIdeaAnalysis>> {
  // First, generate analysis
  const systemPrompt = `
    You are an expert startup advisor analyzing initial venture ideas. 
    Extract key information from the user's idea description. 
    Respond with a JSON object containing:
    - keywords: Array of important keywords from the idea
    - problemSolutionFit: Number from 0-100 indicating alignment between problem and solution
    - suggestedAspects: Array of aspects the user should consider
    - entities: Object with arrays of problems, solutions, customers, market segments identified
  `;

  // Get all user messages for better context
  const allUserMessages = previousMessages
    .filter(msg => msg.role === 'user')
    .map(msg => msg.content)
    .join("\n\n") + "\n\n" + message;

  const analysis = await analyzeTextStructured<InitialIdeaAnalysis>(
    systemPrompt,
    allUserMessages
  );

  // Now, generate conversational response
  const chatPrompt = [
    {
      role: "system",
      content: `
        You are a helpful AI assistant guiding a user through developing a startup idea. 
        After receiving their initial idea description, analyze it and provide specific, constructive feedback.
        Include:
        1. Key elements you've identified in their idea (problem, solution, benefits)
        2. Follow-up questions to help them refine the idea further (3 questions maximum)
        Keep your response conversational and encouraging. Show excitement about their idea while helping them improve it.
      `
    },
    ...formatMessagesForChat(previousMessages),
    { role: "user", content: message }
  ];

  const response = await generateChatResponse(chatPrompt);

  return {
    response,
    analysis
  };
}

// Analyze SMART refinement
export async function analyzeSMARTRefinement(
  message: string,
  previousMessages: ChatMessage[]
): Promise<AnalysisResult<SMARTAnalysis>> {
  // Generate analysis
  const systemPrompt = `
    You are an expert in evaluating business ideas using the SMART framework.
    Analyze the idea and provide a detailed assessment on how well it meets SMART criteria.
    Respond with a JSON object containing:
    - specific: Object with score (0-100) and feedback
    - measurable: Object with score (0-100) and feedback
    - achievable: Object with score (0-100) and feedback
    - relevant: Object with score (0-100) and feedback
    - timeBound: Object with score (0-100) and feedback
    - overallScore: Number from 0-100 representing overall SMART compliance
    - nextSteps: Array of suggested actions to improve SMART alignment
  `;

  // Get all messages for better context
  const allMessages = previousMessages
    .map(msg => `${msg.role}: ${msg.content}`)
    .join("\n\n") + "\n\n" + `user: ${message}`;

  const analysis = await analyzeTextStructured<SMARTAnalysis>(
    systemPrompt,
    allMessages
  );

  // Generate conversational response
  const chatPrompt = [
    {
      role: "system",
      content: `
        You are a helpful AI assistant guiding the user through refining their startup idea using the SMART framework.
        Evaluate their input against SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound).
        Provide constructive feedback on areas of strength and opportunities for improvement.
        Suggest specific ways to improve any weak areas.
        Be encouraging and educational about the SMART framework while maintaining a conversational tone.
      `
    },
    ...formatMessagesForChat(previousMessages),
    { role: "user", content: message }
  ];

  const response = await generateChatResponse(chatPrompt);

  return {
    response,
    analysis
  };
}

// Analyze market opportunity
export async function analyzeMarketOpportunity(
  message: string,
  previousMessages: ChatMessage[]
): Promise<AnalysisResult<MarketAnalysis>> {
  // Generate analysis
  const systemPrompt = `
    You are an expert market analyst assessing startup market opportunities.
    Analyze the venture idea and provide a structured market assessment.
    Respond with a JSON object containing:
    - marketSize: Object with tam, sam, som estimates and description
    - growthPotential: Object with growth rate estimate and key growth factors
    - competitiveLandscape: Object with arrays of direct and indirect competitors, competitive advantages, and threats
    - opportunityScore: Number from 0-100 rating the overall market opportunity
    - marketInsights: Array of important market insights
  `;

  // Get all messages for better context
  const allMessages = previousMessages
    .map(msg => `${msg.role}: ${msg.content}`)
    .join("\n\n") + "\n\n" + `user: ${message}`;

  const analysis = await analyzeTextStructured<MarketAnalysis>(
    systemPrompt,
    allMessages
  );

  // Generate conversational response
  const chatPrompt = [
    {
      role: "system",
      content: `
        You are a helpful AI assistant with expertise in market analysis.
        You're helping the user understand the market opportunity for their startup idea.
        Provide insights on market size, growth potential, competition, and overall viability.
        Use data-driven language but keep it conversational and educational.
        End with 2-3 specific questions that would help further refine their market understanding.
      `
    },
    ...formatMessagesForChat(previousMessages),
    { role: "user", content: message }
  ];

  const response = await generateChatResponse(chatPrompt);

  return {
    response,
    analysis
  };
}

// Generate comprehensive report 
export async function generateReport(
  venture: any,
  stageContents: any[]
): Promise<ReportData> {
  // Convert stage contents to a structured format
  const stageData = stageContents.reduce((acc, stage) => {
    acc[stage.stage] = {
      content: stage.content,
      analysis: stage.aiAnalysis
    };
    return acc;
  }, {});

  const systemPrompt = `
    You are an expert business analyst creating a comprehensive startup venture report.
    Generate a complete startup report based on the provided venture data.
    Include executive summary, problem statement, solution description, market analysis,
    business model, competitive advantages, and implementation plan.
    
    Also generate a pitch deck outline with key slides, a 20-second elevator pitch,
    and a 3-minute full pitch script.
    
    Respond with a JSON object containing:
    - fullReport: Object containing all sections of the report
    - pitchDeck: Array of slide objects (title, content)
    - elevatorPitch: String with 20-second pitch (approximately 50 words)
    - fullPitch: String with 3-minute pitch (approximately 450 words)
  `;

  const contextData = {
    venture,
    stages: stageData
  };

  try {
    const reportData = await analyzeTextStructured<ReportData>(
      systemPrompt,
      JSON.stringify(contextData)
    );
    
    return reportData;
  } catch (error) {
    console.error("Error generating report:", error);
    throw new Error("Failed to generate venture report");
  }
}
