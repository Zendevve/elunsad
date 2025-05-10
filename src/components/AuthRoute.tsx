
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const AuthRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(true);
  const location = useLocation();

  // Check authentication and admin status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsCheckingStatus(true);
        
        // Check auth status
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Auth check error:", sessionError);
          throw sessionError;
        }
        
        const authenticated = !!sessionData.session;
        setIsAuthenticated(authenticated);
        
        // If authenticated, check admin status
        if (authenticated && sessionData.session?.user) {
          const userId = sessionData.session.user.id;
          
          // Check for admin role
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId);
            
          if (roleError) {
            console.error("Error checking admin role:", roleError);
          } else {
            const adminStatus = roleData && roleData.some(r => r.role === 'office_staff');
            console.log("Admin status in AuthRoute:", adminStatus);
            setIsAdmin(adminStatus);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", !!session);
      setIsAuthenticated(!!session);
      
      // If session has changed, we need to recheck admin status
      if (session?.user) {
        // Don't make the Supabase call directly in the callback to avoid deadlocks
        setTimeout(async () => {
          try {
            const { data: roleData, error: roleError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id);
              
            if (roleError) {
              console.error("Error checking admin role after auth change:", roleError);
            } else {
              const adminStatus = roleData && roleData.some(r => r.role === 'office_staff');
              console.log("Admin status updated in AuthRoute:", adminStatus);
              setIsAdmin(adminStatus);
            }
          } catch (error) {
            console.error("Error checking admin status:", error);
          }
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
  if (isCheckingStatus) {
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
        description: 'Please sign in to access this page'
      });
    }, []);
    
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If user is admin and trying to access regular user routes
  // Check if the current location is a non-admin route that should redirect
  const isRegularUserRoute = location.pathname.startsWith('/dashboard') ||
                            location.pathname.startsWith('/applications') ||
                            location.pathname.startsWith('/documents') ||
                            location.pathname.startsWith('/profile');
                          
  if (isAdmin && isRegularUserRoute && !location.pathname.startsWith('/admin')) {
    console.log("Admin user detected on regular user route. Redirecting to admin dashboard.");
    return <Navigate to="/admin-dashboard" replace />;
  }

  // Render the child routes
  return <Outlet />;
};

export default AuthRoute;
