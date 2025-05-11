
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AuthRoute: React.FC = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  // Debug logging for component state
  useEffect(() => {
    console.log("[AuthRoute] Current state:", { 
      isAuthenticated, 
      isAdmin, 
      isLoading,
      path: location.pathname 
    });
  }, [isAuthenticated, isAdmin, isLoading, location.pathname]);

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
