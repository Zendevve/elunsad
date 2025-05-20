import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { adminApplicationService } from "@/services/application/adminApplicationService";
import { ApplicationStatus } from "@/services/application/types";
import {
  CheckCircle,
  AlertTriangle,
  Info,
  Loader2,
  ArrowLeft,
} from "lucide-react";

interface ApplicationData {
  id: string;
  application_type: string;
  application_status: string;
  submission_date: string | null;
  created_at: string;
  user_id: string;
  admin_notes: string | null;
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
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState<string>("");
  const [declarationsAccepted, setDeclarationsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const fromTab = (location.state as { fromTab?: string })?.fromTab || 'submitted';
  
  useEffect(() => {
    const fetchApplicationDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await adminApplicationService.getApplicationDetails(applicationId);
        setApplicationData(data);
        setAdminNotes(data.admin_notes || "");
        // Check if declarations exist and if they are accepted
        if (data.declarations && data.declarations.accepted) {
          setDeclarationsAccepted(true);
        }
      } catch (error: any) {
        console.error("Error fetching application details:", error);
        setError(error.message || "Failed to load application details.");
        toast({
          variant: "destructive",
          title: "Failed to load application",
          description: "Could not retrieve the application details."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [applicationId]);
  
  const handleStatusUpdate = async (newStatus: ApplicationStatus) => {
    setIsUpdating(true);
    
    try {
      console.log(`Updating application ${applicationId} status to ${newStatus}`);
      await adminApplicationService.updateApplicationStatus(applicationId, newStatus, adminNotes);
      
      toast({
        title: "Status updated",
        description: `Application status changed to ${newStatus.replace('_', ' ')}`,
      });
      
      // Update the local state
      setApplicationData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          application_status: newStatus
        };
      });
      
      // Briefly show success message before navigating back
      setTimeout(() => {
        // Navigate back to the application list with refresh flag and active tab
        navigate('/admin', {
          state: { 
            refreshData: true, 
            activeTab: newStatus // Set the tab to show the new status
          }
        });
      }, 1500);
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was a problem updating the application status."
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!applicationData) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Application Not Found</h2>
        <p className="text-gray-600">Could not retrieve application details.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Applications
      </Button>

      {/* Application Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Application Details
            <Badge variant="secondary">{applicationData.application_type}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Application ID</p>
              <p className="text-gray-900">{applicationData.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <div className="flex items-center space-x-2">
                {applicationData.application_status === "approved" && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {applicationData.application_status === "rejected" && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
                {applicationData.application_status === "under_review" && (
                  <Info className="h-4 w-4 text-blue-500" />
                )}
                <p className="text-gray-900">{applicationData.application_status.replace(/_/g, " ")}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Submission Date</p>
              <p className="text-gray-900">{formatDate(applicationData.submission_date)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Created At</p>
              <p className="text-gray-900">{formatDate(applicationData.created_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {applicationData.business_information ? (
            <>
              <div>
                <p className="text-sm font-medium text-gray-600">Business Name</p>
                <p className="text-gray-900">{applicationData.business_information.business_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Address</p>
                <p className="text-gray-900">{applicationData.business_information.address}</p>
              </div>
              {/* Display other business information fields here */}
            </>
          ) : (
            <p className="text-gray-500">No business information available.</p>
          )}
        </CardContent>
      </Card>

      {/* Owner Information */}
      <Card>
        <CardHeader>
          <CardTitle>Owner Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {applicationData.owner_information ? (
            <>
              <div>
                <p className="text-sm font-medium text-gray-600">Owner Name</p>
                <p className="text-gray-900">
                  {applicationData.owner_information.given_name} {applicationData.owner_information.surname}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-gray-900">{applicationData.owner_information.email}</p>
              </div>
              {/* Display other owner information fields here */}
            </>
          ) : (
            <p className="text-gray-500">No owner information available.</p>
          )}
        </CardContent>
      </Card>

      {/* Declarations */}
      <Card>
        <CardHeader>
          <CardTitle>Declarations</CardTitle>
        </CardHeader>
        <CardContent>
          {applicationData.declarations ? (
            <div className="space-y-2">
              <p>
                <Checkbox
                  checked={declarationsAccepted}
                  onCheckedChange={setDeclarationsAccepted}
                  id="declaration-checkbox"
                />
                <label htmlFor="declaration-checkbox" className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I confirm that all the information provided is true and accurate.
                </label>
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No declarations available.</p>
          )}
        </CardContent>
      </Card>

      {/* Admin Notes and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Notes & Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              placeholder="Add admin notes..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setAdminNotes("")}>
              Clear Notes
            </Button>
            {isUpdating ? (
              <Button disabled>
                Updating <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate("rejected")}
                  disabled={!declarationsAccepted}
                >
                  Reject Application
                </Button>
                <Button
                  onClick={() => handleStatusUpdate("approved")}
                  disabled={!declarationsAccepted}
                >
                  Approve Application
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationDetails;
