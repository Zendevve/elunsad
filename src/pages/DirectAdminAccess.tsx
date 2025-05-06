
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DirectAdminAccess: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAdminRole, setHasAdminRole] = useState(false);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', data.user.id)
            .eq('role', 'office_staff')
            .maybeSingle();
          
          if (roleError) {
            console.error("Error checking admin status:", roleError);
          } else {
            setHasAdminRole(!!roleData);
            console.log("User has admin role:", !!roleData);
          }
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
      
      // Use a more direct SQL-based approach with RPC to avoid recursion issues
      // Try a different approach - use a service_role key function if available
      // or direct insert with specific connection settings
      console.log("Attempting to add admin role for user:", userId);
      
      // First approach: direct insert with specific options
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'office_staff'
        });
      
      if (error) {
        console.error("Error adding admin role:", error);
        
        if (error.message.includes("recursion")) {
          setError("Recursion error detected. Please use the provided workaround.");
          
          toast({
            title: "Permission Error",
            description: "There's a recursion issue in the database policy. Try using SQL Editor in Supabase dashboard.",
            variant: "destructive"
          });
        } else if (error.code === '23505') { // Duplicate key violation
          toast({
            title: "Role already exists",
            description: "You already have the admin role",
            variant: "default"
          });
          setHasAdminRole(true);
        } else {
          setError(error.message);
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
      setError(error instanceof Error ? error.message : "Unknown error occurred");
      toast({
        title: "Error occurred",
        description: "Could not add admin role",
        variant: "destructive"
      });
    } finally {
      setIsAddingRole(false);
    }
  };

  const showWorkaround = () => {
    setError(
      `To manually add an admin role, run this SQL in the Supabase SQL Editor:
      
INSERT INTO public.user_roles (user_id, role)
VALUES ('${userId}', 'office_staff');`
    );
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
                    <div className="space-y-2">
                      <p>{error}</p>
                      {error.includes("recursion") && (
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={showWorkaround}
                        >
                          Show SQL Workaround
                        </Button>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
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
