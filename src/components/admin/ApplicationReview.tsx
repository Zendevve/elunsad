
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
import { 
  FileText, Eye, Search, RefreshCcw, AlertCircle, 
  Check, AlertTriangle, Bug, Database 
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import ApplicationTableRow from "./ApplicationTableRow";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

interface Application {
  id: string;
  application_type: ApplicationType;
  application_status: ApplicationStatus;
  submission_date: string | null;
  created_at: string;
  user_id: string;
  business_information?: any;
  owner_information?: any;
}

const ApplicationReview = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<string>("submitted");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [debugMode, setDebugMode] = useState(false);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const { toast } = useToast();
  const location = useLocation();

  // Check if we have a refresh param from a return navigation
  useEffect(() => {
    // Check for state passed from application detail page
    const locationState = location.state as { refreshData?: boolean, activeTab?: string } | undefined;
    
    if (locationState?.activeTab) {
      setActiveTab(locationState.activeTab);
    }
  }, [location]);

  // Use React Query for data fetching
  const { 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['applications', activeTab],
    queryFn: async () => {
      setError(null);
      try {
        console.log(`Fetching applications for tab: ${activeTab}`);
        let data;
        
        try {
          // First try to get applications by the selected status
          if (activeTab === "all") {
            const response = await adminApplicationService.getAllApplications();
            setRawResponse(response); // Store raw response for debug mode
            data = response;
          } else {
            const response = await adminApplicationService.getApplicationsByStatus(activeTab as ApplicationStatus);
            setRawResponse(response); // Store raw response for debug mode
            data = response;
          }
          
          // Check if we actually got data back
          if (data && data.length > 0) {
            console.log("Applications fetched successfully:", data.length);
            toast({
              title: "Applications loaded",
              description: `Successfully loaded ${data.length} applications`
            });
          } else {
            console.log("No applications found for the selected status.");
          }
        } catch (statusError: any) {
          console.error("Error fetching applications by status:", statusError);
          
          // Show more descriptive error message based on error type
          if (statusError.code === "42702") {
            toast({
              variant: "warning",
              title: "Database column reference issue",
              description: "There's an ambiguous column reference in the database query. The admin is working on fixing this."
            });
          } else {
            toast({
              variant: "warning",
              title: "Using local filtering",
              description: "There was an issue with the database query, showing filtered results instead."
            });
          }
          
          // Fallback to fetching all applications if fetching by status fails
          console.log("Attempting to fetch all applications as fallback");
          const response = await adminApplicationService.getAllApplications();
          setRawResponse(response); // Store raw response for debug mode
          data = response;
          
          // If we're on a specific tab, filter on the client side
          if (activeTab !== "all" && data) {
            data = data.filter(app => app.application_status === activeTab);
          }
        }
        
        console.log("Applications fetched:", data?.length || 0);
        
        if (!data || data.length === 0) {
          console.log(`No applications found for status: ${activeTab}`);
        } else {
          console.log("Sample application data:", data[0]?.id, data[0]?.application_status);
        }
        
        setApplications(data || []);
        setFilteredApplications(data || []);
        return data || [];
      } catch (error: any) {
        console.error("Error fetching applications:", error);
        setError(error.message || "Failed to load applications. See console for details.");
        toast({
          variant: "destructive",
          title: "Failed to load applications",
          description: "There was a problem loading the applications. Please try again."
        });
        throw error;
      }
    },
    // Automatically refetch on mount and when coming back to the page
    refetchOnMount: 'always',
    refetchOnWindowFocus: true
  });
  
  // Effect to handle initial loading and refresh from navigation
  useEffect(() => {
    const locationState = location.state as { refreshData?: boolean, activeTab?: string } | undefined;
    if (locationState?.refreshData) {
      console.log('Detected return navigation with refresh flag, refetching data...');
      refetch();
      
      // Clear the state to prevent repeated refreshes
      window.history.replaceState({}, document.title);
    }
  }, [location.state, refetch]);

  const handleRetryWithAllApplications = async () => {
    setRetryCount(prev => prev + 1);
    
    try {
      console.log("Attempting to fetch all applications regardless of status");
      const data = await adminApplicationService.getAllApplications();
      setRawResponse(data); // Store raw response for debug mode
      
      console.log(`Retrieved ${data?.length || 0} total applications`);
      setApplications(data || []);
      setFilteredApplications(data || []);
      
      if (data && data.length > 0) {
        toast({
          title: "Applications loaded",
          description: `Successfully loaded ${data.length} applications`
        });
      } else {
        toast({
          variant: "warning",
          title: "No applications found",
          description: "No applications were found in the database."
        });
      }
    } catch (error: any) {
      console.error("Error in retry attempt:", error);
      setError(error.message || "Failed to load applications after multiple attempts");
    }
  };

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredApplications(applications);
      return;
    }
    
    // Filter applications based on search term
    const filtered = applications.filter(app => {
      const businessName = app.business_information?.business_name || "";
      const ownerSurname = app.owner_information?.surname || "";
      const ownerGivenName = app.owner_information?.given_name || "";
      const ownerName = ownerSurname && ownerGivenName ? 
        `${ownerSurname}, ${ownerGivenName}` : "";
      const applicationId = app.id || "";
      
      return (
        applicationId.toLowerCase().includes(value.toLowerCase()) ||
        businessName.toLowerCase().includes(value.toLowerCase()) ||
        ownerName.toLowerCase().includes(value.toLowerCase())
      );
    });
    
    setFilteredApplications(filtered);
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
            onClick={() => refetch()}
            className="flex items-center gap-1"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDebugMode}
            className="flex items-center gap-1"
          >
            <Bug className="h-4 w-4" />
            {debugMode ? "Hide Debug" : "Debug Mode"}
          </Button>
        </div>
      </div>
      
      {debugMode && (
        <Alert variant="warning" className="bg-amber-50 border-amber-300">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle>Debug Mode Enabled</AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-amber-600" />
                <span className="font-semibold">Raw Data:</span>
              </div>
              <div className="bg-slate-900 text-white p-3 rounded-md text-sm overflow-auto max-h-60">
                <pre>{JSON.stringify(rawResponse, null, 2)}</pre>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">Error loading applications</h3>
            <p className="text-sm text-red-700">{error}</p>
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
                
                {retryCount < 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetryWithAllApplications}
                    className="text-amber-700 border-amber-300 hover:bg-amber-50"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Try fetching all applications
                  </Button>
                )}
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
                    <TableHead>Application ID</TableHead>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
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
