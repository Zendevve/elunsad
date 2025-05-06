
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AdminRoute: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if user is an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Get current user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError || !userData.user) {
          console.log("No authenticated user found");
          setIsAdmin(false);
          return;
        }
        
        setUserId(userData.user.id);
        console.log("Checking admin status for user:", userData.user.id);
        
        // Check if user has office_staff role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userData.user.id)
          .eq('role', 'office_staff');
        
        if (roleError) {
          console.error("Error checking admin role:", roleError);
          setIsAdmin(false);
          return;
        }
        
        const hasAdminRole = roleData && roleData.length > 0;
        console.log("User admin status:", hasAdminRole, "Role data:", roleData);
        setIsAdmin(hasAdminRole);
        
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      console.log("Auth state changed, rechecking admin status");
      checkAdminStatus();
    });

    return () => {
      subscription.unsubscribe();
    };
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
    // Show toast notification when redirecting
    useEffect(() => {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access the admin area',
        variant: 'destructive',
      });
    }, [toast]);
    
    return <Navigate to="/dashboard" replace />;
  }

  // User is an admin, render the admin layout and routes
  return <Outlet />;
};

export default AdminRoute;
