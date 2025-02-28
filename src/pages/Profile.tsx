
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Edit,
  Shield,
  Bell,
  Globe,
  Calendar,
  Clock,
  Lock,
  Camera,
  FileText,
  CheckCircle,
  AlarmClock,
  HelpCircle,
  Save,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample permit history data
const permitHistory = [
  {
    id: "BP-2023-1045",
    type: "Business Permit",
    status: "active",
    businessName: "Metro Restaurant",
    issueDate: "May 15, 2023",
    expiryDate: "May 14, 2024",
    category: "Restaurant",
  },
  {
    id: "BP-2022-0892",
    type: "Health Permit",
    status: "expired",
    businessName: "Metro Restaurant",
    issueDate: "June 10, 2022",
    expiryDate: "June 9, 2023",
    category: "Food Safety",
  },
  {
    id: "BP-2023-0754",
    type: "Zoning Permit",
    status: "pending",
    businessName: "Metro Restaurant",
    issueDate: "Pending Approval",
    expiryDate: "N/A",
    category: "Commercial Zoning",
  },
];

// Sample recent activity
const recentActivity = [
  {
    id: 1,
    action: "Profile Updated",
    description: "Changed contact phone number",
    timestamp: "Today, 10:15 AM",
  },
  {
    id: 2,
    action: "Document Uploaded",
    description: "Submitted business tax declaration",
    timestamp: "Yesterday, 2:30 PM",
  },
  {
    id: 3,
    action: "Permit Application",
    description: "Applied for new signage permit",
    timestamp: "June 12, 2023",
  },
  {
    id: 4,
    action: "Password Changed",
    description: "Updated account security",
    timestamp: "June 5, 2023",
  },
];

// Define the user data type to include all needed properties
interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  company: string;
  role: string;
  id: string;
  accountCreated: string;
  lastLogin: string;
  imageUrl: string;
}

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phoneNumber: "+1 (555) 123-4567",
    address: "123 Main Street, Anytown, CA 12345",
    company: "Metro Restaurant",
    role: "Business Owner",
    id: "12345",
    accountCreated: "January 15, 2023",
    lastLogin: "Today, 9:32 AM",
    imageUrl: "/placeholder.svg",
  });
  
  // Function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Handle form submit
  const handleSaveChanges = () => {
    // In a real app, this would save the changes to the backend
    setIsEditing(false);
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
            <span className="font-medium">My Profile</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal information, review your permit history, and update your account preferences. 
              Keep your contact details up to date to ensure you receive important notifications about your business permits.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={userData.imageUrl} alt={`${userData.firstName} ${userData.lastName}`} />
                      <AvatarFallback className="text-xl">{userData.firstName.charAt(0)}{userData.lastName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full bg-white h-8 w-8">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="text-lg font-semibold">{userData.firstName} {userData.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{userData.role}</p>
                  <p className="text-sm text-muted-foreground">{userData.company}</p>
                  <Separator className="my-4" />
                  <div className="w-full">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Account ID:</span>
                      <span>{userData.id}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Member Since:</span>
                      <span>{userData.accountCreated}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Login:</span>
                      <span>{userData.lastLogin}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  My Permits
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="mr-2 h-4 w-4" />
                  Notification Settings
                </Button>
                <Button variant="destructive" className="w-full justify-start">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Help & Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <Link to="#" className="flex items-center text-blue-600 hover:text-blue-800">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Account FAQs
                </Link>
                <Link to="#" className="flex items-center text-blue-600 hover:text-blue-800">
                  <FileText className="mr-2 h-4 w-4" />
                  User Guide
                </Link>
                <Link to="#" className="flex items-center text-blue-600 hover:text-blue-800">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Your contact details and personal information
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={userData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={userData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={userData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={userData.phoneNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={userData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Business Name</Label>
                      <Input
                        id="company"
                        name="company"
                        value={userData.company}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button onClick={handleSaveChanges}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm text-muted-foreground">Full Name</p>
                            <p className="font-medium">{userData.firstName} {userData.lastName}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm text-muted-foreground">Email Address</p>
                            <p className="font-medium">{userData.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm text-muted-foreground">Phone Number</p>
                            <p className="font-medium">{userData.phoneNumber}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm text-muted-foreground">Address</p>
                            <p className="font-medium">{userData.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm text-muted-foreground">Business Name</p>
                            <p className="font-medium">{userData.company}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="text-sm text-muted-foreground">Account Type</p>
                            <p className="font-medium">{userData.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabs for Permits, Activity, and Settings */}
            <Tabs defaultValue="permits" className="space-y-4">
              <TabsList>
                <TabsTrigger value="permits">My Permits</TabsTrigger>
                <TabsTrigger value="activity">Account Activity</TabsTrigger>
                <TabsTrigger value="settings">Preferences</TabsTrigger>
              </TabsList>
              
              {/* Permits Tab */}
              <TabsContent value="permits">
                <Card>
                  <CardHeader>
                    <CardTitle>Permit History</CardTitle>
                    <CardDescription>
                      View all your business permits and their current status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Permit ID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Business Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Issue Date</TableHead>
                          <TableHead>Expiry Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {permitHistory.map((permit) => (
                          <TableRow key={permit.id}>
                            <TableCell className="font-medium">{permit.id}</TableCell>
                            <TableCell>{permit.type}</TableCell>
                            <TableCell>{permit.businessName}</TableCell>
                            <TableCell>{permit.category}</TableCell>
                            <TableCell>{permit.issueDate}</TableCell>
                            <TableCell>{permit.expiryDate}</TableCell>
                            <TableCell>{getStatusBadge(permit.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing 3 of 3 permits
                    </p>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      View All Applications
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Activity Tab */}
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Track your recent actions and account activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start">
                          <div className="bg-gray-100 p-2 rounded-full mr-4">
                            <Clock className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{activity.action}</p>
                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                              </div>
                              <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                            </div>
                            <Separator className="mt-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Complete Activity Log
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive email updates about your permit applications and renewals
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Get text messages for urgent updates and reminders
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Renewal Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive alerts when permits are approaching expiration
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Application Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about status changes in your applications
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      Save Preferences
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account security and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Password</Label>
                        <p className="text-sm text-muted-foreground">
                          Last changed 45 days ago
                        </p>
                      </div>
                      <Button variant="outline">Change</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Language Preference</Label>
                        <p className="text-sm text-muted-foreground">
                          Currently set to English
                        </p>
                      </div>
                      <Button variant="outline">Change</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Delete Account</Label>
                        <p className="text-sm text-muted-foreground">
                          Permanently remove your account and all data
                        </p>
                      </div>
                      <Button variant="destructive">Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Help & Resources</h3>
              <div className="space-y-2">
                <Link to="#" className="block text-sm text-gray-500 hover:text-gray-900">Account FAQs</Link>
                <Link to="#" className="block text-sm text-gray-500 hover:text-gray-900">User Guides</Link>
                <Link to="#" className="block text-sm text-gray-500 hover:text-gray-900">Support Center</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <div className="space-y-2">
                <Link to="#" className="block text-sm text-gray-500 hover:text-gray-900">Privacy Policy</Link>
                <Link to="#" className="block text-sm text-gray-500 hover:text-gray-900">Terms of Service</Link>
                <Link to="#" className="block text-sm text-gray-500 hover:text-gray-900">Data Protection</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Licensing Office</p>
                <p className="text-sm text-gray-500">Monday - Friday, 9AM - 5PM</p>
                <p className="text-sm text-gray-500">support@licensing.gov</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
