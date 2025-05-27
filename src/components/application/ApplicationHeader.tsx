
import React from 'react';

interface ApplicationHeaderProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({ currentStep, totalSteps, onStepClick }) => {
  const steps = [
    { number: 1, title: "Application Type", description: "Select application type" },
    { number: 2, title: "Business Information", description: "Enter business details" },
    { number: 3, title: "Owner Information", description: "Enter owner details" },
    { number: 4, title: "Business Operations", description: "Enter business operations and lines" },
    { number: 5, title: "Declaration", description: "Review and sign declaration" },
    { number: 6, title: "Documents", description: "Upload required documents" },
  ];

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between py-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Business Permit Application
            </h2>
          </div>
        </div>
        
        {/* Desktop Step Navigation */}
        <div className="hidden lg:block pb-6">
          <div className="relative">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex flex-col items-center relative">
                  {/* Connector line - positioned before each step except the first */}
                  {index > 0 && (
                    <div className="absolute top-4 right-full w-full h-0.5 bg-gray-300 -translate-y-1/2">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          step.number <= currentStep ? 'bg-primary' : 'bg-gray-300'
                        }`}
                        style={{ width: step.number <= currentStep ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                  
                  {/* Step Circle */}
                  <button
                    onClick={() => onStepClick(step.number)}
                    className={`
                      w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium
                      transition-all duration-200 relative z-10 bg-white
                      ${step.number === currentStep 
                        ? 'border-primary text-primary shadow-md' 
                        : step.number < currentStep 
                        ? 'border-primary bg-primary text-white' 
                        : 'border-gray-300 text-gray-500 hover:border-gray-400'
                      }
                      ${step.number <= currentStep ? 'cursor-pointer' : 'cursor-default'}
                    `}
                    disabled={step.number > currentStep}
                  >
                    {step.number < currentStep ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </button>
                  
                  {/* Step Label */}
                  <div className="mt-2 text-center">
                    <div className={`text-xs font-medium ${
                      step.number === currentStep 
                        ? 'text-primary' 
                        : step.number < currentStep 
                        ? 'text-primary' 
                        : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Step Navigation */}
        <div className="lg:hidden pb-6">
          <div className="flex items-center justify-center space-x-2">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium
                    ${step.number === currentStep 
                      ? 'border-primary bg-primary text-white' 
                      : step.number < currentStep 
                      ? 'border-primary bg-primary text-white' 
                      : 'border-gray-300 text-gray-500'
                    }
                  `}
                >
                  {step.number < currentStep ? (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 ${step.number < currentStep ? 'bg-primary' : 'bg-gray-300'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-3 text-center">
            <div className="text-sm font-medium text-primary">
              Step {currentStep}: {steps[currentStep - 1]?.title}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationHeader;
