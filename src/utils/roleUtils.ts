
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/auth";

/**
 * Check if the current user has a specific role
 */
export const hasRole = async (role: UserRole): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;
    
    // Use the security definer function to check role
    const { data, error } = await supabase.rpc('check_user_role', {
      user_id: user.user.id,
      role_name: role
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
    
    // Use direct query to get roles
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.user.id);
    
    if (error) {
      console.error("Error getting user roles:", error);
      return [];
    }
    
    // Convert results to UserRole array
    return Array.isArray(data) ? data.map(item => item.role as UserRole) : [];
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
    // Add role using direct insert
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: role
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
    // Remove role using direct delete
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);
    
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
  return await addRoleToUser(userId, 'office_staff');
};
