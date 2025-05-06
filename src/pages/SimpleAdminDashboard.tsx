
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, FileText, BarChart2, ClipboardCheck, 
  AlertTriangle, Clock, CheckCircle 
} from "lucide-react";

const SimpleAdminDashboard = () => {
  // Get current date
  const currentDate = new Date();
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', dateOptions as Intl.DateTimeFormatOptions);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-500">{formattedDate}</p>
        <p className="text-gray-600 mt-2">Welcome to the administrator control panel</p>
      </div>

      {/* Quick stats */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-gray-500">Registered accounts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ClipboardCheck className="h-8 w-8 text-amber-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-gray-500">Require review</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Expiring Permits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-red-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-gray-500">Within 30 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Approval Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold">0%</p>
                  <p className="text-xs text-gray-500">Applications approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
              <FileText className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Admin Panel Created</p>
                <p className="text-sm text-gray-600">The new admin panel has been set up successfully</p>
                <p className="text-xs text-gray-500 mt-1">Just now</p>
              </div>
            </div>
            
            <div className="flex items-start p-3 border-l-4 border-amber-500 bg-amber-50 rounded">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">System Ready</p>
                <p className="text-sm text-gray-600">The admin system is ready to be configured</p>
                <p className="text-xs text-gray-500 mt-1">Just now</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Statistics */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium">Admin Authentication</p>
                    <p className="text-sm text-gray-500">Working correctly</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium">Role Management</p>
                    <p className="text-sm text-gray-500">Working correctly</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium">Security Policies</p>
                    <p className="text-sm text-gray-500">Configured correctly</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleAdminDashboard;
