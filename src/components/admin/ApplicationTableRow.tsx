
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ApplicationStatusBadge from './ApplicationStatusBadge';
import { ApplicationType } from "@/services/application/types";

interface ApplicationTableRowProps {
  id: string;
  businessName: string | null;
  ownerName: string | null;
  applicationType: ApplicationType;
  submissionDate: string | null;
  applicationStatus: string;
}

const ApplicationTableRow = ({
  id,
  businessName,
  ownerName,
  applicationType,
  submissionDate,
  applicationStatus
}: ApplicationTableRowProps) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getApplicationTypeLabel = (type: ApplicationType) => {
    switch (type) {
      case "newApplication":
        return "New Business";
      case "renewalApplication":
        return "Renewal";
      case "amendmentApplication":
        return "Amendment";
      default:
        return type;
    }
  };
  
  const viewApplicationDetails = (id: string) => {
    navigate(`/admin/applications/${id}`);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{businessName || "-"}</TableCell>
      <TableCell>{ownerName || "-"}</TableCell>
      <TableCell>
        {getApplicationTypeLabel(applicationType)}
      </TableCell>
      <TableCell>{formatDate(submissionDate)}</TableCell>
      <TableCell>
        <ApplicationStatusBadge status={applicationStatus as any} />
      </TableCell>
      <TableCell>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => viewApplicationDetails(id)}
          className="flex items-center"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ApplicationTableRow;
