
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, FileText, User, Building, Briefcase, AlertCircle, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DocumentReview from './DocumentReview';
import ApplicationActions from './ApplicationActions';
import { getApplicationFullDetails } from './ApplicationDetailsService';

interface ApplicationDetailsProps {
  applicationId: string;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({ applicationId }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [adminNotes, setAdminNotes] = useState('');
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  const { isLoading, error, data: applicationData, refetch } = useQuery({
    queryKey: ['applicationDetails', applicationId],
    queryFn: () => getApplicationFullDetails(applicationId),
    enabled: !!applicationId,
    retry: false,
  });

  useEffect(() => {
    if (applicationData?.application?.admin_notes) {
      setAdminNotes(applicationData.application.admin_notes);
    }
  }, [applicationData?.application?.admin_notes]);

  const handleAdminNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAdminNotes(e.target.value);
  };

  const handleSaveAdminNotes = async () => {
    if (!applicationData?.application?.id) {
      toast({
        title: "Error",
        description: "Application ID is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/admin/applications/${applicationData.application.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admin_notes: adminNotes }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Admin notes saved successfully.",
        });
        refetch(); // Refresh the data to show updated notes
      } else {
        toast({
          title: "Error",
          description: "Failed to save admin notes.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving admin notes:", error);
      toast({
        title: "Error",
        description: "Failed to save admin notes. Please try again.",
        variant: "destructive",
      });
    }
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
        return "New Business Application";
      case "renewalApplication":
        return "Renewal Application";
      case "amendmentApplication":
        return "Amendment Application";
      default:
        return type;
    }
  };

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

  const { application, businessInformation, ownerInformation, businessOperations, businessLines } = applicationData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {getApplicationTypeLabel(application.application_type)}
          </h1>
          <p className="text-gray-600">Application #{application.id.substring(0, 8)}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className={getStatusBadgeColor(application.application_status)}>
            {application.application_status.replace("_", " ")}
          </Badge>
          <Button variant="outline" asChild>
            <Link to="/admin/applications">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Applications
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabbed Content */}
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
          <div className="space-y-4">
            {/* Application Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Application Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p className="text-lg">{formatDate(application.created_at)}</p>
                  </div>
                  {application.submission_date && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Submitted</p>
                      <p className="text-lg">{formatDate(application.submission_date)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                    <p className="text-lg">{formatDate(application.updated_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Notes Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Admin Notes
                </CardTitle>
                <CardDescription>Add internal notes for this application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <textarea
                    className="w-full rounded-md border border-gray-200 shadow-sm focus:border-primary focus:ring-primary text-sm"
                    rows={isNotesExpanded ? 5 : 3}
                    placeholder="Enter admin notes..."
                    value={adminNotes}
                    onChange={handleAdminNotesChange}
                    onClick={() => setIsNotesExpanded(true)}
                  />
                  <div className="flex justify-end">
                    <Button size="sm" onClick={handleSaveAdminNotes}>
                      Save Notes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business">
          {businessInformation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Business Name</p>
                  <p className="text-lg">{businessInformation.business_name}</p>
                </div>
                {businessInformation.trade_name && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Trade Name</p>
                    <p>{businessInformation.trade_name}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">TIN Number</p>
                    <p>{businessInformation.tin_number}</p>
                  </div>
                  {businessInformation.registration_number && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Registration Number</p>
                      <p>{businessInformation.registration_number}</p>
                    </div>
                  )}
                </div>
                {businessInformation.sss_number && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">SSS Number</p>
                    <p>{businessInformation.sss_number}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Ownership Type</p>
                  <p className="capitalize">{businessInformation.ownership_type.replace(/([A-Z])/g, ' $1').trim()}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Business Address</p>
                  <p className="text-sm">
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
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact Information</p>
                  <div className="space-y-1 text-sm">
                    <p>Mobile: {businessInformation.mobile_no}</p>
                    {businessInformation.telephone_no && <p>Telephone: {businessInformation.telephone_no}</p>}
                    <p>Email: {businessInformation.email_address}</p>
                  </div>
                </div>
                {(businessInformation.ctc_number || businessInformation.ctc_date_issue || businessInformation.ctc_place_issue) && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">CTC Information</p>
                      <div className="space-y-1 text-sm">
                        {businessInformation.ctc_number && <p>Number: {businessInformation.ctc_number}</p>}
                        {businessInformation.ctc_date_issue && <p>Date Issued: {businessInformation.ctc_date_issue}</p>}
                        {businessInformation.ctc_place_issue && <p>Place Issued: {businessInformation.ctc_place_issue}</p>}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="owner">
          {ownerInformation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Owner Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-lg">
                    {[
                      ownerInformation.given_name,
                      ownerInformation.middle_name,
                      ownerInformation.surname,
                      ownerInformation.suffix
                    ].filter(Boolean).join(" ")}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Age</p>
                    <p>{ownerInformation.age}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Sex</p>
                    <p className="capitalize">{ownerInformation.sex}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Civil Status</p>
                    <p className="capitalize">{ownerInformation.civil_status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nationality</p>
                    <p>{ownerInformation.nationality}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Owner Address</p>
                  <p className="text-sm">
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
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="operations">
          {businessOperations && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Business Operations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Business Activity</p>
                    <p>{businessOperations.business_activity || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Business Area (sq.m)</p>
                    <p>{businessOperations.business_area || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Capitalization</p>
                    <p>₱{Number(businessOperations.capitalization).toLocaleString() || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tax Declaration No.</p>
                    <p>{businessOperations.tax_declaration_no || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">CCTV Cameras</p>
                    <p>{businessOperations.cctv_cameras !== null ? businessOperations.cctv_cameras : "N/A"}</p>
                  </div>
                </div>
                
                {/* Property Information */}
                <Separator className="my-6" />
                <h4 className="font-medium mb-4">Property Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Property Status</p>
                    <p>{businessOperations.property_owned ? 'Owned' : 'Rented'}</p>
                  </div>
                  {!businessOperations.property_owned && businessOperations.monthly_rental && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Monthly Rental</p>
                      <p>₱{Number(businessOperations.monthly_rental).toLocaleString()}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tax Incentives</p>
                    <p>{businessOperations.has_tax_incentives ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                {/* Employee Information */}
                <Separator className="my-6" />
                <h4 className="font-medium mb-4">Employee Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Professional Male</p>
                    <p>{businessOperations.professional_male || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Professional Female</p>
                    <p>{businessOperations.professional_female || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Non-Professional Male</p>
                    <p>{businessOperations.non_professional_male || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Non-Professional Female</p>
                    <p>{businessOperations.non_professional_female || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Employees from Lucena</p>
                    <p>{businessOperations.employees_in_lucena || 0}</p>
                  </div>
                </div>

                {/* Vehicle Information */}
                <Separator className="my-6" />
                <h4 className="font-medium mb-4">Vehicle Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Van/Truck</p>
                    <p>{businessOperations.van_truck || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Motorcycle</p>
                    <p>{businessOperations.motorcycle || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Other Vehicles</p>
                    <p>{businessOperations.other_vehicles || 0}</p>
                  </div>
                </div>

                {/* Main Office Address */}
                {(businessOperations.main_street || businessOperations.main_barangay) && (
                  <>
                    <Separator className="my-6" />
                    <h4 className="font-medium mb-4">Main Office Address</h4>
                    <div>
                      <p className="text-sm">
                        {[
                          businessOperations.main_house_bldg_no,
                          businessOperations.main_building_name,
                          businessOperations.main_block_no,
                          businessOperations.main_lot_no,
                          businessOperations.main_street,
                          businessOperations.main_subdivision,
                          businessOperations.main_barangay,
                          businessOperations.main_city_municipality,
                          businessOperations.main_province,
                          businessOperations.main_zip_code
                        ].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </>
                )}

                {/* Lessor Information */}
                {!businessOperations.property_owned && businessOperations.lessor_full_name && (
                  <>
                    <Separator className="my-6" />
                    <h4 className="font-medium mb-4">Lessor Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Lessor Name</p>
                        <p>{businessOperations.lessor_full_name}</p>
                      </div>
                      {businessOperations.lessor_business_name && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Business Name</p>
                          <p>{businessOperations.lessor_business_name}</p>
                        </div>
                      )}
                      {businessOperations.lessor_contact_number && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Contact Number</p>
                          <p>{businessOperations.lessor_contact_number}</p>
                        </div>
                      )}
                      {businessOperations.lessor_email_address && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email Address</p>
                          <p>{businessOperations.lessor_email_address}</p>
                        </div>
                      )}
                      {businessOperations.lessor_address && (
                        <div className="md:col-span-2">
                          <p className="text-sm font-medium text-gray-500">Lessor Address</p>
                          <p>{businessOperations.lessor_address}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
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
