
import React from 'react';
import ApplicationStatusCard from './ApplicationStatusCard';
import AdminNotesCard from './AdminNotesCard';

interface ApplicationOverviewTabProps {
  application: {
    id: string;
    created_at: string;
    submission_date?: string;
    updated_at: string;
    admin_notes?: string;
  };
  onRefetch: () => void;
}

const ApplicationOverviewTab: React.FC<ApplicationOverviewTabProps> = ({
  application,
  onRefetch
}) => {
  return (
    <div className="space-y-4">
      <ApplicationStatusCard
        createdAt={application.created_at}
        submissionDate={application.submission_date}
        updatedAt={application.updated_at}
      />
      <AdminNotesCard
        applicationId={application.id}
        initialNotes={application.admin_notes}
        onRefetch={onRefetch}
      />
    </div>
  );
};

export default ApplicationOverviewTab;
