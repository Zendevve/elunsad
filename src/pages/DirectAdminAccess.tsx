
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';

const DirectAdminAccess: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
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
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        console.log("No user logged in");
        toast({
          variant: "destructive",
          title: "Not logged in",
          description: "You must be logged in to perform this action."
        });
        setLoading(false);
        return;
      }
      
      // Check if user already has admin role
      const { data: existingRole, error: roleCheckError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userData.user.id)
        .eq('role', 'office_staff')
        .maybeSingle();

      if (roleCheckError) {
        console.error("Error checking admin role:", roleCheckError);
      }

      if (existingRole) {
        console.log("User already has admin role");
        toast({
          title: "Already an admin",
          description: "You already have administrator privileges."
        });
        setLoading(false);
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
        toast({
          variant: "destructive",
          title: "Error adding admin role",
          description: error.message || "An unexpected error occurred."
        });
      } else {
        console.log("Admin role added successfully");
        toast({
          title: "Admin role added successfully",
          description: "Administrator privileges have been granted to your account."
        });
        // Force page refresh to apply changes
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error adding admin role",
        description: "An unexpected error occurred."
      });
    } finally {
      setLoading(false);
    }
  };

  const makeUserAdminByEmail = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter an email address."
      });
      return;
    }

    setLoading(true);
    try {
      // First, find the user by email
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', email);

      if (profileError) {
        console.error("Error finding user:", profileError);
        toast({
          variant: "destructive",
          title: "Error finding user",
          description: profileError.message || `Could not find user with email: ${email}`
        });
        setLoading(false);
        return;
      }

      if (!profiles || profiles.length === 0) {
        toast({
          variant: "destructive",
          title: "User not found",
          description: `No user found with email: ${email}`
        });
        setLoading(false);
        return;
      }

      const userId = profiles[0].id;

      // Check if user already has admin role
      const { data: existingRole, error: roleCheckError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'office_staff')
        .maybeSingle();

      if (roleCheckError) {
        console.error("Error checking existing role:", roleCheckError);
      }

      if (existingRole) {
        toast({
          title: "User already has admin role",
          description: `${email} already has administrator privileges.`
        });
        setLoading(false);
        return;
      }

      // Add admin role to the user
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'office_staff'
        });
      
      if (error) {
        console.error("Error adding admin role:", error);
        toast({
          variant: "destructive",
          title: "Error adding admin role",
          description: error.message || `Failed to grant administrator privileges to ${email}.`
        });
      } else {
        console.log("Admin role added successfully for:", email);
        toast({
          title: "Admin role added successfully",
          description: `Administrator privileges have been granted to ${email}.`
        });
      }
    } catch (error) {
      console.error("Error making user admin:", error);
      toast({
        variant: "destructive",
        title: "Error adding admin role",
        description: "An unexpected error occurred."
      });
    } finally {
      setLoading(false);
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
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Grant Admin Role to Current User
          </Button>
          
          <div className="pt-4 space-y-2">
            <Label htmlFor="email">Make specific user an admin:</Label>
            <div className="flex space-x-2">
              <Input
                id="email"
                type="email"
                placeholder="Enter user email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button 
                onClick={makeUserAdminByEmail}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Grant"}
              </Button>
            </div>
          </div>
          
          <Button 
            className="w-full mt-6" 
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
