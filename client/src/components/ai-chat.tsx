import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Send, Zap } from "lucide-react";
import { Stage } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AIChatProps {
  ventureId: number;
  stage: Stage;
  onAnalysisGenerated?: (analysis: any) => void;
}

interface ChatMessage {
  id?: number;
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export default function AIChat({ ventureId, stage, onAnalysisGenerated }: AIChatProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  
  // Fetch existing messages
  const { data: messages, isLoading } = useQuery({
    queryKey: [`/api/ventures/${ventureId}/stages/${stage}/messages`],
    refetchOnWindowFocus: false
  });
  
  // Auto-generate message for empty stages
  useEffect(() => {
    // Check if messages is loaded and empty
    if (!isLoading && messages && messages.length === 0) {
      // Generate default messages based on stage
      let defaultMessage = "";
      
      switch(stage) {
        case "initialIdea":
          defaultMessage = "I'm working on a startup idea that leverages AI to solve a real-world problem. Can you help me refine it and analyze the potential?";
          break;
        case "smartRefinement":
          defaultMessage = "Please help me refine my idea using the SMART framework (Specific, Measurable, Achievable, Relevant, Time-bound). What specific aspects should I focus on?";
          break;
        case "opportunityAnalysis":
          defaultMessage = "Can you help me analyze the market opportunity for this venture? I need insights on market size, growth potential, and competitive landscape.";
          break;
        case "ventureThesis":
          defaultMessage = "I need to create a comprehensive venture thesis. Please help me define my vision, mission, target customers, and business model.";
          break;
        case "viabilityAssessment":
          defaultMessage = "Can you assess the business viability of my venture? I need to understand market demand, financial projections, and risk factors.";
          break;
        case "gtmStrategy":
          defaultMessage = "I need to develop a go-to-market strategy. Please help me define my target segments, marketing approach, pricing strategy, and launch plan.";
          break;
        default:
          defaultMessage = "Can you help me with this stage of my venture development?";
      }
      
      // Only send if we have a default message
      if (defaultMessage) {
        setMessage(defaultMessage);
        // Auto-submit after a short delay
        setTimeout(() => {
          sendMessageMutation.mutate(defaultMessage);
          setIsSubmitting(true);
        }, 500);
      }
    }
  }, [isLoading, messages, stage]);
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", `/api/ventures/${ventureId}/stages/${stage}/messages`, {
        role: "user",
        content
      });
    },
    onSuccess: async (response) => {
      const data = await response.json();
      
      // Invalidate messages query to refetch the messages
      queryClient.invalidateQueries({ queryKey: [`/api/ventures/${ventureId}/stages/${stage}/messages`] });
      
      // If analysis is generated, call the callback
      if (data.aiAnalysis && onAnalysisGenerated) {
        onAnalysisGenerated(data.aiAnalysis);
      }
      
      setMessage("");
    },
    onError: () => {
      toast({
        title: "Error sending message",
        description: "Please try again later",
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    await sendMessageMutation.mutate(message);
  };
  
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-100">
      {/* Chat Messages */}
      <ScrollArea className="p-4 space-y-4 h-80">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((msg: ChatMessage, index: number) => {
            if (msg.role === "assistant") {
              return (
                <div key={msg.id || index} className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                  <div className="flex-1 bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm text-gray-800 whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={msg.id || index} className="flex flex-row-reverse">
                  <div className="flex-shrink-0 ml-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 bg-primary-50 rounded-lg p-4 shadow-sm">
                    <p className="text-sm text-gray-800 whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              );
            }
          })
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>
      
      {/* Chat Input */}
      <div className="p-4 border-t border-gray-100">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-grow">
            <Textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your response here..."
              className="resize-none"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex-shrink-0">
            <Button type="submit" disabled={isSubmitting || !message.trim()}>
              <Send className="h-5 w-5 mr-1" />
              {isSubmitting ? "Sending..." : "Send"}
            </Button>
          </div>
        </form>
        <p className="mt-2 text-xs text-gray-500">AI will analyze your responses to help refine your idea</p>
      </div>
    </div>
  );
}
