
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStatusBadgeColor } from "./ApplicationHeader";
import { ApplicationStatus, ApplicationType } from "@/services/application/types";

interface ApplicationInfoProps {
  id: string;
  applicationType: ApplicationType;
  applicationStatus: ApplicationStatus;
  createdAt: string | null;
  submissionDate: string | null;
}

const ApplicationInfoView: React.FC<ApplicationInfoProps> = ({
  id,
  applicationType,
  applicationStatus,
  createdAt,
  submissionDate,
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getApplicationTypeLabel = (type: string) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-sm font-medium text-gray-500">Application ID</p>
          <p>{id}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Type</p>
          <p>{getApplicationTypeLabel(applicationType)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Status</p>
          <Badge className={getStatusBadgeColor(applicationStatus)}>
            {applicationStatus.replace("_", " ")}
          </Badge>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Created Date</p>
          <p>{formatDate(createdAt)}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Submission Date</p>
          <p>{formatDate(submissionDate)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationInfoView;
