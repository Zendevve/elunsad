
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/auth";

/**
 * Check if the current user has a specific role
 */
export const hasRole = async (role: UserRole): Promise<boolean> => {
  try {
    console.log(`roleUtils: Checking if user has role: ${role}`);
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      console.log("roleUtils: No authenticated user found");
      return false;
    }
    
    // Use a direct query to check user role
    const { data, error } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', user.user.id)
      .eq('role', role)
      .maybeSingle();
    
    if (error) {
      console.error("roleUtils: Error checking role:", error);
      return false;
    }
    
    const hasRole = !!data;
    console.log(`roleUtils: User has ${role} role:`, hasRole);
    return hasRole;
  } catch (error) {
    console.error("roleUtils: Error checking user role:", error);
    return false;
  }
};

/**
 * Get all roles for the current user
 */
export const getUserRoles = async (): Promise<UserRole[]> => {
  try {
    console.log("roleUtils: Getting all user roles");
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      console.log("roleUtils: No authenticated user found");
      return [];
    }
    
    // Use direct query to get roles
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.user.id);
    
    if (error) {
      console.error("roleUtils: Error getting user roles:", error);
      return [];
    }
    
    // Convert results to UserRole array
    const roles = Array.isArray(data) ? data.map(item => item.role as UserRole) : [];
    console.log("roleUtils: Retrieved user roles:", roles);
    return roles;
  } catch (error) {
    console.error("roleUtils: Error fetching user roles:", error);
    return [];
  }
};

/**
 * Check if the current user is an admin
 */
export const isAdmin = async (): Promise<boolean> => {
  console.log("roleUtils: Checking if user is admin");
  return await hasRole('office_staff');
};

/**
 * Add a role to a user (admin only)
 */
export const addRoleToUser = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    console.log(`roleUtils: Adding ${role} role to user ${userId}`);
    // Add role using direct insert
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: role
      });
    
    if (error) {
      console.error("roleUtils: Error adding role to user:", error);
      return false;
    }
    
    console.log(`roleUtils: Successfully added ${role} role to user ${userId}`);
    return true;
  } catch (error) {
    console.error("roleUtils: Error adding role to user:", error);
    return false;
  }
};

/**
 * Remove a role from a user (admin only)
 */
export const removeRoleFromUser = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    console.log(`roleUtils: Removing ${role} role from user ${userId}`);
    // Remove role using direct delete
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);
    
    if (error) {
      console.error("roleUtils: Error removing role from user:", error);
      return false;
    }
    
    console.log(`roleUtils: Successfully removed ${role} role from user ${userId}`);
    return true;
  } catch (error) {
    console.error("roleUtils: Error removing role from user:", error);
    return false;
  }
};

/**
 * Make a user an admin (admin only, or first user)
 */
export const makeUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    console.log(`roleUtils: Making user ${userId} an admin`);
    // Add admin role using direct insert
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'office_staff'
      });
    
    if (error) {
      console.error("roleUtils: Error making user admin:", error);
      return false;
    }
    
    console.log(`roleUtils: Successfully made user ${userId} an admin`);
    return true;
  } catch (error) {
    console.error("roleUtils: Error making user admin:", error);
    return false;
  }
};
