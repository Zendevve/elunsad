
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
    
    // Simply query the user_roles table directly since we've fixed the RLS policies
    const { data, error } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', user.user.id)
      .eq('role', role)
      .maybeSingle();
    
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
    return Array.isArray(data) ? data.map(item => item.role as UserRole) : [];
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
    if (!user.user) return false;
    
    // Run two parallel checks to improve reliability
    const [directQuery, rpcQuery] = await Promise.allSettled([
      // Direct query to user_roles table (works now that RLS is fixed)
      supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', user.user.id)
        .eq('role', 'office_staff')
        .maybeSingle(),
      
      // RPC to security definer function as a backup - we've fixed this function
      supabase.rpc('check_admin_role', { user_id: user.user.id })
    ]) as [SupabaseSettledResult, SupabaseSettledResult];
    
    // Check results from direct query
    if (directQuery.status === 'fulfilled' && !directQuery.value.error) {
      const isAdminDirect = !!directQuery.value.data;
      console.log("Admin check via direct query:", isAdminDirect);
      if (isAdminDirect) return true;
    }
    else if (directQuery.status === 'fulfilled' && directQuery.value.error) {
      console.error("Direct admin query failed:", directQuery.value.error);
    }
    
    // Check results from RPC query - this should now work after fixing the function
    if (rpcQuery.status === 'fulfilled' && !rpcQuery.value.error) {
      const isAdminRPC = !!rpcQuery.value.data;
      console.log("Admin check via RPC:", isAdminRPC);
      return isAdminRPC;
    } 
    else if (rpcQuery.status === 'fulfilled' && rpcQuery.value.error) {
      console.error("RPC admin query failed:", rpcQuery.value.error);
    }
    
    // If both methods failed, return false
    return false;
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
  try {
    // Add admin role using direct insert
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'office_staff'
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
