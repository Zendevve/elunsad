
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
  CheckCircle, AlertCircle, Clock, RefreshCcw, FileCheck
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

  const { application, businessInformation, ownerInformation, businessOperations, businessLines, declaration, profile } = applicationData;

  // Helper function to format currency
  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return "Not specified";
    return `₱${amount.toLocaleString()}`;
  };

  // Helper function to format address
  const formatBusinessAddress = (info: typeof businessInformation) => {
    if (!info) return "N/A";
    const addressParts = [
      info.house_bldg_no,
      info.building_name,
      info.block_no && `Block ${info.block_no}`,
      info.lot_no && `Lot ${info.lot_no}`,
      info.street,
      info.subdivision,
      info.barangay,
      info.city_municipality,
      info.province,
      info.zip_code
    ].filter(Boolean);
    return addressParts.join(", ");
  };

  const formatOwnerAddress = (info: typeof ownerInformation) => {
    if (!info) return "N/A";
    const addressParts = [
      info.owner_house_bldg_no,
      info.owner_building_name,
      info.owner_block_no && `Block ${info.owner_block_no}`,
      info.owner_lot_no && `Lot ${info.owner_lot_no}`,
      info.owner_street,
      info.owner_subdivision,
      info.owner_barangay,
      info.owner_city_municipality,
      info.owner_province,
      info.owner_zip_code
    ].filter(Boolean);
    return addressParts.join(", ");
  };

  const formatMainAddress = (ops: typeof businessOperations) => {
    if (!ops) return "N/A";
    const addressParts = [
      ops.main_house_bldg_no,
      ops.main_building_name,
      ops.main_block_no && `Block ${ops.main_block_no}`,
      ops.main_lot_no && `Lot ${ops.main_lot_no}`,
      ops.main_street,
      ops.main_subdivision,
      ops.main_barangay,
      ops.main_city_municipality,
      ops.main_province,
      ops.main_zip_code
    ].filter(Boolean);
    return addressParts.length > 0 ? addressParts.join(", ") : "Same as business address";
  };

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
          <TabsTrigger value="declaration">Declaration</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <span className="font-medium">Ownership Type:</span>
                    <p>{businessInformation?.ownership_type || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Address:</span>
                    <p className="text-sm">{formatBusinessAddress(businessInformation)}</p>
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
                    <p>{ownerInformation ? `${ownerInformation.given_name} ${ownerInformation.middle_name || ''} ${ownerInformation.surname}`.trim() : "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Age:</span>
                    <p>{ownerInformation?.age || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Nationality:</span>
                    <p>{ownerInformation?.nationality || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Civil Status:</span>
                    <p>{ownerInformation?.civil_status || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Business Operations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Business Activity:</span>
                    <p>{businessOperations?.business_activity || "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Business Area:</span>
                    <p>{businessOperations?.business_area ? `${businessOperations.business_area} sq meters` : "N/A"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Capitalization:</span>
                    <p>{formatCurrency(businessOperations?.capitalization)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Total Employees:</span>
                    <p>{businessOperations ? (
                      (businessOperations.professional_male || 0) + 
                      (businessOperations.professional_female || 0) + 
                      (businessOperations.non_professional_male || 0) + 
                      (businessOperations.non_professional_female || 0)
                    ) : "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {profile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Applicant Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Full Name:</span>
                      <p>{`${profile.firstname} ${profile.middlename || ''} ${profile.lastname} ${profile.extension_name || ''}`.trim()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="business">
          {businessInformation ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Business Information</CardTitle>
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
                      <span className="font-medium">Registration Number:</span>
                      <p>{businessInformation.registration_number || "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium">Ownership Type:</span>
                      <p>{businessInformation.ownership_type}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Mobile Number:</span>
                      <p>{businessInformation.mobile_no}</p>
                    </div>
                    <div>
                      <span className="font-medium">Telephone Number:</span>
                      <p>{businessInformation.telephone_no || "N/A"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium">Email Address:</span>
                      <p>{businessInformation.email_address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">House/Building No:</span>
                      <p>{businessInformation.house_bldg_no || "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium">Building Name:</span>
                      <p>{businessInformation.building_name || "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium">Block No:</span>
                      <p>{businessInformation.block_no || "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium">Lot No:</span>
                      <p>{businessInformation.lot_no || "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium">Street:</span>
                      <p>{businessInformation.street}</p>
                    </div>
                    <div>
                      <span className="font-medium">Subdivision:</span>
                      <p>{businessInformation.subdivision || "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium">Barangay:</span>
                      <p>{businessInformation.barangay}</p>
                    </div>
                    <div>
                      <span className="font-medium">City/Municipality:</span>
                      <p>{businessInformation.city_municipality}</p>
                    </div>
                    <div>
                      <span className="font-medium">Province:</span>
                      <p>{businessInformation.province}</p>
                    </div>
                    <div>
                      <span className="font-medium">ZIP Code:</span>
                      <p>{businessInformation.zip_code}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Legal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">TIN Number:</span>
                      <p>{businessInformation.tin_number}</p>
                    </div>
                    <div>
                      <span className="font-medium">SSS Number:</span>
                      <p>{businessInformation.sss_number || "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium">CTC Number:</span>
                      <p>{businessInformation.ctc_number || "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium">CTC Date Issued:</span>
                      <p>{businessInformation.ctc_date_issue || "N/A"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium">CTC Place Issued:</span>
                      <p>{businessInformation.ctc_place_issue || "N/A"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">Surname:</span>
                        <p>{ownerInformation.surname}</p>
                      </div>
                      <div>
                        <span className="font-medium">Given Name:</span>
                        <p>{ownerInformation.given_name}</p>
                      </div>
                      <div>
                        <span className="font-medium">Middle Name:</span>
                        <p>{ownerInformation.middle_name || "N/A"}</p>
                      </div>
                      <div>
                        <span className="font-medium">Suffix:</span>
                        <p>{ownerInformation.suffix || "N/A"}</p>
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
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Owner Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">House/Building No:</span>
                        <p>{ownerInformation.owner_house_bldg_no || "N/A"}</p>
                      </div>
                      <div>
                        <span className="font-medium">Building Name:</span>
                        <p>{ownerInformation.owner_building_name || "N/A"}</p>
                      </div>
                      <div>
                        <span className="font-medium">Block No:</span>
                        <p>{ownerInformation.owner_block_no || "N/A"}</p>
                      </div>
                      <div>
                        <span className="font-medium">Lot No:</span>
                        <p>{ownerInformation.owner_lot_no || "N/A"}</p>
                      </div>
                      <div>
                        <span className="font-medium">Street:</span>
                        <p>{ownerInformation.owner_street}</p>
                      </div>
                      <div>
                        <span className="font-medium">Subdivision:</span>
                        <p>{ownerInformation.owner_subdivision || "N/A"}</p>
                      </div>
                      <div>
                        <span className="font-medium">Barangay:</span>
                        <p>{ownerInformation.owner_barangay}</p>
                      </div>
                      <div>
                        <span className="font-medium">City/Municipality:</span>
                        <p>{ownerInformation.owner_city_municipality}</p>
                      </div>
                      <div>
                        <span className="font-medium">Province:</span>
                        <p>{ownerInformation.owner_province}</p>
                      </div>
                      <div>
                        <span className="font-medium">ZIP Code:</span>
                        <p>{ownerInformation.owner_zip_code}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="font-medium">Complete Address:</span>
                      <p className="text-sm">{formatOwnerAddress(ownerInformation)}</p>
                    </div>
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
            {businessOperations ? (
              <>
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
                        <p>{formatCurrency(businessOperations.capitalization)}</p>
                      </div>
                      <div>
                        <span className="font-medium">Tax Incentives:</span>
                        <p>{businessOperations.has_tax_incentives ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <span className="font-medium">Property Owned:</span>
                        <p>{businessOperations.property_owned ? "Yes" : "No"}</p>
                      </div>
                      {!businessOperations.property_owned && (
                        <div>
                          <span className="font-medium">Monthly Rental:</span>
                          <p>{formatCurrency(businessOperations.monthly_rental)}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Employee Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="font-medium">Professional Male:</span>
                        <p>{businessOperations.professional_male || 0}</p>
                      </div>
                      <div>
                        <span className="font-medium">Professional Female:</span>
                        <p>{businessOperations.professional_female || 0}</p>
                      </div>
                      <div>
                        <span className="font-medium">Non-Professional Male:</span>
                        <p>{businessOperations.non_professional_male || 0}</p>
                      </div>
                      <div>
                        <span className="font-medium">Non-Professional Female:</span>
                        <p>{businessOperations.non_professional_female || 0}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium">Employees in Lucena:</span>
                        <p>{businessOperations.employees_in_lucena || 0}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium">Total Employees:</span>
                        <p>{(businessOperations.professional_male || 0) + (businessOperations.professional_female || 0) + (businessOperations.non_professional_male || 0) + (businessOperations.non_professional_female || 0)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Assets & Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="font-medium">Motorcycles:</span>
                        <p>{businessOperations.motorcycle || 0}</p>
                      </div>
                      <div>
                        <span className="font-medium">Van/Truck:</span>
                        <p>{businessOperations.van_truck || 0}</p>
                      </div>
                      <div>
                        <span className="font-medium">Other Vehicles:</span>
                        <p>{businessOperations.other_vehicles || 0}</p>
                      </div>
                      <div>
                        <span className="font-medium">CCTV Cameras:</span>
                        <p>{businessOperations.cctv_cameras || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {(businessOperations.main_street || businessOperations.main_barangay) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Main Office Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium">House/Building No:</span>
                          <p>{businessOperations.main_house_bldg_no || "N/A"}</p>
                        </div>
                        <div>
                          <span className="font-medium">Building Name:</span>
                          <p>{businessOperations.main_building_name || "N/A"}</p>
                        </div>
                        <div>
                          <span className="font-medium">Block No:</span>
                          <p>{businessOperations.main_block_no || "N/A"}</p>
                        </div>
                        <div>
                          <span className="font-medium">Lot No:</span>
                          <p>{businessOperations.main_lot_no || "N/A"}</p>
                        </div>
                        <div>
                          <span className="font-medium">Street:</span>
                          <p>{businessOperations.main_street || "N/A"}</p>
                        </div>
                        <div>
                          <span className="font-medium">Subdivision:</span>
                          <p>{businessOperations.main_subdivision || "N/A"}</p>
                        </div>
                        <div>
                          <span className="font-medium">Barangay:</span>
                          <p>{businessOperations.main_barangay || "N/A"}</p>
                        </div>
                        <div>
                          <span className="font-medium">City/Municipality:</span>
                          <p>{businessOperations.main_city_municipality || "N/A"}</p>
                        </div>
                        <div>
                          <span className="font-medium">Province:</span>
                          <p>{businessOperations.main_province || "N/A"}</p>
                        </div>
                        <div>
                          <span className="font-medium">ZIP Code:</span>
                          <p>{businessOperations.main_zip_code || "N/A"}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="font-medium">Complete Address:</span>
                        <p className="text-sm">{formatMainAddress(businessOperations)}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {!businessOperations.property_owned && (businessOperations.lessor_full_name || businessOperations.lessor_business_name) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Lessor Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium">Lessor Full Name:</span>
                          <p>{businessOperations.lessor_full_name || "N/A"}</p>
                        </div>
                        <div>
                          <span className="font-medium">Lessor Business Name:</span>
                          <p>{businessOperations.lessor_business_name || "N/A"}</p>
                        </div>
                        <div>
                          <span className="font-medium">Contact Number:</span>
                          <p>{businessOperations.lessor_contact_number || "N/A"}</p>
                        </div>
                        <div>
                          <span className="font-medium">Email Address:</span>
                          <p>{businessOperations.lessor_email_address || "N/A"}</p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium">Address:</span>
                          <p>{businessOperations.lessor_address || "N/A"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {businessOperations.tax_declaration_no && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Tax Declaration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <span className="font-medium">Tax Declaration Number:</span>
                        <p>{businessOperations.tax_declaration_no}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>No business operations information available.</AlertDescription>
              </Alert>
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
                          <div>
                            <span className="font-medium">Units:</span>
                            <p>{line.units || "N/A"}</p>
                          </div>
                          <div>
                            <span className="font-medium">Gross Sales:</span>
                            <p>{line.gross_sales || "N/A"}</p>
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

        <TabsContent value="declaration">
          {declaration ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileCheck className="h-5 w-5 mr-2" />
                  Declaration Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Agreement Status:</span>
                      <div className="mt-1">
                        <Badge variant={declaration.is_agreed ? "default" : "destructive"}>
                          {declaration.is_agreed ? "Agreed" : "Not Agreed"}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Designation/Position:</span>
                      <p>{declaration.designation || "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium">Place of Declaration:</span>
                      <p>{declaration.declaration_place || "N/A"}</p>
                    </div>
                    <div>
                      <span className="font-medium">Verified By:</span>
                      <p>{declaration.verified_by || "Pending Verification"}</p>
                    </div>
                  </div>

                  {declaration.signature && (
                    <div>
                      <span className="font-medium">Digital Signature:</span>
                      <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                        <img 
                          src={declaration.signature} 
                          alt="Digital Signature" 
                          className="max-w-xs max-h-32 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        <div className="mt-2">
                          <a 
                            href={declaration.signature} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View Full Signature
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Declaration Statement</h4>
                    <p className="text-sm text-gray-700">
                      "I hereby declare that the information provided in this application is true and correct to the best of my knowledge.
                      I understand that any false information or misrepresentation may be grounds for rejection of this application or
                      revocation of any permit issued."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No declaration information available.</AlertDescription>
            </Alert>
          )}
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
