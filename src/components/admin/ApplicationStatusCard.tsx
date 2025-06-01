
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface ApplicationStatusCardProps {
  createdAt: string;
  submissionDate?: string;
  updatedAt: string;
}

const ApplicationStatusCard: React.FC<ApplicationStatusCardProps> = ({
  createdAt,
  submissionDate,
  updatedAt
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Application Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Created</p>
            <p className="text-lg">{formatDate(createdAt)}</p>
          </div>
          {submissionDate && (
            <div>
              <p className="text-sm font-medium text-gray-500">Submitted</p>
              <p className="text-lg">{formatDate(submissionDate)}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-500">Last Updated</p>
            <p className="text-lg">{formatDate(updatedAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationStatusCard;
