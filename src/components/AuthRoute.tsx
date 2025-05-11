
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { hasRole } from '@/utils/roleUtils';

const AuthRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth check error:", error);
          throw error;
        }

        const authenticated = !!data.session;
        setIsAuthenticated(authenticated);
        
        // Check for admin status if authenticated
        if (authenticated && data.session?.user) {
          console.log("User is authenticated, checking admin status...");
          const adminStatus = await hasRole('office_staff');
          console.log("Admin status:", adminStatus);
          setIsAdmin(adminStatus);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed. Session exists:", !!session);
      setIsAuthenticated(!!session);
      
      // Check admin status when auth state changes
      if (session?.user) {
        console.log("Auth state change: checking admin status...");
        // Use setTimeout to avoid potential Supabase client deadlocks
        setTimeout(async () => {
          const adminStatus = await hasRole('office_staff');
          console.log("Admin status after auth change:", adminStatus);
          setIsAdmin(adminStatus);
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="mt-4 text-lg font-medium">Verifying authentication...</span>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Show toast notification when redirecting to login
    useEffect(() => {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to access this page',
        variant: 'destructive',
      });
    }, [toast]);
    
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If user is admin and trying to access user routes, redirect to admin dashboard
  if (isAdmin && location.pathname === '/dashboard') {
    console.log("Admin user detected, redirecting to admin dashboard");
    return <Navigate to="/admin-dashboard" replace />;
  }

  // Authenticated user can access the page
  return <Outlet />;
};

export default AuthRoute;
