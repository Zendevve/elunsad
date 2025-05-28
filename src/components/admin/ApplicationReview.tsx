
import React, { useState, useEffect } from "react";
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { adminApplicationService } from "@/services/applicationService";
import { useToast } from "@/hooks/use-toast";
import { ApplicationStatus, ApplicationType } from "@/services/application/types";
import { ApplicationListItem } from "@/services/application/adminApplicationTypes";
import { 
  FileText, Search, RefreshCcw, AlertCircle, 
  Check, AlertTriangle 
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import ApplicationTableRow from "./ApplicationTableRow";
import { useQuery } from "@tanstack/react-query";
import { activityGenerator } from "@/utils/activityGenerator";
import { businessInformationService } from "@/services/application";
import DocumentStatusIndicator from "./DocumentStatusIndicator";

const ApplicationReview = () => {
  const [activeTab, setActiveTab] = useState<string>("submitted");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Use React Query for data fetching
  const { 
    data: applications = [],
    error: queryError, 
    isLoading, 
    isError,
    refetch
  } = useQuery({
    queryKey: ['applications', activeTab],
    queryFn: async () => {
      console.log(`Fetching applications for tab: ${activeTab}`);
      if (activeTab === "all") {
        return adminApplicationService.getAllApplications();
      } else {
        return adminApplicationService.getApplicationsByStatus(activeTab as ApplicationStatus);
      }
    },
    staleTime: 1000 * 60, // 1 minute before considering data stale
  });

  // Function to handle status change with activity generation
  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus, currentApplication: ApplicationListItem) => {
    try {
      // Update the application status
      await adminApplicationService.updateApplicationStatus(applicationId, newStatus);
      
      // Get business name for activity generation
      const businessName = currentApplication.business_information?.business_name || "Business Application";
      
      // Generate activity for status change
      await activityGenerator.statusChanged(newStatus, businessName, applicationId);
      
      // Refetch data to update the UI
      refetch();
      
      toast({
        title: "Status Updated",
        description: `Application status changed to ${newStatus.replace('_', ' ')}`,
      });
    } catch (error) {
      console.error("Error updating application status:", error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    }
  };

  // Filter applications based on search term
  const filteredApplications = searchTerm.trim() 
    ? applications.filter(app => {
        const businessName = app.business_information?.business_name || "";
        const ownerSurname = app.owner_information?.surname || "";
        const ownerGivenName = app.owner_information?.given_name || "";
        const ownerName = ownerSurname && ownerGivenName ? 
          `${ownerSurname}, ${ownerGivenName}` : "";
        const applicationId = app.id || "";
        
        return (
          applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ownerName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : applications;

  // Handle search input change
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Force refetch data
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing applications",
      description: "Getting the latest data from the server"
    });
  };

  // Handle retry with all applications
  const handleRetryWithAllApplications = async () => {
    setActiveTab("all");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Application Review</h1>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 w-[250px]"
            />
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">Error loading applications</h3>
            <p className="text-sm text-red-700">{(queryError as Error)?.message || "Unknown error occurred"}</p>
            <div className="flex gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refetch()} 
                className="text-red-700"
              >
                <RefreshCcw className="h-3 w-3 mr-1" />
                Try again
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetryWithAllApplications} 
                className="text-amber-700"
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Try fetching all applications
              </Button>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="submitted" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="under_review">Under Review</TabsTrigger>
          <TabsTrigger value="requires_additional_info">Requires Info</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <RefreshCcw className="h-8 w-8 animate-spin text-primary mb-2" />
                <p>Loading applications...</p>
              </div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-500 mb-4">
                {activeTab === "all" 
                  ? "There are no applications in the system yet."
                  : `There are no applications with the status "${activeTab.replace('_', ' ')}".`}
              </p>
              <div className="flex flex-col gap-3 items-center">
                <Button 
                  variant="outline" 
                  onClick={() => refetch()}
                  className="flex items-center gap-1"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Try Again
                </Button>
                
                {activeTab !== "all" && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setActiveTab("all")}
                    className="text-primary"
                  >
                    View all applications instead
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetryWithAllApplications}
                  className="text-amber-700 border-amber-300 hover:bg-amber-50"
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Try fetching all applications
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4 flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span>Found <strong>{filteredApplications.length}</strong> application(s)</span>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <ApplicationTableRow 
                      key={app.id}
                      id={app.id}
                      businessName={app.business_information?.business_name || null}
                      ownerName={
                        app.owner_information ? 
                          `${app.owner_information.surname || ''}, ${app.owner_information.given_name || ''}`.trim().replace(/^,\s*/, '') : 
                          null
                      }
                      applicationType={app.application_type}
                      submissionDate={app.submission_date}
                      applicationStatus={app.application_status}
                      onStatusChange={(newStatus) => handleStatusChange(app.id, newStatus, app)}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationReview;
