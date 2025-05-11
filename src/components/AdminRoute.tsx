
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import useRoleAuth from '@/hooks/useRoleAuth';

const AdminRoute: React.FC = () => {
  const { isAdmin, isLoading } = useRoleAuth();
  const { toast } = useToast();
  const location = useLocation();

  // Show access denied toast when redirecting non-admin users
  useEffect(() => {
    if (isLoading === false && isAdmin === false) {
      console.log("[AdminRoute] Access denied - user is not admin");
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access the admin area',
        variant: 'destructive',
      });
    }
  }, [isLoading, isAdmin, toast]);

  // Log the current state for debugging
  useEffect(() => {
    console.log("[AdminRoute] Current state:", { 
      isAdmin, 
      isLoading, 
      path: location.pathname 
    });
  }, [isAdmin, isLoading, location.pathname]);

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

  // If not an admin, redirect to dashboard
  if (!isAdmin) {
    console.log("[AdminRoute] Not admin - redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // User is an admin, render the admin layout and routes
  console.log("[AdminRoute] Admin access granted - rendering admin content");
  return <Outlet />;
};

export default AdminRoute;
