
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const DirectAdminAccess: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [roleStatus, setRoleStatus] = useState<{roles: string[], userId: string | null}>({ roles: [], userId: null });
  const { isAdmin, refreshRoles } = useAuth();
  const { toast } = useToast();
  
  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate('/signin');
      } else {
        await viewUserRoles(); // Check roles on initial load
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
  
  const viewUserRoles = async () => {
    try {
      setIsLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        setMessage({ type: 'error', text: "No user logged in" });
        return;
      }
      
      // Get user roles
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userData.user.id);
      
      console.log("User ID:", userData.user.id);
      console.log("User roles data:", roleData);
      
      if (roleError) {
        console.error("Error fetching roles:", roleError);
        setMessage({ type: 'error', text: `Error fetching roles: ${roleError.message}` });
      } else {
        setRoleStatus({
          roles: roleData?.map(r => r.role) || [],
          userId: userData.user.id
        });
        setMessage({ type: 'success', text: `Found ${roleData?.length || 0} roles for user` });
      }
    } catch (error: any) {
      console.error("Error:", error);
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const addAdminRole = async () => {
    try {
      setIsLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        setMessage({ type: 'error', text: "No user logged in" });
        return;
      }
      
      // Add office_staff role to current user
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userData.user.id,
          role: 'office_staff'
        });
      
      if (error) {
        console.error("Error adding admin role:", error);
        if (error.code === '23505') { // Duplicate key violation
          setMessage({ type: 'info', text: "User already has admin role" });
        } else {
          setMessage({ type: 'error', text: `Error adding admin role: ${error.message}` });
        }
      } else {
        setMessage({ type: 'success', text: "Admin role added successfully" });
        // Refresh roles in auth context
        refreshRoles();
        // Refresh displayed roles
        await viewUserRoles();
      }
    } catch (error: any) {
      console.error("Error:", error);
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };
  
  const forceRefreshRoles = async () => {
    try {
      setIsLoading(true);
      await refreshRoles();
      setMessage({ type: 'success', text: "Roles refreshed successfully" });
      await viewUserRoles(); // Update displayed roles
    } catch (error: any) {
      console.error("Error refreshing roles:", error);
      setMessage({ type: 'error', text: `Error refreshing roles: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Access Helper</CardTitle>
          <CardDescription>
            Use this page to help troubleshoot admin access issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              {message.type === 'error' && <AlertCircle className="h-4 w-4" />}
              {message.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
              <AlertTitle>{message.type === 'error' ? 'Error' : message.type === 'success' ? 'Success' : 'Info'}</AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
          
          {roleStatus.userId && (
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm font-medium">User ID: {roleStatus.userId}</p>
              <p className="text-sm mt-1">Current roles:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {roleStatus.roles.length > 0 ? (
                  roleStatus.roles.map((role, index) => (
                    <Badge key={index} variant={role === 'office_staff' ? 'default' : 'outline'}>
                      {role}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No roles assigned</span>
                )}
              </div>
              <div className="mt-3">
                <Badge variant={isAdmin ? 'default' : 'outline'} className="mt-2">
                  Context API: {isAdmin ? 'Is Admin' : 'Not Admin'}
                </Badge>
              </div>
            </div>
          )}
          
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={viewUserRoles}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            View My Roles
          </Button>
          
          <Button 
            className="w-full" 
            variant="default" 
            onClick={addAdminRole}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Grant Admin Role to Current User
          </Button>
          
          <Button
            className="w-full"
            variant="secondary"
            onClick={forceRefreshRoles}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Refresh Auth Context Roles
          </Button>
          
          <Button 
            className="w-full" 
            variant="secondary"
            onClick={goToAdminDashboard}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Try Admin Dashboard
          </Button>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            variant="ghost"
            onClick={goToUserDashboard}
            disabled={isLoading}
          >
            Return to User Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DirectAdminAccess;
