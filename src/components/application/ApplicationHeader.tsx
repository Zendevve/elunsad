
import React from 'react';
import { Check } from 'lucide-react';

interface ApplicationHeaderProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({ currentStep, totalSteps, onStepClick }) => {
  const steps = [
    { number: 1, title: "Application Type Selection", description: "Choose your application type" },
    { number: 2, title: "Business Details & Registration", description: "Enter business information and registration details" },
    { number: 3, title: "Business Owner Information", description: "Provide owner personal and contact details" },
    { number: 4, title: "Operations & Business Lines", description: "Define business operations and activity lines" },
    { number: 5, title: "Declaration & Signature", description: "Review terms and provide digital signature" },
    { number: 6, title: "Document Submission", description: "Upload all required supporting documents" },
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
            {/* Progress bar background - positioned to connect between step circles */}
            <div className="absolute top-5 h-0.5 bg-gray-200" 
                 style={{ 
                   left: '8.33%', 
                   right: '8.33%'
                 }} 
                 aria-hidden="true">
              <div 
                className="h-full bg-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              />
            </div>
            
            {/* Steps */}
            <div className="relative flex justify-between px-[8.33%]">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center group max-w-40">
                  {/* Step Circle */}
                  <button
                    onClick={() => onStepClick(step.number)}
                    className={`
                      relative w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-semibold
                      transition-all duration-200 bg-white z-10 shadow-sm
                      ${step.number === currentStep 
                        ? 'border-blue-600 text-blue-600 ring-4 ring-blue-100' 
                        : step.number < currentStep 
                        ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700' 
                        : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600'
                      }
                      ${step.number <= currentStep ? 'cursor-pointer' : 'cursor-default'}
                    `}
                    disabled={step.number > currentStep}
                  >
                    {step.number < currentStep ? (
                      <Check className="w-5 h-5" strokeWidth={3} />
                    ) : (
                      step.number
                    )}
                  </button>
                  
                  {/* Step Content */}
                  <div className="mt-3 text-center">
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
            <div className="absolute top-4 h-0.5 bg-gray-200" 
                 style={{ 
                   left: '8.33%', 
                   right: '8.33%'
                 }} 
                 aria-hidden="true">
              <div 
                className="h-full bg-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
              />
            </div>
            
            {/* Steps */}
            <div className="relative flex justify-between px-[8.33%]">
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
                        ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700' 
                        : 'border-gray-300 text-gray-500'
                      }
                      ${step.number <= currentStep ? 'cursor-pointer' : 'cursor-default'}
                    `}
                    disabled={step.number > currentStep}
                  >
                    {step.number < currentStep ? (
                      <Check className="w-4 h-4" strokeWidth={3} />
                    ) : (
                      step.number
                    )}
                  </button>
                  
                  {/* Step Title Only */}
                  <div className="mt-2 text-center max-w-20">
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
                    <Check className="w-3 h-3" strokeWidth={3} />
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
