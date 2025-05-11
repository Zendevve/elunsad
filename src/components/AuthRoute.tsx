
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import useRoleAuth from '@/hooks/useRoleAuth';

const AuthRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasShownAuthToast, setHasShownAuthToast] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const { isAdmin, isLoading: isRoleLoading } = useRoleAuth();

  // Effect to show toast when redirecting to login
  useEffect(() => {
    if (!isAuthenticated && hasShownAuthToast) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to access this page',
        variant: 'destructive',
      });
    }
  }, [isAuthenticated, hasShownAuthToast, toast]);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Auth check error:", error);
          throw error;
        }
        setIsAuthenticated(!!data.session);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", !!session);
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show loading while checking authentication
  if (isAuthenticated === null || (isAuthenticated && isRoleLoading)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="mt-4 text-lg font-medium">Verifying authentication...</span>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Set flag to show toast on next render if not already shown
    if (!hasShownAuthToast) {
      setHasShownAuthToast(true);
    }
    
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Log current state for debugging
  console.log("AuthRoute: isAdmin=", isAdmin, "isAuthenticated=", isAuthenticated);

  // If user is admin and we've confirmed it, redirect to admin dashboard
  if (isAdmin && !isRoleLoading) {
    console.log("User is admin, redirecting to admin dashboard");
    return <Navigate to="/admin-dashboard" replace />;
  }

  // Render the child routes for regular authenticated non-admin users
  return <Outlet />;
};

export default AuthRoute;
