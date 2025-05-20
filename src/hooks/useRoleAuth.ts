
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
        
        // Check admin status first using the security definer function
        const adminCheckPromise = supabase.rpc('check_admin_role', { user_id: user.id });
        
        // Also fetch all roles for the user
        const rolesPromise = supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
        
        // Wait for both promises to resolve
        const [adminCheck, roleData] = await Promise.all([adminCheckPromise, rolesPromise]);
        
        // Handle admin check result
        if (adminCheck.error) {
          console.error("Error checking admin role:", adminCheck.error);
          // Don't throw, we'll still try to use the roleData
        } else {
          console.log("Admin check result:", adminCheck.data);
          setIsAdminUser(!!adminCheck.data);
        }
        
        // Handle role data
        if (roleData.error) {
          console.error("Error fetching user roles:", roleData.error);
          // Only throw if both checks failed
          if (adminCheck.error) {
            throw roleData.error;
          }
        } else {
          console.log("User role data received:", roleData.data);
          
          // Extract roles from the data
          const userRoles: UserRole[] = roleData.data ? 
            roleData.data.map(item => item.role as UserRole) : [];
            
          console.log("Parsed user roles:", userRoles);
          
          setRoles(userRoles);
          
          // If admin check failed, determine from roles
          if (adminCheck.error) {
            const adminStatus = userRoles.includes('office_staff');
            console.log("Admin status determined from roles:", adminStatus);
            setIsAdminUser(adminStatus);
          }
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
    fetchUserRoles();

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
