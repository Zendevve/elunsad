
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AdminRoute: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { toast } = useToast();
  const location = useLocation();
  const [shouldShowToast, setShouldShowToast] = useState(false);

  // Simplified check for admin status with improved logging
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        console.log("AdminRoute: Starting admin status check");
        // Get current user session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("AdminRoute: Session error", sessionError);
          throw sessionError;
        }
        
        if (!sessionData.session) {
          console.log("AdminRoute: No authenticated user found");
          setIsAdmin(false);
          setShouldShowToast(true);
          return;
        }
        
        const userId = sessionData.session.user.id;
        console.log("AdminRoute: Checking admin status for user:", userId);
        
        // Direct query to check if user has office_staff role
        const { data, error } = await supabase
          .from('user_roles')
          .select('id')
          .eq('user_id', userId)
          .eq('role', 'office_staff')
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error code
          console.error("AdminRoute: Error checking admin role:", error);
          setIsAdmin(false);
          setShouldShowToast(true);
          return;
        }
        
        // User is admin if data exists
        const hasAdminRole = !!data;
        console.log("AdminRoute: User admin status:", hasAdminRole);
        setIsAdmin(hasAdminRole);
        
        if (!hasAdminRole) {
          setShouldShowToast(true);
        }
        
      } catch (error) {
        console.error("AdminRoute: Error checking admin status:", error);
        setIsAdmin(false);
        setShouldShowToast(true);
      }
    };

    checkAdminStatus();
  }, []);

  // Effect for showing toast notification - separate from the render cycle
  useEffect(() => {
    if (shouldShowToast && isAdmin === false) {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access the admin area',
        variant: 'destructive',
      });
      setShouldShowToast(false);
    }
  }, [shouldShowToast, isAdmin, toast]);

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
    console.log("AdminRoute: Access denied, redirecting from", location.pathname, "to /dashboard");
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  // User is an admin, render the admin layout and routes
  console.log("AdminRoute: Admin access granted to", location.pathname);
  return <Outlet />;
};

export default AdminRoute;
