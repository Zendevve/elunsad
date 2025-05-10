import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/utils/toastCompat';
import { v4 as uuidv4 } from 'uuid';
import { 
  applicationService,
  businessInformationService, 
  ownerInformationService, 
  businessOperationsService,
  businessLinesService,
  declarationService
} from '@/services/application';
import { ApplicationStatus, ApplicationType, OwnershipType } from '@/services/application/types';

interface ApplicationContextType {
  applicationId: string | null;
  applicationStatus: ApplicationStatus | null;
  applicationType: ApplicationType | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  createNewApplication: (applicationType: ApplicationType) => Promise<string | null>;
  updateStatus: (status: ApplicationStatus) => Promise<boolean>;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const useApplication = (): ApplicationContextType => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
};

export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus | null>(null);
  const [applicationType, setApplicationType] = useState<ApplicationType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Create a new application
  const createNewApplication = async (appType: ApplicationType): Promise<string | null> => {
    setIsLoading(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast({
          description: "Please sign in to create an application."
        });
        return null;
      }

      // Create the application record
      const newApplication = {
        application_type: appType,
        user_id: user.id
      };
      
      const { data: appData, error: appError } = await applicationService.createApplication(newApplication);
      
      if (appError || !appData) {
        console.error("Error creating application:", appError);
        toast({
          description: "Failed to create application. Please try again."
        });
        return null;
      }
      
      // Initialize related records
      try {
        // These might now be handled differently based on updates
        await businessInformationService.saveBusinessInformation({
          application_id: appData.id,
          business_name: '',
          tin_number: '',
          ownership_type: 'soleProprietorship', // Fixed to match the enum
          street: '',
          barangay: '',
          city_municipality: '',
          province: '',
          zip_code: '',
          mobile_no: '',
          email_address: '',
        });
        
        await ownerInformationService.saveOwnerInformation({
          application_id: appData.id,
          surname: '',
          given_name: '',
          age: 18,
          sex: 'male',
          civil_status: 'single',
          nationality: '',
          owner_street: '',
          owner_barangay: '',
          owner_city_municipality: '',
          owner_province: '',
          owner_zip_code: '',
        });
        
        await declarationService.saveDeclaration({
          application_id: appData.id,
          signature: '',
          is_agreed: false,
        });
      } catch (error) {
        console.error("Error initializing application data:", error);
        // Continue anyway since the main application was created
      }

      // Set state once everything is done
      setApplicationId(appData.id);
      setApplicationStatus(appData.application_status);
      setApplicationType(appData.application_type);
      
      toast({
        description: "Application created successfully."
      });
      
      return appData.id;
    } catch (error) {
      console.error("Unexpected error creating application:", error);
      toast({
        description: "An unexpected error occurred. Please try again."
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update application status
  const updateStatus = async (status: ApplicationStatus): Promise<boolean> => {
    if (!applicationId) {
      toast({
        description: "No active application to update."
      });
      return false;
    }

    setIsLoading(true);
    try {
      // Only update needed fields for the status change
      const updateData = {
        application_status: status,
        submission_date: status === 'submitted' ? new Date().toISOString() : null,
      };

      const { data, error } = await applicationService.updateApplicationStatus(applicationId, status);
      
      if (error) {
        console.error("Error updating application status:", error);
        toast({
          description: "Failed to update application status."
        });
        return false;
      }

      setApplicationStatus(data?.application_status as ApplicationStatus || status);
      
      toast({
        description: `Application status updated to ${status.replace('_', ' ')}.`
      });
      
      return true;
    } catch (error) {
      console.error("Unexpected error updating application status:", error);
      toast({
        description: "An unexpected error occurred while updating status."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Return context provider
  return (
    <ApplicationContext.Provider
      value={{
        applicationId,
        applicationStatus,
        applicationType,
        isLoading,
        setIsLoading,
        createNewApplication,
        updateStatus,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
