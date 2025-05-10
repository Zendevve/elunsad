
/**
 * Utility functions for managing authentication state
 */

/**
 * Clean up all Supabase auth state to prevent conflicts and authentication limbo
 * Call this function before sign in or sign out operations
 */
export const cleanupAuthState = (): void => {
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

/**
 * Perform a safe global sign out that handles errors
 */
export const safeSignOut = async (): Promise<void> => {
  try {
    // Clean up auth state first
    cleanupAuthState();
    
    // Attempt global sign out from Supabase
    try {
      const { error } = await import('@/integrations/supabase/client')
        .then(module => module.supabase.auth.signOut({ scope: 'global' }));
      
      if (error) {
        console.error("Error during sign out:", error);
      }
    } catch (signOutError) {
      console.warn("Error during global sign out:", signOutError);
      // Continue even if sign out fails
    }
    
  } catch (error) {
    console.error("Error in safeSignOut:", error);
  }
};
