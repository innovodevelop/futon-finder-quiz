import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Trin {currentStep} af {totalSteps}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>
      </div>
      <div className="w-full bg-progress-bg rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-500 ease-in-out"
          style={{
            width: `${(currentStep / totalSteps) * 100}%`,
          }}
        />
      </div>
      <div className="flex justify-between mt-4">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div
              key={stepNumber}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300",
              isCompleted && "bg-primary text-primary-foreground",
              isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary/30",
              !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
            )}
            >
              {isCompleted ? "✓" : stepNumber}
            </div>
          );
        })}
      </div>
    </div>
  );
};