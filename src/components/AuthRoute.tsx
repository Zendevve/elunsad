
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import useRoleAuth from '@/hooks/useRoleAuth';

const AuthRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  const { toast } = useToast();
  const { isAdmin, isLoading: isRoleLoading } = useRoleAuth();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("[AuthRoute] Checking authentication status");
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("[AuthRoute] Auth check error:", error);
          throw error;
        }
        
        const isAuth = !!data.session;
        console.log("[AuthRoute] Authentication status:", isAuth);
        setIsAuthenticated(isAuth);
      } catch (error) {
        console.error('[AuthRoute] Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("[AuthRoute] Auth state changed:", !!session);
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Debug logging for component state
  useEffect(() => {
    console.log("[AuthRoute] Current state:", { 
      isAuthenticated, 
      isAdmin, 
      isRoleLoading,
      path: location.pathname,
      isAdminRoute: location.pathname.startsWith('/admin') || 
                   location.pathname === '/admin-dashboard' || 
                   location.pathname.startsWith('/analytics')
    });
  }, [isAuthenticated, isAdmin, isRoleLoading, location.pathname]);

  // Show loading while checking authentication
  if (isAuthenticated === null || (isAuthenticated && isRoleLoading)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="mt-4 text-lg font-medium">
          {isAuthenticated === null ? "Verifying authentication..." : "Checking user role..."}
        </span>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Use an effect to show the toast to avoid infinite re-renders
    useEffect(() => {
      console.log("[AuthRoute] Not authenticated - redirecting to signin");
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
  console.log("[AuthRoute] User has proper access for this route - rendering content");
  return <Outlet />;
};

export default AuthRoute;
