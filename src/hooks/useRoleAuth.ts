
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/auth";
import { getUserRoles, isAdmin as checkIsAdmin } from "@/utils/roleUtils";

export function useRoleAuth() {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Use useCallback to memoize the function and prevent recreation on each render
  const fetchUserAndRoles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw userError;
      }
      
      if (user) {
        setUserId(user.id);
        
        console.log("Fetching roles for user:", user.id);
        
        // Get the user's roles with the updated util function
        const userRoles = await getUserRoles();
        setRoles(userRoles);
        
        console.log("User roles from hook:", userRoles);
        
        // Check if the user is an admin with the updated util function
        const adminStatus = await checkIsAdmin();
        setIsAdminUser(adminStatus);
        
        console.log("Admin status from hook:", adminStatus);
      } else {
        console.log("No user found, clearing roles");
        setRoles([]);
        setIsAdminUser(false);
        setUserId(null);
      }
    } catch (error) {
      console.error("Error fetching user roles:", error);
      setError(error instanceof Error ? error : new Error('Unknown error'));
      setRoles([]);
      setIsAdminUser(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("useRoleAuth hook initialized, fetching user and roles");
    fetchUserAndRoles();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log("Auth state change detected:", event);
      fetchUserAndRoles();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserAndRoles]);

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
    refetch: fetchUserAndRoles
  };
}

export default useRoleAuth;
