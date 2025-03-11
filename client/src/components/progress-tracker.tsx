import { Stage, stageLabels, stageOrder } from "@shared/schema";
import { cn } from "@/lib/utils";

interface ProgressTrackerProps {
  activeStage: Stage;
  completedStages: Stage[];
  onStageClick: (stage: Stage) => void;
}

export default function ProgressTracker({
  activeStage,
  completedStages,
  onStageClick,
}: ProgressTrackerProps) {
  // Get all stages in order
  const orderedStages = Object.entries(stageOrder)
    .sort((a, b) => a[1] - b[1])
    .map(([stage]) => stage as Stage);

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div className="flex items-center justify-between overflow-x-auto hide-scrollbar pb-5">
          {orderedStages.map((stage, index) => {
            const isActive = stage === activeStage;
            const isCompleted = completedStages.includes(stage);
            const stageNumber = stageOrder[stage];
            
            return (
              <div 
                key={stage}
                className={cn(
                  "progress-step relative flex flex-col items-center cursor-pointer",
                  isActive && "active",
                  isCompleted && "completed"
                )}
                onClick={() => onStageClick(stage)}
              >
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    isActive ? "bg-primary-500" : 
                    isCompleted ? "bg-green-500" : "bg-gray-200"
                  )}
                >
                  <span className={cn(
                    "text-sm font-medium",
                    isActive || isCompleted ? "text-white" : "text-gray-600"
                  )}>
                    {stageNumber}
                  </span>
                </div>
                <span className={cn(
                  "mt-2 text-xs font-medium whitespace-nowrap",
                  isActive ? "text-gray-900" : 
                  isCompleted ? "text-green-700" : "text-gray-500"
                )}>
                  {stageLabels[stage]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      <style jsx>{`
        .progress-step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 15px;
          left: 30px;
          width: 100%;
          height: 2px;
          background-color: #E5E7EB;
          z-index: -1;
        }
        
        .progress-step.active:not(:last-child)::after {
          background-color: #3B82F6;
        }
        
        .progress-step.completed:not(:last-child)::after {
          background-color: #10B981;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
