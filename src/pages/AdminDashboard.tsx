
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, FileText, BarChart2, ClipboardCheck, 
  AlertTriangle, Calendar, Clock, CheckCircle 
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApplications: 0,
    expiringPermits: 0,
    approvalRate: 0
  });

  // Get current date
  const currentDate = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', dateOptions as Intl.DateTimeFormatOptions);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch user count
        const { count: userCount, error: userError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (userError) throw userError;
        
        // In a real app, you'd fetch these values from your database
        setStats({
          totalUsers: userCount || 0,
          pendingApplications: 15,
          expiringPermits: 8,
          approvalRate: 78
        });
        
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-500">{formattedDate}</p>
          <p className="text-gray-600 mt-2">Welcome to the administrator control panel</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Manage Users</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>View Reports</span>
          </Button>
        </div>
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
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
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
                  <p className="text-2xl font-bold">{stats.pendingApplications}</p>
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
                  <p className="text-2xl font-bold">{stats.expiringPermits}</p>
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
                  <p className="text-2xl font-bold">{stats.approvalRate}%</p>
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
                <p className="font-medium">New Application Submitted</p>
                <p className="text-sm text-gray-600">John Smith submitted a new business permit application</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start p-3 border-l-4 border-green-500 bg-green-50 rounded">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Application Approved</p>
                <p className="text-sm text-gray-600">Maria Rodriguez's business permit was approved by Admin</p>
                <p className="text-xs text-gray-500 mt-1">Yesterday</p>
              </div>
            </div>
            
            <div className="flex items-start p-3 border-l-4 border-amber-500 bg-amber-50 rounded">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
              <div>
                <p className="font-medium">Document Flagged</p>
                <p className="text-sm text-gray-600">Business tax certificate for Downtown Café needs verification</p>
                <p className="text-xs text-gray-500 mt-1">2 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex flex-col items-center justify-center">
              <div className="relative w-full h-32">
                <BarChart2 className="h-32 w-full text-gray-200" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 flex items-end">
                  <div className="w-1/6 h-12 bg-blue-500 mx-1 rounded-t"></div>
                  <div className="w-1/6 h-20 bg-blue-500 mx-1 rounded-t"></div>
                  <div className="w-1/6 h-16 bg-blue-500 mx-1 rounded-t"></div>
                  <div className="w-1/6 h-24 bg-blue-500 mx-1 rounded-t"></div>
                  <div className="w-1/6 h-18 bg-blue-500 mx-1 rounded-t"></div>
                  <div className="w-1/6 h-14 bg-blue-500 mx-1 rounded-t"></div>
                </div>
              </div>
              <div className="flex space-x-4 mt-6 mb-4">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">New</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Approved</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-amber-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">Application trend for the last 6 months</p>
              <Link to="/analytics" className="mt-4">
                <Button variant="outline">View Full Analytics</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Renewals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium">Downtown Café</p>
                    <p className="text-sm text-gray-500">Expires in 12 days</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Send reminder</Button>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium">Green Gardens Nursery</p>
                    <p className="text-sm text-gray-500">Expires in 15 days</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Send reminder</Button>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium">Tech Solutions Inc.</p>
                    <p className="text-sm text-gray-500">Expires in 18 days</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Send reminder</Button>
              </div>
              
              <div className="mt-4">
                <Link to="/admin/renewals">
                  <Button variant="ghost" className="w-full">View All Renewals</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
