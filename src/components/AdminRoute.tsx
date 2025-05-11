
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const AdminRoute: React.FC = () => {
  const { isAdmin, isAuthenticated, isLoading, refreshRoles } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // Attempt to refresh roles when mounting to ensure we have the latest data
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log("[AdminRoute] Authenticated user detected, refreshing roles");
      refreshRoles().catch(err => {
        console.error("[AdminRoute] Error refreshing roles:", err);
      });
    }
  }, [isAuthenticated, isLoading, refreshRoles]);

  // Directly check admin status if needed
  useEffect(() => {
    const checkAdminDirectly = async () => {
      if (isAuthenticated && !isLoading && !isAdmin) {
        try {
          console.log("[AdminRoute] Double-checking admin status directly using RPC");
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) return;
          
          const { data: roleData, error: roleError } = await supabase
            .rpc('check_user_role', { 
              user_id: user.id, 
              role_name: 'office_staff' 
            });
            
          console.log("[AdminRoute] Direct admin check result:", { roleData, roleError });
          
          if (roleData === true) {
            console.log("[AdminRoute] User is actually admin, refreshing roles");
            await refreshRoles();
            // Force reload the page if we detected admin status directly
            window.location.reload();
          }
        } catch (error) {
          console.error("[AdminRoute] Error in direct admin check:", error);
        }
      }
    };
    
    checkAdminDirectly();
  }, [isAuthenticated, isAdmin, isLoading, refreshRoles]);

  // Log the current state for debugging
  useEffect(() => {
    console.log("[AdminRoute] Current state:", { 
      isAdmin, 
      isAuthenticated,
      isLoading, 
      path: location.pathname 
    });
  }, [isAdmin, isAuthenticated, isLoading, location.pathname]);

  // Show loading while checking admin status
  if (isLoading) {
    console.log("[AdminRoute] Loading - checking admin status");
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="mt-4 text-lg font-medium">Verifying admin access...</span>
      </div>
    );
  }

  // If not authenticated, redirect to signin
  if (!isAuthenticated) {
    console.log("[AdminRoute] Not authenticated - redirecting to signin");
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If not an admin, redirect to dashboard
  if (!isAdmin) {
    console.log("[AdminRoute] Not admin - redirecting to dashboard");
    // Show toast message
    toast({
      title: 'Access Denied',
      description: 'You do not have permission to access the admin area',
      variant: 'destructive',
    });
    return <Navigate to="/dashboard" replace />;
  }

  // User is an admin, render the admin layout and routes
  console.log("[AdminRoute] Admin access granted - rendering admin content");
  return <Outlet />;
};

export default AdminRoute;
