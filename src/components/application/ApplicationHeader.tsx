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
    { number: 6, title: "Documents", description: "Upload required documents" }, // New step
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
        <nav className="hidden sm:flex space-x-4" aria-label="Progress">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              {step.number > 1 && (
                <div className="absolute top-4 left-[-1.5rem] h-0.5 w-8 bg-gray-300" aria-hidden="true" />
              )}
              <button
                onClick={() => onStepClick(step.number)}
                className={`group flex items-center ${step.number === currentStep ? 'text-primary' : step.number < currentStep ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'} text-sm font-medium`}
                aria-current={step.number === currentStep ? 'step' : undefined}
                disabled={step.number > currentStep}
              >
                <span className="flex items-center">
                  {step.number < currentStep ? (
                    <svg className="w-5 h-5 mr-2 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className={`h-6 w-6 flex items-center justify-center rounded-full border-2 ${step.number === currentStep ? 'border-primary' : 'border-gray-300'} group-hover:border-gray-400`}>
                      <span className="text-xs">{step.number}</span>
                    </span>
                  )}
                  <span className="ml-2">{step.title}</span>
                </span>
              </button>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ApplicationHeader;
