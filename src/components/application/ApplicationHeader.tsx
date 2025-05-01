
import StepIndicator from "./StepIndicator";

interface ApplicationHeaderProps {
  currentStep: number;
  totalSteps: number;
}

const stepTitles = [
  "Application Type",
  "Business Information",
  "Owner Information",
  "Business Operation",
  "Review & Submit"
];

const ApplicationHeader = ({ currentStep, totalSteps }: ApplicationHeaderProps) => {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-semibold text-center mb-6">Business Permit Application</h1>
        
        <div className="max-w-4xl mx-auto">
          <StepIndicator 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
            stepTitles={stepTitles}
            className="px-8 md:px-16"
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicationHeader;
