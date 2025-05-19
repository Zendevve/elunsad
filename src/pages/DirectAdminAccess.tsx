
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const DirectAdminAccess: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [roleData, setRoleData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<boolean>(false);
  
  // Check user and their roles
  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      try {
        // Get the current user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        if (!userData.user) {
          console.log("No user logged in");
          navigate('/signin');
          return;
        }
        
        setUserData(userData.user);
        
        // Get user roles
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', userData.user.id);
        
        if (roleError) throw roleError;
        
        setRoleData(roleData || []);
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUser();
  }, [navigate]);
  
  const goToAdminDashboard = () => {
    navigate('/admin-dashboard');
  };
  
  const goToUserDashboard = () => {
    navigate('/dashboard');
  };
  
  const viewFullDebugInfo = () => {
    // Display full debug info
    console.log({
      userData,
      roleData,
      localStorage: { ...localStorage }
    });
  };

  const addAdminRole = async () => {
    if (!userData) return;
    
    setActionLoading(true);
    setActionMessage(null);
    setActionError(false);
    
    try {
      // First check if the role already exists
      const existingRole = roleData.find(r => r.role === 'office_staff');
      
      if (existingRole) {
        setActionMessage("User already has admin role");
        return;
      }
      
      // Add office_staff role to current user
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userData.id,
          role: 'office_staff'
        });
      
      if (error) throw error;
      
      setActionMessage("Admin role added successfully");
      
      // Refresh role data
      const { data: updatedRoleData } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userData.id);
      
      setRoleData(updatedRoleData || []);
      
    } catch (error) {
      console.error("Error adding admin role:", error);
      setActionMessage("Error adding admin role");
      setActionError(true);
    } finally {
      setActionLoading(false);
    }
  };

  const removeAdminRole = async () => {
    if (!userData) return;
    
    setActionLoading(true);
    setActionMessage(null);
    setActionError(false);
    
    try {
      const existingRole = roleData.find(r => r.role === 'office_staff');
      
      if (!existingRole) {
        setActionMessage("User doesn't have admin role");
        return;
      }
      
      // Remove office_staff role from current user
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userData.id)
        .eq('role', 'office_staff');
      
      if (error) throw error;
      
      setActionMessage("Admin role removed successfully");
      
      // Refresh role data
      const { data: updatedRoleData } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userData.id);
      
      setRoleData(updatedRoleData || []);
      
    } catch (error) {
      console.error("Error removing admin role:", error);
      setActionMessage("Error removing admin role");
      setActionError(true);
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-lg">Loading user data...</p>
        </div>
      </div>
    );
  }

  const isAdmin = roleData.some(role => role.role === 'office_staff');

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="bg-primary/5">
          <CardTitle>Admin Access Helper</CardTitle>
          <CardDescription>
            Use this page to help troubleshoot admin access issues
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-6">
          {actionMessage && (
            <Alert variant={actionError ? "destructive" : "default"}>
              <div className="flex items-center">
                {actionError ? <AlertCircle className="h-4 w-4 mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                <AlertTitle>{actionError ? "Error" : "Success"}</AlertTitle>
              </div>
              <AlertDescription>{actionMessage}</AlertDescription>
            </Alert>
          )}
          
          <div className="bg-gray-50 border rounded-md p-4">
            <h3 className="font-medium text-sm mb-2">Current User Information</h3>
            <div className="text-sm space-y-1">
              <p><span className="font-medium">User ID:</span> {userData?.id}</p>
              <p><span className="font-medium">Email:</span> {userData?.email}</p>
              <p><span className="font-medium">Admin Role:</span> {isAdmin ? '✅ Yes' : '❌ No'}</p>
              <p>
                <span className="font-medium">All Roles:</span>{' '}
                {roleData.length ? roleData.map(r => r.role).join(', ') : 'No roles assigned'}
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium">Role Management</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                className="w-full" 
                variant="default"
                disabled={isAdmin || actionLoading}
                onClick={addAdminRole}
              >
                {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Grant Admin Role
              </Button>
              
              <Button 
                className="w-full" 
                variant="destructive"
                disabled={!isAdmin || actionLoading}
                onClick={removeAdminRole}
              >
                {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Remove Admin Role
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium">Navigation Testing</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                className="w-full" 
                variant="secondary"
                onClick={goToAdminDashboard}
              >
                Go To Admin Dashboard
              </Button>
              
              <Button 
                className="w-full" 
                variant="outline"
                onClick={goToUserDashboard}
              >
                Go To User Dashboard
              </Button>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            variant="ghost"
            onClick={viewFullDebugInfo}
          >
            View Full Debug Info (Check Console)
          </Button>
        </CardContent>
        
        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-xs text-gray-500">
            ID: {userData?.id.substring(0, 8)}... | Session Status: {isAdmin ? 'Admin' : 'Regular User'}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DirectAdminAccess;
