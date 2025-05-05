
import { supabase } from "@/integrations/supabase/client";

/**
 * Utility to check if Supabase connection is working correctly
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Try a simple query to test the connection
    const { data, error } = await supabase
      .from('applications')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error("Supabase connection error:", error);
      return false;
    }
    
    console.log("Supabase connection is working correctly");
    return true;
  } catch (error) {
    console.error("Failed to connect to Supabase:", error);
    return false;
  }
};

/**
 * Utility to log database errors with more context
 */
export const logDatabaseError = (operation: string, error: any, data?: any) => {
  console.error(`Database error during ${operation}:`, error);
  console.error("Error details:", {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint
  });
  
  if (data) {
    console.error("Data that caused the error:", data);
  }
};
