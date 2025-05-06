
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DirectAdminAccess: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAdminRole, setHasAdminRole] = useState(false);
  const [isAddingRole, setIsAddingRole] = useState(false);
  
  // Check if user is logged in and get roles
  useEffect(() => {
    const checkUser = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getUser();
        
        if (!data.user) {
          toast({
            title: "Not logged in",
            description: "You need to sign in first",
            variant: "destructive"
          });
          navigate('/signin');
          return;
        }
        
        setUserId(data.user.id);
        
        // Check admin role
        const { data: adminData, error: adminError } = await supabase.rpc('check_user_role', {
          user_id: data.user.id,
          role_name: 'office_staff'
        });
        
        if (adminError) {
          console.error("Error checking admin status:", adminError);
        } else {
          setHasAdminRole(!!adminData);
          console.log("User has admin role:", adminData);
        }
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
  
  const addAdminRole = async () => {
    if (!userId) return;
    
    try {
      setIsAddingRole(true);
      
      // Add office_staff role to current user
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'office_staff'
        });
      
      if (error) {
        console.error("Error adding admin role:", error);
        if (error.code === '23505') { // Duplicate key violation
          toast({
            title: "Role already exists",
            description: "You already have the admin role",
            variant: "default"
          });
        } else {
          toast({
            title: "Error adding role",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        console.log("Admin role added successfully");
        setHasAdminRole(true);
        toast({
          title: "Admin role added",
          description: "You now have administrator privileges",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error occurred",
        description: "Could not add admin role",
        variant: "destructive"
      });
    } finally {
      setIsAddingRole(false);
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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-medium mb-2">Admin Status</h3>
                <div className="flex items-center">
                  {hasAdminRole ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      <span>You have admin privileges</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      <span>You do not have admin privileges</span>
                    </>
                  )}
                </div>
              </div>
              
              {!hasAdminRole && (
                <Button 
                  className="w-full" 
                  variant="default"
                  onClick={addAdminRole}
                  disabled={isAddingRole}
                >
                  {isAddingRole ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span>Adding Admin Role...</span>
                    </>
                  ) : (
                    'Grant Admin Role to Current User'
                  )}
                </Button>
              )}
              
              {hasAdminRole && (
                <Button 
                  className="w-full" 
                  variant="default"
                  onClick={goToAdminDashboard}
                >
                  Go To Admin Dashboard
                </Button>
              )}
            </>
          )}
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
