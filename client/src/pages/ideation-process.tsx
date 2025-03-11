import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SidebarNav from "@/components/sidebar-nav";
import ProgressTracker from "@/components/progress-tracker";
import { useVenture } from "@/context/venture-context";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Stage, stageOrder } from "@shared/schema";
import InitialIdea from "@/components/venture-stages/initial-idea";
import SmartRefinement from "@/components/venture-stages/smart-refinement";
import OpportunityAnalysis from "@/components/venture-stages/opportunity-analysis";
import VentureThesis from "@/components/venture-stages/venture-thesis";
import ViabilityAssessment from "@/components/venture-stages/viability-assessment";
import GtmStrategy from "@/components/venture-stages/gtm-strategy";
import PitchReport from "@/components/venture-stages/pitch-report";
import StageCard from "@/components/venture-stages/stage-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function IdeationProcess() {
  const [, params] = useRoute("/ideation/:ventureId");
  const ventureId = params?.ventureId ? parseInt(params.ventureId) : null;
  const { currentVenture, setCurrentVenture } = useVenture();
  const [activeStage, setActiveStage] = useState<Stage>("initialIdea");
  const queryClient = useQueryClient();
  
  // Fetch venture details if not in context
  const { data: venture, isLoading: isLoadingVenture } = useQuery({
    queryKey: [`/api/ventures/${ventureId}`],
    enabled: !!ventureId && !currentVenture,
  });
  
  // Fetch all stage contents for this venture
  const { data: stageContents, isLoading: isLoadingStages } = useQuery({
    queryKey: [`/api/ventures/${ventureId}/stages`],
    enabled: !!ventureId,
  });
  
  // Mutation to update venture current stage
  const updateVentureMutation = useMutation({
    mutationFn: async (stageNumber: number) => {
      return apiRequest("PATCH", `/api/ventures/${ventureId}`, {
        currentStage: stageNumber
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/ventures/${ventureId}`] });
    },
    onError: () => {
      toast({
        title: "Error updating progress",
        description: "Could not update current stage",
        variant: "destructive"
      });
    }
  });
  
  // Set current venture from fetch if needed
  useEffect(() => {
    if (venture && !currentVenture) {
      setCurrentVenture(venture);
    }
  }, [venture, currentVenture, setCurrentVenture]);
  
  // Set active stage based on current venture stage
  useEffect(() => {
    if (currentVenture) {
      const stageKeys = Object.keys(stageOrder) as Stage[];
      const currentStage = stageKeys.find(key => stageOrder[key] === currentVenture.currentStage);
      if (currentStage) {
        setActiveStage(currentStage);
      }
    }
  }, [currentVenture]);
  
  // Navigate to next/previous stage
  const navigateStage = (direction: "next" | "previous") => {
    const stageKeys = Object.keys(stageOrder) as Stage[];
    const currentIndex = stageKeys.findIndex(key => key === activeStage);
    
    if (direction === "next" && currentIndex < stageKeys.length - 1) {
      const nextStage = stageKeys[currentIndex + 1];
      setActiveStage(nextStage);
      // Update venture currentStage if moving forward
      updateVentureMutation.mutate(stageOrder[nextStage]);
    } else if (direction === "previous" && currentIndex > 0) {
      setActiveStage(stageKeys[currentIndex - 1]);
    }
  };
  
  // Check if current stage is completed
  const isStageCompleted = (stage: Stage): boolean => {
    if (!stageContents) return false;
    const content = stageContents.find((content: any) => content.stage === stage);
    return content?.isCompleted || false;
  };
  
  // Render active stage component
  const renderStageComponent = () => {
    if (isLoadingVenture || isLoadingStages) {
      return <div className="flex justify-center py-12">Loading...</div>;
    }
    
    if (!ventureId) {
      return <div className="text-center py-12">Venture not found</div>;
    }
    
    switch (activeStage) {
      case "initialIdea":
        return <InitialIdea ventureId={ventureId} />;
      case "smartRefinement":
        return <SmartRefinement ventureId={ventureId} />;
      case "opportunityAnalysis":
        return <OpportunityAnalysis ventureId={ventureId} />;
      case "ventureThesis":
        return <VentureThesis ventureId={ventureId} />;
      case "viabilityAssessment":
        return <ViabilityAssessment ventureId={ventureId} />;
      case "gtmStrategy":
        return <GtmStrategy ventureId={ventureId} />;
      case "pitchReport":
        return <PitchReport ventureId={ventureId} />;
      default:
        return <div>Unknown stage</div>;
    }
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarNav />
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            {/* Page Header */}
            <div className="px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">
                {currentVenture?.title || "Startup Venture Ideation"}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Let's transform your concept into a compelling startup venture
              </p>
            </div>
            
            {/* Progress Tracker */}
            <div className="mt-6 px-4 sm:px-6 lg:px-8">
              <ProgressTracker 
                activeStage={activeStage} 
                completedStages={stageContents?.filter((content: any) => content.isCompleted)
                  .map((content: any) => content.stage as Stage) || []}
                onStageClick={(stage) => {
                  const clickedStageOrder = stageOrder[stage];
                  const currentStageOrder = currentVenture ? currentVenture.currentStage : 1;
                  
                  // Only allow clicking on stages that we've already reached
                  if (clickedStageOrder <= currentStageOrder) {
                    setActiveStage(stage);
                  } else {
                    toast({
                      title: "Complete previous stages first",
                      description: "You need to complete earlier stages before accessing this one",
                      variant: "default"
                    });
                  }
                }}
              />
            </div>
            
            {/* Main Workflow Container */}
            <div className="px-4 sm:px-6 lg:px-8 mt-4">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {renderStageComponent()}
                
                {/* Stage Navigation */}
                <div className="p-6 border-t border-gray-200 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => navigateStage("previous")}
                    disabled={activeStage === "initialIdea"}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    onClick={() => navigateStage("next")}
                    disabled={
                      activeStage === "pitchReport" || 
                      (!isStageCompleted(activeStage) && activeStage !== "pitchReport")
                    }
                  >
                    Continue
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Workflow Preview */}
            <div className="px-4 sm:px-6 lg:px-8 mt-8">
              <h3 className="text-lg font-medium text-gray-900">Complete Workflow Preview</h3>
              <p className="mt-1 text-sm text-gray-600">Here's what's ahead in your venture creation journey</p>
              
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StageCard 
                  title="SMART Refinement"
                  description="Make your idea Specific, Measurable, Achievable, Relevant, and Time-bound"
                  icon="lightbulb"
                  items={[
                    "Define precise problem statement",
                    "Establish concrete success metrics",
                    "Set realistic timeline and milestones"
                  ]}
                />
                
                <StageCard 
                  title="Market Opportunity"
                  description="Analyze market size, growth potential, and competitive landscape"
                  icon="barChart"
                  items={[
                    "Identify target customer segments",
                    "Assess market size and growth trends",
                    "Analyze competitive landscape"
                  ]}
                />
                
                <StageCard 
                  title="Venture Thesis"
                  description="Create a compelling vision and business model"
                  icon="fileText"
                  items={[
                    "Articulate compelling vision",
                    "Define business model and revenue streams",
                    "Identify key competitive advantages"
                  ]}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
