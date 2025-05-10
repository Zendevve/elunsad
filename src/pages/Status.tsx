import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { applicationService } from "@/services/application/applicationService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ArrowRight, FileText, Calendar, Info } from "lucide-react";

interface Application {
  id: string;
  application_type: string;
  application_status: string;
  submission_date: string;
  created_at: string;
  updated_at: string;
}

const Status = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        toast({
          description: "Please sign in to view your applications.",
          variant: "destructive",
        });
        // Redirect to login page
        window.location.href = "/auth";
      } else {
        fetchApplications();
      }
    };
    
    checkAuth();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await applicationService.getUserApplications(await getCurrentUserId());
      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        description: "There was an error loading your applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get current user ID
  const getCurrentUserId = async (): Promise<string> => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new Error("User not authenticated");
    return data.user.id;
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getApplicationTypeLabel = (type: string) => {
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
  
  const getApplicationsByStatus = (status: string) => {
    if (status === "all") return applications;
    return applications.filter(app => app.application_status === status);
  };

  const displayApplications = getApplicationsByStatus(activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700 hover:underline transition-colors">
              Dashboard
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">Application Status</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Application Status</h1>
          <Button asChild>
            <Link to="/applications" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              New Application
            </Link>
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
            <TabsTrigger value="under_review">Under Review</TabsTrigger>
            <TabsTrigger value="requires_additional_info">Requires Info</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading applications...</p>
              </div>
            ) : displayApplications.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-500 mb-6">
                  {activeTab === "all" 
                    ? "You haven't submitted any applications yet. Start by creating a new application."
                    : `You don't have any applications with ${activeTab.replace("_", " ")} status.`}
                </p>
                <Button asChild>
                  <Link to="/applications">Start New Application</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayApplications.map((app) => (
                  <Card key={app.id} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{getApplicationTypeLabel(app.application_type)}</CardTitle>
                          <CardDescription>Application #{app.id.substring(0, 8)}</CardDescription>
                        </div>
                        <Badge className={getStatusBadgeColor(app.application_status)}>
                          {app.application_status.replace("_", " ")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-5">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-gray-700">Created: {formatDate(app.created_at)}</span>
                        </div>
                        {app.submission_date && (
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-gray-700">Submitted: {formatDate(app.submission_date)}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t pt-4">
                      <div className="w-full flex justify-end">
                        <Button asChild variant="outline" className="w-full sm:w-auto group">
                          <Link to={`/application/${app.id}`}>
                            View Details <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Status;
