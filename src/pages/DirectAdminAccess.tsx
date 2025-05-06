
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle2, XCircle, AlertTriangle, Code } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getUserRoles, addRoleToUser } from '@/utils/roleUtils';

const DirectAdminAccess: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAdminRole, setHasAdminRole] = useState(false);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSqlCommand, setShowSqlCommand] = useState(false);
  
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
        
        // Check admin role using direct query
        try {
          const roles = await getUserRoles();
          const isAdmin = roles.includes('office_staff');
          setHasAdminRole(isAdmin);
          console.log("User has admin role:", isAdmin);
        } catch (error) {
          console.error("Error in role check:", error);
        }
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUser();
  }, [navigate, toast]);
  
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
      setError(null);
      
      // Use our utility function which handles errors better
      const success = await addRoleToUser(userId, 'office_staff');
      
      if (!success) {
        // Show manual SQL workaround immediately for any error
        setError("Could not add admin role automatically. This is likely due to the infinite recursion issue in the RLS policies. Please use the SQL workaround below.");
        setShowSqlCommand(true);
        
        toast({
          title: "Error adding role",
          description: "Please use the SQL workaround displayed below",
          variant: "destructive"
        });
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
      setError(error instanceof Error ? error.message : "Unknown error occurred");
      
      // Show SQL workaround for all errors
      setShowSqlCommand(true);
      
      toast({
        title: "Error occurred",
        description: "Could not add admin role automatically. Try the SQL workaround.",
        variant: "destructive"
      });
    } finally {
      setIsAddingRole(false);
    }
  };

  // Function to show the SQL workaround
  const showWorkaround = () => {
    setShowSqlCommand(true);
    setError(
      `To manually add an admin role, run this SQL in the Supabase SQL Editor:`
    );
  };

  // SQL command text
  const getSqlCommandText = () => {
    return `INSERT INTO public.user_roles (user_id, role)
VALUES ('${userId}', 'office_staff');`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-[500px]">
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
              
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error Detected</AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">{error}</p>
                  </AlertDescription>
                </Alert>
              )}
              
              {showSqlCommand && (
                <div className="bg-black text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-xs">SQL Command</span>
                    <Code className="h-4 w-4 text-white" />
                  </div>
                  {getSqlCommandText()}
                </div>
              )}
              
              {!hasAdminRole && (
                <div className="space-y-3">
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
                  
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={showWorkaround}
                  >
                    Show SQL Workaround
                  </Button>
                </div>
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
        <CardFooter className="flex flex-col space-y-2">
          <Button 
            className="w-full" 
            variant="ghost"
            onClick={goToUserDashboard}
          >
            Return to User Dashboard
          </Button>
          
          {userId && (
            <div className="text-xs text-gray-500 text-center w-full">
              <p>Current User ID: {userId}</p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default DirectAdminAccess;
