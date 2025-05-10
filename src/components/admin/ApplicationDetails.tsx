import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminApplicationService } from "@/services/application/adminApplicationService";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ApplicationData, ApplicationStatus } from "@/services/application/types";
import { ArrowLeft, Loader2 } from "lucide-react";

// Import our new subcomponents
import ApplicationHeader from "./application-detail/ApplicationHeader";
import ApplicationInfoView from "./application-detail/ApplicationInfoView";
import AdminActionsPanel from "./application-detail/AdminActionsPanel";
import AdminNotesView from "./application-detail/AdminNotesView";
import BusinessInformationView from "./application-detail/BusinessInformationView";
import OwnerInformationView from "./application-detail/OwnerInformationView";
import BusinessOperationsView from "./application-detail/BusinessOperationsView";
import BusinessLinesView from "./application-detail/BusinessLinesView";
import DeclarationsView from "./application-detail/DeclarationsView";

// Define a more comprehensive type for our application data including related entities
interface DetailedApplicationData extends ApplicationData {
  business_information?: any;
  owner_information?: any;
  business_operations?: any;
  business_lines?: any[];
  declarations?: any;
}

interface ApplicationDetailsProps {
  applicationId: string;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({ applicationId }) => {
  const [application, setApplication] = useState<DetailedApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [dialogAction, setDialogAction] = useState<ApplicationStatus | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails(applicationId);
    }
  }, [applicationId]);

  const fetchApplicationDetails = async (id: string) => {
    try {
      setLoading(true);
      const data = await adminApplicationService.getApplicationDetails(id);
      setApplication(data as DetailedApplicationData);
      // Check if admin_notes exists before trying to access it
      setAdminNotes(data?.admin_notes || "");
    } catch (error) {
      console.error("Error fetching application details:", error);
      toast('Failed to load application details', {
        description: "There was a problem loading the application. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: ApplicationStatus) => {
    if (!applicationId) return;
    
    try {
      setProcessingAction(true);
      await adminApplicationService.updateApplicationStatus(applicationId, status, adminNotes);
      
      toast('Status Updated', {
        description: `Application status has been updated to ${status.replace("_", " ")}.`
      });
      
      // Refresh the application data
      fetchApplicationDetails(applicationId);
      setDialogAction(null);
    } catch (error) {
      console.error("Error updating application status:", error);
      toast('Failed to update status', {
        description: "There was a problem updating the application status. Please try again."
      });
    } finally {
      setProcessingAction(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-lg">Loading application details...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700">Application not found or has been deleted.</p>
        <Button variant="outline" onClick={() => navigate('/admin/applications')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <ApplicationHeader 
          id={application.id} 
          status={application.application_status}
          loading={loading} 
        />
        
        <AdminActionsPanel
          currentStatus={application.application_status}
          processingAction={processingAction}
          adminNotes={adminNotes}
          setAdminNotes={setAdminNotes}
          setDialogAction={setDialogAction}
          handleStatusUpdate={handleStatusUpdate}
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <ApplicationInfoView
          id={application.id}
          applicationType={application.application_type}
          applicationStatus={application.application_status}
          createdAt={application.created_at}
          submissionDate={application.submission_date || null}
        />

        {/* Only show admin notes card if application has admin notes */}
        <AdminNotesView adminNotes={application.admin_notes} />
      </div>

      <BusinessInformationView businessInformation={application.business_information} />
      <OwnerInformationView ownerInformation={application.owner_information} />
      <BusinessOperationsView businessOperations={application.business_operations} />
      <BusinessLinesView businessLines={application.business_lines || []} />
      <DeclarationsView declarations={application.declarations} />

      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={() => navigate('/admin/applications')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>
      </div>
    </div>
  );
};

export default ApplicationDetails;
