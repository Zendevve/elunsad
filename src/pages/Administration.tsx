import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Settings,
  FileText,
  ChevronRight,
  Search,
  Plus,
  Filter,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Eye,
  UserPlus,
  Database,
  Bell,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import AdminUserManagement from "@/components/admin/AdminUserManagement";

// Sample permit data
const permitData = [
  {
    id: "BP-2023-1045",
    businessName: "Metro Restaurant",
    applicantName: "John Smith",
    type: "Restaurant",
    status: "pending",
    submittedDate: "2023-05-28",
    expiryDate: "2023-06-15",
  },
  {
    id: "BP-2023-0892",
    businessName: "Sunshine Retail Store",
    applicantName: "Maria Garcia",
    type: "Retail",
    status: "approved",
    submittedDate: "2023-05-15",
    expiryDate: "2024-05-14",
  },
  {
    id: "BP-2023-0754",
    businessName: "Tech Solutions Inc.",
    applicantName: "Robert Johnson",
    type: "Service",
    status: "declined",
    submittedDate: "2023-05-10",
    expiryDate: "N/A",
  },
  {
    id: "BP-2022-7651",
    businessName: "Green Earth Recycling",
    applicantName: "Sarah Williams",
    type: "Industrial",
    status: "pending_renewal",
    submittedDate: "2023-06-01",
    expiryDate: "2023-06-30",
  },
  {
    id: "BP-2023-0631",
    businessName: "Urban Coffee Shop",
    applicantName: "David Lee",
    type: "Food & Beverage",
    status: "approved",
    submittedDate: "2023-04-22",
    expiryDate: "2024-04-21",
  },
];

// Stats data
const statsData = {
  totalPermits: 156,
  pendingReview: 28,
  approvedToday: 12,
  expiringThisMonth: 15,
};

const Administration = () => {
  const [permitFilter, setPermitFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Get status badge for permits
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "declined":
        return <Badge className="bg-destructive">Declined</Badge>;
      case "pending_renewal":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Pending Renewal</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Administration</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Administration Panel</h1>
            <p className="text-muted-foreground">
              This area is restricted to authorized office staff. Manage business permit applications, 
              user access, system settings, and view audit logs to maintain the licensing office operations.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Permits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statsData.totalPermits}</div>
              <p className="text-sm text-muted-foreground">Active business permits</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statsData.pendingReview}</div>
              <p className="text-sm text-muted-foreground">Applications awaiting decision</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Approved Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statsData.approvedToday}</div>
              <p className="text-sm text-muted-foreground">Permits approved today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{statsData.expiringThisMonth}</div>
              <p className="text-sm text-muted-foreground">Permits expiring this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="permits" className="mb-6">
          <TabsList className="mb-4 grid grid-cols-4 max-w-md">
            <TabsTrigger value="permits">Permit Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          </TabsList>
          
          {/* Permit Management Tab */}
          <TabsContent value="permits">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Permit Applications</CardTitle>
                    <CardDescription>
                      Manage all business permit applications and renewals
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Permit
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-2">
                    <Select value={permitFilter} onValueChange={setPermitFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="declined">Declined</SelectItem>
                        <SelectItem value="renewal">Pending Renewal</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-9 w-[300px]" 
                      placeholder="Search permits..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permit ID</TableHead>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permitData.map((permit) => (
                      <TableRow key={permit.id}>
                        <TableCell className="font-medium">{permit.id}</TableCell>
                        <TableCell>{permit.businessName}</TableCell>
                        <TableCell>{permit.applicantName}</TableCell>
                        <TableCell>{permit.type}</TableCell>
                        <TableCell>{getStatusBadge(permit.status)}</TableCell>
                        <TableCell>{permit.submittedDate}</TableCell>
                        <TableCell>{permit.expiryDate}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {permit.status === "pending" && (
                              <>
                                <Button variant="ghost" size="icon" className="text-green-600">
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-600">
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing 5 of 156 permits
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* User Management Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage office staff accounts and permissions
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <AdminUserManagement />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>
                    Configure system-wide parameters and defaults
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <Bell className="mr-2 h-5 w-5" />
                        Notification Settings
                      </h3>
                      <div className="grid grid-cols-1 gap-4 pl-7">
                        <div className="space-y-2">
                          <Label htmlFor="email-frequency">Email Notification Frequency</Label>
                          <Select defaultValue="daily">
                            <SelectTrigger id="email-frequency" className="w-full">
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="immediate">Immediate</SelectItem>
                              <SelectItem value="daily">Daily Digest</SelectItem>
                              <SelectItem value="weekly">Weekly Summary</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reminder-days">Permit Expiry Reminder (Days)</Label>
                          <Select defaultValue="30">
                            <SelectTrigger id="reminder-days" className="w-full">
                              <SelectValue placeholder="Select days" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="7">7 Days Before</SelectItem>
                              <SelectItem value="14">14 Days Before</SelectItem>
                              <SelectItem value="30">30 Days Before</SelectItem>
                              <SelectItem value="60">60 Days Before</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <Database className="mr-2 h-5 w-5" />
                        Data Management
                      </h3>
                      <div className="grid grid-cols-1 gap-4 pl-7">
                        <div className="space-y-2">
                          <Label htmlFor="retention-period">Data Retention Period</Label>
                          <Select defaultValue="5">
                            <SelectTrigger id="retention-period" className="w-full">
                              <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Year</SelectItem>
                              <SelectItem value="3">3 Years</SelectItem>
                              <SelectItem value="5">5 Years</SelectItem>
                              <SelectItem value="7">7 Years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="file-size">Maximum File Upload Size (MB)</Label>
                          <Select defaultValue="10">
                            <SelectTrigger id="file-size" className="w-full">
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5 MB</SelectItem>
                              <SelectItem value="10">10 MB</SelectItem>
                              <SelectItem value="20">20 MB</SelectItem>
                              <SelectItem value="50">50 MB</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <Shield className="mr-2 h-5 w-5" />
                        Security Settings
                      </h3>
                      <div className="grid grid-cols-1 gap-4 pl-7">
                        <div className="space-y-2">
                          <Label htmlFor="session-timeout">Session Timeout (Minutes)</Label>
                          <Select defaultValue="30">
                            <SelectTrigger id="session-timeout" className="w-full">
                              <SelectValue placeholder="Select timeout" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15 Minutes</SelectItem>
                              <SelectItem value="30">30 Minutes</SelectItem>
                              <SelectItem value="60">60 Minutes</SelectItem>
                              <SelectItem value="120">120 Minutes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password-expiry">Password Expiry (Days)</Label>
                          <Select defaultValue="90">
                            <SelectTrigger id="password-expiry" className="w-full">
                              <SelectValue placeholder="Select days" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 Days</SelectItem>
                              <SelectItem value="60">60 Days</SelectItem>
                              <SelectItem value="90">90 Days</SelectItem>
                              <SelectItem value="180">180 Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end space-x-2">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common administrative tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="mr-2 h-4 w-4" />
                      Backup System Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Verify All Requirements
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Clock className="mr-2 h-4 w-4" />
                      Manage Business Hours
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Bell className="mr-2 h-4 w-4" />
                      Send System Notification
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="mr-2 h-4 w-4" />
                      Security Audit
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Help & Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Link to="#" className="block text-sm text-blue-600 hover:text-blue-800">
                      Administrator Manual
                    </Link>
                    <Link to="#" className="block text-sm text-blue-600 hover:text-blue-800">
                      Frequently Asked Questions
                    </Link>
                    <Link to="#" className="block text-sm text-blue-600 hover:text-blue-800">
                      System Requirements
                    </Link>
                    <Link to="#" className="block text-sm text-blue-600 hover:text-blue-800">
                      Release Notes
                    </Link>
                    <Link to="#" className="block text-sm text-blue-600 hover:text-blue-800">
                      Contact Technical Support
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Audit Logs Tab */}
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Audit Logs</CardTitle>
                    <CardDescription>
                      Track all administrative actions and changes
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Logs
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-2">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Actions</SelectItem>
                        <SelectItem value="permit">Permit Changes</SelectItem>
                        <SelectItem value="user">User Management</SelectItem>
                        <SelectItem value="settings">System Settings</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-9 w-[300px]" 
                      placeholder="Search logs..." 
                    />
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.action}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.target}</TableCell>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing 5 of 256 log entries
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Help & Resources</h3>
              <div className="space-y-2">
                <Link to="#" className="block text-sm text-gray-500 hover:text-gray-900">Administrator Guide</Link>
                <Link to="#" className="block text-sm text-gray-500 hover:text-gray-900">System FAQs</Link>
                <Link to="#" className="block text-sm text-gray-500 hover:text-gray-900">Technical Support</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <div className="space-y-2">
                <Link to="#" className="block text-sm text-gray-500 hover:text-gray-900">Privacy Policy</Link>
                <Link to="#" className="block text-sm text-gray-500 hover:text-gray-900">Terms of Service</Link>
                <Link to="#" className="block text-sm text-gray-500 hover:text-gray-900">Data Protection Guidelines</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Licensing Office IT Department</p>
                <p className="text-sm text-gray-500">Monday - Friday, 8AM - 6PM</p>
                <p className="text-sm text-gray-500">admin-support@licensing.gov</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Administration;
