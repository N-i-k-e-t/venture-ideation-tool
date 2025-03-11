import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AIChat from "@/components/ai-chat";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, AlertCircle, LineChart, TrendingUp, Gauge, Coins, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RevenueProjectionChart, BreakEvenChart } from "@/components/chart-components";

interface ViabilityAssessmentProps {
  ventureId: number;
}

interface FinancialProjection {
  year: number;
  revenue: number;
  expenses: number;
  profit: number;
}

interface ViabilityAnalysis {
  marketAssessment?: {
    demandLevel?: "high" | "medium" | "low";
    demandReasons?: string[];
    barrierToEntry?: string;
    competitivePressure?: "high" | "medium" | "low";
  };
  financialProjections?: {
    projections?: FinancialProjection[];
    breakEvenPoint?: {
      time?: string;
      units?: number;
      revenue?: number;
    };
    keyAssumptions?: string[];
    capitalRequired?: string;
  };
  riskAssessment?: {
    keyRisks?: Array<{
      risk: string;
      impact: "high" | "medium" | "low";
      mitigation?: string;
    }>;
    successProbability?: number;
  };
  viabilityScore?: number;
  recommendedActions?: string[];
}

export default function ViabilityAssessment({ ventureId }: ViabilityAssessmentProps) {
  const [aiAnalysis, setAiAnalysis] = useState<ViabilityAnalysis | null>(null);
  const [isExampleOpen, setIsExampleOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const queryClient = useQueryClient();
  
  // Mutation to mark stage as completed
  const completeStageMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/ventures/${ventureId}/stages/viabilityAssessment`, {
        content: { completed: true },
        aiAnalysis,
        isCompleted: true
      });
    },
    onSuccess: () => {
      setIsCompleted(true);
      toast({
        title: "Viability assessment stage completed!",
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
  
  const handleAnalysisGenerated = (analysis: ViabilityAnalysis) => {
    setAiAnalysis(analysis);
  };
  
  const handleCompleteStage = () => {
    if (!aiAnalysis) {
      toast({
        title: "Interact with AI assistant first",
        description: "Please discuss your business viability with the AI assistant before completing this stage",
        variant: "destructive"
      });
      return;
    }
    
    completeStageMutation.mutate();
  };
  
  // Helper function to get impact color
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "text-red-600";
      case "medium": return "text-amber-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };
  
  // Helper function to get demand level color
  const getDemandLevelColor = (level: string) => {
    switch (level) {
      case "high": return "text-green-600";
      case "medium": return "text-blue-600";
      case "low": return "text-amber-600";
      default: return "text-gray-600";
    }
  };
  
  return (
    <div id="viability-assessment-stage" className="p-6">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-medium text-gray-900">Business Viability Assessment</h2>
        {isCompleted ? (
          <Badge variant="success">Completed</Badge>
        ) : (
          <Badge>Current Step</Badge>
        )}
      </div>
      
      <p className="mt-2 text-sm text-gray-600">
        Let's assess the business viability of your venture by considering market demand, financial projections, and risk factors.
      </p>
      
      {/* Viability Assessment Explainer */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-sm font-semibold">Market Demand</h3>
            </div>
            <p className="text-xs text-gray-600">Evaluate market demand and competition</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center mb-2">
              <LineChart className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-sm font-semibold">Financial Projections</h3>
            </div>
            <p className="text-xs text-gray-600">Forecast revenue, expenses, and break-even point</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center mb-2">
              <ShieldAlert className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-sm font-semibold">Risk Assessment</h3>
            </div>
            <p className="text-xs text-gray-600">Identify key risks and mitigation strategies</p>
          </CardContent>
        </Card>
      </div>
      
      {/* AI Assistant Chat Interface */}
      <div className="mt-6">
        <AIChat 
          ventureId={ventureId} 
          stage="viabilityAssessment"
          onAnalysisGenerated={handleAnalysisGenerated}
        />
      </div>
      
      {/* AI Analysis Card - Viability Analysis */}
      {aiAnalysis && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Business Viability Analysis</h3>
          
          <Tabs defaultValue="market">
            <TabsList className="mb-4 grid grid-cols-1 md:grid-cols-3">
              <TabsTrigger value="market">Market Assessment</TabsTrigger>
              <TabsTrigger value="financial">Financial Projections</TabsTrigger>
              <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="market">
              {aiAnalysis.marketAssessment && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-medium">Market Demand</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {aiAnalysis.marketAssessment.demandLevel && (
                        <div className="flex items-center mb-4">
                          <Gauge className={`h-8 w-8 mr-3 ${getDemandLevelColor(aiAnalysis.marketAssessment.demandLevel)}`} />
                          <div className={`text-2xl font-bold ${getDemandLevelColor(aiAnalysis.marketAssessment.demandLevel)}`}>
                            {aiAnalysis.marketAssessment.demandLevel.charAt(0).toUpperCase() + aiAnalysis.marketAssessment.demandLevel.slice(1)} Demand
                          </div>
                        </div>
                      )}
                      
                      {aiAnalysis.marketAssessment.demandReasons && aiAnalysis.marketAssessment.demandReasons.length > 0 && (
                        <div className="mt-2">
                          <h4 className="text-sm font-medium mb-2">Supporting Factors:</h4>
                          <ul className="space-y-1">
                            {aiAnalysis.marketAssessment.demandReasons.map((reason, index) => (
                              <li key={index} className="text-sm text-gray-700 flex items-start">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-500 mt-1.5 mr-2"></span>
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-medium">Competitive Environment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {aiAnalysis.marketAssessment.barrierToEntry && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-1">Barrier to Entry:</h4>
                          <p className="text-sm text-gray-700">{aiAnalysis.marketAssessment.barrierToEntry}</p>
                        </div>
                      )}
                      
                      {aiAnalysis.marketAssessment.competitivePressure && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Competitive Pressure:</h4>
                          <div className={`text-sm font-medium ${
                            aiAnalysis.marketAssessment.competitivePressure === "high" ? "text-red-600" :
                            aiAnalysis.marketAssessment.competitivePressure === "medium" ? "text-amber-600" : "text-green-600"
                          }`}>
                            {aiAnalysis.marketAssessment.competitivePressure.charAt(0).toUpperCase() + aiAnalysis.marketAssessment.competitivePressure.slice(1)}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="financial">
              {aiAnalysis.financialProjections && (
                <div className="space-y-4">
                  {aiAnalysis.financialProjections.projections && aiAnalysis.financialProjections.projections.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Revenue & Profit Projections</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <RevenueProjectionChart projections={aiAnalysis.financialProjections.projections} />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {aiAnalysis.financialProjections.breakEvenPoint && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md font-medium">Break-Even Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {aiAnalysis.financialProjections.breakEvenPoint.time && (
                              <div>
                                <h4 className="text-sm font-medium mb-1">Time to Break-Even:</h4>
                                <div className="flex items-center">
                                  <Coins className="h-5 w-5 text-amber-500 mr-2" />
                                  <p className="text-sm font-medium">{aiAnalysis.financialProjections.breakEvenPoint.time}</p>
                                </div>
                              </div>
                            )}
                            
                            {aiAnalysis.financialProjections.breakEvenPoint.units && (
                              <div>
                                <h4 className="text-sm font-medium mb-1">Units Required:</h4>
                                <p className="text-sm">{aiAnalysis.financialProjections.breakEvenPoint.units.toLocaleString()}</p>
                              </div>
                            )}
                            
                            {aiAnalysis.financialProjections.breakEvenPoint.revenue && (
                              <div>
                                <h4 className="text-sm font-medium mb-1">Revenue Required:</h4>
                                <p className="text-sm">${aiAnalysis.financialProjections.breakEvenPoint.revenue.toLocaleString()}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md font-medium">Financial Requirements</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {aiAnalysis.financialProjections.capitalRequired && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium mb-1">Initial Capital Required:</h4>
                              <div className="flex items-center">
                                <Coins className="h-5 w-5 text-green-500 mr-2" />
                                <p className="text-sm font-medium">{aiAnalysis.financialProjections.capitalRequired}</p>
                              </div>
                            </div>
                          )}
                          
                          {aiAnalysis.financialProjections.keyAssumptions && aiAnalysis.financialProjections.keyAssumptions.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">Key Financial Assumptions:</h4>
                              <ul className="space-y-1">
                                {aiAnalysis.financialProjections.keyAssumptions.map((assumption, index) => (
                                  <li key={index} className="text-xs text-gray-600 flex items-start">
                                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mt-1 mr-2"></span>
                                    {assumption}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="risk">
              {aiAnalysis.riskAssessment && (
                <div className="space-y-4">
                  {aiAnalysis.riskAssessment.keyRisks && aiAnalysis.riskAssessment.keyRisks.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Key Risk Factors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {aiAnalysis.riskAssessment.keyRisks.map((riskItem, index) => (
                            <div key={index} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="text-sm font-medium">{riskItem.risk}</h4>
                                <Badge variant={
                                  riskItem.impact === "high" ? "destructive" :
                                  riskItem.impact === "medium" ? "default" : "outline"
                                }>
                                  {riskItem.impact.charAt(0).toUpperCase() + riskItem.impact.slice(1)} Impact
                                </Badge>
                              </div>
                              {riskItem.mitigation && (
                                <div>
                                  <h5 className="text-xs font-medium mb-1">Mitigation Strategy:</h5>
                                  <p className="text-xs text-gray-600">{riskItem.mitigation}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {aiAnalysis.riskAssessment.successProbability !== undefined && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Success Probability</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center mb-2">
                          <Gauge className={`h-6 w-6 mr-2 ${
                            aiAnalysis.riskAssessment.successProbability >= 70 ? "text-green-500" :
                            aiAnalysis.riskAssessment.successProbability >= 40 ? "text-amber-500" : "text-red-500"
                          }`} />
                          <div className="text-lg font-bold">
                            {aiAnalysis.riskAssessment.successProbability}%
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              aiAnalysis.riskAssessment.successProbability >= 70 ? "bg-green-500" :
                              aiAnalysis.riskAssessment.successProbability >= 40 ? "bg-amber-500" : "bg-red-500"
                            }`}
                            style={{ width: `${aiAnalysis.riskAssessment.successProbability}%` }}
                          ></div>
                        </div>
                        <p className="mt-2 text-xs text-gray-600">
                          {aiAnalysis.riskAssessment.successProbability >= 70 
                            ? "High probability of success - strong viability indicators" 
                            : aiAnalysis.riskAssessment.successProbability >= 40 
                            ? "Moderate success probability - carefully consider risk factors"
                            : "Low success probability - significant challenges to overcome"
                          }
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {/* Viability Score & Recommendations */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiAnalysis.viabilityScore !== undefined && (
              <Card className="md:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md font-medium">Overall Viability Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className={`text-4xl font-bold mb-2 ${
                      aiAnalysis.viabilityScore >= 70 ? "text-green-500" :
                      aiAnalysis.viabilityScore >= 40 ? "text-amber-500" : "text-red-500"
                    }`}>
                      {aiAnalysis.viabilityScore}/100
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          aiAnalysis.viabilityScore >= 70 ? "bg-green-500" :
                          aiAnalysis.viabilityScore >= 40 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${aiAnalysis.viabilityScore}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-xs text-gray-600 text-center">
                      {aiAnalysis.viabilityScore >= 70 
                        ? "High viability - strong business potential" 
                        : aiAnalysis.viabilityScore >= 40 
                        ? "Moderate viability - proceed with caution"
                        : "Low viability - consider significant revisions"
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {aiAnalysis.recommendedActions && aiAnalysis.recommendedActions.length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md font-medium">Recommended Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {aiAnalysis.recommendedActions.map((action, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-500 mt-1.5 mr-2"></span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
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
          See example viability assessment
        </button>
        
        {isExampleOpen && (
          <div className="mt-2 bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
            <p className="font-medium">Example: Subscription-Based Meal Kit Delivery Service</p>
            <div className="mt-2 space-y-3">
              <div>
                <p className="font-medium text-xs">Market Assessment:</p>
                <p>High market demand with 22% annual growth in meal kit industry. Moderate competitive pressure with 5 major competitors, but differentiation possible through local ingredient sourcing and specialty diets focus.</p>
              </div>
              <div>
                <p className="font-medium text-xs">Financial Projections:</p>
                <p>Break-even projected at 18 months with 3,500 active subscribers. Initial capital requirement of $450,000. Projected Year 3 revenue of $4.2M with 14% profit margin.</p>
              </div>
              <div>
                <p className="font-medium text-xs">Key Risks:</p>
                <p>High customer acquisition cost (mitigated by strong retention program), logistics complexity (addressed through phased regional rollout), and ingredient cost volatility (managed with flexible menu design and supplier contracts).</p>
              </div>
              <div>
                <p className="font-medium text-xs">Overall Viability:</p>
                <p>Viability score: 72/100 - Strong potential with appropriate funding and execution. Recommended focus on customer retention strategies and technology platform development.</p>
              </div>
            </div>
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
