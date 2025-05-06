
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import useRoleAuth from '@/hooks/useRoleAuth';

const AdminRoute: React.FC = () => {
  const { isAdmin, isLoading, refetch } = useRoleAuth();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);

  // Refresh roles check on mount to ensure we have the latest data
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        await refetch();
        setIsChecking(false);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsChecking(false);
      }
    };

    checkAdminStatus();
  }, [refetch]);

  // Show loading while checking admin status
  if (isLoading || isChecking) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="mt-4 text-lg font-medium">Verifying admin access...</span>
      </div>
    );
  }

  // If not an admin, redirect to dashboard
  if (!isAdmin) {
    toast({
      title: 'Access Denied',
      description: 'You do not have permission to access the admin area',
      variant: 'destructive',
    });
    
    return <Navigate to="/dashboard" replace />;
  }

  // User is an admin, render the admin layout and routes
  return <Outlet />;
};

export default AdminRoute;
