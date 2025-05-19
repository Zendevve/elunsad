
import { supabase } from "@/integrations/supabase/client";

/**
 * Debug utility to verify authentication state
 */
export const verifyAuthState = async () => {
  console.log("[AuthDebug] Verifying authentication state...");
  
  // Check localStorage for tokens
  const authTokens = [];
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      console.log(`[AuthDebug] Found auth token in localStorage: ${key}`);
      authTokens.push(key);
    }
  });
  
  console.log(`[AuthDebug] Total auth tokens in localStorage: ${authTokens.length}`);
  
  // Try to get the current session
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error("[AuthDebug] Error fetching session:", sessionError);
    return {
      isAuthenticated: false,
      reason: "Error fetching session",
      error: sessionError
    };
  }
  
  if (!sessionData.session) {
    console.log("[AuthDebug] No active session found");
    return {
      isAuthenticated: false,
      reason: "No session found"
    };
  }
  
  console.log("[AuthDebug] Session found:", {
    expires_at: sessionData.session.expires_at,
    user_id: sessionData.session.user.id
  });
  
  // Try to get the current user
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error("[AuthDebug] Error fetching user:", userError);
    return {
      isAuthenticated: false,
      reason: "Error fetching user",
      error: userError
    };
  }
  
  if (!userData.user) {
    console.log("[AuthDebug] No user data found despite having a session");
    return {
      isAuthenticated: false,
      reason: "No user data found"
    };
  }
  
  console.log("[AuthDebug] User data found:", {
    id: userData.user.id,
    email: userData.user.email
  });
  
  // Verify if auth token is being applied to requests by testing a database query
  try {
    const { data: testData, error: testError } = await supabase.rpc(
      'check_user_role',
      { 
        user_id: userData.user.id, 
        role_name: 'business_owner' 
      }
    );
    
    if (testError) {
      console.error("[AuthDebug] Error testing token with RPC:", testError);
      return {
        isAuthenticated: true,
        tokenWorking: false,
        reason: "Error testing token",
        error: testError
      };
    }
    
    console.log("[AuthDebug] RPC test successful:", testData);
    
    return {
      isAuthenticated: true,
      tokenWorking: true,
      userId: userData.user.id
    };
  } catch (error) {
    console.error("[AuthDebug] Exception testing token:", error);
    return {
      isAuthenticated: true,
      tokenWorking: false,
      reason: "Exception testing token",
      error
    };
  }
};

/**
 * Debug utility to check if a user has access to a given application
 */
export const verifyApplicationAccess = async (applicationId: string) => {
  console.log("[AuthDebug] Verifying application access:", applicationId);
  
  // Get current user
  const { data: authData, error: authError } = await supabase.auth.getUser();
  
  if (authError) {
    console.error("[AuthDebug] Authentication error when verifying access:", authError);
    return {
      hasAccess: false,
      reason: "Authentication error",
      error: authError
    };
  }
  
  if (!authData.user) {
    console.error("[AuthDebug] No user found when verifying access");
    return {
      hasAccess: false,
      reason: "No authenticated user"
    };
  }
  
  // Check if application exists and belongs to the current user
  const { data, error } = await supabase
    .from('applications')
    .select('id, user_id')
    .eq('id', applicationId)
    .maybeSingle();
  
  if (error) {
    console.error("[AuthDebug] Error fetching application for access check:", error);
    return {
      hasAccess: false,
      reason: "Error fetching application",
      error
    };
  }
  
  if (!data) {
    console.log("[AuthDebug] Application not found");
    return {
      hasAccess: false,
      reason: "Application not found"
    };
  }
  
  const hasAccess = data.user_id === authData.user.id;
  console.log("[AuthDebug] Application access check:", {
    applicationId,
    applicationUserId: data.user_id,
    currentUserId: authData.user.id,
    hasAccess
  });
  
  return {
    hasAccess,
    applicationUserId: data.user_id,
    currentUserId: authData.user.id,
  };
};
