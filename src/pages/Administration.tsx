
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import AdminUserManagement from "@/components/admin/AdminUserManagement";
import ApplicationReview from "@/components/admin/ApplicationReview";

const Administration = () => {
  const [activeTab, setActiveTab] = useState("applications");
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize tab based on URL hash if present
  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.substring(1); // Remove the # character
      if (["users", "applications", "logs", "settings"].includes(hash)) {
        setActiveTab(hash);
      }
    }
  }, [location.hash]);

  // Update URL hash when changing tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/admin#${value}`, { replace: true });
  };

  return (
    <div className="p-6 space-y-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold">Administration</h1>
      
      <Tabs defaultValue="applications" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminUserManagement />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Application Management</CardTitle>
            </CardHeader>
            <CardContent>
              <ApplicationReview />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <p className="text-center text-gray-500">No audit logs available yet.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <p className="text-center text-gray-500">System configuration options will be available here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Administration;
