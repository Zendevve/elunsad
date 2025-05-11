
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
  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="mt-4 text-lg font-medium">Verifying authentication...</span>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Use an effect to show the toast to avoid infinite re-renders
    useEffect(() => {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to access this page',
        variant: 'destructive',
      });
    }, []);
    
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If authenticated and isAdmin is true, redirect to admin dashboard
  // Only redirect if we're going to a regular user route
  if (isAdmin && 
      !['/admin-dashboard', '/admin', '/admin-helper', '/analytics'].some(path => location.pathname.startsWith(path))) {
    console.log("Admin user detected, redirecting to admin dashboard");
    return <Navigate to="/admin-dashboard" replace />;
  }

  // Render the child routes
  return <Outlet />;
};

export default AuthRoute;
