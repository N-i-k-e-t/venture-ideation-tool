import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AIChat from "@/components/ai-chat";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

interface InitialIdeaProps {
  ventureId: number;
}

interface IdeaAnalysis {
  keywords?: string[];
  problemSolutionFit?: number;
  suggestedAspects?: string[];
  entities?: {
    problems?: string[];
    solutions?: string[];
    customers?: string[];
    market?: string[];
  };
}

export default function InitialIdea({ ventureId }: InitialIdeaProps) {
  const [aiAnalysis, setAiAnalysis] = useState<IdeaAnalysis | null>(null);
  const [isExampleOpen, setIsExampleOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const queryClient = useQueryClient();
  
  // Mutation to mark stage as completed
  const completeStageMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/ventures/${ventureId}/stages/initialIdea`, {
        content: { completed: true },
        aiAnalysis,
        isCompleted: true
      });
    },
    onSuccess: () => {
      setIsCompleted(true);
      toast({
        title: "Initial idea stage completed!",
        description: "You can now proceed to the next stage.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/ventures/${ventureId}/stages`] });
    },
    onError: () => {
      toast({
        title: "Error completing stage",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  });
  
  const handleAnalysisGenerated = (analysis: IdeaAnalysis) => {
    setAiAnalysis(analysis);
  };
  
  const handleCompleteStage = () => {
    if (!aiAnalysis) {
      toast({
        title: "Interact with AI assistant first",
        description: "Please discuss your idea with the AI assistant before completing this stage",
        variant: "destructive"
      });
      return;
    }
    
    completeStageMutation.mutate();
  };
  
  return (
    <div id="initial-idea-stage" className="p-6">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-medium text-gray-900">Initial Idea Refinement</h2>
        {isCompleted ? (
          <Badge variant="success">Completed</Badge>
        ) : (
          <Badge>Current Step</Badge>
        )}
      </div>
      
      <p className="mt-2 text-sm text-gray-600">
        Let's develop your venture idea. Please share your initial concept with as much detail as possible.
      </p>
      
      {/* AI Assistant Chat Interface */}
      <div className="mt-6">
        <AIChat 
          ventureId={ventureId} 
          stage="initialIdea"
          onAnalysisGenerated={handleAnalysisGenerated}
        />
      </div>
      
      {/* AI Analysis Card */}
      {aiAnalysis && (
        <div className="mt-6 bg-gray-50 rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900">AI Analysis</h3>
          <div className="mt-2 space-y-3">
            {aiAnalysis.keywords && aiAnalysis.keywords.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-700">Keywords Detected</h4>
                <div className="mt-1 flex flex-wrap gap-2">
                  {aiAnalysis.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">{keyword}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {aiAnalysis.problemSolutionFit !== undefined && (
              <div>
                <h4 className="text-xs font-medium text-gray-700">Problem-Solution Fit</h4>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${aiAnalysis.problemSolutionFit}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  {aiAnalysis.problemSolutionFit}% - {aiAnalysis.problemSolutionFit > 75 
                    ? "Good alignment between problem and proposed solution" 
                    : aiAnalysis.problemSolutionFit > 50 
                    ? "Moderate alignment between problem and solution"
                    : "Weak alignment between problem and solution - consider revising"
                  }
                </p>
              </div>
            )}
            
            {aiAnalysis.suggestedAspects && aiAnalysis.suggestedAspects.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-700">Suggested Aspects to Consider</h4>
                <ul className="mt-1 text-xs text-gray-600 space-y-1">
                  {aiAnalysis.suggestedAspects.map((aspect, index) => (
                    <li key={index}>• {aspect}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {aiAnalysis.entities && (
              <div>
                <h4 className="text-xs font-medium text-gray-700">Identified Elements</h4>
                <div className="mt-1 grid grid-cols-2 gap-3 text-xs">
                  {aiAnalysis.entities.problems && aiAnalysis.entities.problems.length > 0 && (
                    <div>
                      <span className="font-medium">Problems:</span>
                      <ul className="text-gray-600 mt-1">
                        {aiAnalysis.entities.problems.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {aiAnalysis.entities.solutions && aiAnalysis.entities.solutions.length > 0 && (
                    <div>
                      <span className="font-medium">Solutions:</span>
                      <ul className="text-gray-600 mt-1">
                        {aiAnalysis.entities.solutions.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Example Card */}
      <div className="mt-4">
        <button
          className="flex items-center text-sm font-medium text-primary-600 cursor-pointer"
          onClick={() => setIsExampleOpen(!isExampleOpen)}
        >
          {isExampleOpen ? (
            <ChevronUp className="h-5 w-5 text-primary-500 mr-1" />
          ) : (
            <ChevronDown className="h-5 w-5 text-primary-500 mr-1" />
          )}
          See example of a good initial idea
        </button>
        
        {isExampleOpen && (
          <div className="mt-2 bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
            <p className="font-medium">Example: Smart Medication Dispenser for Seniors</p>
            <p className="mt-1">
              Our idea is to create a smart medication dispenser that helps seniors manage complex medication regimens. 
              Many elderly people struggle with multiple prescriptions, leading to missed doses or incorrect intake. 
              Our device automatically dispenses the right pills at the right time, sends reminders via a companion app, 
              and alerts caregivers when doses are missed. We'll integrate with pharmacy systems to automate refills and 
              include medication interaction warnings.
            </p>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm">
            {!isCompleted && aiAnalysis && (
              <div className="flex items-center text-amber-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>Don't forget to complete this stage when you're ready</span>
              </div>
            )}
          </div>
          
          {!isCompleted && (
            <Button onClick={handleCompleteStage} variant="outline">
              Mark as Complete & Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
