import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ApplicationDetailsHeaderProps {
  applicationType: string;
  applicationId: string;
  applicationStatus: string;
}

const ApplicationDetailsHeader: React.FC<ApplicationDetailsHeaderProps> = ({
  applicationType,
  applicationId,
  applicationStatus
}) => {
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

  const getApplicationTypeLabel = (type: string) => {
    switch (type) {
      case "newApplication":
        return "New Business Application";
      case "renewalApplication":
        return "Renewal Application";
      case "amendmentApplication":
        return "Amendment Application";
      default:
        return type;
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {getApplicationTypeLabel(applicationType)}
        </h1>
        <p className="text-gray-600">Application #{applicationId.substring(0, 8)}</p>
      </div>
      <div className="flex items-center gap-4">
        <Badge className={getStatusBadgeColor(applicationStatus)}>
          {applicationStatus.replace("_", " ")}
        </Badge>
        <Button variant="outline" asChild>
          <Link to="/admin#applications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Applications
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ApplicationDetailsHeader;
