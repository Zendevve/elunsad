
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, FileText, BarChart2, ClipboardCheck, 
  AlertTriangle, Calendar, Clock, CheckCircle 
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { adminApplicationService } from "@/services/application/adminApplicationService";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApplications: 0,
    expiringPermits: 0,
    approvalRate: 0
  });
  
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get current date
  const currentDate = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', dateOptions as Intl.DateTimeFormatOptions);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch user count
        const { count: userCount, error: userError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (userError) throw userError;
        
        // Fetch application counts
        const applicationCounts = await adminApplicationService.getApplicationCounts();
        
        // Calculate approval rate
        const totalProcessed = (applicationCounts.approved || 0) + (applicationCounts.rejected || 0);
        const approvalRate = totalProcessed > 0 
          ? Math.round((applicationCounts.approved || 0) / totalProcessed * 100) 
          : 0;
        
        // Set statistics
        setStats({
          totalUsers: userCount || 0,
          pendingApplications: (applicationCounts.submitted || 0) + (applicationCounts.under_review || 0),
          expiringPermits: 8, // Placeholder until we implement permit expiry tracking
          approvalRate: approvalRate
        });
        
        // Fetch recent submitted applications
        const submittedApps = await adminApplicationService.getSubmittedApplications();
        setRecentApplications(submittedApps.slice(0, 3)); // Get only the 3 most recent
        
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

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
          <Button className="flex items-center gap-2" asChild>
            <Link to="/admin/users">
              <Users className="h-4 w-4" />
              <span>Manage Users</span>
            </Link>
          </Button>
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <Link to="/admin/applications">
              <FileText className="h-4 w-4" />
              <span>Review Applications</span>
            </Link>
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

      {/* Recent Applications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Applications</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/applications">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Loading recent applications...</p>
          ) : recentApplications.length === 0 ? (
            <p className="text-center py-4">No recent applications found.</p>
          ) : (
            <div className="space-y-4">
              {recentApplications.map(app => (
                <div key={app.id} className="flex items-start p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
                  <FileText className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">
                        New Application Submitted: {app.business_information?.business_name || `Application #${app.id.substring(0, 8)}`}
                      </p>
                      <Button variant="ghost" size="sm" className="h-6" asChild>
                        <Link to={`/admin/applications/${app.id}`}>View</Link>
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">
                      {app.owner_information ? 
                        `From ${app.owner_information.given_name} ${app.owner_information.surname}` : 
                        "Unknown applicant"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted on {formatDate(app.submission_date)}
                    </p>
                  </div>
                </div>
              ))}
              
              {recentApplications.length > 0 && (
                <div className="mt-4 text-center">
                  <Link to="/admin/applications">
                    <Button variant="ghost" className="w-full">View All Applications</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
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
