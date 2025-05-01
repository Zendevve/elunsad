
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  className?: string;
}

const StepIndicator = ({
  currentStep,
  totalSteps,
  stepTitles,
  className,
}: StepIndicatorProps) => {
  return (
    <div className={cn("w-full py-3", className)}>
      <ol className="flex items-center w-full max-w-[95%] mx-auto">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <li 
              key={stepNumber}
              className={cn(
                "flex items-center",
                stepNumber < totalSteps ? "w-full" : "",
                "md:transition-all md:duration-500"
              )}
            >
              <div className="flex flex-col items-center">
                {/* Step indicator */}
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full shrink-0 border-2 transition-all duration-300 font-medium text-xs",
                    isActive && "border-primary bg-primary text-primary-foreground",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    !isActive && !isCompleted && "border-muted-foreground text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
                </div>
                
                {/* Step title */}
                <span
                  className={cn(
                    "absolute hidden md:block mt-10 text-xs text-center",
                    isActive && "font-medium text-primary",
                    isCompleted && "text-primary",
                    !isActive && !isCompleted && "text-muted-foreground"
                  )}
                >
                  {stepTitles[index]}
                </span>
              </div>
              
              {/* Connector line */}
              {stepNumber < totalSteps && (
                <div className="w-full flex items-center">
                  <div 
                    className={cn(
                      "w-full h-0.5",
                      isCompleted ? "bg-primary" : "bg-muted"
                    )}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default StepIndicator;
