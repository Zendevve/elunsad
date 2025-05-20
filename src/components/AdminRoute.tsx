
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AdminRoute: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { toast } = useToast();
  const location = useLocation();
  
  // To track if we should show the access denied toast
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  // Check admin status using the security definer function
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        console.log("Checking admin access rights...");
        
        // Get current user session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setIsAdmin(false);
          return;
        }
        
        if (!sessionData.session) {
          console.log("No authenticated user session found");
          setIsAdmin(false);
          return;
        }
        
        const userId = sessionData.session.user.id;
        console.log("Checking admin status for user:", userId);
        
        // Use RPC to call our new security definer function
        // This avoids the RLS recursion issues
        const { data, error } = await supabase
          .rpc('check_admin_role', { user_id: userId });
        
        if (error) {
          console.error("Error checking admin role:", error);
          
          // Fallback to direct query if the RPC fails
          // This is a backup in case the function call fails
          const fallbackCheck = await supabase
            .from('user_roles')
            .select('id')
            .eq('user_id', userId)
            .eq('role', 'office_staff')
            .maybeSingle();
            
          if (fallbackCheck.error) {
            console.error("Fallback check failed:", fallbackCheck.error);
            setIsAdmin(false);
          } else {
            const hasAdminRole = !!fallbackCheck.data;
            console.log("Admin status (fallback):", hasAdminRole);
            setIsAdmin(hasAdminRole);
            
            if (!hasAdminRole) {
              setShowAccessDenied(true);
            }
          }
          return;
        }
        
        // data contains the boolean result from check_admin_role function
        console.log("Admin status check result:", data);
        setIsAdmin(data);
        
        // Set flag to show toast if not admin
        if (!data) {
          setShowAccessDenied(true);
        }
        
      } catch (error) {
        console.error("Unexpected error checking admin status:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

  // Show access denied toast when needed
  // This hook is ALWAYS called, not conditionally
  useEffect(() => {
    // Only show toast when isAdmin is confirmed to be false (not null)
    if (isAdmin === false && showAccessDenied) {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access the admin area',
        variant: 'destructive',
      });
    }
  }, [isAdmin, showAccessDenied, toast]);

  // Show loading while checking admin status
  if (isAdmin === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="mt-4 text-lg font-medium">Verifying admin access...</span>
      </div>
    );
  }

  // If not an admin, redirect to dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // User is an admin, render the admin layout and routes
  return <Outlet />;
};

export default AdminRoute;
