
/**
 * Cleans up authentication state to prevent "limbo" states
 * when logging in, out, or switching accounts
 */
import { supabase } from "@/integrations/supabase/client";

export const cleanupAuthState = () => {
  console.log("[authUtils] Cleaning up auth state");
  
  // More aggressive cleanup of all Supabase related storage
  
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.includes('supabase')) {
      console.log(`[authUtils] Removing localStorage key: ${key}`);
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.includes('supabase')) {
      console.log(`[authUtils] Removing sessionStorage key: ${key}`);
      sessionStorage.removeItem(key);
    }
  });
  
  // Remove cookies that might be related to authentication
  document.cookie.split(';').forEach(function(c) {
    if (c.trim().startsWith('sb-') || c.includes('supabase')) {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      console.log(`[authUtils] Removed cookie: ${c.trim()}`);
    }
  });
};

/**
 * Determines the appropriate redirect path based on user role
 */
export const getRedirectPathForUser = (isAdmin: boolean): string => {
  return isAdmin ? '/admin-dashboard' : '/dashboard';
};

/**
 * Ensure the user's session is valid and fresh
 */
export const refreshAuthSession = async () => {
  try {
    console.log("[authUtils] Refreshing auth session");
    
    // First try to get the current session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("[authUtils] Error getting session during refresh:", sessionError);
      return false;
    }
    
    // If we have a session, try to refresh the token
    if (sessionData.session) {
      console.log("[authUtils] Existing session found, refreshing token");
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("[authUtils] Error refreshing token:", error);
        return false;
      }
      
      if (data.session) {
        console.log("[authUtils] Token successfully refreshed");
        return true;
      }
    }
    
    console.log("[authUtils] No session to refresh");
    return false;
  } catch (error) {
    console.error("[authUtils] Exception during session refresh:", error);
    return false;
  }
};
