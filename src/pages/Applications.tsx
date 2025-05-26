
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, HelpCircle, CheckCircle2, Loader } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicationHeader from "@/components/application/ApplicationHeader";
import BusinessInformationSection from "@/components/application/BusinessInformationSection";
import OwnerInformationSection from "@/components/application/OwnerInformationSection";
import BusinessOperationSection from "@/components/application/BusinessOperationSection";
import BusinessLinesSection from "@/components/application/BusinessLinesSection";
import DeclarationSection from "@/components/application/DeclarationSection";
import { useToast } from "@/hooks/use-toast";
import FormSectionWrapper from "@/components/application/FormSectionWrapper";
import { EnhancedRadioGroup } from "@/components/ui/enhanced-radio-group";
import { useApplication } from "@/contexts/ApplicationContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  applicationService,
  businessInformationService, 
  ownerInformationService, 
  businessLinesService, 
  declarationService 
} from "@/services/application";
import { ApplicationType } from "@/services/application/types";
import { activityGenerator } from "@/utils/activityGenerator";

const Applications = () => {
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const { toast } = useToast();
  const [applicationType, setApplicationType] = useState<ApplicationType>("newApplication");
  const [fadeIn, setFadeIn] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  
  const { 
    applicationId, 
    createNewApplication, 
    updateStatus, 
    applicationStatus,
    isLoading,
    setIsLoading
  } = useApplication();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        console.log("Auth check result:", { user: data.user, error });
        
        if (error) {
          console.error("Auth error:", error);
          setIsAuthenticated(false);
        } else if (data.user) {
          setIsAuthenticated(true);
          setCurrentUser(data.user);
          console.log("User authenticated:", data.user.id);
        } else {
          setIsAuthenticated(false);
        }
        
        if (!data.user) {
          toast({
            title: "Authentication Required",
            description: "Please sign in to create an application.",
            variant: "destructive",
          });
          navigate("/signin");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  useEffect(() => {
    console.log("Applications - Current applicationType state:", applicationType);
  }, [applicationType]);

  const applicationTypeOptions = [
    {
      value: "newApplication",
      label: "New Business Application",
      description: "For first-time business permit applications"
    },
    {
      value: "renewalApplication",
      label: "Renewal Application",
      description: "For renewing an existing business permit"
    },
    {
      value: "amendmentApplication",
      label: "Amendment/Change of Information",
      description: "For updating details on an existing business permit"
    }
  ];

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setFadeIn(false);
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleNext = async () => {
    setIsSaving(true);
    try {
      if (currentStep === 1) {
        if (!applicationId && isAuthenticated) {
          console.log("Before application creation - Selected type:", applicationType);
          console.log("Creating new application from Next button with type:", applicationType);
          
          const newAppId = await createNewApplication(applicationType);
          console.log("After creation - New application ID:", newAppId);
          
          if (!newAppId) {
            toast({
              title: "Application Creation Failed",
              description: "Failed to create application. Please try again.",
              variant: "destructive",
            });
            setIsSaving(false);
            return;
          }
        }
        
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsSaving(false);
        return;
      }
      
      if (currentStep === 2) {
        if (window.businessInfoHelpers?.validateAndSave) {
          console.log("Applications - Validating business info through helper");
          const isValid = await window.businessInfoHelpers.validateAndSave();
          
          if (!isValid) {
            toast({
              title: "Incomplete Information",
              description: "Please complete all required business information fields before proceeding.",
              variant: "destructive",
            });
            setIsSaving(false);
            return;
          }
        } else {
          const businessInfo = await businessInformationService.getBusinessInformation(applicationId || '');
          
          if (!businessInfo) {
            toast({
              title: "Incomplete Information",
              description: "Please complete the business information before proceeding.",
              variant: "destructive",
            });
            setIsSaving(false);
            return;
          }
          
          const requiredBusinessFields = [
            'business_name', 'tin_number', 'ownership_type', 
            'street', 'barangay', 'city_municipality', 
            'province', 'zip_code', 'mobile_no', 'email_address'
          ];
          
          const missingFields = requiredBusinessFields.filter(field => !businessInfo[field as keyof typeof businessInfo]);
          
          if (missingFields.length > 0) {
            toast({
              title: "Incomplete Information",
              description: "Please complete all required fields before proceeding.",
              variant: "destructive",
            });
            setIsSaving(false);
            return;
          }
        }
      } else if (currentStep === 3) {
        if (window.ownerInfoHelpers?.validateAndSave) {
          console.log("Applications - Validating owner info through helper");
          const isValid = await window.ownerInfoHelpers.validateAndSave();
          if (!isValid) {
            toast({
              title: "Incomplete Information",
              description: "Please complete all required owner information fields before proceeding.",
              variant: "destructive",
            });
            setIsSaving(false);
            return;
          }
        } else {
          const ownerInfo = await ownerInformationService.getOwnerInformation(applicationId || '');
          if (!ownerInfo) {
            toast({
              title: "Incomplete Information",
              description: "Please complete the owner information before proceeding.",
              variant: "destructive",
            });
            setIsSaving(false);
            return;
          }
          
          const requiredOwnerFields = [
            'surname', 'given_name', 'age', 'sex', 
            'civil_status', 'nationality', 'owner_street', 
            'owner_barangay', 'owner_city_municipality',
            'owner_province', 'owner_zip_code'
          ];
          
          const missingFields = requiredOwnerFields.filter(field => !ownerInfo[field as keyof typeof ownerInfo]);
          
          if (missingFields.length > 0) {
            toast({
              title: "Incomplete Information",
              description: "Please complete all required owner information fields before proceeding.",
              variant: "destructive",
            });
            setIsSaving(false);
            return;
          }
        }
      } else if (currentStep === 4) {
        const businessLines = await businessLinesService.getBusinessLines(applicationId || '');
        if (!businessLines || businessLines.length === 0) {
          toast({
            title: "Incomplete Information",
            description: "Please add at least one line of business before proceeding.",
            variant: "destructive",
          });
          setIsSaving(false);
          return;
        }
      } else if (currentStep === 5) {
        if (window.declarationHelpers?.validateAndSave) {
          console.log("Applications - Validating declaration through helper");
          const isValid = await window.declarationHelpers.validateAndSave();
          
          if (!isValid) {
            toast({
              title: "Incomplete Declaration",
              description: "Please complete the declaration before proceeding.",
              variant: "destructive",
            });
            setIsSaving(false);
            return;
          }
        } else {
          const declaration = await declarationService.getDeclaration(applicationId || '');
          if (!declaration || !declaration.signature) {
            toast({
              title: "Signature Required",
              description: "Please sign the declaration before submitting.",
              variant: "destructive",
            });
            setIsSaving(false);
            return;
          }
          
          if (!isAgreed) {
            toast({
              title: "Agreement Required",
              description: "You must agree to the declaration before submitting.",
              variant: "destructive",
            });
            setIsSaving(false);
            return;
          }
        }
      }
      
      if (currentStep < totalSteps) {
        if (currentStep === 2) {
          toast({
            title: "Business Information Saved",
            description: "Your business information has been saved successfully.",
          });
        } else if (currentStep === 3) {
          toast({
            title: "Owner Information Saved",
            description: "Your owner information has been saved successfully.",
          });
        } else if (currentStep === 4) {
          toast({
            title: "Business Operations Saved",
            description: "Your business operations and lines have been saved successfully.",
          });
        } else if (currentStep === 5) {
          toast({
            title: "Declaration Confirmed",
            description: "Your declaration has been confirmed successfully.",
          });
        }
        
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        handleSubmitApplication();
      }
    } catch (error) {
      console.error("Error validating before next step:", error);
      toast({
        title: "Error",
        description: "An error occurred while processing your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  const validateApplication = async () => {
    if (!applicationId) {
      toast({
        title: "Application Error",
        description: "Could not find application to submit. Please try again.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!isAgreed) {
      toast({
        title: "Agreement Required",
        description: "You must agree to the declaration before submitting the application.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const businessInfo = await businessInformationService.getBusinessInformation(applicationId);
      const ownerInfo = await ownerInformationService.getOwnerInformation(applicationId);
      const businessLines = await businessLinesService.getBusinessLines(applicationId);
      const declaration = await declarationService.getDeclaration(applicationId);
      
      console.log("Validation data:", { 
        businessInfo, 
        ownerInfo, 
        businessLines, 
        declaration 
      });
      
      if (!businessInfo) {
        toast({
          title: "Incomplete Application",
          description: "Please complete the Business Information section before submitting.",
          variant: "destructive",
        });
        setCurrentStep(2);
        return false;
      }
      
      if (!ownerInfo) {
        toast({
          title: "Incomplete Application",
          description: "Please complete the Owner Information section before submitting.",
          variant: "destructive",
        });
        setCurrentStep(3);
        return false;
      }
      
      if (!businessLines || businessLines.length === 0) {
        toast({
          title: "Incomplete Application",
          description: "Please add at least one Line of Business before submitting.",
          variant: "destructive",
        });
        setCurrentStep(4);
        return false;
      }
      
      if (!declaration || !declaration.signature) {
        toast({
          title: "Signature Required",
          description: "Please sign the declaration before submitting.",
          variant: "destructive",
        });
        setCurrentStep(5);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Validation error:", error);
      toast({
        title: "Validation Error",
        description: "An error occurred while validating your application. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleSubmitApplication = async () => {
    console.log("Starting application submission...");
    
    // Verify authentication before submission
    if (!isAuthenticated || !currentUser) {
      console.error("User not authenticated during submission");
      toast({
        title: "Authentication Error",
        description: "Please sign in to submit your application.",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }

    const isValid = await validateApplication();
    if (!isValid) return;

    try {
      setIsSubmitting(true);
      setIsLoading(true);
      
      console.log("Submitting application with ID:", applicationId);
      console.log("Current user:", currentUser.id);
      
      // Get business information for activity generation
      const businessInfo = await businessInformationService.getBusinessInformation(applicationId!);
      const businessName = businessInfo?.business_name || "Your Business";
      
      console.log("Business info for activity:", businessName);
      
      // Update application status to submitted
      await updateStatus('submitted');
      console.log("Application status updated to submitted");
      
      // Generate activity for application submission - with proper error handling
      try {
        console.log("Creating activity for application submission...");
        const activity = await activityGenerator.applicationSubmitted(businessName, applicationId!);
        console.log("Activity created successfully:", activity);
        
        toast({
          title: "Application Submitted",
          description: "Your business permit application has been submitted successfully.",
        });
      } catch (activityError) {
        console.error("Failed to create activity:", activityError);
        // Still show success toast even if activity creation fails
        toast({
          title: "Application Submitted",
          description: "Your business permit application has been submitted successfully.",
        });
      }
      
      navigate('/status');
    } catch (error) {
      console.error("Application submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const handleAgreementChange = (agreed: boolean) => {
    setIsAgreed(agreed);
  };

  if (isAuthenticated === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center">You need to be logged in to access this page.</p>
            <div className="flex justify-center">
              <Button onClick={() => navigate("/signin")}>
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700 hover:underline transition-colors">
              Dashboard
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">Business Permit Application</span>
          </nav>
        </div>
      </div>

      {/* Application Header with Progress */}
      <ApplicationHeader 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
        onStepClick={handleStepClick}
      />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Sections */}
          <div className={`lg:col-span-2 space-y-6 transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
            {/* Step content based on current step */}
            {currentStep === 1 && (
              <FormSectionWrapper 
                title="Application Type" 
                description="Select the type of application you wish to submit"
                stepNumber={1}
              >
                <div className="mt-4">
                  <EnhancedRadioGroup
                    options={applicationTypeOptions}
                    value={applicationType}
                    onValueChange={(value) => {
                      console.log("Application type selection changed to:", value);
                      setApplicationType(value as ApplicationType);
                    }}
                    name="applicationType"
                  />
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
              <DeclarationSection onAgreementChange={handleAgreementChange} />
            )}

            <div className="flex justify-between mt-8">
              {/* Only show back button if not on step 1 */}
              {currentStep > 1 && (
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="px-6 group"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back
                </Button>
              )}
              
              {/* If on step 1, push next button to right side */}
              {currentStep === 1 && (
                <div className="flex-1"></div>
              )}
              
              <Button 
                onClick={handleNext}
                className="px-6 bg-primary group hover:bg-primary/90 transition-all"
                disabled={isSubmitting || isSaving} 
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <Loader className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </span>
                ) : isSubmitting ? (
                  <span className="flex items-center">
                    <Loader className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                  </span>
                ) : currentStep === totalSteps ? (
                  "Submit Application"
                ) : (
                  <>
                    Next <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 shadow-md border border-gray-200/80">
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
                          <span>Filled-out Business Permit application form</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 shrink-0"></span>
                          <span>Two (2) passport size ID pictures of the owner</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 shrink-0"></span>
                          <span>One (1) valid I.D. with signature</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 shrink-0"></span>
                          <span>Community Tax Certificate (CTC/CEDULA)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 shrink-0"></span>
                          <span>DTI/SEC/CDA Registration</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 shrink-0"></span>
                          <span>Zoning clearance from City Zoning Office</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 shrink-0"></span>
                          <span>Occupancy Permit or Certificate of OP Exemption</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 shrink-0"></span>
                          <span>Health Card/Certificate from City Health Office</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 shrink-0"></span>
                          <span>Real Property Tax Clearance</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 shrink-0"></span>
                          <span>PESO Clearance from City PESO Office</span>
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
