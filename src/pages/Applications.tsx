
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, HelpCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicationHeader from "@/components/application/ApplicationHeader";
import BusinessInformationSection from "@/components/application/BusinessInformationSection";
import OwnerInformationSection from "@/components/application/OwnerInformationSection";
import BusinessOperationSection from "@/components/application/BusinessOperationSection";
import BusinessLinesSection from "@/components/application/BusinessLinesSection";
import DeclarationSection from "@/components/application/DeclarationSection";
import { useToast } from "@/components/ui/use-toast";
import FormSectionWrapper from "@/components/application/FormSectionWrapper";

const Applications = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Submit the form
      toast({
        title: "Application Submitted",
        description: "Your business permit application has been submitted successfully.",
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Dashboard
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">Business Permit Application</span>
          </nav>
        </div>
      </div>

      {/* Application Header with Progress */}
      <ApplicationHeader currentStep={currentStep} totalSteps={totalSteps} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step content based on current step */}
            {currentStep === 1 && (
              <FormSectionWrapper 
                title="Application Type" 
                description="Select the type of application you wish to submit"
                stepNumber={1}
              >
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-start p-4 border rounded-md bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                    <input 
                      type="radio" 
                      id="newApplication" 
                      name="applicationType" 
                      className="h-5 w-5 text-primary mt-1" 
                      defaultChecked 
                    />
                    <div className="ml-3">
                      <label htmlFor="newApplication" className="font-medium text-gray-900 block cursor-pointer">New Business Application</label>
                      <p className="text-sm text-gray-500 mt-1">For first-time business permit applications</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-4 border rounded-md bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                    <input 
                      type="radio" 
                      id="renewalApplication" 
                      name="applicationType" 
                      className="h-5 w-5 text-primary mt-1"
                    />
                    <div className="ml-3">
                      <label htmlFor="renewalApplication" className="font-medium text-gray-900 block cursor-pointer">Renewal Application</label>
                      <p className="text-sm text-gray-500 mt-1">For renewing an existing business permit</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-4 border rounded-md bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                    <input 
                      type="radio" 
                      id="amendmentApplication" 
                      name="applicationType" 
                      className="h-5 w-5 text-primary mt-1"
                    />
                    <div className="ml-3">
                      <label htmlFor="amendmentApplication" className="font-medium text-gray-900 block cursor-pointer">Amendment/Change of Information</label>
                      <p className="text-sm text-gray-500 mt-1">For updating details on an existing business permit</p>
                    </div>
                  </div>
                </div>
              </FormSectionWrapper>
            )}

            {currentStep === 2 && (
              <BusinessInformationSection />
            )}

            {currentStep === 3 && (
              <OwnerInformationSection />
            )}

            {currentStep === 4 && (
              <>
                <BusinessOperationSection />
                <BusinessLinesSection />
              </>
            )}

            {currentStep === 5 && (
              <DeclarationSection />
            )}

            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={handleBack} 
                disabled={currentStep === 1}
                className="px-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button 
                onClick={handleNext}
                className="px-6 bg-primary"
              >
                {currentStep === totalSteps ? (
                  "Submit Application"
                ) : (
                  <>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader className="py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
                <CardTitle className="text-lg font-medium flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5 text-primary" />
                  Application Guidance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">Required Documents</h4>
                      <ul className="text-sm text-gray-600 mt-2 space-y-1.5 list-inside">
                        <li className="flex items-start">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 shrink-0"></span>
                          <span>Barangay Business Clearance</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 shrink-0"></span>
                          <span>DTI/SEC Registration</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 shrink-0"></span>
                          <span>Contract of Lease (if applicable)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 shrink-0"></span>
                          <span>Tax Identification Number (TIN)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 shrink-0"></span>
                          <span>Establishment Photos</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">Current Step: {currentStep} of {totalSteps}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {currentStep === 1 && "Choose your application type"}
                        {currentStep === 2 && "Enter your business details"}
                        {currentStep === 3 && "Enter owner information"}
                        {currentStep === 4 && "Provide business operation details"}
                        {currentStep === 5 && "Review and submit your application"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">Need Help?</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Contact BPLO at (046) 788-2316 or<br/>
                        <a href="mailto:bplolucena@gmail.com" className="text-primary hover:underline">bplolucena@gmail.com</a>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Support</h3>
              <p className="mt-2 text-sm text-gray-600">
                Need assistance? Contact us at<br/>
                <a href="mailto:bplolucena@gmail.com" className="text-primary hover:underline">bplolucena@gmail.com</a>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
              <ul className="mt-2 space-y-1">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-primary hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-primary hover:underline">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Office Hours</h3>
              <p className="mt-2 text-sm text-gray-600">
                Monday - Friday: 8:00 AM - 5:00 PM<br/>
                Closed on weekends and holidays
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Applications;
