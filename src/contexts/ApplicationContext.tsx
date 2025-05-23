
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ApplicationType, ApplicationStatus } from '@/services/application/types';
import { applicationService } from '@/services/application';
import { supabase } from "@/integrations/supabase/client";

interface ApplicationContextType {
  applicationId: string | null;
  applicationType: ApplicationType | null;
  applicationStatus: ApplicationStatus | null;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setApplicationId: (id: string | null) => void;
  createNewApplication: (type: ApplicationType) => Promise<string | null>;
  getApplicationDetails: () => Promise<void>;
  updateStatus: (status: ApplicationStatus) => Promise<void>;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [applicationType, setApplicationType] = useState<ApplicationType | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Check if the user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Auth error:", error);
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(!!data.user);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Create a new application
  const createNewApplication = async (type: ApplicationType) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create an application.",
        variant: "destructive",
      });
      return null;
    }
    
    setIsLoading(true);
    try {
      console.log("ApplicationContext: Creating application with explicit type:", type);
      const application = await applicationService.createApplication(type);
      if (application) {
        console.log("ApplicationContext: Application created with response:", application);
        console.log("ApplicationContext: Type in response:", application.application_type);
        setApplicationId(application.id);
        setApplicationType(application.application_type as ApplicationType);
        setApplicationStatus(application.application_status as ApplicationStatus);
        return application.id;
      }
      return null;
    } catch (error) {
      console.error("Error creating application:", error);
      toast({
        title: "Application Creation Failed",
        description: "There was an error creating your application. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get application details
  const getApplicationDetails = async () => {
    if (!applicationId) return;
    
    setIsLoading(true);
    try {
      const application = await applicationService.getApplicationById(applicationId);
      if (application) {
        console.log("ApplicationContext: Retrieved application details:", application);
        setApplicationType(application.application_type as ApplicationType);
        setApplicationStatus(application.application_status as ApplicationStatus);
      } else {
        // Application not found, reset state
        setApplicationId(null);
        setApplicationType(null);
        setApplicationStatus(null);
      }
    } catch (error) {
      console.error("Error getting application details:", error);
      toast({
        title: "Failed to Retrieve Application",
        description: "There was an error loading your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update application status
  const updateStatus = async (status: ApplicationStatus) => {
    if (!applicationId) return;
    
    setIsLoading(true);
    try {
      const application = await applicationService.updateApplicationStatus(applicationId, status);
      if (application) {
        setApplicationStatus(application.application_status as ApplicationStatus);
        
        // Show success message for submission
        if (status === 'submitted') {
          toast({
            title: "Application Submitted Successfully",
            description: "Your application has been submitted for review.",
          });
        }
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      toast({
        title: "Status Update Failed",
        description: "There was an error updating your application status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load application details when applicationId changes
  useEffect(() => {
    if (applicationId) {
      getApplicationDetails();
    } else {
      setApplicationType(null);
      setApplicationStatus(null);
    }
  }, [applicationId]);

  const value = {
    applicationId,
    applicationType,
    applicationStatus,
    isLoading,
    setIsLoading,
    setApplicationId,
    createNewApplication,
    getApplicationDetails,
    updateStatus
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
};
