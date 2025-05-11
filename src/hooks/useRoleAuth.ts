
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/auth";

export function useRoleAuth() {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState<boolean>(false);

  // Fetch user roles function that can be called as needed
  const fetchUserRoles = useCallback(async () => {
    // Prevent multiple fetches if already attempted
    if (hasAttemptedFetch) return;
    
    setIsLoading(true);
    setError(null);
    setHasAttemptedFetch(true);
    
    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Error getting user:", userError);
        throw userError;
      }
      
      if (user) {
        setUserId(user.id);
        
        console.log("Fetching roles for user:", user.id);
        
        // Explicitly query user roles from the database
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
          
        if (roleError) {
          console.error("Error fetching user roles:", roleError);
          throw roleError;
        }
        
        console.log("User role data received:", roleData);
        
        // Extract roles from the data
        const userRoles: UserRole[] = roleData ? 
          roleData.map(item => item.role as UserRole) : [];
          
        console.log("Parsed user roles:", userRoles);
        
        setRoles(userRoles);
        
        // Check if admin (office_staff role)
        const adminStatus = userRoles.includes('office_staff');
        console.log("Admin status determined:", adminStatus);
        
        setIsAdminUser(adminStatus);
      } else {
        console.log("No user found, clearing roles");
        setRoles([]);
        setIsAdminUser(false);
        setUserId(null);
      }
    } catch (error) {
      console.error("Error in useRoleAuth:", error);
      setError(error instanceof Error ? error : new Error('Unknown error'));
      setRoles([]);
      setIsAdminUser(false);
    } finally {
      setIsLoading(false);
    }
  }, [hasAttemptedFetch]);

  // Initial fetch and auth state change subscription
  useEffect(() => {
    console.log("useRoleAuth hook initialized");
    
    // Function to handle auth state changes
    const handleAuthChange = (event: string) => {
      console.log("Auth state change detected:", event);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log("User signed in or token refreshed, resetting fetch state");
        setHasAttemptedFetch(false); // Reset fetch state to allow a new fetch
        // Use setTimeout to avoid potential deadlocks with Supabase client
        setTimeout(() => fetchUserRoles(), 0);
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, clearing roles");
        setRoles([]);
        setIsAdminUser(false);
        setUserId(null);
        setHasAttemptedFetch(false);
      }
    };

    // Initial fetch
    fetchUserRoles();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      console.log("Cleaning up auth subscription in useRoleAuth");
      subscription.unsubscribe();
    };
  }, [fetchUserRoles]);

  const hasRole = useCallback((role: UserRole): boolean => {
    return roles.includes(role);
  }, [roles]);

  return {
    roles,
    isAdmin: isAdminUser,
    isBusinessOwner: hasRole('business_owner'),
    hasRole,
    isLoading,
    userId,
    error,
    refetch: useCallback(() => {
      setHasAttemptedFetch(false);
      fetchUserRoles();
    }, [fetchUserRoles])
  };
}

export default useRoleAuth;
