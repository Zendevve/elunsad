
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import useRoleAuth from '@/hooks/useRoleAuth';

const AdminRoute: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin, isLoading } = useRoleAuth();

  // Show loading while checking admin status
  if (isLoading) {
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
