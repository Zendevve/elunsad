
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { ApplicationStatus, ApplicationType } from "@/services/application/types";
import { Eye } from "lucide-react";

interface ApplicationTableRowProps {
  id: string;
  businessName: string | null;
  ownerName: string | null;
  applicationType: ApplicationType;
  submissionDate: string | null;
  applicationStatus: ApplicationStatus;
}

const ApplicationTableRow: React.FC<ApplicationTableRowProps> = ({
  id,
  businessName,
  ownerName,
  applicationType,
  submissionDate,
  applicationStatus
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const truncateId = (id: string) => {
    return id.substring(0, 8) + "...";
  };

  // Get current tab from application status
  const currentTab = applicationStatus;

  return (
    <TableRow>
      <TableCell className="font-mono text-xs">
        {truncateId(id)}
      </TableCell>
      <TableCell>
        {businessName || <span className="text-gray-400 italic">Unnamed Business</span>}
      </TableCell>
      <TableCell>
        {ownerName || <span className="text-gray-400 italic">Unknown</span>}
      </TableCell>
      <TableCell>
        {applicationType === "new" ? "New Application" : "Renewal"}
      </TableCell>
      <TableCell>
        {formatDate(submissionDate)}
      </TableCell>
      <TableCell>
        <ApplicationStatusBadge status={applicationStatus} />
      </TableCell>
      <TableCell>
        <Button variant="ghost" size="sm" asChild>
          <Link 
            to={`/admin/applications/${id}`}
            state={{ fromTab: currentTab }}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ApplicationTableRow;
