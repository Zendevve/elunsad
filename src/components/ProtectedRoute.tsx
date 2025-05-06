
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
  const location = useLocation();
  const { toast } = useToast();
  const { isAdmin, isLoading } = useRoleAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsAuthenticated(!!data.session);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show loading while checking authentication and roles
  if (isAuthenticated === null || (isAuthenticated && adminOnly && isLoading)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="ml-2 text-lg font-medium">Verifying access...</span>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    toast({
      title: 'Authentication Required',
      description: 'Please sign in to access this page',
      variant: 'destructive',
    });
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If admin only and user is not admin, redirect to dashboard
  if (adminOnly && !isAdmin) {
    toast({
      title: 'Access Denied',
      description: 'You do not have permission to access this area',
      variant: 'destructive',
    });
    return <Navigate to="/dashboard" replace />;
  }

  // Render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
