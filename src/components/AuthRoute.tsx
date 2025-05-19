
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const AuthRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  const { toast } = useToast();
  const [shouldShowToast, setShouldShowToast] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("AuthRoute: Checking authentication status");
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("AuthRoute: Auth check error:", error);
          throw error;
        }
        
        const authenticated = !!data.session;
        console.log("AuthRoute: User authenticated:", authenticated);
        setIsAuthenticated(authenticated);
        
        if (!authenticated) {
          setShouldShowToast(true);
        }
      } catch (error) {
        console.error('AuthRoute: Error checking authentication:', error);
        setIsAuthenticated(false);
        setShouldShowToast(true);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("AuthRoute: Auth state changed:", !!session);
      setIsAuthenticated(!!session);
      if (!session) {
        setShouldShowToast(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Effect for showing toast notification
  useEffect(() => {
    if (shouldShowToast && isAuthenticated === false) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to access this page',
        variant: 'destructive',
      });
      setShouldShowToast(false);
    }
  }, [shouldShowToast, isAuthenticated, toast]);

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
    console.log("AuthRoute: Not authenticated, redirecting to /signin from", location.pathname);
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Render the child routes
  console.log("AuthRoute: User authenticated, rendering", location.pathname);
  return <Outlet />;
};

export default AuthRoute;
