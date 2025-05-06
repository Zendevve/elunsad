
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
        
        // Check if admin (office_staff role) using the security definer function
        const { data: isAdmin, error: adminError } = await supabase.rpc('check_user_role', {
          user_id: user.id,
          role: 'office_staff'
        });
        
        if (adminError) {
          console.error("Error checking admin status:", adminError);
          throw adminError;
        }
        
        console.log("Admin status determined:", isAdmin);
        setIsAdminUser(!!isAdmin);
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
    
    // We need to fetch roles immediately
    fetchUserRoles();

    // Listen for auth state changes and update roles accordingly
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
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
      }
    });

    return () => {
      console.log("Cleaning up auth subscription in useRoleAuth");
      subscription.unsubscribe();
    };
  }, [fetchUserRoles]);

  const hasRole = useCallback(async (role: UserRole): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      const { data, error } = await supabase.rpc('check_user_role', {
        user_id: userId,
        role
      });
      
      if (error) {
        console.error("Error checking role:", error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error("Error checking role:", error);
      return false;
    }
  }, [userId]);

  return {
    roles,
    isAdmin: isAdminUser,
    isBusinessOwner: roles.includes('business_owner'),
    hasRole,
    isLoading,
    userId,
    error,
    refetch: fetchUserRoles
  };
}

export default useRoleAuth;
