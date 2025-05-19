
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { safeRedirectByRole } from '@/utils/authUtils';

const AuthGuard: React.FC = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
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

  // Effect to handle admin redirection if needed
  useEffect(() => {
    // Only run this effect when we have determined authentication and admin status
    if (!isLoading && isAuthenticated) {
      const isAdminRoute = location.pathname.startsWith('/admin') || 
                          location.pathname === '/admin-dashboard' || 
                          location.pathname.startsWith('/analytics');
      
      // If admin on regular route or regular user on admin route, redirect appropriately
      if ((isAdmin && !isAdminRoute) || (!isAdmin && isAdminRoute)) {
        console.log("[AuthGuard] Role mismatch detected, redirecting...", {
          isAdmin,
          isAdminRoute,
          currentPath: location.pathname
        });
        
        // Use safe redirect to handle potential errors
        safeRedirectByRole(isAdmin, navigate);
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, location.pathname, navigate]);

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

  // User is authenticated, render children (other guards will handle specific permissions)
  console.log("[AuthGuard] User has proper access for this route - rendering content");
  return <Outlet />;
};

export default AuthGuard;
