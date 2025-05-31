import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { getApplicationFullDetails } from "@/components/admin/ApplicationDetailsService";
import { documentService, DocumentData } from "@/services/documentService";
import { ArrowLeft, Calendar, FileText, User, Building, Briefcase, AlertCircle, File, Eye, Download } from "lucide-react";

const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate("/status");
      return;
    }

    fetchApplicationDetails();
    fetchDocuments();
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

  const fetchDocuments = async () => {
    if (!id) return;

    try {
      setDocumentsLoading(true);
      const docs = await documentService.getApplicationDocuments(id);
      setDocuments(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setDocumentsLoading(false);
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

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
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

  const handleViewDocument = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  const handleDownloadDocument = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const { application, businessInformation, ownerInformation, businessOperations, businessLines } = applicationData;

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

        {/* Tabbed Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="business">Business Info</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="business-lines">Business Lines</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
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
                  {application.admin_notes && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm font-medium text-amber-800 mb-2">Admin Notes:</p>
                      <p className="text-amber-700">{application.admin_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businessInformation && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Building className="h-5 w-5" />
                        Business Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Business Name</p>
                        <p className="text-base">{businessInformation.business_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">TIN Number</p>
                        <p className="text-base">{businessInformation.tin_number}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Ownership Type</p>
                        <p className="text-base capitalize">{businessInformation.ownership_type.replace(/([A-Z])/g, ' $1').trim()}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {ownerInformation && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="h-5 w-5" />
                        Owner Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                        <p className="text-base">
                          {[
                            ownerInformation.given_name,
                            ownerInformation.middle_name,
                            ownerInformation.surname,
                            ownerInformation.suffix
                          ].filter(Boolean).join(" ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Age</p>
                        <p className="text-base">{ownerInformation.age}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Nationality</p>
                        <p className="text-base">{ownerInformation.nationality}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {businessOperations && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Briefcase className="h-5 w-5" />
                        Operations Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Business Activity</p>
                        <p className="text-base">{businessOperations.business_activity || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Business Area</p>
                        <p className="text-base">{businessOperations.business_area ? `${businessOperations.business_area} sq meters` : "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Capitalization</p>
                        <p className="text-base">{businessOperations.capitalization ? `₱${Number(businessOperations.capitalization).toLocaleString()}` : "N/A"}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <File className="h-5 w-5" />
                  Document Status
                </CardTitle>
                <CardDescription>
                  Track the status of your uploaded documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {documentsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : documents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No documents uploaded yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <FileText className="h-4 w-4 mr-2 text-gray-500" />
                              <h4 className="font-medium">{doc.document_type}</h4>
                              {getDocumentStatusBadge(doc.status)}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{doc.document_name}</p>
                            <div className="flex items-center text-xs text-gray-500 space-x-4">
                              {doc.file_size && <span>{(doc.file_size / 1024).toFixed(2)} KB</span>}
                              <span>Uploaded: {formatDate(doc.uploaded_at || '')}</span>
                            </div>
                            {doc.admin_feedback && doc.status === 'rejected' && (
                              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                                <p className="text-sm text-red-700">
                                  <strong>Feedback:</strong> {doc.admin_feedback}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {doc.file_url && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewDocument(doc.file_url!)}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownloadDocument(doc.file_url!, doc.document_name)}
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business">
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
            </div>
          </TabsContent>

          <TabsContent value="operations">
            <div className="space-y-6">
              {/* Business Operations */}
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
            </div>
          </TabsContent>

          <TabsContent value="business-lines">
            {/* Business Lines */}
            {businessLines && businessLines.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Lines of Business</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {businessLines.map((line, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Line of Business</p>
                            <p>{line.line_of_business}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">PSIC Code</p>
                            <p>{line.psic_code || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Units</p>
                            <p>{line.units || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Gross Sales</p>
                            <p>{line.gross_sales ? `₱${Number(line.gross_sales).toLocaleString()}` : "N/A"}</p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-500">Products/Services</p>
                            <p>{line.products_services}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8 text-gray-500">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No business lines information available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ApplicationDetail;
