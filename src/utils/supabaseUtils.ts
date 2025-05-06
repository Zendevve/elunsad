
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

/**
 * Extract file path from Supabase storage URL
 */
export const extractFilePathFromUrl = (url: string): { bucket: string, path: string } | null => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const publicIndex = pathParts.findIndex(part => part === 'public');
    
    if (publicIndex !== -1 && pathParts.length > publicIndex + 1) {
      const bucket = pathParts[publicIndex + 1];
      const path = pathParts.slice(publicIndex + 2).join('/');
      return { bucket, path };
    }
    
    return null;
  } catch (error) {
    console.error("Error extracting file path from URL:", error);
    return null;
  }
};
