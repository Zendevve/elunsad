
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/auth";

// Define types for Promise.allSettled results
type SupabaseQueryResult = { data: any; error?: any };
type FulfilledPromiseResult<T> = { status: 'fulfilled'; value: T };
type RejectedPromiseResult = { status: 'rejected'; reason: any };
type SettledResult<T> = FulfilledPromiseResult<T> | RejectedPromiseResult;
type SupabaseSettledResult = SettledResult<SupabaseQueryResult>;

/**
 * Check if the current user has a specific role
 */
export const hasRole = async (role: UserRole): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;
    
    console.log(`Checking if user ${user.user.id} has role: ${role}`);
    
    // Simply query the user_roles table directly since we've fixed the RLS policies
    const { data, error } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', user.user.id)
      .eq('role', role)
      .maybeSingle();
    
    if (error) {
      console.error(`Error checking role ${role}:`, error);
      return false;
    }
    
    const hasRole = !!data;
    console.log(`User ${user.user.id} has role ${role}: ${hasRole}`);
    return hasRole;
  } catch (error) {
    console.error(`Error checking user role ${role}:`, error);
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
    
    console.log(`Getting all roles for user: ${user.user.id}`);
    
    // Use direct query to get roles since RLS is fixed
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.user.id);
    
    if (error) {
      console.error("Error getting user roles:", error);
      return [];
    }
    
    // Convert results to UserRole array
    const roles = Array.isArray(data) ? data.map(item => item.role as UserRole) : [];
    console.log(`Found roles for user ${user.user.id}:`, roles);
    return roles;
  } catch (error) {
    console.error("Error fetching user roles:", error);
    return [];
  }
};

/**
 * Check if the current user is an admin with improved reliability
 */
export const isAdmin = async (): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      console.log("No user found, cannot check admin status");
      return false;
    }
    
    console.log("Checking admin status for user ID:", user.user.id);
    
    // Use direct query to check if user has admin role
    const { data, error } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', user.user.id)
      .eq('role', 'office_staff')
      .maybeSingle();
    
    if (error) {
      console.error("Error checking admin role:", error);
      return false;
    }
    
    const hasAdminRole = !!data;
    console.log(`Admin role check result for ${user.user.id}: ${hasAdminRole}`);
    return hasAdminRole;
  } catch (error) {
    console.error("Error in isAdmin check:", error);
    return false;
  }
};

/**
 * Add a role to a user (admin only)
 */
export const addRoleToUser = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    console.log(`Adding role ${role} to user ${userId}`);
    
    // Add role using direct insert
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: role
      });
    
    if (error) {
      console.error(`Error adding role ${role} to user ${userId}:`, error);
      return false;
    }
    
    console.log(`Successfully added role ${role} to user ${userId}`);
    return true;
  } catch (error) {
    console.error(`Error adding role ${role} to user ${userId}:`, error);
    return false;
  }
};

/**
 * Remove a role from a user (admin only)
 */
export const removeRoleFromUser = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    console.log(`Removing role ${role} from user ${userId}`);
    
    // Remove role using direct delete
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);
    
    if (error) {
      console.error(`Error removing role ${role} from user ${userId}:`, error);
      return false;
    }
    
    console.log(`Successfully removed role ${role} from user ${userId}`);
    return true;
  } catch (error) {
    console.error(`Error removing role ${role} from user ${userId}:`, error);
    return false;
  }
};

/**
 * Make a user an admin (admin only, or first user)
 */
export const makeUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    console.log(`Making user ${userId} an admin`);
    
    // Add admin role using direct insert
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'office_staff'
      });
    
    if (error) {
      console.error(`Error making user ${userId} admin:`, error);
      return false;
    }
    
    console.log(`Successfully made user ${userId} an admin`);
    return true;
  } catch (error) {
    console.error(`Error making user ${userId} admin:`, error);
    return false;
  }
};
