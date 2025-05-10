
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AdminRoute: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  // Check for admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        console.log("Checking admin status...");
        
        // Get current user session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          throw sessionError;
        }
        
        if (!sessionData.session) {
          console.log("No authenticated user found");
          setIsAuthenticated(false);
          setIsAdmin(false);
          return;
        }
        
        setIsAuthenticated(true);
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
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed in AdminRoute:", !!session);
      
      // If session is null (user logged out), set admin to false
      if (!session) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        return;
      }
      
      setIsAuthenticated(true);
      
      // Don't make the Supabase call directly in the callback to avoid deadlocks
      setTimeout(async () => {
        try {
          const userId = session.user.id;
          console.log("Rechecking admin status for user:", userId);
          
          // Direct query to check if user has office_staff role
          const { data, error } = await supabase
            .from('user_roles')
            .select('id')
            .eq('user_id', userId)
            .eq('role', 'office_staff')
            .maybeSingle();
          
          if (error) {
            console.error("Error rechecking admin role:", error);
            setIsAdmin(false);
            return;
          }
          
          // User is admin if data exists
          const hasAdminRole = !!data;
          console.log("Updated user admin status:", hasAdminRole);
          setIsAdmin(hasAdminRole);
        } catch (error) {
          console.error("Error rechecking admin status:", error);
          setIsAdmin(false);
        }
      }, 0);
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

  // If not authenticated, redirect to login first
  if (!isAuthenticated) {
    toast({
      title: 'Authentication Required',
      description: 'Please sign in to access the admin area'
    });
    
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  // If not an admin, redirect to dashboard with access denied message
  if (!isAdmin) {
    toast({
      variant: "destructive",
      title: 'Access Denied',
      description: 'You do not have permission to access the admin area'
    });
    
    return <Navigate to="/dashboard" replace />;
  }

  // User is an admin, render the admin layout and routes
  return <Outlet />;
};

export default AdminRoute;
