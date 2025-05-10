
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { ApplicationStatus } from "@/services/application/types";

interface ApplicationHeaderProps {
  id: string;
  status: ApplicationStatus;
  loading: boolean;
}

export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "draft": return "bg-gray-500";
    case "submitted": return "bg-blue-500";
    case "under_review": return "bg-amber-500";
    case "approved": return "bg-green-500";
    case "rejected": return "bg-red-500";
    case "requires_additional_info": return "bg-purple-500";
    default: return "bg-gray-500";
  }
};

const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({ id, status, loading }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/admin/applications')} disabled={loading}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>
        <h1 className="text-2xl font-bold">Application Details</h1>
        <Badge className={getStatusBadgeColor(status)}>
          {status.replace("_", " ")}
        </Badge>
      </div>
    </div>
  );
};

export default ApplicationHeader;
