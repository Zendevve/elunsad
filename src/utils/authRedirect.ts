
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/auth";

/**
 * Determines the redirect route based on user roles and redirects to the appropriate dashboard
 * @param userId The authenticated user ID
 * @returns Promise with the target route
 */
export const determineUserRoute = async (userId: string): Promise<string> => {
  try {
    console.log("Determining route for user:", userId);
    
    // Query user roles directly from the database
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    
    if (roleError) {
      console.error("Error fetching user roles:", roleError);
      return '/dashboard'; // Default to user dashboard on error
    }
    
    // Check if user has office_staff (admin) role
    const isAdmin = roleData && roleData.some(r => r.role === 'office_staff');
    
    console.log("User admin status:", isAdmin, "Role data:", roleData);
    
    // Return the appropriate route
    return isAdmin ? '/admin-dashboard' : '/dashboard';
  } catch (error) {
    console.error("Error determining user route:", error);
    return '/dashboard'; // Default to user dashboard on error
  }
};

/**
 * Redirects the user to the appropriate dashboard based on their role
 * @param userId The authenticated user ID
 * @param navigate The navigation function from react-router
 */
export const redirectToUserDashboard = async (
  userId: string, 
  navigate: (path: string) => void
): Promise<void> => {
  const targetRoute = await determineUserRoute(userId);
  console.log("Redirecting user to:", targetRoute);
  navigate(targetRoute);
};
