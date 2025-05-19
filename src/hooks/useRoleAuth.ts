
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/auth";

export function useRoleAuth() {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Fetch user roles function that can be called as needed
  const fetchUserRoles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("useRoleAuth: Starting to fetch user roles");
      
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("useRoleAuth: Error getting user:", userError);
        throw userError;
      }
      
      if (user) {
        setUserId(user.id);
        
        console.log("useRoleAuth: Fetching roles for user:", user.id);
        
        // Explicitly query user roles from the database
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
          
        if (roleError) {
          console.error("useRoleAuth: Error fetching user roles:", roleError);
          throw roleError;
        }
        
        console.log("useRoleAuth: User role data received:", roleData);
        
        // Extract roles from the data
        const userRoles: UserRole[] = roleData ? 
          roleData.map(item => item.role as UserRole) : [];
          
        console.log("useRoleAuth: Parsed user roles:", userRoles);
        
        setRoles(userRoles);
        
        // Check if admin (office_staff role)
        const adminStatus = userRoles.includes('office_staff');
        console.log("useRoleAuth: Admin status determined:", adminStatus);
        
        setIsAdminUser(adminStatus);
      } else {
        console.log("useRoleAuth: No user found, clearing roles");
        setRoles([]);
        setIsAdminUser(false);
        setUserId(null);
      }
    } catch (error) {
      console.error("useRoleAuth: Error fetching roles:", error);
      setError(error instanceof Error ? error : new Error('Unknown error'));
      setRoles([]);
      setIsAdminUser(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and auth state change subscription
  useEffect(() => {
    console.log("useRoleAuth: Hook initialized");
    fetchUserRoles();

    // Listen for auth state changes and update roles accordingly
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log("useRoleAuth: Auth state change detected:", event);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log("useRoleAuth: User signed in or token refreshed, fetching roles");
        // Use setTimeout to avoid potential deadlocks with Supabase client
        setTimeout(() => fetchUserRoles(), 0);
      } else if (event === 'SIGNED_OUT') {
        console.log("useRoleAuth: User signed out, clearing roles");
        setRoles([]);
        setIsAdminUser(false);
        setUserId(null);
      }
    });

    return () => {
      console.log("useRoleAuth: Cleaning up auth subscription");
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
    refetch: fetchUserRoles
  };
}

export default useRoleAuth;
