
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getRedirectPathForUser } from '@/utils/authUtils';

const AuthGuard: React.FC = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  // Debug logging
  useEffect(() => {
    console.log("[AuthGuard] Current state:", { 
      isAuthenticated, 
      isAdmin, 
      isLoading, 
      path: location.pathname 
    });
  }, [isAuthenticated, isAdmin, isLoading, location.pathname]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("[AuthGuard] Access denied - user is not authenticated");
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to access this page',
        variant: 'destructive',
      });
    }
  }, [isLoading, isAuthenticated, toast]);

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

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If authenticated and the user is an admin, redirect to admin dashboard
  // BUT only if they're trying to access a regular user route
  const isAdminRoute = location.pathname.startsWith('/admin') || 
                      location.pathname === '/admin-dashboard' || 
                      location.pathname.startsWith('/analytics');

  if (isAdmin && !isAdminRoute) {
    console.log("[AuthGuard] Admin user detected on regular route - redirecting to admin dashboard");
    return <Navigate to="/admin-dashboard" replace />;
  }

  // User is authenticated and either:
  // 1. Not an admin trying to access a regular route
  // 2. An admin trying to access an admin route (AdminRoute will handle this case)
  console.log("[AuthGuard] User has proper access for this route - rendering content");
  return <Outlet />;
};

export default AuthGuard;
