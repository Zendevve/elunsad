
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { getApplicationFullDetails } from "@/components/admin/ApplicationDetailsService";
import { ArrowLeft, Calendar, FileText, User, Building, Briefcase, CheckSquare, AlertCircle } from "lucide-react";

const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [applicationData, setApplicationData] = useState<any>(null);

  useEffect(() => {
    if (!id) {
      navigate("/status");
      return;
    }

    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getApplicationFullDetails(id);
      setApplicationData(data);
    } catch (error) {
      console.error("Error fetching application details:", error);
      toast({
        title: "Error",
        description: "Failed to load application details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Skeleton className="h-6 w-64" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!applicationData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex text-sm">
              <Link to="/status" className="text-gray-500 hover:text-gray-700 hover:underline transition-colors">
                Application Status
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-900">Application Details</span>
            </nav>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Application not found</h3>
            <p className="text-gray-500 mb-6">The application you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button asChild>
              <Link to="/status">Back to Applications</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { application, businessInformation, ownerInformation, businessOperations, businessLines, declaration } = applicationData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex text-sm">
            <Link to="/status" className="text-gray-500 hover:text-gray-700 hover:underline transition-colors">
              Application Status
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">Application Details</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{getApplicationTypeLabel(application.application_type)}</h1>
            <p className="text-gray-600">Application #{application.id.substring(0, 8)}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className={getStatusBadgeColor(application.application_status)}>
              {application.application_status.replace("_", " ")}
            </Badge>
            <Button variant="outline" asChild>
              <Link to="/status">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Applications
              </Link>
            </Button>
          </div>
        </div>

        {/* Application Status Card */}
        <Card className="mb-6">
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
            {application.admin_notes && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm font-medium text-amber-800 mb-2">Admin Notes:</p>
                <p className="text-amber-700">{application.admin_notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Business Information */}
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
                <div>
                  <p className="text-sm font-medium text-gray-500">TIN Number</p>
                  <p>{businessInformation.tin_number}</p>
                </div>
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
              </CardContent>
            </Card>
          )}

          {/* Owner Information */}
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
                      ownerInformation.surname,
                      ownerInformation.given_name,
                      ownerInformation.middle_name,
                      ownerInformation.suffix
                    ].filter(Boolean).join(", ")}
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
        </div>

        {/* Business Operations */}
        {businessOperations && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Business Operations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businessOperations.business_activity && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Business Activity</p>
                    <p>{businessOperations.business_activity}</p>
                  </div>
                )}
                {businessOperations.business_area && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Business Area (sq.m)</p>
                    <p>{businessOperations.business_area}</p>
                  </div>
                )}
                {businessOperations.capitalization && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Capitalization</p>
                    <p>₱{Number(businessOperations.capitalization).toLocaleString()}</p>
                  </div>
                )}
              </div>
              
              {/* Employee Information */}
              <Separator className="my-6" />
              <h4 className="font-medium mb-4">Employee Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              </div>
            </CardContent>
          </Card>
        )}

        {/* Business Lines */}
        {businessLines && businessLines.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Lines of Business</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessLines.map((line: any, index: number) => (
                  <div key={line.id || index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Line of Business</p>
                        <p>{line.line_of_business}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Products/Services</p>
                        <p>{line.products_services}</p>
                      </div>
                      {line.psic_code && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">PSIC Code</p>
                          <p>{line.psic_code}</p>
                        </div>
                      )}
                      {line.gross_sales && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Gross Sales</p>
                          <p>{line.gross_sales}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Declaration */}
        {declaration && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5" />
                Declaration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Agreement Status</p>
                  <p className={declaration.is_agreed ? "text-green-600" : "text-red-600"}>
                    {declaration.is_agreed ? "Agreed to terms and conditions" : "Not agreed"}
                  </p>
                </div>
                {declaration.designation && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Designation</p>
                    <p>{declaration.designation}</p>
                  </div>
                )}
                {declaration.declaration_place && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Place of Declaration</p>
                    <p>{declaration.declaration_place}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Signature Status</p>
                  <p className={declaration.signature ? "text-green-600" : "text-red-600"}>
                    {declaration.signature ? "Signed" : "Not signed"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetail;
