
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
 * Falls back safely to user dashboard if admin status cannot be determined
 */
export const getRedirectPathForUser = (isAdmin: boolean): string => {
  console.log("[authUtils] Determining redirect path:", isAdmin ? "admin" : "user");
  try {
    return isAdmin ? '/admin-dashboard' : '/dashboard';
  } catch (error) {
    console.error("[authUtils] Error in redirect determination, defaulting to dashboard:", error);
    return '/dashboard';
  }
};

/**
 * Safe redirect to the appropriate dashboard based on user role
 */
export const safeRedirectByRole = (isAdmin: boolean, navigate: (path: string) => void): void => {
  try {
    const redirectPath = getRedirectPathForUser(isAdmin);
    console.log("[authUtils] Safe redirecting to:", redirectPath);
    navigate(redirectPath);
  } catch (error) {
    console.error("[authUtils] Error during redirect, defaulting to dashboard:", error);
    navigate('/dashboard');
  }
};
