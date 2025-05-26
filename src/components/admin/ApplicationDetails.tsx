
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, FileText, User, Building, Briefcase, 
  CheckCircle, AlertCircle, Clock, RefreshCcw
} from "lucide-react";
import { Link } from "react-router-dom";
import { getApplicationFullDetails } from "./ApplicationDetailsService";
import { adminApplicationService } from "@/services/applicationService";
import { ApplicationStatus } from "@/services/application/types";
import ApplicationStatusBadge from "./ApplicationStatusBadge";
import DocumentReview from "./DocumentReview";

interface ApplicationDetailsProps {
  applicationId: string;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({ applicationId }) => {
  const [adminNotes, setAdminNotes] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { toast } = useToast();

  const { 
    data: applicationData, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['application-details', applicationId],
    queryFn: () => getApplicationFullDetails(applicationId)
  });

  useEffect(() => {
    if (applicationData?.application?.admin_notes) {
      setAdminNotes(applicationData.application.admin_notes);
    }
  }, [applicationData]);

  const handleStatusUpdate = async (newStatus: ApplicationStatus) => {
    try {
      setIsUpdatingStatus(true);
      await adminApplicationService.updateApplicationStatus(
        applicationId, 
        newStatus, 
        adminNotes.trim() || undefined
      );
      
      toast({
        title: "Status Updated",
        description: `Application status changed to ${newStatus.replace('_', ' ')}`,
      });
      
      refetch();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <RefreshCcw className="h-8 w-8 animate-spin text-primary mb-2" />
          <p>Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error || !applicationData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load application details. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  const { application, businessInformation, ownerInformation, businessOperations, businessLines, declaration } = applicationData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              {businessInformation?.business_name || "Application Details"}
            </h1>
            <p className="text-gray-600">Application ID: {application.id}</p>
          </div>
        </div>
        <ApplicationStatusBadge status={application.application_status} />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="business">Business Info</TabsTrigger>
          <TabsTrigger value="owner">Owner Info</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Business Name:</span>
                    <p>{businessInformation?.business_name || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium">TIN Number:</span>
                    <p>{businessInformation?.tin_number || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Address:</span>
                    <p>{businessInformation ? `${businessInformation.street}, ${businessInformation.barangay}, ${businessInformation.city_municipality}` : "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Owner Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Owner Name:</span>
                    <p>{ownerInformation ? `${ownerInformation.given_name} ${ownerInformation.middle_name || ''} ${ownerInformation.surname}` : "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Age:</span>
                    <p>{ownerInformation?.age || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Address:</span>
                    <p>{ownerInformation ? `${ownerInformation.owner_street}, ${ownerInformation.owner_barangay}, ${ownerInformation.owner_city_municipality}` : "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business">
          {businessInformation ? (
            <Card>
              <CardHeader>
                <CardTitle>Business Information Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Business Name:</span>
                    <p>{businessInformation.business_name}</p>
                  </div>
                  <div>
                    <span className="font-medium">Trade Name:</span>
                    <p>{businessInformation.trade_name || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Ownership Type:</span>
                    <p>{businessInformation.ownership_type}</p>
                  </div>
                  <div>
                    <span className="font-medium">TIN Number:</span>
                    <p>{businessInformation.tin_number}</p>
                  </div>
                  <div>
                    <span className="font-medium">SSS Number:</span>
                    <p>{businessInformation.sss_number || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Mobile Number:</span>
                    <p>{businessInformation.mobile_no}</p>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>
                    <p>{businessInformation.email_address}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Complete Address:</span>
                    <p>
                      {[
                        businessInformation.house_bldg_no,
                        businessInformation.building_name,
                        businessInformation.street,
                        businessInformation.subdivision,
                        businessInformation.barangay,
                        businessInformation.city_municipality,
                        businessInformation.province,
                        businessInformation.zip_code
                      ].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No business information available.</AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="owner">
          {ownerInformation ? (
            <Card>
              <CardHeader>
                <CardTitle>Owner Information Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Full Name:</span>
                    <p>{`${ownerInformation.given_name} ${ownerInformation.middle_name || ''} ${ownerInformation.surname} ${ownerInformation.suffix || ''}`.trim()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Age:</span>
                    <p>{ownerInformation.age}</p>
                  </div>
                  <div>
                    <span className="font-medium">Sex:</span>
                    <p>{ownerInformation.sex}</p>
                  </div>
                  <div>
                    <span className="font-medium">Civil Status:</span>
                    <p>{ownerInformation.civil_status}</p>
                  </div>
                  <div>
                    <span className="font-medium">Nationality:</span>
                    <p>{ownerInformation.nationality}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Complete Address:</span>
                    <p>
                      {[
                        ownerInformation.owner_house_bldg_no,
                        ownerInformation.owner_building_name,
                        ownerInformation.owner_street,
                        ownerInformation.owner_subdivision,
                        ownerInformation.owner_barangay,
                        ownerInformation.owner_city_municipality,
                        ownerInformation.owner_province,
                        ownerInformation.owner_zip_code
                      ].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No owner information available.</AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="operations">
          <div className="space-y-6">
            {businessOperations && (
              <Card>
                <CardHeader>
                  <CardTitle>Business Operations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Business Activity:</span>
                      <p>{businessOperations.business_activity || "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium">Business Area:</span>
                      <p>{businessOperations.business_area ? `${businessOperations.business_area} sq meters` : "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium">Capitalization:</span>
                      <p>{businessOperations.capitalization ? `₱${businessOperations.capitalization.toLocaleString()}` : "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium">Total Employees:</span>
                      <p>{(businessOperations.professional_male || 0) + (businessOperations.professional_female || 0) + (businessOperations.non_professional_male || 0) + (businessOperations.non_professional_female || 0)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {businessLines && businessLines.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Business Lines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {businessLines.map((line, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <span className="font-medium">Line of Business:</span>
                            <p>{line.line_of_business}</p>
                          </div>
                          <div>
                            <span className="font-medium">PSIC Code:</span>
                            <p>{line.psic_code || "N/A"}</p>
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium">Products/Services:</span>
                            <p>{line.products_services}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <DocumentReview applicationId={applicationId} />
        </TabsContent>

        <TabsContent value="actions">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Status Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Admin Notes</label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this application..."
                    rows={4}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {application.application_status === "submitted" && (
                    <>
                      <Button
                        onClick={() => handleStatusUpdate("under_review")}
                        disabled={isUpdatingStatus}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Start Review
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate("approved")}
                        disabled={isUpdatingStatus}
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate("rejected")}
                        disabled={isUpdatingStatus}
                        variant="destructive"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  
                  {application.application_status === "under_review" && (
                    <>
                      <Button
                        onClick={() => handleStatusUpdate("approved")}
                        disabled={isUpdatingStatus}
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate("rejected")}
                        disabled={isUpdatingStatus}
                        variant="destructive"
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate("requires_additional_info")}
                        disabled={isUpdatingStatus}
                      >
                        Request More Info
                      </Button>
                    </>
                  )}
                  
                  {application.application_status === "requires_additional_info" && (
                    <>
                      <Button
                        onClick={() => handleStatusUpdate("under_review")}
                        disabled={isUpdatingStatus}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Resume Review
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate("approved")}
                        disabled={isUpdatingStatus}
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate("rejected")}
                        disabled={isUpdatingStatus}
                        variant="destructive"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationDetails;
