import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AIChat from "@/components/ai-chat";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, AlertCircle, Users, TrendingUp, LineChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketSizeChart, CompetitiveAnalysisChart } from "@/components/chart-components";

interface OpportunityAnalysisProps {
  ventureId: number;
}

interface MarketAnalysis {
  marketSize?: {
    tam?: string;
    sam?: string;
    som?: string;
    description?: string;
  };
  growthPotential?: {
    rate?: string;
    factors?: string[];
  };
  competitiveLandscape?: {
    directCompetitors?: string[];
    indirectCompetitors?: string[];
    advantages?: string[];
    threats?: string[];
  };
  opportunityScore?: number;
  marketInsights?: string[];
}

export default function OpportunityAnalysis({ ventureId }: OpportunityAnalysisProps) {
  const [aiAnalysis, setAiAnalysis] = useState<MarketAnalysis | null>(null);
  const [isExampleOpen, setIsExampleOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const queryClient = useQueryClient();
  
  // Mutation to mark stage as completed
  const completeStageMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/ventures/${ventureId}/stages/opportunityAnalysis`, {
        content: { completed: true },
        aiAnalysis,
        isCompleted: true
      });
    },
    onSuccess: () => {
      setIsCompleted(true);
      toast({
        title: "Opportunity analysis stage completed!",
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
  
  const handleAnalysisGenerated = (analysis: MarketAnalysis) => {
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
  
  const renderMarketSizeCard = () => {
    if (!aiAnalysis?.marketSize) return null;
    
    const { tam, sam, som, description } = aiAnalysis.marketSize;
    
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium">Market Size</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-60">
            <MarketSizeChart tam={tam} sam={sam} som={som} />
          </div>
          <div className="mt-3 text-xs text-gray-600">
            <p>{description}</p>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const renderGrowthPotentialCard = () => {
    if (!aiAnalysis?.growthPotential) return null;
    
    const { rate, factors } = aiAnalysis.growthPotential;
    
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium">Growth Potential</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
            <div className="text-2xl font-bold text-green-600">{rate}</div>
          </div>
          <h4 className="text-sm font-medium mb-2">Key Growth Factors:</h4>
          <ul className="space-y-1">
            {factors?.map((factor, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                {factor}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };
  
  const renderCompetitiveAnalysisCard = () => {
    if (!aiAnalysis?.competitiveLandscape) return null;
    
    const { directCompetitors, indirectCompetitors, advantages, threats } = aiAnalysis.competitiveLandscape;
    
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium">Competitive Landscape</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="competitors">
            <TabsList className="mb-4">
              <TabsTrigger value="competitors">Competitors</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="competitors">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Direct Competitors:</h4>
                  <ul className="space-y-1">
                    {directCompetitors?.map((competitor, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                        {competitor}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Indirect Competitors:</h4>
                  <ul className="space-y-1">
                    {indirectCompetitors?.map((competitor, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-500 mt-1.5 mr-2"></span>
                        {competitor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analysis">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Your Advantages:</h4>
                  <ul className="space-y-1">
                    {advantages?.map((advantage, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                        {advantage}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Potential Threats:</h4>
                  <ul className="space-y-1">
                    {threats?.map((threat, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                        {threat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };
  
  const renderMarketInsightsCard = () => {
    if (!aiAnalysis?.marketInsights) return null;
    
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium">Key Market Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {aiAnalysis.marketInsights.map((insight, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-500 mt-1.5 mr-2"></span>
                {insight}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div id="opportunity-analysis-stage" className="p-6">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-medium text-gray-900">Grand Opportunity Analysis</h2>
        {isCompleted ? (
          <Badge variant="success">Completed</Badge>
        ) : (
          <Badge>Current Step</Badge>
        )}
      </div>
      
      <p className="mt-2 text-sm text-gray-600">
        Let's analyze the market opportunity for your venture. We'll consider market size, growth potential, competition, and potential revenue.
      </p>
      
      {/* Opportunity Analysis Explainer */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-sm font-semibold">Market Size & Segments</h3>
            </div>
            <p className="text-xs text-gray-600">Identify your target market size and customer segments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-sm font-semibold">Growth Potential</h3>
            </div>
            <p className="text-xs text-gray-600">Estimate market growth rate and trends</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center mb-2">
              <LineChart className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-sm font-semibold">Competitive Analysis</h3>
            </div>
            <p className="text-xs text-gray-600">Assess competitors and your unique advantages</p>
          </CardContent>
        </Card>
      </div>
      
      {/* AI Assistant Chat Interface */}
      <div className="mt-6">
        <AIChat 
          ventureId={ventureId} 
          stage="opportunityAnalysis"
          onAnalysisGenerated={handleAnalysisGenerated}
        />
      </div>
      
      {/* AI Analysis Card */}
      {aiAnalysis && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Market Opportunity Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderMarketSizeCard()}
            {renderGrowthPotentialCard()}
            {renderCompetitiveAnalysisCard()}
            {renderMarketInsightsCard()}
          </div>
          
          {aiAnalysis.opportunityScore !== undefined && (
            <div className="mt-4 bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">Overall Opportunity Score</h4>
                <span className="text-sm font-medium">
                  {aiAnalysis.opportunityScore}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    aiAnalysis.opportunityScore >= 75 ? "bg-green-500" :
                    aiAnalysis.opportunityScore >= 50 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${aiAnalysis.opportunityScore}%` }}
                ></div>
              </div>
              <p className="mt-2 text-xs text-gray-600">
                {aiAnalysis.opportunityScore >= 75 
                  ? "High opportunity potential - this market looks promising!" 
                  : aiAnalysis.opportunityScore >= 50 
                  ? "Moderate opportunity - has potential but be aware of challenges"
                  : "Limited opportunity - consider pivoting or finding different market segments"
                }
              </p>
            </div>
          )}
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
          See example market opportunity analysis
        </button>
        
        {isExampleOpen && (
          <div className="mt-2 bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
            <p className="font-medium">Example: Telemedicine Platform for Mental Health</p>
            <ul className="mt-2 space-y-2">
              <li><strong>Market Size:</strong> TAM: $68B (global mental health market), SAM: $12.5B (US telehealth for behavioral health), SOM: $350M (target of 2.8% market share in first 3 years)</li>
              <li><strong>Growth Rate:</strong> 22% CAGR projected for mental health telemedicine through 2028</li>
              <li><strong>Key Customer Segments:</strong> Young professionals (25-40), rural populations with limited access to specialists, employers offering mental health benefits</li>
              <li><strong>Direct Competitors:</strong> BetterHelp, Talkspace, Alma</li>
              <li><strong>Competitive Advantages:</strong> Integration with insurance providers, specialized care paths for specific conditions, group therapy options</li>
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
