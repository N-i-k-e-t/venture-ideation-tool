import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AIChat from "@/components/ai-chat";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SmartRefinementProps {
  ventureId: number;
}

interface SMARTAnalysis {
  specific?: {
    score: number;
    feedback: string;
  };
  measurable?: {
    score: number;
    feedback: string;
  };
  achievable?: {
    score: number;
    feedback: string;
  };
  relevant?: {
    score: number;
    feedback: string;
  };
  timeBound?: {
    score: number;
    feedback: string;
  };
  overallScore?: number;
  nextSteps?: string[];
}

export default function SmartRefinement({ ventureId }: SmartRefinementProps) {
  const [aiAnalysis, setAiAnalysis] = useState<SMARTAnalysis | null>(null);
  const [isExampleOpen, setIsExampleOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const queryClient = useQueryClient();
  
  // Mutation to mark stage as completed
  const completeStageMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/ventures/${ventureId}/stages/smartRefinement`, {
        content: { completed: true },
        aiAnalysis,
        isCompleted: true
      });
    },
    onSuccess: () => {
      setIsCompleted(true);
      toast({
        title: "SMART refinement stage completed!",
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
  
  const handleAnalysisGenerated = (analysis: SMARTAnalysis) => {
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
    <div id="smart-refinement-stage" className="p-6">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-medium text-gray-900">SMART Idea Refinement</h2>
        {isCompleted ? (
          <Badge variant="success">Completed</Badge>
        ) : (
          <Badge>Current Step</Badge>
        )}
      </div>
      
      <p className="mt-2 text-sm text-gray-600">
        Let's refine your idea using the SMART framework (Specific, Measurable, Achievable, Relevant, Time-bound).
      </p>
      
      {/* SMART Explanation */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-sm font-semibold mb-1">Specific</h3>
            <p className="text-xs text-gray-600">Clearly define what your venture will do</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-sm font-semibold mb-1">Measurable</h3>
            <p className="text-xs text-gray-600">Define concrete metrics for success</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-sm font-semibold mb-1">Achievable</h3>
            <p className="text-xs text-gray-600">Ensure your goals are realistic</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-sm font-semibold mb-1">Relevant</h3>
            <p className="text-xs text-gray-600">Align with market needs and your vision</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-sm font-semibold mb-1">Time-bound</h3>
            <p className="text-xs text-gray-600">Set clear timelines and milestones</p>
          </CardContent>
        </Card>
      </div>
      
      {/* AI Assistant Chat Interface */}
      <div className="mt-6">
        <AIChat 
          ventureId={ventureId} 
          stage="smartRefinement"
          onAnalysisGenerated={handleAnalysisGenerated}
        />
      </div>
      
      {/* AI Analysis Card */}
      {aiAnalysis && (
        <div className="mt-6 bg-gray-50 rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900">SMART Analysis</h3>
          
          <div className="mt-4 space-y-4">
            {aiAnalysis.specific && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-700">Specific</h4>
                  <span className="text-xs font-medium">{aiAnalysis.specific.score}%</span>
                </div>
                <Progress value={aiAnalysis.specific.score} className="h-2" />
                <p className="mt-1 text-xs text-gray-600">{aiAnalysis.specific.feedback}</p>
              </div>
            )}
            
            {aiAnalysis.measurable && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-700">Measurable</h4>
                  <span className="text-xs font-medium">{aiAnalysis.measurable.score}%</span>
                </div>
                <Progress value={aiAnalysis.measurable.score} className="h-2" />
                <p className="mt-1 text-xs text-gray-600">{aiAnalysis.measurable.feedback}</p>
              </div>
            )}
            
            {aiAnalysis.achievable && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-700">Achievable</h4>
                  <span className="text-xs font-medium">{aiAnalysis.achievable.score}%</span>
                </div>
                <Progress value={aiAnalysis.achievable.score} className="h-2" />
                <p className="mt-1 text-xs text-gray-600">{aiAnalysis.achievable.feedback}</p>
              </div>
            )}
            
            {aiAnalysis.relevant && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-700">Relevant</h4>
                  <span className="text-xs font-medium">{aiAnalysis.relevant.score}%</span>
                </div>
                <Progress value={aiAnalysis.relevant.score} className="h-2" />
                <p className="mt-1 text-xs text-gray-600">{aiAnalysis.relevant.feedback}</p>
              </div>
            )}
            
            {aiAnalysis.timeBound && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-700">Time-bound</h4>
                  <span className="text-xs font-medium">{aiAnalysis.timeBound.score}%</span>
                </div>
                <Progress value={aiAnalysis.timeBound.score} className="h-2" />
                <p className="mt-1 text-xs text-gray-600">{aiAnalysis.timeBound.feedback}</p>
              </div>
            )}
            
            {aiAnalysis.overallScore !== undefined && (
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900">Overall SMART Score</h4>
                  <span className="text-xs font-medium">{aiAnalysis.overallScore}%</span>
                </div>
                <Progress 
                  value={aiAnalysis.overallScore} 
                  className="h-3"
                  indicatorClassName={
                    aiAnalysis.overallScore >= 75 ? "bg-green-500" :
                    aiAnalysis.overallScore >= 50 ? "bg-yellow-500" : "bg-red-500"
                  }
                />
              </div>
            )}
            
            {aiAnalysis.nextSteps && aiAnalysis.nextSteps.length > 0 && (
              <div className="pt-3 mt-3 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700">Recommended Next Steps</h4>
                <ul className="mt-2 space-y-1">
                  {aiAnalysis.nextSteps.map((step, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-500 mt-1.5 mr-2"></span>
                      {step}
                    </li>
                  ))}
                </ul>
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
          See example of a SMART-refined idea
        </button>
        
        {isExampleOpen && (
          <div className="mt-2 bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
            <p className="font-medium">Example: HealthTrack Mobile App</p>
            <ul className="mt-2 space-y-2">
              <li><strong>Specific:</strong> Develop a mobile app that tracks daily nutrition, exercise, medication, and vitals for people managing chronic conditions.</li>
              <li><strong>Measurable:</strong> Target 10,000 downloads in the first six months, 40% retention rate, and 4.5+ app store rating.</li>
              <li><strong>Achievable:</strong> Focusing initially on diabetes management with a team of 2 developers, 1 designer, and a medical advisor.</li>
              <li><strong>Relevant:</strong> Addresses the growing market of 34M Americans with diabetes who need daily health tracking solutions.</li>
              <li><strong>Time-bound:</strong> MVP in 4 months, beta testing with 100 users by month 5, public launch in month 6, revenue-generating by month 9.</li>
            </ul>
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
