
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AdminRoute: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { toast } = useToast();
  const location = useLocation();

  // Improved check for admin status with better error handling
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
        
        // Direct query to check if user has office_staff role
        const { data, error } = await supabase
          .from('user_roles')
          .select('id')
          .eq('user_id', userId)
          .eq('role', 'office_staff')
          .maybeSingle();
        
        if (error) {
          console.error("Error checking admin role:", error);
          setIsAdmin(false);
          return;
        }
        
        // User is admin if data exists
        const hasAdminRole = !!data;
        console.log("User admin status:", hasAdminRole);
        setIsAdmin(hasAdminRole);
        
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

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
    // Move toast notification to useEffect to avoid render-time side effects
    // This is critical - do not call toast() directly in the component body
    useEffect(() => {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access the admin area',
        variant: 'destructive',
      });
    }, [toast]);
    
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // User is an admin, render the admin layout and routes
  return <Outlet />;
};

export default AdminRoute;
