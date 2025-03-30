
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Dashboard
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">Applications</span>
          </nav>
        </div>
      </div>

      {/* Application Header with Progress */}
      <ApplicationHeader currentStep={currentStep} totalSteps={totalSteps} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step content based on current step */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Application Type</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-2 p-4 border rounded-md hover:bg-gray-50 cursor-pointer">
                      <input 
                        type="radio" 
                        id="newApplication" 
                        name="applicationType" 
                        className="h-5 w-5 text-blue-600"
                        defaultChecked 
                      />
                      <div>
                        <label htmlFor="newApplication" className="font-medium text-gray-900">New Business Application</label>
                        <p className="text-sm text-gray-500">Apply for a new business permit</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-4 border rounded-md hover:bg-gray-50 cursor-pointer">
                      <input 
                        type="radio" 
                        id="renewalApplication" 
                        name="applicationType" 
                        className="h-5 w-5 text-blue-600" 
                      />
                      <div>
                        <label htmlFor="renewalApplication" className="font-medium text-gray-900">Renewal Application</label>
                        <p className="text-sm text-gray-500">Renew an existing business permit</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-4 border rounded-md hover:bg-gray-50 cursor-pointer">
                      <input 
                        type="radio" 
                        id="amendmentApplication" 
                        name="applicationType" 
                        className="h-5 w-5 text-blue-600" 
                      />
                      <div>
                        <label htmlFor="amendmentApplication" className="font-medium text-gray-900">Amendment/Change of Information</label>
                        <p className="text-sm text-gray-500">Update information for an existing business permit</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <>
                <BusinessInformationSection />
              </>
            )}

            {currentStep === 3 && (
              <>
                <OwnerInformationSection />
              </>
            )}

            {currentStep === 4 && (
              <>
                <BusinessOperationSection />
                <BusinessLinesSection />
              </>
            )}

            {currentStep === 5 && (
              <>
                <DeclarationSection />
              </>
            )}

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleNext}>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Helpful Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Document Checklist</h4>
                      <p className="text-sm text-gray-600">
                        Ensure you have all required documents ready:
                      </p>
                      <ul className="text-sm text-gray-600 mt-2 list-disc list-inside ml-1">
                        <li>Barangay Business Clearance</li>
                        <li>DTI/SEC Registration</li>
                        <li>Contract of Lease (if renting)</li>
                        <li>Community Tax Certificate</li>
                        <li>Picture of Business Establishment</li>
                        <li>Tax Identification Number (TIN)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Application Tips</h4>
                      <p className="text-sm text-gray-600">
                        Fill out all fields completely and accurately to avoid delays in processing.
                        You can save your application and continue later.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Contact Support</h4>
                      <p className="text-sm text-gray-600">
                        Need help? Contact BPLO at (046342) 788-2316 local 111
                        or email at bplolucena@gmail.com
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
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Contact Support</h3>
              <p className="mt-2 text-sm text-gray-600">
                Need help? Contact our support team at bplolucena@gmail.com
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Office Hours</h3>
              <p className="mt-2 text-sm text-gray-600">
                Monday - Friday: 9:00 AM - 5:00 PM
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Applications;
