
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CalendarClock,
  ChevronRight,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Filter,
  Search,
  ArrowRight,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

// Sample data for upcoming reminders
const upcomingReminders = [
  {
    id: 1,
    title: "Permit Renewal Due",
    description: "Business Permit #BP-2023-1045 requires renewal",
    dueDate: "2023-06-15",
    daysLeft: 3,
    priority: "high",
    permitId: "BP-2023-1045",
    type: "renewal",
  },
  {
    id: 2,
    title: "Document Submission Required",
    description: "Tax Clearance Certificate needed for Application #APP-2023-0587",
    dueDate: "2023-06-20",
    daysLeft: 8,
    priority: "medium",
    permitId: "APP-2023-0587",
    type: "document",
  },
  {
    id: 3,
    title: "Inspection Scheduled",
    description: "Facility inspection for Permit #BP-2023-0892",
    dueDate: "2023-06-12",
    daysLeft: 0,
    priority: "high",
    permitId: "BP-2023-0892",
    type: "inspection",
  },
  {
    id: 4,
    title: "Payment Due",
    description: "Annual fee payment for Permit #BP-2022-7651",
    dueDate: "2023-06-25",
    daysLeft: 13,
    priority: "medium",
    permitId: "BP-2022-7651",
    type: "payment",
  },
];

// Sample data for notification history
const notificationHistory = [
  {
    id: 101,
    date: "2023-06-08",
    time: "14:32",
    title: "Document Approved",
    description: "Your Business Tax Declaration was approved",
    status: "read",
    type: "approval",
  },
  {
    id: 102,
    date: "2023-06-05",
    time: "09:15",
    title: "Application Submitted",
    description: "Your application #APP-2023-0587 was successfully submitted",
    status: "read",
    type: "submission",
  },
  {
    id: 103,
    date: "2023-06-01",
    time: "16:45",
    title: "Permit Expiring Soon",
    description: "Business Permit #BP-2022-5432 expires in 30 days",
    status: "unread",
    type: "reminder",
  },
  {
    id: 104,
    date: "2023-05-28",
    time: "11:20",
    title: "Document Rejected",
    description: "Your Sanitary Permit application requires revision",
    status: "read",
    type: "rejection",
  },
  {
    id: 105,
    date: "2023-05-25",
    time: "13:10",
    title: "Payment Received",
    description: "Payment for Permit #BP-2022-7651 was received",
    status: "read",
    type: "payment",
  },
];

const Notifications = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("all");

  // Get priority badge color
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge>Standard</Badge>;
    }
  };

  // Get status indicator for days left
  const getStatusIndicator = (daysLeft: number) => {
    if (daysLeft === 0) {
      return <Badge variant="destructive">Due Today</Badge>;
    } else if (daysLeft < 0) {
      return <Badge variant="destructive">Overdue</Badge>;
    } else if (daysLeft <= 3) {
      return <Badge variant="destructive">{daysLeft} Days Left</Badge>;
    } else if (daysLeft <= 7) {
      return <Badge className="bg-yellow-500">{daysLeft} Days Left</Badge>;
    } else {
      return <Badge variant="secondary">{daysLeft} Days Left</Badge>;
    }
  };

  // Get notification type badge
  const getNotificationTypeBadge = (type: string) => {
    switch (type) {
      case "approval":
        return <Badge className="bg-green-500">Approval</Badge>;
      case "rejection":
        return <Badge variant="destructive">Rejection</Badge>;
      case "submission":
        return <Badge variant="secondary">Submission</Badge>;
      case "reminder":
        return <Badge className="bg-yellow-500">Reminder</Badge>;
      case "payment":
        return <Badge className="bg-blue-500">Payment</Badge>;
      default:
        return <Badge>Notification</Badge>;
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
            <span className="font-medium">Notifications & Reminders</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Notifications & Reminders</h1>
            <p className="text-muted-foreground">
              Stay informed about your business permits, upcoming renewals, document approvals, and other important
              updates. This centralized hub helps you track and manage all notifications related to your business licensing
              activities.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    className="pl-9" 
                    placeholder="Search notifications..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Notification Type</Label>
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Notifications</SelectItem>
                      <SelectItem value="renewal">Renewals</SelectItem>
                      <SelectItem value="document">Documents</SelectItem>
                      <SelectItem value="payment">Payments</SelectItem>
                      <SelectItem value="inspection">Inspections</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time Range</Label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Past Week</SelectItem>
                      <SelectItem value="month">Past Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full" variant="secondary">
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <p>
                    <span className="font-medium">⚡ Pro Tip:</span> Use the filters to focus on upcoming renewals and avoid permit expiration.
                  </p>
                  <p>
                    <span className="font-medium">🔔 Reminder:</span> Set up email notifications in your profile settings for important alerts.
                  </p>
                  <Link 
                    to="/help/notifications" 
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    View notification guide
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Alert for unread notifications */}
            <Alert>
              <Bell className="h-4 w-4" />
              <AlertTitle>You have 3 unread notifications</AlertTitle>
              <AlertDescription>
                These include important updates about your permits and applications.
              </AlertDescription>
            </Alert>

            {/* Upcoming Reminders Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Upcoming Reminders</h2>
                <Link to="/notifications/all" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  View all
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {upcomingReminders.map((reminder) => (
                  <Card key={reminder.id} className="border-l-4 border-l-blue-600">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{reminder.title}</CardTitle>
                        {getPriorityBadge(reminder.priority)}
                      </div>
                      <CardDescription>{reminder.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <CalendarClock className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">Due: {reminder.dueDate}</span>
                        </div>
                        {getStatusIndicator(reminder.daysLeft)}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <span className="text-sm text-gray-600">Permit: {reminder.permitId}</span>
                      <Button size="sm" className="h-8">
                        View Details
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>

            {/* Notification History Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Notification History</h2>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Notification</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notificationHistory.map((notification) => (
                        <TableRow key={notification.id} className={notification.status === "unread" ? "bg-blue-50" : ""}>
                          <TableCell className="whitespace-nowrap">
                            <div className="text-sm">{notification.date}</div>
                            <div className="text-xs text-gray-500">{notification.time}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{notification.title}</div>
                            <div className="text-sm text-gray-500">{notification.description}</div>
                          </TableCell>
                          <TableCell>{getNotificationTypeBadge(notification.type)}</TableCell>
                          <TableCell>
                            {notification.status === "unread" ? (
                              <Badge variant="outline" className="bg-blue-100 border-blue-300 text-blue-800">
                                Unread
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-100 text-gray-600">
                                Read
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
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
                <Link to="#" className="block text-sm text-gray-500 hover:text-gray-900">Notification Settings Guide</Link>
                <Link to="#" className="block text-sm text-gray-500 hover:text-gray-900">Reminders & Alerts FAQs</Link>
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

export default Notifications;
