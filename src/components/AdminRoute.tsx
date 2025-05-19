
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AdminRoute: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const { toast } = useToast();

  // Show toast when user is not an admin and needs to be redirected
  useEffect(() => {
    if (isAdmin === false && showToast) {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access the admin area',
        variant: 'destructive',
      });
      setShowToast(false);
    }
  }, [isAdmin, showToast, toast]);

  // Simplified check for admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Get current user session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          console.log("No authenticated user found");
          setIsAdmin(false);
          setShowToast(true);
          return;
        }
        
        const userId = sessionData.session.user.id;
        console.log("Checking admin status for user:", userId);
        
        // Direct query to check if user has office_staff role
        const { data, error } = await supabase
          .from('user_roles')
          .select('id')
          .eq('user_id', userId)
          .eq('role', 'office_staff')
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error code
          console.error("Error checking admin role:", error);
          setIsAdmin(false);
          setShowToast(true);
          return;
        }
        
        // User is admin if data exists
        const hasAdminRole = !!data;
        console.log("User admin status:", hasAdminRole);
        setIsAdmin(hasAdminRole);
        
        if (!hasAdminRole) {
          setShowToast(true);
        }
        
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
        setShowToast(true);
      }
    };

    checkAdminStatus();
  }, []);

  // Show loading while checking admin status
  if (isAdmin === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="mt-4 text-lg font-medium">Verifying admin access...</span>
      </div>
    );
  }

  // If not an admin, redirect to dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is an admin, render the admin layout and routes
  return <Outlet />;
};

export default AdminRoute;
