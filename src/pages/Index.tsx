
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Files, 
  PieChart, 
  Map, 
  Bell, 
  Settings, 
  User,
  Menu,
  AlertTriangle,
  Plus,
  Upload,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Applications', href: '/applications', icon: FileText },
  { name: 'Documents', href: '/documents', icon: Files },
  { name: 'Analytics', href: '/analytics', icon: PieChart },
  { name: 'Map View', href: '/map', icon: Map },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Administration', href: '/admin', icon: Settings },
];

const quickActions = [
  { name: 'New Application', href: '/applications/new', icon: Plus, color: 'bg-blue-500' },
  { name: 'Submit Renewal', href: '/applications/renewal', icon: CalendarClock, color: 'bg-green-500' },
  { name: 'Upload Documents', href: '/documents/upload', icon: Upload, color: 'bg-purple-500' },
];

const recentActivity = [
  { 
    id: 1, 
    message: 'New permit application submitted', 
    time: '5 minutes ago',
    type: 'success',
    icon: CheckCircle2 
  },
  { 
    id: 2, 
    message: 'Document review pending', 
    time: '1 hour ago',
    type: 'warning',
    icon: AlertTriangle 
  },
  { 
    id: 3, 
    message: 'Permit renewal rejected', 
    time: '2 hours ago',
    type: 'error',
    icon: XCircle 
  },
];

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold">Business Permits</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <nav className="mt-5 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-margin duration-300 ease-in-out`}>
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className={isSidebarOpen ? 'invisible' : 'visible'}
            >
              <Menu className="h-6 w-6" />
            </Button>

            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/settings" className="w-full">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="/login" className="w-full">Sign out</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Banner */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
                  <p className="text-gray-600 mt-1">{currentDate}</p>
                </div>
                <Badge variant="secondary" className="text-sm">
                  3 permits expiring soon
                </Badge>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Pending Applications</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-gray-600">+2 from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Approved This Month</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">28</div>
                  <p className="text-xs text-gray-600">+5 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Expiring Soon</CardTitle>
                  <CalendarClock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-gray-600">Due within 30 days</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action) => (
                <Link key={action.name} to={action.href}>
                  <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <CardContent className="flex items-center p-6">
                      <div className={`${action.color} p-3 rounded-lg text-white mr-4`}>
                        <action.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium">{action.name}</h3>
                        <p className="text-sm text-gray-600">Click to proceed</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Recent Activity & Map Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-4">
                        <activity.icon className={`h-5 w-5 mt-0.5 ${
                          activity.type === 'success' ? 'text-green-500' :
                          activity.type === 'warning' ? 'text-yellow-500' :
                          'text-red-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Map Preview */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Permit Locations</CardTitle>
                  <Link to="/map" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    View full map <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded-lg h-[200px] flex items-center justify-center">
                    <p className="text-gray-500">Map preview will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold">Support</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Help Center</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900">FAQs</a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold">Legal</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold">Contact</h3>
                <p className="mt-4 text-sm text-gray-600">
                  Email: support@example.com<br />
                  Phone: (555) 123-4567
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
