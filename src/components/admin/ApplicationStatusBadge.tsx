
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ApplicationStatus } from "@/services/application/types";

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
}

const ApplicationStatusBadge = ({ status }: ApplicationStatusBadgeProps) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-500";
      case "submitted":
        return "bg-blue-500";
      case "under_review":
        return "bg-amber-500";
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      case "requires_additional_info":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Badge className={getStatusBadgeColor(status)}>
      {status.replace("_", " ")}
    </Badge>
  );
};

export default ApplicationStatusBadge;
