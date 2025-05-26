
import React, { useState, useEffect } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { ApplicationStatus, ApplicationType } from "@/services/application/types";
import { documentService, REQUIRED_DOCUMENTS } from "@/services/documentService";
import ApplicationStatusBadge from "./ApplicationStatusBadge";
import DocumentStatusIndicator from "./DocumentStatusIndicator";

interface ApplicationTableRowProps {
  id: string;
  businessName: string | null;
  ownerName: string | null;
  applicationType: ApplicationType;
  submissionDate: string | null;
  applicationStatus: ApplicationStatus;
  onStatusChange?: (newStatus: ApplicationStatus) => void;
}

const ApplicationTableRow: React.FC<ApplicationTableRowProps> = ({
  id,
  businessName,
  ownerName,
  applicationType,
  submissionDate,
  applicationStatus,
  onStatusChange
}) => {
  const [documentStatus, setDocumentStatus] = useState({
    uploaded: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  });

  useEffect(() => {
    loadDocumentStatus();
  }, [id]);

  const loadDocumentStatus = async () => {
    try {
      const completion = await documentService.checkDocumentCompletion(id);
      const totalRequired = REQUIRED_DOCUMENTS.length;
      const uploaded = totalRequired - completion.missingDocuments.length;
      
      setDocumentStatus({
        uploaded,
        approved: completion.allApproved ? totalRequired : completion.pendingDocuments.length + completion.rejectedDocuments.length < totalRequired ? totalRequired - completion.missingDocuments.length - completion.pendingDocuments.length - completion.rejectedDocuments.length : 0,
        pending: completion.pendingDocuments.length,
        rejected: completion.rejectedDocuments.length
      });
    } catch (error) {
      console.error('Error loading document status:', error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getApplicationTypeDisplay = (type: ApplicationType) => {
    switch (type) {
      case "newApplication":
        return "New Application";
      case "renewalApplication":
        return "Renewal";
      case "amendmentApplication":
        return "Amendment";
      default:
        return type;
    }
  };

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        {businessName || <span className="text-gray-400 italic">No business name</span>}
      </TableCell>
      <TableCell>
        {ownerName || <span className="text-gray-400 italic">No owner info</span>}
      </TableCell>
      <TableCell>
        <Badge variant="outline">{getApplicationTypeDisplay(applicationType)}</Badge>
      </TableCell>
      <TableCell>{formatDate(submissionDate)}</TableCell>
      <TableCell>
        <ApplicationStatusBadge status={applicationStatus} />
      </TableCell>
      <TableCell>
        <DocumentStatusIndicator
          totalRequired={REQUIRED_DOCUMENTS.length}
          uploaded={documentStatus.uploaded}
          approved={documentStatus.approved}
          pending={documentStatus.pending}
          rejected={documentStatus.rejected}
        />
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/admin/applications/${id}`} className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            
            {applicationStatus === "submitted" && (
              <>
                <DropdownMenuItem onClick={() => handleStatusChange("under_review")}>
                  <Clock className="mr-2 h-4 w-4" />
                  Start Review
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("approved")}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("rejected")}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </DropdownMenuItem>
              </>
            )}
            
            {applicationStatus === "under_review" && (
              <>
                <DropdownMenuItem onClick={() => handleStatusChange("approved")}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("rejected")}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("requires_additional_info")}>
                  <Clock className="mr-2 h-4 w-4" />
                  Request More Info
                </DropdownMenuItem>
              </>
            )}
            
            {applicationStatus === "requires_additional_info" && (
              <>
                <DropdownMenuItem onClick={() => handleStatusChange("under_review")}>
                  <Clock className="mr-2 h-4 w-4" />
                  Resume Review
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("approved")}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("rejected")}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default ApplicationTableRow;
