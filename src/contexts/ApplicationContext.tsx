import React, { createContext, useState, useContext, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "@/hooks/use-toast";
import { 
  applicationService,
  businessInformationService, 
  ownerInformationService, 
  businessLinesService, 
  declarationService 
} from "@/services/application";
import { ApplicationData, ApplicationType, ApplicationStatus } from '@/services/application/types';

interface ApplicationContextProps {
  applicationId: string | null;
  applicationType: ApplicationType | null;
  applicationStatus: ApplicationStatus | null;
  createNewApplication: (type: ApplicationType) => Promise<void>;
  updateStatus: (status: ApplicationStatus) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ApplicationContext = createContext<ApplicationContextProps>({
  applicationId: null,
  applicationType: null,
  applicationStatus: null,
  createNewApplication: async () => {},
  updateStatus: async () => {},
  isLoading: false,
  setIsLoading: () => {},
});

interface ApplicationProviderProps {
  children: React.ReactNode;
}

export const ApplicationProvider: React.FC<ApplicationProviderProps> = ({ children }) => {
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [applicationType, setApplicationType] = useState<ApplicationType | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Create a new application
  const createNewApplication = useCallback(async (type: ApplicationType) => {
    setIsLoading(true);
    try {
      const newApplicationId = uuidv4();
      
      // Create application record
      await applicationService.createApplication({
        id: newApplicationId,
        application_type: type,
        application_status: 'draft',
        submission_date: null,
        admin_notes: null,
        created_at: new Date(),
      });
      
      // Initialize related entities
      await businessInformationService.createBusinessInformation({
        application_id: newApplicationId,
      });
      
      await ownerInformationService.createOwnerInformation({
        application_id: newApplicationId,
      });
      
      await declarationService.createDeclaration({
        application_id: newApplicationId,
      });
      
      // Set context values
      setApplicationId(newApplicationId);
      setApplicationType(type);
      setApplicationStatus('draft');
      
      toast('Application Started', {
        description: `New ${type.replace("Application", "")} application has been started.`
      });
    } catch (error) {
      console.error("Error creating application:", error);
      toast('Application Failed', {
        description: "Failed to start a new application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update application status
  const updateStatus = useCallback(async (status: ApplicationStatus) => {
    setIsLoading(true);
    if (!applicationId) {
      toast('Missing Application', {
        description: "No application ID found. Cannot update status.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Update application status in database
      await applicationService.updateApplication(applicationId, {
        application_status: status,
        submission_date: status === 'submitted' ? new Date() : null,
      });

      // Update context value
      setApplicationStatus(status);
      
      toast('Application Updated', {
        description: `Application status updated to ${status}.`
      });
    } catch (error) {
      console.error("Error updating application status:", error);
      toast('Update Failed', {
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [applicationId]);

  const value = {
    applicationId,
    applicationType,
    applicationStatus,
    createNewApplication,
    updateStatus,
    isLoading,
    setIsLoading,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => useContext(ApplicationContext);
