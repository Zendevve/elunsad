
/**
 * Cleans up authentication state to prevent "limbo" states
 * when logging in, out, or switching accounts
 */
export const cleanupAuthState = () => {
  console.log("[authUtils] Cleaning up auth state");
  
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      console.log(`[authUtils] Removing localStorage key: ${key}`);
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      console.log(`[authUtils] Removing sessionStorage key: ${key}`);
      sessionStorage.removeItem(key);
    }
  });
};

/**
 * Determines the appropriate redirect path based on user role
 */
export const getRedirectPathForUser = (isAdmin: boolean): string => {
  return isAdmin ? '/admin-dashboard' : '/dashboard';
};
