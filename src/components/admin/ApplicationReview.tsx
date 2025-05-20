
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
import { 
  FileText, Eye, CheckCircle, XCircle, 
  AlertCircle, Search, Loader2, RefreshCw 
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, [activeTab]);

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let data;
      console.log(`Fetching applications for tab: ${activeTab}`);
      
      if (activeTab === "all") {
        data = await adminApplicationService.getAllApplications();
      } else {
        data = await adminApplicationService.getApplicationsByStatus(activeTab as ApplicationStatus);
      }
      
      console.log(`Fetched ${data?.length || 0} applications:`, data);
      setApplications(data);
      setFilteredApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setError("Failed to load applications. Please try again.");
      toast({
        variant: "destructive",
        title: "Failed to load applications",
        description: "There was a problem loading the applications. Please try again."
      });
    } finally {
      setIsLoading(false);
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
            onClick={fetchApplications}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>
      </div>

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
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
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
