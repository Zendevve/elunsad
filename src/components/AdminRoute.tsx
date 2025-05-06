
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import useRoleAuth from '@/hooks/useRoleAuth';
import { Button } from '@/components/ui/button';

const AdminRoute: React.FC = () => {
  const { isAdmin, isLoading, refetch, error } = useRoleAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Refresh roles check on mount to ensure we have the latest data
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        await refetch();
        setIsChecking(false);
      } catch (err) {
        console.error("Error checking admin status:", err);
        setIsChecking(false);
      }
    };

    checkAdminStatus();
  }, [refetch, retryCount]);

  // Handler for manual retry
  const handleRetry = () => {
    setIsChecking(true);
    setRetryCount(prev => prev + 1);
  };

  // Show loading while checking admin status
  if (isLoading || isChecking) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="mt-4 text-lg font-medium">Verifying admin access...</span>
      </div>
    );
  }

  // If there was an error checking admin status, show an error message with retry option
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
            <h2 className="text-xl font-semibold text-red-700">Admin Access Error</h2>
          </div>
          <p className="text-gray-700 mb-4">
            There was an error verifying your admin privileges. This might be due to the 
            recursion issue in the database policies.
          </p>
          <div className="flex flex-col space-y-3">
            <Button 
              variant="default"
              onClick={handleRetry}
              className="w-full"
            >
              Retry Verification
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/admin-helper')}
              className="w-full"
            >
              Go To Admin Helper
            </Button>
            <Button 
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="w-full"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If not an admin, redirect to dashboard
  if (!isAdmin) {
    toast({
      title: 'Access Denied',
      description: 'You do not have permission to access the admin area. Please use the Admin Helper to grant yourself admin access.',
      variant: 'destructive',
    });
    
    return <Navigate to="/admin-helper" replace />;
  }

  // User is an admin, render the admin layout and routes
  return <Outlet />;
};

export default AdminRoute;
