
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/auth";

/**
 * Function to clean up auth state and prevent conflicts
 */
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

// Determine the redirect path based on user role
export const getRedirectPathForUser = (isAdmin: boolean): string => {
  return isAdmin ? '/admin-dashboard' : '/dashboard';
};

// Direct check for admin role using RPC
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase.rpc('check_user_role', {
      user_id: userId,
      role_name: 'office_staff'
    });
    
    if (error) {
      console.error("[authUtils] RPC error checking admin role:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("[authUtils] Error checking admin role:", error);
    return false;
  }
};
