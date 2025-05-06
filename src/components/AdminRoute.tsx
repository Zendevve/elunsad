
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AdminRoute: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Check admin status on component mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Get current user session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          console.log("No authenticated user found");
          setIsAdmin(false);
          return;
        }
        
        const userId = sessionData.session.user.id;
        console.log("Checking admin status for user:", userId);
        
        // Use the security definer function to safely check role
        const { data, error } = await supabase.rpc('check_user_role', {
          user_id: userId,
          role: 'office_staff'
        });
        
        if (error) {
          console.error("Error checking admin role:", error);
          setIsAdmin(false);
          return;
        }
        
        console.log("User admin status:", data);
        setIsAdmin(!!data);
        
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
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
