import { useState, useEffect } from "react";
import { adminApplicationService } from "@/services/application/adminApplicationService";
import { useToast } from "@/hooks/use-toast";
import { ApplicationData, ApplicationStatus } from "@/services/application/types";

export const useApplicationDetails = (applicationId: string) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Handle fetching application details 
  const fetchApplicationDetails = async () => {
    if (!applicationId) {
      setError("No application ID provided");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
  
    try {
      console.log(`Fetching application details for ID: ${applicationId}`);
      const data = await adminApplicationService.getApplicationDetails(applicationId);
      console.log('Application details retrieved:', data);
      setApplication(data);
    } catch (err: any) {
      console.error('Error fetching application details:', err);
      setError(err.message || "Failed to load application details");
      toast({
        variant: "destructive",
        title: "Error loading application",
        description: "Could not retrieve the application details"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationId]);
  
  // Update application status
  const updateApplicationStatus = async (newStatus: ApplicationStatus, adminNotes?: string) => {
    if (!applicationId || !application) {
      console.error("Cannot update status: Application not loaded");
      return false;
    }
    
    try {
      console.log(`Updating application ${applicationId} status to ${newStatus}`);
      await adminApplicationService.updateApplicationStatus(applicationId, newStatus, adminNotes);
      
      // Update local state
      setApplication(prev => prev ? {...prev, application_status: newStatus} : null);
      
      return true;
    } catch (error) {
      console.error("Error updating application status:", error);
      return false;
    }
  };
  
  return {
    application,
    loading,
    error,
    refreshData: fetchApplicationDetails,
    updateApplicationStatus
  };
};
