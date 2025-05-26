import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Upload,
  FileText,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  ArrowRight,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const documentTypes = [
  {
    id: 1,
    name: "Business Permit Application Form",
    description: "Filled-out Business Permit application form",
    required: true,
    status: "approved",
    lastUpdated: "2024-03-15",
    feedback: "Document approved and verified"
  },
  {
    id: 2,
    name: "Owner ID Pictures",
    description: "Two (2) passport size ID pictures of the owner or in cases of partnership or Corporation the picture of the Senior or Managing Partner, President or Branch Manager",
    required: true,
    status: "pending",
    lastUpdated: "2024-03-14",
    feedback: "Under review by office staff"
  },
  {
    id: 3,
    name: "Valid ID with Signature",
    description: "One (1) valid I.D. with signature",
    required: true,
    status: "declined",
    lastUpdated: "2024-03-13",
    feedback: "ID unclear. Please submit a clearer copy"
  },
  {
    id: 4,
    name: "Community Tax Certificate",
    description: "Community Tax Certificate (CTC/CEDULA)",
    required: true,
    status: "pending",
    lastUpdated: "2024-03-12",
    feedback: "Awaiting verification"
  },
  {
    id: 5,
    name: "DTI/SEC/CDA Registration",
    description: "DTI/SEC/CDA Registration certificate",
    required: true,
    status: "approved",
    lastUpdated: "2024-03-11",
    feedback: "Document verified and approved"
  },
  {
    id: 6,
    name: "Zoning Clearance",
    description: "Zoning clearance from City Zoning Office",
    required: true,
    status: "pending",
    lastUpdated: "2024-03-10",
    feedback: "Processing at City Zoning Office"
  },
  {
    id: 7,
    name: "Occupancy Permit",
    description: "Occupancy Permit (OP) or Certificate of OP Exemption from City Engineering Office",
    required: true,
    status: "declined",
    lastUpdated: "2024-03-09",
    feedback: "Permit expired. Please renew and resubmit"
  },
  {
    id: 8,
    name: "Health Certificate",
    description: "Health Card/Certificate of the owner or any one of the employees from City Health Office",
    required: true,
    status: "approved",
    lastUpdated: "2024-03-08",
    feedback: "Health certificate verified"
  },
  {
    id: 9,
    name: "Real Property Tax Clearance",
    description: "Real Property Tax Clearance from City Treasurer's Office",
    required: true,
    status: "pending",
    lastUpdated: "2024-03-07",
    feedback: "Verification in progress at City Treasurer's Office"
  },
  {
    id: 10,
    name: "PESO Clearance",
    description: "PESO Clearance from City PESO Office",
    required: true,
    status: "approved",
    lastUpdated: "2024-03-06",
    feedback: "PESO clearance verified and approved"
  }
];

const recentUploads = [
  {
    id: 1,
    name: "business-registration-2024.pdf",
    type: "application/pdf",
    size: "2.4 MB",
    uploadDate: "2024-03-15",
    status: "approved"
  },
  {
    id: 2,
    name: "tax-clearance-2024.pdf",
    type: "application/pdf",
    size: "1.8 MB",
    uploadDate: "2024-03-14",
    status: "pending"
  }
];

const Documents = () => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file upload logic here
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "declined":
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "declined":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Dashboard
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">Documents & Requirements</span>
          </nav>
        </div>
      </div>

      {/* Title Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Documents & Requirements</h1>
          <p className="mt-2 text-gray-600">
            Upload and manage your required documents for permit applications. Supported formats: PDF, JPG, PNG (max 10MB per file).
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload & Recent */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>
                  Drag and drop your files here or click to browse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag and drop your files here, or{" "}
                    <button className="text-blue-500 hover:text-blue-600">
                      click to select files
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Uploads */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
                <CardDescription>
                  Recently uploaded documents and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUploads.map((upload) => (
                      <TableRow key={upload.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            {upload.name}
                          </div>
                        </TableCell>
                        <TableCell>{upload.uploadDate}</TableCell>
                        <TableCell>{upload.size}</TableCell>
                        <TableCell>{getStatusBadge(upload.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Requirements & Help */}
          <div className="space-y-6">
            {/* Requirements List */}
            <Card>
              <CardHeader>
                <CardTitle>Document Requirements</CardTitle>
                <CardDescription>
                  Required documents for your permit application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documentTypes.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getStatusIcon(doc.status)}
                          <div>
                            <h4 className="font-medium">{doc.name}</h4>
                            <p className="text-sm text-gray-600">{doc.description}</p>
                          </div>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <HelpCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{doc.feedback}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      {doc.status === "declined" && (
                        <div className="mt-3 flex items-center justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <RefreshCcw className="h-4 w-4 mr-2" />
                            Re-upload
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Help Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Document Guidelines</h4>
                    <p className="text-sm text-gray-600">
                      Review our guidelines for document requirements and specifications
                    </p>
                    <Button variant="outline" className="w-full">
                      View Guidelines
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Support Contact</h4>
                    <p className="text-sm text-gray-600">
                      Need assistance? Contact our support team:
                      <br />
                      support@permits.gov
                      <br />
                      (555) 123-4567
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold">Document Support</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Document Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Contact</h3>
              <p className="mt-4 text-sm text-gray-600">
                Business Permits Office<br />
                Monday - Friday: 9:00 AM - 5:00 PM<br />
                support@permits.gov
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Documents;
