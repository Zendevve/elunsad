
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { verifyAuthState } from '@/utils/authDebugUtils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AuthDebugger: React.FC = () => {
  const [authState, setAuthState] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user, refreshRoles } = useAuth();
  
  const checkAuth = async () => {
    setLoading(true);
    try {
      const state = await verifyAuthState();
      setAuthState(state);
    } catch (error) {
      console.error("Error checking auth:", error);
      setAuthState({ error });
    } finally {
      setLoading(false);
    }
  };
  
  const refreshToken = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw error;
      }
      
      console.log("Session refresh response:", data);
      await refreshRoles();
      await checkAuth();
    } catch (error) {
      console.error("Error refreshing token:", error);
      setAuthState(prev => ({ ...prev, refreshError: error }));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    checkAuth();
  }, []);
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Authentication Debugger</CardTitle>
        <CardDescription>Check the current authentication state and token validity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium">Current User</h3>
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto text-xs">
              {user ? JSON.stringify(user, null, 2) : "No user found"}
            </pre>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium">Auth Verification</h3>
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto text-xs">
              {authState ? JSON.stringify(authState, null, 2) : "Not checked yet"}
            </pre>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={checkAuth} disabled={loading}>
          {loading ? "Checking..." : "Verify Auth State"}
        </Button>
        <Button onClick={refreshToken} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh Token"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthDebugger;
