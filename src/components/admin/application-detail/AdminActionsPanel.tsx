
import React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { ApplicationStatus } from "@/services/application/types";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

interface AdminActionsPanelProps {
  currentStatus: ApplicationStatus;
  processingAction: boolean;
  adminNotes: string;
  setAdminNotes: (notes: string) => void;
  setDialogAction: (status: ApplicationStatus | null) => void;
  handleStatusUpdate: (status: ApplicationStatus) => Promise<void>;
}

const AdminActionsPanel: React.FC<AdminActionsPanelProps> = ({
  currentStatus,
  processingAction,
  adminNotes,
  setAdminNotes,
  setDialogAction,
  handleStatusUpdate,
}) => {
  return (
    <div className="space-x-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-300"
            onClick={() => setDialogAction("under_review")}
            disabled={currentStatus === "under_review"}
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Mark as Reviewing
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark Application as Under Review?</AlertDialogTitle>
            <AlertDialogDescription>
              This will set the application status to "Under Review" and notify the applicant that their submission is being reviewed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Add notes about this application (optional)"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            className="min-h-[100px] mt-4"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleStatusUpdate("under_review")}
              disabled={processingAction}
            >
              {processingAction ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-300"
            onClick={() => setDialogAction("requires_additional_info")}
            disabled={currentStatus === "requires_additional_info"}
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Request More Info
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Request Additional Information?</AlertDialogTitle>
            <AlertDialogDescription>
              This will set the application status to "Requires Additional Information" and notify the applicant that they need to provide more information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Specify what additional information is required"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            className="min-h-[100px] mt-4"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleStatusUpdate("requires_additional_info")}
              disabled={processingAction}
            >
              {processingAction ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300"
            onClick={() => setDialogAction("approved")}
            disabled={currentStatus === "approved"}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve This Application?</AlertDialogTitle>
            <AlertDialogDescription>
              This will set the application status to "Approved" and notify the applicant that their business permit has been approved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Add approval notes (optional)"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            className="min-h-[100px] mt-4"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleStatusUpdate("approved")}
              disabled={processingAction}
              className="bg-green-600 hover:bg-green-700"
            >
              {processingAction ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Approval"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-red-100 text-red-800 hover:bg-red-200 border-red-300"
            onClick={() => setDialogAction("rejected")}
            disabled={currentStatus === "rejected"}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject This Application?</AlertDialogTitle>
            <AlertDialogDescription>
              This will set the application status to "Rejected" and notify the applicant that their business permit application has been rejected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Explain the reason for rejection (required)"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            className="min-h-[100px] mt-4"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleStatusUpdate("rejected")}
              disabled={processingAction || !adminNotes.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {processingAction ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Rejection"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminActionsPanel;
