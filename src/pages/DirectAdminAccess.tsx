
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const DirectAdminAccess: React.FC = () => {
  const navigate = useNavigate();
  
  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate('/signin');
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
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        console.log("No user logged in");
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
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addAdminRole = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        console.log("No user logged in");
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
          console.log("User already has admin role");
        }
      } else {
        console.log("Admin role added successfully");
        // Refresh the page to see changes
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Admin Access Helper</CardTitle>
          <CardDescription>
            Use this page to help troubleshoot admin access issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={viewUserRoles}
          >
            View My Roles (Check Console)
          </Button>
          
          <Button 
            className="w-full" 
            variant="default" 
            onClick={addAdminRole}
          >
            Grant Admin Role to Current User
          </Button>
          
          <Button 
            className="w-full" 
            variant="secondary"
            onClick={goToAdminDashboard}
          >
            Go To Admin Dashboard Directly
          </Button>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            variant="ghost"
            onClick={goToUserDashboard}
          >
            Return to User Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DirectAdminAccess;
