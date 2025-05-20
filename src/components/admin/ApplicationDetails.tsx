
import React, { useState, useEffect } from "react";
import { getApplicationFullDetails } from "./ApplicationDetailsService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ApplicationData, ApplicationStatus, BusinessInformationData, OwnerInformationData, BusinessOperationsData, BusinessLinesData, DeclarationData } from "@/services/application/types";

interface ApplicationDetailsProps {
  applicationId: string;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({ applicationId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    application: ApplicationData | null;
    businessInformation: BusinessInformationData | null;
    ownerInformation: OwnerInformationData | null;
    businessOperations: BusinessOperationsData | null;
    businessLines: BusinessLinesData[] | null;
    declaration: DeclarationData | null;
    profile: any | null;
  }>({
    application: null,
    businessInformation: null,
    ownerInformation: null,
    businessOperations: null,
    businessLines: null,
    declaration: null,
    profile: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadApplicationDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const details = await getApplicationFullDetails(applicationId);
        setData(details);
      } catch (err) {
        console.error("Error loading application details:", err);
        setError("Failed to load application details. Please try again later.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load application details",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (applicationId) {
      loadApplicationDetails();
    }
  }, [applicationId]);

  const handleUpdateStatus = async (status: ApplicationStatus) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ application_status: status })
        .eq('id', applicationId);
      
      if (error) throw error;
      
      // Update local state
      setData(prev => prev.application ? {
        ...prev,
        application: {
          ...(prev.application as ApplicationData),
          application_status: status
        }
      } : prev);
      
      toast({
        title: "Status Updated",
        description: `Application status has been changed to ${status.replace(/_/g, ' ')}`,
      });
    } catch (err) {
      console.error("Error updating status:", err);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update application status",
      });
    }
  };

  const handleSaveNotes = async (notes: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ admin_notes: notes })
        .eq('id', applicationId);
      
      if (error) throw error;
      
      // Update local state
      setData(prev => prev.application ? {
        ...prev,
        application: {
          ...(prev.application as ApplicationData),
          admin_notes: notes
        }
      } : prev);
      
      toast({
        title: "Notes Saved",
        description: "Admin notes have been updated",
      });
    } catch (err) {
      console.error("Error saving notes:", err);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save admin notes",
      });
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Draft</Badge>;
      case 'submitted':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Submitted</Badge>;
      case 'under_review':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Under Review</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'requires_additional_info':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Requires Additional Info</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getApplicationTypeLabel = (type: string) => {
    switch (type) {
      case 'newApplication':
        return 'New Business Application';
      case 'renewalApplication':
        return 'Business Renewal Application';
      case 'amendmentApplication':
        return 'Business Amendment Application';
      default:
        return type;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Loading application details...</p>
      </div>
    );
  }

  if (error || !data.application) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-xl font-bold mb-2">Failed to Load Application</h3>
        <p className="text-muted-foreground mb-6">{error || "Application not found or access denied"}</p>
        <Button onClick={() => navigate('/admin-dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const { application, businessInformation, ownerInformation, businessOperations, businessLines, declaration, profile } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {getApplicationTypeLabel(application.application_type)}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-sm text-muted-foreground">Application ID: {application.id}</p>
            {application.submission_date && (
              <p className="text-sm text-muted-foreground">
                • Submitted on {formatDate(application.submission_date)}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(application.application_status)}
          <Button
            variant="outline"
            onClick={() => navigate('/admin-dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applicant Information</CardTitle>
          <CardDescription>Details of the business owner who submitted this application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Applicant Name</h3>
              <p className="font-medium">
                {profile ? 
                  `${profile.firstname || ''} ${profile.middlename ? profile.middlename + ' ' : ''}${profile.lastname || ''}${profile.extension_name ? ' ' + profile.extension_name : ''}` : 
                  'Not available'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">User ID</h3>
              <p className="font-medium">{application.user_id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="business-info">
        <TabsList className="mb-4">
          <TabsTrigger value="business-info">Business Information</TabsTrigger>
          <TabsTrigger value="owner-info">Owner Information</TabsTrigger>
          <TabsTrigger value="operations">Business Operations</TabsTrigger>
          <TabsTrigger value="lines">Business Lines</TabsTrigger>
          <TabsTrigger value="declaration">Declaration</TabsTrigger>
          <TabsTrigger value="admin-notes">Admin Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="business-info">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {businessInformation ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Business Name</h3>
                    <p className="font-medium">{businessInformation.business_name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Trade Name</h3>
                    <p className="font-medium">{businessInformation.trade_name || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">TIN Number</h3>
                    <p className="font-medium">{businessInformation.tin_number}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Registration Number</h3>
                    <p className="font-medium">{businessInformation.registration_number || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">SSS Number</h3>
                    <p className="font-medium">{businessInformation.sss_number || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Type of Ownership</h3>
                    <p className="font-medium">{businessInformation.ownership_type}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Business Address</h3>
                    <p className="font-medium">
                      {[
                        businessInformation.house_bldg_no,
                        businessInformation.building_name,
                        businessInformation.street,
                        businessInformation.barangay,
                        businessInformation.city_municipality,
                        businessInformation.province,
                        businessInformation.zip_code
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                    <p className="font-medium">{businessInformation.email_address}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Contact Number</h3>
                    <p className="font-medium">{businessInformation.mobile_no}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">No business information provided</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="owner-info">
          <Card>
            <CardHeader>
              <CardTitle>Owner Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ownerInformation ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                    <p className="font-medium">
                      {`${ownerInformation.given_name} ${ownerInformation.middle_name || ''} ${ownerInformation.surname}${ownerInformation.suffix ? ' ' + ownerInformation.suffix : ''}`}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Nationality</h3>
                    <p className="font-medium">{ownerInformation.nationality}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Age</h3>
                    <p className="font-medium">{ownerInformation.age}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Sex</h3>
                    <p className="font-medium">{ownerInformation.sex}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Civil Status</h3>
                    <p className="font-medium">{ownerInformation.civil_status}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Owner's Address</h3>
                    <p className="font-medium">
                      {[
                        ownerInformation.owner_house_bldg_no,
                        ownerInformation.owner_building_name,
                        ownerInformation.owner_street,
                        ownerInformation.owner_barangay,
                        ownerInformation.owner_city_municipality,
                        ownerInformation.owner_province,
                        ownerInformation.owner_zip_code
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">No owner information provided</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations">
          <Card>
            <CardHeader>
              <CardTitle>Business Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {businessOperations ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Business Activity</h3>
                    <p className="font-medium">{businessOperations.business_activity || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Business Area (sqm)</h3>
                    <p className="font-medium">{businessOperations.business_area || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Capitalization</h3>
                    <p className="font-medium">{businessOperations.capitalization ? `₱${businessOperations.capitalization.toLocaleString()}` : 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Total Employees</h3>
                    <p className="font-medium">
                      {(
                        (businessOperations.professional_male || 0) +
                        (businessOperations.professional_female || 0) +
                        (businessOperations.non_professional_male || 0) +
                        (businessOperations.non_professional_female || 0)
                      )}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Employees in Lucena</h3>
                    <p className="font-medium">{businessOperations.employees_in_lucena || 0}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Property Owned</h3>
                    <p className="font-medium">{businessOperations.property_owned ? 'Yes' : 'No'}</p>
                  </div>
                  {!businessOperations.property_owned && (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Monthly Rental</h3>
                        <p className="font-medium">{businessOperations.monthly_rental ? `₱${businessOperations.monthly_rental.toLocaleString()}` : 'N/A'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Lessor Name</h3>
                        <p className="font-medium">{businessOperations.lessor_full_name || 'N/A'}</p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">No business operations information provided</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lines">
          <Card>
            <CardHeader>
              <CardTitle>Business Lines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {businessLines && businessLines.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left px-4 py-2">Line of Business</th>
                        <th className="text-left px-4 py-2">PSIC Code</th>
                        <th className="text-left px-4 py-2">Products/Services</th>
                        <th className="text-right px-4 py-2">Units</th>
                        <th className="text-right px-4 py-2">Gross Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {businessLines.map((line, index) => (
                        <tr key={line.id || index} className="border-b">
                          <td className="px-4 py-2">{line.line_of_business}</td>
                          <td className="px-4 py-2">{line.psic_code || 'N/A'}</td>
                          <td className="px-4 py-2">{line.products_services}</td>
                          <td className="text-right px-4 py-2">{line.units || 'N/A'}</td>
                          <td className="text-right px-4 py-2">{line.gross_sales || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">No business lines provided</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="declaration">
          <Card>
            <CardHeader>
              <CardTitle>Declaration and Signature</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {declaration ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Agreement</h3>
                    <p className="font-medium">{declaration.is_agreed ? 'Agreed' : 'Not Agreed'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Declaration Place</h3>
                    <p className="font-medium">{declaration.declaration_place || 'City of Lucena'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Designation</h3>
                    <p className="font-medium">{declaration.designation || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Signature</h3>
                    {declaration.signature ? (
                      <div className="mt-2 max-w-sm">
                        <img src={declaration.signature} alt="Signature" className="border rounded-md" />
                      </div>
                    ) : (
                      <p className="font-medium">No signature provided</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">No declaration information provided</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin-notes">
          <Card>
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
              <CardDescription>Add notes or comments about this application</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea 
                className="w-full min-h-[200px] p-4 border rounded-md" 
                defaultValue={application.admin_notes || ''}
                placeholder="Add notes about this application..."
                onChange={(e) => {/* Handle change */}}
                onBlur={(e) => handleSaveNotes(e.target.value)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
          <CardDescription>Update the status of this application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant={application.application_status === 'under_review' ? 'default' : 'outline'}
              onClick={() => handleUpdateStatus('under_review')}
            >
              Mark Under Review
            </Button>
            <Button 
              variant={application.application_status === 'requires_additional_info' ? 'default' : 'outline'}
              onClick={() => handleUpdateStatus('requires_additional_info')}
            >
              Request More Info
            </Button>
            <Button 
              variant={application.application_status === 'approved' ? 'default' : 'outline'}
              className={application.application_status === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
              onClick={() => handleUpdateStatus('approved')}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button 
              variant={application.application_status === 'rejected' ? 'default' : 'outline'}
              className={application.application_status === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}
              onClick={() => handleUpdateStatus('rejected')}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationDetails;
