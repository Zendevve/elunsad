import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Bell, 
  FileText, 
  PlusCircle, 
  UploadCloud, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  BarChart2, 
  TrendingUp,
  MapPin,
  Calendar,
  Users,
  HelpCircle
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useRoleAuth from "@/hooks/useRoleAuth";

const Dashboard = () => {
  // Get current date
  const currentDate = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', dateOptions as Intl.DateTimeFormatOptions);
  
  // Add role check and navigation
  const { isAdmin, isLoading } = useRoleAuth();
  const navigate = useNavigate();
  
  // Auto-redirect admin users to admin dashboard
  useEffect(() => {
    if (isAdmin && !isLoading) {
      console.log("Admin user detected, redirecting to admin dashboard");
      navigate("/admin-dashboard");
    }
  }, [isAdmin, isLoading, navigate]);
  
  // Show loading state while checking roles
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-t-4 border-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      {/* Hero / Welcome Banner */}
      <section className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, John Smith</h1>
            <p className="text-gray-600">{formattedDate}</p>
            <p className="text-gray-600 mt-2">You have <span className="font-semibold text-amber-600">3 permits</span> expiring soon.</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              <span>5 Pending Renewals</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span>2 New Applications</span>
            </Badge>
          </div>
        </div>
      </section>

      {/* Dashboard Overview / Quick Stats */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Expiring Permits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-amber-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-xs text-gray-500">Within 30 days</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link to="/applications" className="text-sm text-blue-600 hover:underline">View details</Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">New Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-gray-500">This month</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link to="/applications" className="text-sm text-blue-600 hover:underline">View details</Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Approval Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-xs text-gray-500">+2% from last month</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link to="/analytics" className="text-sm text-blue-600 hover:underline">View analytics</Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-orange-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-xs text-gray-500">Require attention</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link to="/documents" className="text-sm text-blue-600 hover:underline">View documents</Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Quick Action Section */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>New Application</span>
          </Button>
          <Button className="flex items-center gap-2" variant="secondary">
            <RefreshCw className="h-4 w-4" />
            <span>Submit Renewal</span>
          </Button>
          <Button className="flex items-center gap-2" variant="outline">
            <UploadCloud className="h-4 w-4" />
            <span>Upload Documents</span>
          </Button>
        </div>
      </section>

      {/* Two Column Layout for Analytics and Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Predictive Analytics Preview */}
        <section className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Analytics Preview</h2>
            <Link to="/analytics">
              <Button variant="ghost" size="sm" className="text-blue-600">
                View Full Analytics
              </Button>
            </Link>
          </div>
          <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4">
            <div className="flex space-x-4 mb-4">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">New</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Renewals</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-amber-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
            </div>
            <div className="relative w-full h-32">
              <TrendingUp className="h-32 w-full text-blue-200" />
              <div className="absolute bottom-0 left-0 w-full h-1/2 flex items-end">
                <div className="w-1/6 h-8 bg-blue-500 mx-1 rounded-t"></div>
                <div className="w-1/6 h-16 bg-blue-500 mx-1 rounded-t"></div>
                <div className="w-1/6 h-12 bg-blue-500 mx-1 rounded-t"></div>
                <div className="w-1/6 h-20 bg-blue-500 mx-1 rounded-t"></div>
                <div className="w-1/6 h-24 bg-blue-500 mx-1 rounded-t"></div>
                <div className="w-1/6 h-16 bg-blue-500 mx-1 rounded-t"></div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Application trend for the last 6 months</p>
          </div>
        </section>

        {/* Geo-Tagging Map Preview */}
        <section className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Permit Locations</h2>
            <Link to="/mapview">
              <Button variant="ghost" size="sm" className="text-blue-600">
                View Full Map
              </Button>
            </Link>
          </div>
          <div className="h-64 bg-gray-100 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full bg-blue-50">
                {/* Simplified map representation */}
                <div className="absolute top-1/4 left-1/3">
                  <MapPin className="h-6 w-6 text-red-500" />
                </div>
                <div className="absolute top-1/2 left-1/2">
                  <MapPin className="h-6 w-6 text-red-500" />
                </div>
                <div className="absolute bottom-1/3 right-1/4">
                  <MapPin className="h-6 w-6 text-red-500" />
                </div>
                <div className="absolute top-1/3 right-1/3">
                  <MapPin className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-white p-2 rounded shadow-sm">
              <div className="flex items-center text-xs">
                <div className="flex items-center mr-2">
                  <div className="h-2 w-2 bg-red-500 rounded-full mr-1"></div>
                  <span>Active</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mr-1"></div>
                  <span>New</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Recent Activity / Notifications Feed */}
      <section className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <Link to="/notifications">
            <Button variant="ghost" size="sm" className="text-blue-600">
              View All
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          <div className="flex items-start p-3 border-l-4 border-green-500 bg-green-50 rounded">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
            <div>
              <p className="font-medium">Document Approved</p>
              <p className="text-sm text-gray-600">Your business permit for "Main Street Cafe" has been approved</p>
              <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
            <UploadCloud className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <div>
              <p className="font-medium">Document Uploaded</p>
              <p className="text-sm text-gray-600">You uploaded "Business Tax Certificate" for review</p>
              <p className="text-xs text-gray-500 mt-1">Yesterday</p>
            </div>
          </div>
          <div className="flex items-start p-3 border-l-4 border-amber-500 bg-amber-50 rounded">
            <Bell className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
            <div>
              <p className="font-medium">Renewal Reminder</p>
              <p className="text-sm text-gray-600">Your permit for "Downtown Gift Shop" expires in 15 days</p>
              <p className="text-xs text-gray-500 mt-1">2 days ago</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-sm font-semibold mb-2">Quick Links</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <Link to="#" className="text-gray-600 hover:text-blue-600">Help Center</Link>
              <Link to="#" className="text-gray-600 hover:text-blue-600">FAQs</Link>
              <Link to="#" className="text-gray-600 hover:text-blue-600">Terms of Service</Link>
              <Link to="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Contact Support</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HelpCircle className="h-4 w-4" />
              <span>support@elunsad.gov</span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Business Permit Licensing Office. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
