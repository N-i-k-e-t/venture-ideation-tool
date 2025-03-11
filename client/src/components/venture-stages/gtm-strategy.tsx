import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AIChat from "@/components/ai-chat";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, AlertCircle, Target, Users, Presentation, MessageSquare, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerAcquisitionChart, ChannelComparisonChart } from "@/components/chart-components";

interface GTMStrategyProps {
  ventureId: number;
}

interface ChannelData {
  name: string;
  effectiveness: number;
  costEfficiency: number;
  timeToResults: number;
}

interface PricingTier {
  name: string;
  price: string;
  benefits: string[];
  target: string;
}

interface GTMAnalysis {
  targetMarketStrategy?: {
    primarySegments?: string[];
    segmentPrioritization?: Array<{
      segment: string;
      priority: number;
      reasoning: string;
    }>;
    earlyAdopters?: string;
  };
  marketingStrategy?: {
    valueProposition?: string;
    keyMessages?: string[];
    channels?: ChannelData[];
    contentStrategy?: string[];
  };
  salesStrategy?: {
    salesProcess?: string[];
    conversionTactics?: string[];
    partnershipOpportunities?: string[];
  };
  pricingStrategy?: {
    strategy?: string;
    pricingTiers?: PricingTier[];
    competitivePricing?: string;
  };
  customerAcquisition?: {
    cac?: string;
    ltv?: string;
    growthProjections?: Array<{
      month: number;
      customers: number;
    }>;
  };
  launchPlan?: {
    phases?: Array<{
      name: string;
      timeline: string;
      activities: string[];
      goals: string[];
    }>;
    keyMetrics?: string[];
  };
  overallScore?: number;
}

export default function GTMStrategy({ ventureId }: GTMStrategyProps) {
  const [aiAnalysis, setAiAnalysis] = useState<GTMAnalysis | null>(null);
  const [isExampleOpen, setIsExampleOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const queryClient = useQueryClient();
  
  // Mutation to mark stage as completed
  const completeStageMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/ventures/${ventureId}/stages/gtmStrategy`, {
        content: { completed: true },
        aiAnalysis,
        isCompleted: true
      });
    },
    onSuccess: () => {
      setIsCompleted(true);
      toast({
        title: "Go-to-Market strategy stage completed!",
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
  
  const handleAnalysisGenerated = (analysis: GTMAnalysis) => {
    setAiAnalysis(analysis);
  };
  
  const handleCompleteStage = () => {
    if (!aiAnalysis) {
      toast({
        title: "Interact with AI assistant first",
        description: "Please discuss your Go-to-Market strategy with the AI assistant before completing this stage",
        variant: "destructive"
      });
      return;
    }
    
    completeStageMutation.mutate();
  };
  
  return (
    <div id="gtm-strategy-stage" className="p-6">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-medium text-gray-900">Go-to-Market (GTM) Strategy</h2>
        {isCompleted ? (
          <Badge variant="success">Completed</Badge>
        ) : (
          <Badge>Current Step</Badge>
        )}
      </div>
      
      <p className="mt-2 text-sm text-gray-600">
        Let's develop your go-to-market strategy. We'll define how you'll reach customers, your pricing model, and your launch plan.
      </p>
      
      {/* GTM Strategy Explainer */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center mb-2">
              <Target className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-sm font-semibold">Target Segments</h3>
            </div>
            <p className="text-xs text-gray-600">Prioritize market segments and identify early adopters</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center mb-2">
              <MessageSquare className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-sm font-semibold">Marketing Strategy</h3>
            </div>
            <p className="text-xs text-gray-600">Define your messaging, channels, and content plan</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center mb-2">
              <DollarSign className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-sm font-semibold">Pricing Strategy</h3>
            </div>
            <p className="text-xs text-gray-600">Set your pricing model and tiers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center mb-2">
              <Presentation className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-sm font-semibold">Launch Plan</h3>
            </div>
            <p className="text-xs text-gray-600">Create phased rollout plan with key metrics</p>
          </CardContent>
        </Card>
      </div>
      
      {/* AI Assistant Chat Interface */}
      <div className="mt-6">
        <AIChat 
          ventureId={ventureId} 
          stage="gtmStrategy"
          onAnalysisGenerated={handleAnalysisGenerated}
        />
      </div>
      
      {/* AI Analysis Card - GTM Strategy Analysis */}
      {aiAnalysis && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Go-to-Market Strategy</h3>
          
          <Tabs defaultValue="targeting">
            <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="targeting">Target Market</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="launch">Launch Plan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="targeting">
              {aiAnalysis.targetMarketStrategy && (
                <div className="space-y-4">
                  {/* Primary Segments */}
                  {aiAnalysis.targetMarketStrategy.primarySegments && aiAnalysis.targetMarketStrategy.primarySegments.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Primary Market Segments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {aiAnalysis.targetMarketStrategy.primarySegments.map((segment, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-500 mt-1.5 mr-2"></span>
                              {segment}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Segment Prioritization */}
                  {aiAnalysis.targetMarketStrategy.segmentPrioritization && aiAnalysis.targetMarketStrategy.segmentPrioritization.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Segment Prioritization</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {aiAnalysis.targetMarketStrategy.segmentPrioritization
                            .sort((a, b) => a.priority - b.priority)
                            .map((item, index) => (
                              <div key={index} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                                <div className="flex justify-between items-center mb-1">
                                  <h4 className="text-sm font-medium">{item.segment}</h4>
                                  <Badge variant="outline">Priority {item.priority}</Badge>
                                </div>
                                <p className="text-xs text-gray-600">{item.reasoning}</p>
                              </div>
                            ))
                          }
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Early Adopters */}
                  {aiAnalysis.targetMarketStrategy.earlyAdopters && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Early Adopters Strategy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center mb-4">
                          <Users className="h-5 w-5 text-primary-500 mr-2" />
                          <p className="text-sm text-gray-700">{aiAnalysis.targetMarketStrategy.earlyAdopters}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="marketing">
              {aiAnalysis.marketingStrategy && (
                <div className="space-y-4">
                  {/* Value Proposition */}
                  {aiAnalysis.marketingStrategy.valueProposition && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Value Proposition</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">{aiAnalysis.marketingStrategy.valueProposition}</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Key Messages */}
                  {aiAnalysis.marketingStrategy.keyMessages && aiAnalysis.marketingStrategy.keyMessages.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Key Messages</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {aiAnalysis.marketingStrategy.keyMessages.map((message, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-500 mt-1.5 mr-2"></span>
                              <div className="italic">"{message}"</div>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Marketing Channels */}
                  {aiAnalysis.marketingStrategy.channels && aiAnalysis.marketingStrategy.channels.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Marketing Channels</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 mb-4">
                          <ChannelComparisonChart channels={aiAnalysis.marketingStrategy.channels} />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Content Strategy */}
                  {aiAnalysis.marketingStrategy.contentStrategy && aiAnalysis.marketingStrategy.contentStrategy.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Content Strategy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {aiAnalysis.marketingStrategy.contentStrategy.map((item, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-500 mt-1.5 mr-2"></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="pricing">
              {aiAnalysis.pricingStrategy && (
                <div className="space-y-4">
                  {/* Pricing Strategy */}
                  {aiAnalysis.pricingStrategy.strategy && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Pricing Strategy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">{aiAnalysis.pricingStrategy.strategy}</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Pricing Tiers */}
                  {aiAnalysis.pricingStrategy.pricingTiers && aiAnalysis.pricingStrategy.pricingTiers.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Pricing Tiers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {aiAnalysis.pricingStrategy.pricingTiers.map((tier, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="text-center mb-4">
                                <h4 className="text-lg font-medium">{tier.name}</h4>
                                <div className="mt-1 text-2xl font-bold text-primary-600">{tier.price}</div>
                                <div className="mt-1 text-xs text-gray-500">{tier.target}</div>
                              </div>
                              <ul className="space-y-2">
                                {tier.benefits.map((benefit, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 flex items-start">
                                    <svg className="h-5 w-5 text-green-500 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Competitive Pricing */}
                  {aiAnalysis.pricingStrategy.competitivePricing && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Competitive Pricing Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">{aiAnalysis.pricingStrategy.competitivePricing}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
              
              {/* Customer Acquisition */}
              {aiAnalysis.customerAcquisition && (
                <div className="mt-4 space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-medium">Customer Acquisition Economics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {aiAnalysis.customerAcquisition.cac && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Customer Acquisition Cost (CAC):</h4>
                            <div className="text-lg font-semibold text-primary-600">{aiAnalysis.customerAcquisition.cac}</div>
                          </div>
                        )}
                        
                        {aiAnalysis.customerAcquisition.ltv && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Customer Lifetime Value (LTV):</h4>
                            <div className="text-lg font-semibold text-green-600">{aiAnalysis.customerAcquisition.ltv}</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {aiAnalysis.customerAcquisition.growthProjections && aiAnalysis.customerAcquisition.growthProjections.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Customer Growth Projections</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <CustomerAcquisitionChart data={aiAnalysis.customerAcquisition.growthProjections} />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="launch">
              {aiAnalysis.launchPlan && (
                <div className="space-y-4">
                  {/* Launch Phases */}
                  {aiAnalysis.launchPlan.phases && aiAnalysis.launchPlan.phases.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Launch Plan Phases</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative">
                          {/* Timeline Line */}
                          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                          
                          <div className="space-y-6">
                            {aiAnalysis.launchPlan.phases.map((phase, index) => (
                              <div key={index} className="relative pl-10">
                                {/* Timeline Circle */}
                                <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-primary-100 border-2 border-primary-500 flex items-center justify-center">
                                  <span className="text-xs font-medium">{index + 1}</span>
                                </div>
                                
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-medium">{phase.name}</h4>
                                    <Badge variant="outline">{phase.timeline}</Badge>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <h5 className="text-xs font-medium mb-1">Key Activities:</h5>
                                      <ul className="space-y-1">
                                        {phase.activities.map((activity, idx) => (
                                          <li key={idx} className="text-xs text-gray-600 flex items-start">
                                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mt-1 mr-2"></span>
                                            {activity}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    
                                    <div>
                                      <h5 className="text-xs font-medium mb-1">Goals & Milestones:</h5>
                                      <ul className="space-y-1">
                                        {phase.goals.map((goal, idx) => (
                                          <li key={idx} className="text-xs text-gray-600 flex items-start">
                                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 mt-1 mr-2"></span>
                                            {goal}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Key Metrics */}
                  {aiAnalysis.launchPlan.keyMetrics && aiAnalysis.launchPlan.keyMetrics.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Key Success Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {aiAnalysis.launchPlan.keyMetrics.map((metric, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-500 mt-1.5 mr-2"></span>
                              {metric}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
              
              {/* Overall GTM Score */}
              {aiAnalysis.overallScore !== undefined && (
                <Card className="mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md font-medium">Overall GTM Strategy Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center">
                      <div className={`text-4xl font-bold mb-2 ${
                        aiAnalysis.overallScore >= 75 ? "text-green-500" :
                        aiAnalysis.overallScore >= 50 ? "text-amber-500" : "text-red-500"
                      }`}>
                        {aiAnalysis.overallScore}/100
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            aiAnalysis.overallScore >= 75 ? "bg-green-500" :
                            aiAnalysis.overallScore >= 50 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${aiAnalysis.overallScore}%` }}
                        ></div>
                      </div>
                      <p className="mt-2 text-xs text-gray-600 text-center">
                        {aiAnalysis.overallScore >= 75 
                          ? "Strong GTM strategy - well-positioned for market entry" 
                          : aiAnalysis.overallScore >= 50 
                          ? "Solid foundation - some areas need refinement"
                          : "Needs significant improvement - consider revisiting core elements"
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
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
          See example Go-to-Market strategy
        </button>
        
        {isExampleOpen && (
          <div className="mt-2 bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
            <p className="font-medium">Example: B2B SaaS Project Management Tool</p>
            <div className="mt-2 space-y-3">
              <div>
                <p className="font-medium text-xs">Target Segments:</p>
                <p>Primary: Mid-market technology companies (50-500 employees). Secondary: Professional services firms and marketing agencies. Early adopters: Tech startups with distributed teams seeking better collaboration tools.</p>
              </div>
              <div>
                <p className="font-medium text-xs">Marketing Strategy:</p>
                <p>Content marketing focused on project management best practices, webinars showcasing solution to common pain points, LinkedIn and industry publication advertising. Key channels: SEO (40%), paid search (25%), partner marketing (20%), and industry events (15%).</p>
              </div>
              <div>
                <p className="font-medium text-xs">Pricing Strategy:</p>
                <p>Tiered SaaS model: Starter ($15/user/month) for small teams, Professional ($29/user/month) with advanced reporting, Enterprise ($49/user/month) with premium features and support. Annual billing discount of 20%. Free trial for 14 days.</p>
              </div>
              <div>
                <p className="font-medium text-xs">Launch Plan:</p>
                <p>Phase 1 (1-3 months): Closed beta with 15 partner companies, refine product based on feedback. Phase 2 (3-6 months): Public launch with introductory pricing, focus on case study development. Phase 3 (6-12 months): Feature expansion and integration partnerships to drive growth.</p>
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
