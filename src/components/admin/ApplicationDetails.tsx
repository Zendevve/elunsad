
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import DocumentReview from './DocumentReview';
import ApplicationActions from './ApplicationActions';
import ApplicationDetailsHeader from './ApplicationDetailsHeader';
import ApplicationOverviewTab from './ApplicationOverviewTab';
import ApplicationBusinessTab from './ApplicationBusinessTab';
import ApplicationOwnerTab from './ApplicationOwnerTab';
import ApplicationOperationsTab from './ApplicationOperationsTab';
import { getApplicationFullDetails } from './ApplicationDetailsService';

interface ApplicationDetailsProps {
  applicationId: string;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({ applicationId }) => {
  const { isLoading, error, data: applicationData, refetch } = useQuery({
    queryKey: ['applicationDetails', applicationId],
    queryFn: () => getApplicationFullDetails(applicationId),
    enabled: !!applicationId,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <div className="space-x-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview"><Skeleton className="h-8 w-24" /></TabsTrigger>
            <TabsTrigger value="business"><Skeleton className="h-8 w-24" /></TabsTrigger>
            <TabsTrigger value="owner"><Skeleton className="h-8 w-24" /></TabsTrigger>
            <TabsTrigger value="operations"><Skeleton className="h-8 w-24" /></TabsTrigger>
            <TabsTrigger value="documents"><Skeleton className="h-8 w-24" /></TabsTrigger>
            <TabsTrigger value="actions"><Skeleton className="h-8 w-24" /></TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </TabsContent>
          <TabsContent value="business">
            <Skeleton className="h-48 w-full" />
          </TabsContent>
          <TabsContent value="owner">
            <Skeleton className="h-48 w-full" />
          </TabsContent>
          <TabsContent value="operations">
            <Skeleton className="h-48 w-full" />
          </TabsContent>
          <TabsContent value="documents">
            <Skeleton className="h-48 w-full" />
          </TabsContent>
           <TabsContent value="actions">
            <Skeleton className="h-48 w-full" />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  if (error || !applicationData) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-lg font-semibold">Error loading application details.</h2>
        <p className="text-muted-foreground">
          Please check the application ID or try again later.
        </p>
        <Button variant="outline" asChild>
          <Link to="/admin/applications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Applications
          </Link>
        </Button>
      </div>
    );
  }

  const { application, businessInformation, ownerInformation, businessOperations } = applicationData;

  return (
    <div className="space-y-6">
      <ApplicationDetailsHeader
        applicationType={application.application_type}
        applicationId={application.id}
        applicationStatus={application.application_status}
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="business">Business Info</TabsTrigger>
          <TabsTrigger value="owner">Owner Info</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ApplicationOverviewTab
            application={application}
            onRefetch={refetch}
          />
        </TabsContent>

        <TabsContent value="business">
          {businessInformation && (
            <ApplicationBusinessTab businessInformation={businessInformation} />
          )}
        </TabsContent>

        <TabsContent value="owner">
          {ownerInformation && (
            <ApplicationOwnerTab ownerInformation={ownerInformation} />
          )}
        </TabsContent>

        <TabsContent value="operations">
          {businessOperations && (
            <ApplicationOperationsTab businessOperations={businessOperations} />
          )}
        </TabsContent>

        <TabsContent value="documents">
          <DocumentReview applicationId={applicationId} />
        </TabsContent>

        <TabsContent value="actions">
          <ApplicationActions 
            applicationId={applicationId}
            currentStatus={application.application_status}
            currentNotes={application.admin_notes}
            onStatusUpdate={refetch}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationDetails;
