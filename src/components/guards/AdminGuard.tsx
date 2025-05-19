
import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const AdminGuard: React.FC = () => {
  const { isAdmin, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Debug logging
  useEffect(() => {
    console.log("[AdminGuard] Current state:", { isAdmin, isAuthenticated, isLoading });
  }, [isAdmin, isAuthenticated, isLoading]);

  // Show access denied toast only once when access is actually denied
  useEffect(() => {
    if (!isLoading && isAuthenticated && !isAdmin) {
      console.log("[AdminGuard] Access denied - user is not admin");
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access the admin area',
        variant: 'destructive',
      });
      
      // Navigate back to user dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    }
  }, [isLoading, isAuthenticated, isAdmin, toast, navigate]);

  // Show loading while checking admin status
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="mt-4 text-lg font-medium">Verifying admin access...</span>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("[AdminGuard] Not authenticated - redirecting to signin");
    return <Navigate to="/signin" />;
  }

  // If authenticated but not admin, redirect to user dashboard
  if (!isAdmin) {
    console.log("[AdminGuard] Not admin - redirecting to dashboard");
    return <Navigate to="/dashboard" />;
  }

  // User is an admin, render the admin content
  console.log("[AdminGuard] Admin access granted - rendering admin content");
  return <Outlet />;
};

export default AdminGuard;
