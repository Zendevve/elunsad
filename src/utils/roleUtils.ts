
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/auth";

/**
 * Check if the current user has a specific role
 */
export const hasRole = async (role: UserRole): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;
    
    // Call the has_role function using RPC
    const { data, error } = await supabase
      .rpc('has_role', {
        _user_id: user.user.id,
        _role: role
      });
    
    if (error) {
      console.error("Error checking role:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Error checking user role:", error);
    return false;
  }
};

/**
 * Get all roles for the current user
 */
export const getUserRoles = async (): Promise<UserRole[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return [];
    
    // Get roles using RPC
    const { data, error } = await supabase
      .rpc('get_user_roles', {
        _user_id: user.user.id
      });
    
    if (error) {
      console.error("Error getting user roles:", error);
      return [];
    }
    
    // Return the roles
    return data || [];
  } catch (error) {
    console.error("Error fetching user roles:", error);
    return [];
  }
};

/**
 * Check if the current user is an admin
 */
export const isAdmin = async (): Promise<boolean> => {
  return await hasRole('office_staff');
};

/**
 * Add a role to a user (admin only)
 */
export const addRoleToUser = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    // Add role using RPC
    const { data, error } = await supabase
      .rpc('add_role_to_user', {
        _user_id: userId,
        _role: role
      });
    
    if (error) {
      console.error("Error adding role to user:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error adding role to user:", error);
    return false;
  }
};

/**
 * Remove a role from a user (admin only)
 */
export const removeRoleFromUser = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    // Remove role using RPC
    const { data, error } = await supabase
      .rpc('remove_role_from_user', {
        _user_id: userId,
        _role: role
      });
    
    if (error) {
      console.error("Error removing role from user:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error removing role from user:", error);
    return false;
  }
};

/**
 * Make a user an admin (admin only, or first user)
 */
export const makeUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    // Make user admin using RPC
    const { data, error } = await supabase
      .rpc('make_user_admin', {
        _user_id: userId
      });
    
    if (error) {
      console.error("Error making user admin:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error making user admin:", error);
    return false;
  }
};
