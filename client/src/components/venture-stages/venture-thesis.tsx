import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AIChat from "@/components/ai-chat";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, AlertCircle, Lightbulb, Target, Users, DollarSign, Users2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VentureThesisProps {
  ventureId: number;
}

interface VentureThesisAnalysis {
  vision?: string;
  mission?: string;
  problemStatement?: string;
  solution?: {
    description?: string;
    keyFeatures?: string[];
    uniqueValue?: string;
  };
  targetCustomers?: {
    segments?: string[];
    personas?: Array<{
      name?: string;
      description?: string;
      painPoints?: string[];
    }>;
  };
  businessModel?: {
    revenueStreams?: string[];
    pricingStrategy?: string;
    customerAcquisition?: string;
    keyPartners?: string[];
  };
  competitiveAdvantages?: string[];
  teamAndResources?: {
    requiredRoles?: string[];
    keySkills?: string[];
    resources?: string[];
  };
  roadmap?: {
    shortTerm?: string[];
    mediumTerm?: string[];
    longTerm?: string[];
  };
  overallScore?: number;
}

export default function VentureThesis({ ventureId }: VentureThesisProps) {
  const [aiAnalysis, setAiAnalysis] = useState<VentureThesisAnalysis | null>(null);
  const [isExampleOpen, setIsExampleOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const queryClient = useQueryClient();
  
  // Mutation to mark stage as completed
  const completeStageMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/ventures/${ventureId}/stages/ventureThesis`, {
        content: { completed: true },
        aiAnalysis,
        isCompleted: true
      });
    },
    onSuccess: () => {
      setIsCompleted(true);
      toast({
        title: "Venture thesis stage completed!",
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
  
  const handleAnalysisGenerated = (analysis: VentureThesisAnalysis) => {
    setAiAnalysis(analysis);
  };
  
  const handleCompleteStage = () => {
    if (!aiAnalysis) {
      toast({
        title: "Interact with AI assistant first",
        description: "Please discuss your venture thesis with the AI assistant before completing this stage",
        variant: "destructive"
      });
      return;
    }
    
    completeStageMutation.mutate();
  };
  
  return (
    <div id="venture-thesis-stage" className="p-6">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-medium text-gray-900">Venture Thesis Creation</h2>
        {isCompleted ? (
          <Badge variant="success">Completed</Badge>
        ) : (
          <Badge>Current Step</Badge>
        )}
      </div>
      
      <p className="mt-2 text-sm text-gray-600">
        Let's create a comprehensive venture thesis that outlines your vision, market opportunity, business model, and competitive advantages.
      </p>
      
      {/* Venture Thesis Explainer */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center mb-2">
              <Lightbulb className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-sm font-semibold">Vision & Mission</h3>
            </div>
            <p className="text-xs text-gray-600">Define your company's long-term vision and purpose</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center mb-2">
              <Target className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-sm font-semibold">Solution & Value</h3>
            </div>
            <p className="text-xs text-gray-600">Describe your solution and its unique value proposition</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-sm font-semibold">Target Customers</h3>
            </div>
            <p className="text-xs text-gray-600">Define your ideal customer personas and segments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center mb-2">
              <DollarSign className="h-5 w-5 text-primary-500 mr-2" />
              <h3 className="text-sm font-semibold">Business Model</h3>
            </div>
            <p className="text-xs text-gray-600">Outline how you'll generate revenue and grow</p>
          </CardContent>
        </Card>
      </div>
      
      {/* AI Assistant Chat Interface */}
      <div className="mt-6">
        <AIChat 
          ventureId={ventureId} 
          stage="ventureThesis"
          onAnalysisGenerated={handleAnalysisGenerated}
        />
      </div>
      
      {/* AI Analysis Card - Venture Thesis Draft */}
      {aiAnalysis && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Venture Thesis Draft</h3>
          
          <Tabs defaultValue="vision">
            <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="vision">Vision & Mission</TabsTrigger>
              <TabsTrigger value="solution">Solution</TabsTrigger>
              <TabsTrigger value="customers">Target Customers</TabsTrigger>
              <TabsTrigger value="business">Business Model</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vision" className="space-y-4">
              {aiAnalysis.vision && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md font-medium">Vision</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{aiAnalysis.vision}</p>
                  </CardContent>
                </Card>
              )}
              
              {aiAnalysis.mission && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md font-medium">Mission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{aiAnalysis.mission}</p>
                  </CardContent>
                </Card>
              )}
              
              {aiAnalysis.problemStatement && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md font-medium">Problem Statement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{aiAnalysis.problemStatement}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="solution" className="space-y-4">
              {aiAnalysis.solution && (
                <>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-medium">Solution Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700">{aiAnalysis.solution.description}</p>
                    </CardContent>
                  </Card>
                  
                  {aiAnalysis.solution.keyFeatures && aiAnalysis.solution.keyFeatures.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Key Features</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {aiAnalysis.solution.keyFeatures.map((feature, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-500 mt-1.5 mr-2"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  
                  {aiAnalysis.solution.uniqueValue && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Unique Value Proposition</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">{aiAnalysis.solution.uniqueValue}</p>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
              
              {aiAnalysis.competitiveAdvantages && aiAnalysis.competitiveAdvantages.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md font-medium">Competitive Advantages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {aiAnalysis.competitiveAdvantages.map((advantage, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                          {advantage}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="customers" className="space-y-4">
              {aiAnalysis.targetCustomers && (
                <>
                  {aiAnalysis.targetCustomers.segments && aiAnalysis.targetCustomers.segments.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Target Segments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {aiAnalysis.targetCustomers.segments.map((segment, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-500 mt-1.5 mr-2"></span>
                              {segment}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  
                  {aiAnalysis.targetCustomers.personas && aiAnalysis.targetCustomers.personas.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Customer Personas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {aiAnalysis.targetCustomers.personas.map((persona, index) => (
                            <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                              <div className="flex items-center mb-2">
                                <Users2 className="h-4 w-4 text-gray-500 mr-2" />
                                <h4 className="text-sm font-medium">{persona.name}</h4>
                              </div>
                              {persona.description && (
                                <p className="text-xs text-gray-600 mb-2">{persona.description}</p>
                              )}
                              {persona.painPoints && persona.painPoints.length > 0 && (
                                <div>
                                  <h5 className="text-xs font-medium mb-1">Pain Points:</h5>
                                  <ul className="space-y-1">
                                    {persona.painPoints.map((point, idx) => (
                                      <li key={idx} className="text-xs text-gray-600 flex items-start">
                                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 mt-1 mr-2"></span>
                                        {point}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>
            
            <TabsContent value="business" className="space-y-4">
              {aiAnalysis.businessModel && (
                <>
                  {aiAnalysis.businessModel.revenueStreams && aiAnalysis.businessModel.revenueStreams.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Revenue Streams</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {aiAnalysis.businessModel.revenueStreams.map((stream, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                              {stream}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  
                  {aiAnalysis.businessModel.pricingStrategy && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Pricing Strategy</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">{aiAnalysis.businessModel.pricingStrategy}</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {aiAnalysis.businessModel.customerAcquisition && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Customer Acquisition</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">{aiAnalysis.businessModel.customerAcquisition}</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {aiAnalysis.businessModel.keyPartners && aiAnalysis.businessModel.keyPartners.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md font-medium">Key Partners</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {aiAnalysis.businessModel.keyPartners.map((partner, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-500 mt-1.5 mr-2"></span>
                              {partner}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
          
          {/* Roadmap Section */}
          {aiAnalysis.roadmap && (
            <div className="mt-6 bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Implementation Roadmap</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiAnalysis.roadmap.shortTerm && aiAnalysis.roadmap.shortTerm.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-2">Short-term (0-6 months)</h5>
                    <ul className="space-y-1">
                      {aiAnalysis.roadmap.shortTerm.map((item, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mt-1 mr-2"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {aiAnalysis.roadmap.mediumTerm && aiAnalysis.roadmap.mediumTerm.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-2">Medium-term (6-18 months)</h5>
                    <ul className="space-y-1">
                      {aiAnalysis.roadmap.mediumTerm.map((item, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-purple-500 mt-1 mr-2"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {aiAnalysis.roadmap.longTerm && aiAnalysis.roadmap.longTerm.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-2">Long-term (18+ months)</h5>
                    <ul className="space-y-1">
                      {aiAnalysis.roadmap.longTerm.map((item, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 mt-1 mr-2"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Team & Resources Section */}
          {aiAnalysis.teamAndResources && (
            <div className="mt-4 bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Team & Resources</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiAnalysis.teamAndResources.requiredRoles && aiAnalysis.teamAndResources.requiredRoles.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-2">Key Roles Needed</h5>
                    <ul className="space-y-1">
                      {aiAnalysis.teamAndResources.requiredRoles.map((role, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-500 mt-1 mr-2"></span>
                          {role}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {aiAnalysis.teamAndResources.keySkills && aiAnalysis.teamAndResources.keySkills.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-2">Critical Skills</h5>
                    <ul className="space-y-1">
                      {aiAnalysis.teamAndResources.keySkills.map((skill, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 mt-1 mr-2"></span>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {aiAnalysis.teamAndResources.resources && aiAnalysis.teamAndResources.resources.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-2">Required Resources</h5>
                    <ul className="space-y-1">
                      {aiAnalysis.teamAndResources.resources.map((resource, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mt-1 mr-2"></span>
                          {resource}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
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
          See example venture thesis
        </button>
        
        {isExampleOpen && (
          <div className="mt-2 bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
            <p className="font-medium">Example: FoodConnect - Restaurant-Farm Platform</p>
            <div className="mt-2 space-y-3">
              <div>
                <p className="font-medium text-xs">Vision & Mission:</p>
                <p>To create a sustainable food ecosystem where local farms thrive by connecting directly with restaurants, reducing waste, and supporting local economies.</p>
              </div>
              <div>
                <p className="font-medium text-xs">Solution:</p>
                <p>A two-sided marketplace platform with logistics integration that enables restaurants to browse, order, and receive fresh produce directly from local farms within 50 miles. Features include inventory management, quality ratings, delivery coordination, and price comparison.</p>
              </div>
              <div>
                <p className="font-medium text-xs">Target Customers:</p>
                <p>Primary: Independent restaurants focused on farm-to-table concepts and small-to-medium farms within 50 miles of metro areas. Secondary: Specialty food producers and high-end restaurant chains.</p>
              </div>
              <div>
                <p className="font-medium text-xs">Business Model:</p>
                <p>7% commission on transactions, premium subscription for farms ($99/month) with advanced inventory tools, and delivery coordination fees. Additional revenue from promoting featured farms and future data insights packages.</p>
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
