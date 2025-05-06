
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminApplicationService } from "@/services/application/adminApplicationService";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ApplicationStatus } from "@/services/application/types";
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

const ApplicationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [dialogAction, setDialogAction] = useState<ApplicationStatus | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchApplicationDetails(id);
    }
  }, [id]);

  const fetchApplicationDetails = async (applicationId: string) => {
    try {
      setLoading(true);
      const data = await adminApplicationService.getApplicationDetails(applicationId);
      setApplication(data);
      // Check if admin_notes exists before trying to access it
      setAdminNotes(data?.admin_notes || "");
    } catch (error) {
      console.error("Error fetching application details:", error);
      toast({
        variant: "destructive",
        title: "Failed to load application details",
        description: "There was a problem loading the application. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: ApplicationStatus) => {
    if (!id) return;
    
    try {
      setProcessingAction(true);
      await adminApplicationService.updateApplicationStatus(id, status, adminNotes);
      
      toast({
        title: "Status Updated",
        description: `Application status has been updated to ${status.replace("_", " ")}.`
      });
      
      // Refresh the application data
      fetchApplicationDetails(id);
      setDialogAction(null);
    } catch (error) {
      console.error("Error updating application status:", error);
      toast({
        variant: "destructive",
        title: "Failed to update status",
        description: "There was a problem updating the application status. Please try again."
      });
    } finally {
      setProcessingAction(false);
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

  const formatDate = (dateString: string | null) => {
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-lg">Loading application details...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700">Application not found or has been deleted.</p>
        <Button variant="outline" onClick={() => navigate('/admin/applications')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/admin/applications')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
          <h1 className="text-2xl font-bold">Application Details</h1>
          <Badge className={getStatusBadgeColor(application.application_status)}>
            {application.application_status.replace("_", " ")}
          </Badge>
        </div>
        
        <div className="space-x-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-300"
                onClick={() => setDialogAction("under_review")}
                disabled={application.application_status === "under_review"}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Mark as Reviewing
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Mark Application as Under Review?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will set the application status to "Under Review" and notify the applicant that their submission is being reviewed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Textarea
                placeholder="Add notes about this application (optional)"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="min-h-[100px] mt-4"
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleStatusUpdate("under_review")}
                  disabled={processingAction}
                >
                  {processingAction ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-300"
                onClick={() => setDialogAction("requires_additional_info")}
                disabled={application.application_status === "requires_additional_info"}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Request More Info
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Request Additional Information?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will set the application status to "Requires Additional Information" and notify the applicant that they need to provide more information.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Textarea
                placeholder="Specify what additional information is required"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="min-h-[100px] mt-4"
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleStatusUpdate("requires_additional_info")}
                  disabled={processingAction}
                >
                  {processingAction ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300"
                onClick={() => setDialogAction("approved")}
                disabled={application.application_status === "approved"}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Approve This Application?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will set the application status to "Approved" and notify the applicant that their business permit has been approved.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Textarea
                placeholder="Add approval notes (optional)"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="min-h-[100px] mt-4"
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleStatusUpdate("approved")}
                  disabled={processingAction}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {processingAction ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Approval"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-red-100 text-red-800 hover:bg-red-200 border-red-300"
                onClick={() => setDialogAction("rejected")}
                disabled={application.application_status === "rejected"}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reject This Application?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will set the application status to "Rejected" and notify the applicant that their business permit application has been rejected.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Textarea
                placeholder="Explain the reason for rejection (required)"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="min-h-[100px] mt-4"
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleStatusUpdate("rejected")}
                  disabled={processingAction || !adminNotes.trim()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {processingAction ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Rejection"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Application Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Application ID</p>
              <p>{application.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p>{getApplicationTypeLabel(application.application_type)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Badge className={getStatusBadgeColor(application.application_status)}>
                {application.application_status.replace("_", " ")}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created Date</p>
              <p>{formatDate(application.created_at)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Submission Date</p>
              <p>{formatDate(application.submission_date)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Only show admin notes if they exist */}
        {application.admin_notes && (
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{application.admin_notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {application.business_information && (
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Business Name</p>
                <p>{application.business_information.business_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Trade Name</p>
                <p>{application.business_information.trade_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">TIN Number</p>
                <p>{application.business_information.tin_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ownership Type</p>
                <p>{application.business_information.ownership_type}</p>
              </div>
              <div className="col-span-3">
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p>
                  {[
                    application.business_information.street,
                    application.business_information.barangay,
                    application.business_information.city_municipality,
                    application.business_information.province,
                    application.business_information.zip_code
                  ].filter(Boolean).join(", ")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Mobile Number</p>
                <p>{application.business_information.mobile_no}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email Address</p>
                <p>{application.business_information.email_address}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {application.owner_information && (
        <Card>
          <CardHeader>
            <CardTitle>Owner Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p>
                  {[
                    application.owner_information.surname,
                    application.owner_information.given_name,
                    application.owner_information.middle_name,
                    application.owner_information.suffix
                  ].filter(Boolean).join(" ")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Sex</p>
                <p>{application.owner_information.sex}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Age</p>
                <p>{application.owner_information.age}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Civil Status</p>
                <p>{application.owner_information.civil_status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Nationality</p>
                <p>{application.owner_information.nationality}</p>
              </div>
              <div className="col-span-3">
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p>
                  {[
                    application.owner_information.owner_street,
                    application.owner_information.owner_barangay,
                    application.owner_information.owner_city_municipality,
                    application.owner_information.owner_province,
                    application.owner_information.owner_zip_code
                  ].filter(Boolean).join(", ")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {application.business_operations && (
        <Card>
          <CardHeader>
            <CardTitle>Business Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Business Area</p>
                <p>{application.business_operations.business_area || "N/A"} sqm</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Employees in Lucena</p>
                <p>{application.business_operations.employees_in_lucena || "0"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Capitalization</p>
                <p>₱ {application.business_operations.capitalization || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Property Status</p>
                <p>{application.business_operations.property_owned ? "Owned" : "Rented"}</p>
              </div>
              {!application.business_operations.property_owned && (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Monthly Rental</p>
                    <p>₱ {application.business_operations.monthly_rental || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Lessor</p>
                    <p>{application.business_operations.lessor_full_name || "N/A"}</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm font-medium text-gray-500">Tax Incentives</p>
                <p>{application.business_operations.has_tax_incentives ? "Yes" : "No"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {application.business_lines && application.business_lines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Business Lines</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Line of Business</TableHead>
                  <TableHead>Products/Services</TableHead>
                  <TableHead>PSIC Code</TableHead>
                  <TableHead>Gross Sales</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {application.business_lines.map((line: any) => (
                  <TableRow key={line.id}>
                    <TableCell>{line.line_of_business}</TableCell>
                    <TableCell>{line.products_services}</TableCell>
                    <TableCell>{line.psic_code || "N/A"}</TableCell>
                    <TableCell>{line.gross_sales || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {application.declarations && (
        <Card>
          <CardHeader>
            <CardTitle>Declaration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Agreed to Terms</p>
                <p>{application.declarations.is_agreed ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Designation</p>
                <p>{application.declarations.designation || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Declaration Place</p>
                <p>{application.declarations.declaration_place || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Signature</p>
                {application.declarations.signature && (
                  <img 
                    src={application.declarations.signature} 
                    alt="Signature" 
                    className="max-h-24 border border-gray-200 p-2"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={() => navigate('/admin/applications')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>
      </div>
    </div>
  );
};

export default ApplicationDetails;
