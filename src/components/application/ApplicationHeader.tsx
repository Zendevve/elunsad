
import StepIndicator from "./StepIndicator";

interface ApplicationHeaderProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
  stepTitles?: string[];
}

const defaultStepTitles = [
  "Application Type",
  "Business Information",
  "Owner Information",
  "Business Operation",
  "Payment Options",
  "Review & Submit"
];

const ApplicationHeader = ({ 
  currentStep, 
  totalSteps, 
  onStepClick,
  stepTitles = defaultStepTitles
}: ApplicationHeaderProps) => {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <h1 className="text-2xl font-semibold text-center mb-5">Business Permit Application</h1>
        
        <div className="max-w-4xl mx-auto px-4">
          <StepIndicator 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
            stepTitles={stepTitles}
            onStepClick={onStepClick}
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicationHeader;
