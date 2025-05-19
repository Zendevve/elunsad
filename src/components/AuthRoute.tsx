
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AuthRoute: React.FC = () => {
  const { isAuthenticated, isAdmin, isLoading, refreshRoles } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  // Attempt to refresh roles when mounting to ensure we have the latest data
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log("[AuthRoute] Authenticated user detected, refreshing roles");
      refreshRoles().catch(err => {
        console.error("[AuthRoute] Error refreshing roles:", err);
      });
    }
  }, [isAuthenticated, isLoading, refreshRoles]);

  // Debug logging for component state
  useEffect(() => {
    console.log("[AuthRoute] Current state:", { 
      isAuthenticated, 
      isAdmin, 
      isLoading,
      path: location.pathname 
    });
  }, [isAuthenticated, isAdmin, isLoading, location.pathname]);

  // Directly check for admin role if needed
  useEffect(() => {
    const checkAdminDirectly = async () => {
      if (isAuthenticated && !isLoading && !isAdmin) {
        try {
          console.log("[AuthRoute] Double-checking admin status directly");
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) return;
          
          const { data: roleData, error: roleError } = await supabase
            .rpc('check_user_role', { 
              user_id: user.id, 
              role_name: 'office_staff' 
            });
            
          console.log("[AuthRoute] Direct admin check result:", { roleData, roleError });
          
          if (roleData === true) {
            console.log("[AuthRoute] User is actually admin, refreshing roles");
            await refreshRoles();
          }
        } catch (error) {
          console.error("[AuthRoute] Error in direct admin check:", error);
        }
      }
    };
    
    checkAdminDirectly();
  }, [isAuthenticated, isAdmin, isLoading, refreshRoles]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="mt-4 text-lg font-medium">
          Verifying authentication...
        </span>
      </div>
    );
  }

  // If not authenticated, redirect to login with a toast message
  if (!isAuthenticated) {
    useEffect(() => {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to access this page',
        variant: 'destructive',
      });
    }, []);
    
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If authenticated and the user is an admin, redirect to admin dashboard
  // BUT only if they're trying to access a regular user route
  const isAdminRoute = location.pathname.startsWith('/admin') || 
                      location.pathname === '/admin-dashboard' || 
                      location.pathname.startsWith('/analytics');

  if (isAdmin && !isAdminRoute) {
    console.log("[AuthRoute] Admin user detected on regular route - redirecting to admin dashboard");
    return <Navigate to="/admin-dashboard" replace />;
  }

  // If we get here, the user is authenticated and either:
  // 1. Not an admin trying to access a regular route
  // 2. An admin trying to access an admin route (AdminRoute will handle this case)
  return <Outlet />;
};

export default AuthRoute;
