
import React, { createContext, useState, useContext, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "@/utils/toastCompat";
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
        application_status: 'draft' as ApplicationStatus,
        submission_date: null,
        admin_notes: null,
        created_at: new Date().toISOString(),
        user_id: '',  // This will be set by the backend
      });
      
      // Initialize business information
      await businessInformationService.saveBusinessInformation({
        application_id: newApplicationId,
        business_name: '',
        tin_number: '',
        ownership_type: 'soleProprietorship',
        street: '',
        barangay: '',
        city_municipality: '',
        province: '',
        zip_code: '',
        mobile_no: '',
        email_address: '',
      });
      
      // Initialize owner information
      await ownerInformationService.saveOwnerInformation({
        application_id: newApplicationId,
        surname: '',
        given_name: '',
        age: 0,
        sex: 'male',
        civil_status: 'single',
        nationality: '',
        owner_street: '',
        owner_barangay: '',
        owner_city_municipality: '',
        owner_province: '',
        owner_zip_code: '',
      });
      
      // Initialize declaration
      await declarationService.saveDeclaration({
        application_id: newApplicationId,
        signature: '',
        is_agreed: false,
        declaration_place: 'City of Lucena',
      });
      
      // Set context values
      setApplicationId(newApplicationId);
      setApplicationType(type);
      setApplicationStatus('draft');
      
      toast("Application Started", {
        description: `New ${type.replace("Application", "")} application has been started.`
      });
    } catch (error) {
      console.error("Error creating application:", error);
      toast("Application Failed", {
        description: "Failed to start a new application. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update application status
  const updateStatus = useCallback(async (status: ApplicationStatus) => {
    setIsLoading(true);
    if (!applicationId) {
      toast("Missing Application", {
        description: "No application ID found. Cannot update status."
      });
      setIsLoading(false);
      return;
    }

    try {
      // Update application status in database
      await applicationService.createApplication({
        id: applicationId,
        application_status: status,
        submission_date: status === 'submitted' ? new Date().toISOString() : null,
        application_type: applicationType as ApplicationType,
        user_id: '',  // This will be ignored by the backend for updates
      });

      // Update context value
      setApplicationStatus(status);
      
      toast("Application Updated", {
        description: `Application status updated to ${status}.`
      });
    } catch (error) {
      console.error("Error updating application status:", error);
      toast("Update Failed", {
        description: "Failed to update application status. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  }, [applicationId, applicationType]);

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
