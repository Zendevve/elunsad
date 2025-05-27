
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
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="md:flex md:items-center md:justify-between py-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Business Permit Application
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Complete all required steps to submit your application
            </p>
          </div>
        </div>
        
        {/* Desktop Step Navigation */}
        <div className="hidden lg:block pb-8">
          <div className="relative">
            {/* Progress bar background */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" aria-hidden="true">
              <div 
                className="h-full bg-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              />
            </div>
            
            {/* Steps */}
            <div className="relative flex justify-between">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center group">
                  {/* Step Circle */}
                  <button
                    onClick={() => onStepClick(step.number)}
                    className={`
                      relative w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold
                      transition-all duration-200 bg-white z-10 shadow-sm
                      ${step.number === currentStep 
                        ? 'border-blue-600 text-blue-600 ring-4 ring-blue-100' 
                        : step.number < currentStep 
                        ? 'border-blue-600 bg-blue-600 text-white' 
                        : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600'
                      }
                      ${step.number <= currentStep ? 'cursor-pointer' : 'cursor-default'}
                    `}
                    disabled={step.number > currentStep}
                  >
                    {step.number < currentStep ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </button>
                  
                  {/* Step Content */}
                  <div className="mt-3 text-center max-w-24">
                    <div className={`text-sm font-medium leading-tight ${
                      step.number === currentStep 
                        ? 'text-blue-600' 
                        : step.number < currentStep 
                        ? 'text-blue-600' 
                        : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className={`text-xs mt-1 leading-tight ${
                      step.number === currentStep 
                        ? 'text-blue-500' 
                        : step.number < currentStep 
                        ? 'text-blue-500' 
                        : 'text-gray-400'
                    }`}>
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Medium Screen Navigation */}
        <div className="hidden md:block lg:hidden pb-6">
          <div className="relative">
            {/* Progress bar */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" aria-hidden="true">
              <div 
                className="h-full bg-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              />
            </div>
            
            {/* Steps */}
            <div className="relative flex justify-between">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center">
                  {/* Step Circle */}
                  <button
                    onClick={() => onStepClick(step.number)}
                    className={`
                      relative w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold
                      transition-all duration-200 bg-white z-10
                      ${step.number === currentStep 
                        ? 'border-blue-600 text-blue-600' 
                        : step.number < currentStep 
                        ? 'border-blue-600 bg-blue-600 text-white' 
                        : 'border-gray-300 text-gray-500'
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
                  
                  {/* Step Title Only */}
                  <div className="mt-2 text-center max-w-16">
                    <div className={`text-xs font-medium leading-tight ${
                      step.number === currentStep 
                        ? 'text-blue-600' 
                        : step.number < currentStep 
                        ? 'text-blue-600' 
                        : 'text-gray-500'
                    }`}>
                      {step.title.split(' ')[0]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium
                    ${step.number === currentStep 
                      ? 'border-blue-600 bg-blue-600 text-white' 
                      : step.number < currentStep 
                      ? 'border-blue-600 bg-blue-600 text-white' 
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
                  <div className={`w-6 h-0.5 ${step.number < currentStep ? 'bg-blue-600' : 'bg-gray-300'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Current Step Info */}
          <div className="text-center">
            <div className="text-sm font-medium text-blue-600">
              Step {currentStep} of {totalSteps}: {steps[currentStep - 1]?.title}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {steps[currentStep - 1]?.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationHeader;
