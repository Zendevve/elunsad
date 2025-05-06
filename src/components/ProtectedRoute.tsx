
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import useRoleAuth from '@/hooks/useRoleAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState<Error | null>(null);
  const location = useLocation();
  const { toast } = useToast();
  const { isAdmin, isLoading: roleLoading, error: roleError } = useRoleAuth();

  // Handle authentication error - This is now outside conditional rendering
  useEffect(() => {
    if (authError) {
      toast({
        title: 'Authentication Error',
        description: 'There was an issue verifying your authentication status.',
        variant: 'destructive',
      });
    }
  }, [authError, toast]);

  // Handle role error - This is now outside conditional rendering
  useEffect(() => {
    if (roleError) {
      toast({
        title: 'Role Verification Error',
        description: 'There was an issue verifying your permissions. Please try again later.',
        variant: 'destructive',
      });
    }
  }, [roleError, toast]);

  // Authentication check effect
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setIsAuthenticated(!!data.session);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuthError(error instanceof Error ? error : new Error('Authentication error'));
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show loading while checking authentication and roles
  if (isAuthenticated === null || (isAuthenticated && adminOnly && roleLoading)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="mt-4 text-lg font-medium">Verifying access...</span>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Use a local variable for authentication message
    const authMessage = {
      title: 'Authentication Required',
      description: 'Please sign in to access this page',
      variant: 'destructive',
    };
    
    // Show authentication required toast
    useEffect(() => {
      toast(authMessage);
    }, [toast]); // Dependencies array correctly includes toast
    
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If admin only and user is not admin, redirect to dashboard
  if (adminOnly && !isAdmin && !roleLoading) {
    // Use a local variable for access denied message
    const accessDeniedMessage = {
      title: 'Access Denied',
      description: 'You do not have permission to access this area',
      variant: 'destructive',
    };
    
    // Show access denied toast
    useEffect(() => {
      toast(accessDeniedMessage);
    }, [toast]); // Dependencies array correctly includes toast
    
    return <Navigate to="/dashboard" replace />;
  }

  // Render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
