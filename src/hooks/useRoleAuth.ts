
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/auth";
import { getUserRoles, isAdmin as checkIsAdmin } from "@/utils/roleUtils";

export function useRoleAuth() {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserAndRoles = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);
          
          // Get the user's roles with the updated util function
          const userRoles = await getUserRoles();
          setRoles(userRoles);
          
          // Check if the user is an admin with the updated util function
          const adminStatus = await checkIsAdmin();
          setIsAdminUser(adminStatus);
        } else {
          setRoles([]);
          setIsAdminUser(false);
        }
      } catch (error) {
        console.error("Error fetching user roles:", error);
        setError(error instanceof Error ? error : new Error('Unknown error'));
        setRoles([]);
        setIsAdminUser(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndRoles();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserAndRoles();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const hasRole = (role: UserRole): boolean => {
    return roles.includes(role);
  };

  return {
    roles,
    isAdmin: isAdminUser,
    isBusinessOwner: hasRole('business_owner'),
    hasRole,
    isLoading,
    userId,
    error
  };
}

export default useRoleAuth;
