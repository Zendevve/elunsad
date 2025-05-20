
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/auth";

export function useRoleAuth() {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Improved fetch user roles function with better error handling
  const fetchUserRoles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
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
        
        // Fetch roles directly
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
          
        if (rolesError) {
          console.error("Error fetching user roles:", rolesError);
          setRoles([]);
          setIsAdminUser(false);
        } else {
          const userRoles: UserRole[] = rolesData ? 
            rolesData.map((item: any) => item.role as UserRole) : [];
          
          console.log("Parsed user roles:", userRoles);
          setRoles(userRoles);
          
          // Set admin status from roles
          const adminStatus = userRoles.includes('office_staff');
          console.log("Admin status determined from roles:", adminStatus);
          setIsAdminUser(adminStatus);
        }
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
  }, []);

  // Initial fetch and auth state change subscription
  useEffect(() => {
    console.log("useRoleAuth hook initialized");
    
    // Get initial user session
    const initializeUserSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        fetchUserRoles();
      } else {
        setIsLoading(false);
      }
    };
    
    initializeUserSession();

    // Listen for auth state changes and update roles accordingly
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change detected:", event);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        console.log("User signed in or token refreshed, fetching roles");
        // Use setTimeout to avoid potential deadlocks with Supabase client
        setTimeout(() => fetchUserRoles(), 0);
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, clearing roles");
        setRoles([]);
        setIsAdminUser(false);
        setUserId(null);
        setIsLoading(false);
      }
    });

    return () => {
      console.log("Cleaning up auth subscription in useRoleAuth");
      subscription.unsubscribe();
    };
  }, [fetchUserRoles]);

  const hasRole = useCallback((role: UserRole): boolean => {
    return roles.includes(role);
  }, [roles]);

  // Debugging output
  useEffect(() => {
    console.log("useRoleAuth state updated:", {
      roles,
      isAdmin: isAdminUser,
      isLoading,
      userId,
      error: error ? error.message : null
    });
  }, [roles, isAdminUser, isLoading, userId, error]);

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
