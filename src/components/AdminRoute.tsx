
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { hasRole } from '@/utils/roleUtils';

const AdminRoute: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  const { toast } = useToast();

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        console.log("AdminRoute: Checking authentication and admin status");
        
        // Get current user session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("AdminRoute: Session error", sessionError);
          setIsAuthenticated(false);
          setIsAdmin(false);
          return;
        }
        
        setIsAuthenticated(!!sessionData.session);
        
        if (!sessionData.session) {
          console.log("AdminRoute: No authenticated user found");
          setIsAdmin(false);
          return;
        }
        
        console.log("AdminRoute: User authenticated, checking admin role");
        
        // Check if user has office_staff role using the utility function
        const adminStatus = await hasRole('office_staff');
        console.log("AdminRoute: Admin status determined:", adminStatus);
        setIsAdmin(adminStatus);
        
      } catch (error) {
        console.error("AdminRoute: Error checking admin status:", error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("AdminRoute: Auth state changed, session exists:", !!session);
      setIsAuthenticated(!!session);
      
      if (session) {
        // Use setTimeout to avoid potential Supabase client deadlocks
        setTimeout(async () => {
          const adminStatus = await hasRole('office_staff');
          console.log("AdminRoute: Admin status after auth change:", adminStatus);
          setIsAdmin(adminStatus);
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show loading while checking admin status
  if (isAdmin === null || isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="mt-4 text-lg font-medium">Verifying admin access...</span>
      </div>
    );
  }

  // If not authenticated at all, redirect to login
  if (!isAuthenticated) {
    toast({
      title: 'Authentication Required',
      description: 'Please sign in to access this page',
      variant: 'destructive',
    });
    
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If not an admin, redirect to dashboard
  if (!isAdmin) {
    toast({
      title: 'Access Denied',
      description: 'You do not have permission to access the admin area',
      variant: 'destructive',
    });
    
    return <Navigate to="/dashboard" replace />;
  }

  // User is an admin, render the admin layout and routes
  return <Outlet />;
};

export default AdminRoute;
