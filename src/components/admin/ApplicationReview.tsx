
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, TableHeader, TableRow, TableHead, 
  TableBody, TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectGroup, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { adminApplicationService } from "@/services/application/adminApplicationService";
import { useToast } from "@/hooks/use-toast";
import { ApplicationStatus, ApplicationType } from "@/services/application/types";
import { FileText, Eye, CheckCircle, XCircle, AlertCircle, Search, RefreshCw, DatabaseIcon } from "lucide-react";
import { useRoleAuth } from "@/hooks/useRoleAuth";
import { checkSupabaseConnection } from "@/utils/supabaseUtils";

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
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionChecked, setConnectionChecked] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, isLoading: isRoleLoading } = useRoleAuth();

  useEffect(() => {
    async function checkConnection() {
      try {
        console.log("Checking Supabase connection...");
        const isConnected = await checkSupabaseConnection();
        setConnectionChecked(true);
        
        if (!isConnected) {
          const errorMsg = "Could not connect to database. Please check your connection.";
          setConnectionError(errorMsg);
          toast({
            variant: "destructive",
            title: "Connection Error",
            description: errorMsg
          });
        } else {
          console.log("Supabase connection successful!");
          setConnectionError(null);
        }
      } catch (error) {
        console.error("Connection check failed:", error);
        setConnectionError("Connection check failed. See console for details.");
        setConnectionChecked(true);
      }
    }
    
    checkConnection();
  }, [toast]);

  useEffect(() => {
    console.log("ApplicationReview - useEffect triggered with activeTab:", activeTab);
    console.log("ApplicationReview - isAdmin status:", isAdmin);
    console.log("ApplicationReview - isRoleLoading status:", isRoleLoading);
    
    // Only proceed if connection was checked and role loading is complete
    if (connectionChecked && !isRoleLoading) {
      if (isAdmin) {
        fetchApplications();
      } else {
        console.warn("User does not have admin privileges");
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You do not have permission to view applications."
        });
        
        // Set error message for UI to display
        setConnectionError("Access denied: You do not have admin privileges to view applications.");
        setIsLoading(false);
      }
    }
  }, [activeTab, isAdmin, isRoleLoading, connectionChecked, toast]);

  const fetchApplications = async () => {
    setIsLoading(true);
    setConnectionError(null);
    
    try {
      console.log("Fetching applications with status:", activeTab);
      let data;
      
      if (activeTab === "all") {
        data = await adminApplicationService.getAllApplications();
      } else {
        data = await adminApplicationService.getApplicationsByStatus(activeTab as ApplicationStatus);
      }
      
      console.log("Fetched applications data:", data);
      setApplications(data);
      setFilteredApplications(data);
      console.log(`Fetched ${data?.length || 0} applications with status: ${activeTab}`);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        variant: "destructive",
        title: "Failed to load applications",
        description: "There was a problem loading the applications. Please check console for details."
      });
      setConnectionError("Failed to fetch applications. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshApplications = async () => {
    setRefreshing(true);
    try {
      await fetchApplications();
      toast({
        title: "Refreshed",
        description: "Applications data has been refreshed."
      });
    } catch (error) {
      console.error("Error refreshing applications:", error);
      toast({
        variant: "destructive",
        title: "Refresh Failed",
        description: "Could not refresh application data."
      });
    } finally {
      setRefreshing(false);
    }
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
      const ownerName = app.owner_information ? 
        `${app.owner_information.surname}, ${app.owner_information.given_name}` : "";
      
      return (
        app.id.toLowerCase().includes(value.toLowerCase()) ||
        businessName.toLowerCase().includes(value.toLowerCase()) ||
        ownerName.toLowerCase().includes(value.toLowerCase())
      );
    });
    
    setFilteredApplications(filtered);
  };

  const viewApplicationDetails = (id: string) => {
    navigate(`/admin/applications/${id}`);
  };

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getApplicationTypeLabel = (type: ApplicationType) => {
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
            onClick={refreshApplications}
            disabled={refreshing || isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {connectionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p className="font-medium">Connection Error</p>
          </div>
          <p className="text-sm mt-1">{connectionError}</p>
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white text-red-700 border-red-300 hover:bg-red-50"
              onClick={refreshApplications}
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="under_review">Under Review</TabsTrigger>
          <TabsTrigger value="requires_additional_info">Requires Info</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <p>Loading applications...</p>
              </div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-500">
                {activeTab === "all" 
                  ? "There are no applications in the system yet."
                  : `There are no applications with the status "${activeTab.replace('_', ' ')}".`}
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={refreshApplications}
              >
                Refresh Data
              </Button>
            </div>
          ) : (
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
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.id.substring(0, 8)}</TableCell>
                    <TableCell>{app.business_information?.business_name || "-"}</TableCell>
                    <TableCell>
                      {app.owner_information ? 
                        `${app.owner_information.surname}, ${app.owner_information.given_name}` : "-"}
                    </TableCell>
                    <TableCell>
                      {getApplicationTypeLabel(app.application_type)}
                    </TableCell>
                    <TableCell>{formatDate(app.submission_date)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(app.application_status)}>
                        {app.application_status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => viewApplicationDetails(app.id)}
                        className="flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationReview;
