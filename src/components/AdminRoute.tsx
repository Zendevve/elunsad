
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { isAdmin } from '@/utils/roleUtils';

const AdminRoute: React.FC = () => {
  const [isAdminUser, setIsAdminUser] = useState<boolean | null>(null);
  const { toast } = useToast();
  const location = useLocation();
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        console.log("Checking admin access rights...");
        
        // Get current user session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setIsAdminUser(false);
          return;
        }
        
        if (!sessionData.session) {
          console.log("No authenticated user session found");
          setIsAdminUser(false);
          return;
        }
        
        const userId = sessionData.session.user.id;
        console.log("Checking admin status for user:", userId);
        
        // Use the improved isAdmin function from roleUtils
        const adminStatus = await isAdmin();
        console.log("Admin status check result:", adminStatus);
        setIsAdminUser(adminStatus);
        
        // Only show access denied toast if explicitly not an admin
        if (adminStatus === false) {
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to access the admin area',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error("Unexpected error checking admin status:", error);
        setIsAdminUser(false);
        
        toast({
          title: 'Error',
          description: 'There was an issue checking admin permissions. Please try again.',
          variant: 'destructive',
        });
      }
    };

    checkAdminStatus();
  }, [toast]);

  // Show loading while checking admin status
  if (isAdminUser === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="mt-4 text-lg font-medium">Verifying admin access...</span>
      </div>
    );
  }

  // If not an admin, redirect to dashboard
  if (!isAdminUser) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // User is an admin, render the admin layout and routes
  return <Outlet />;
};

export default AdminRoute;
