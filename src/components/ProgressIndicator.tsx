import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
  return (
    <div id="fq-progress-indicator" className="fq-progress">
      <div className="fq-progress__header">
        <span className="fq-progress__text">
          Trin {currentStep} af {totalSteps}
        </span>
        <span className="fq-progress__text">
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>
      </div>
      <div className="fq-progress__bar">
        <div
          className="fq-progress__fill"
          style={{
            width: `${(currentStep / totalSteps) * 100}%`,
          }}
        />
      </div>
      <div className="fq-progress__steps">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div
              key={stepNumber}
              id={`fq-progress-step-${stepNumber}`}
              className={cn(
                "fq-progress__step",
                isCompleted && "fq-progress__step--completed",
                isCurrent && "fq-progress__step--current",
                !isCompleted && !isCurrent && "fq-progress__step--inactive"
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