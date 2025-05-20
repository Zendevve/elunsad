
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
export const logDatabaseError = async (operation: string, error: any, data?: any) => {
  console.error(`Database error during ${operation}:`, error);
  
  // Log specific details about the error
  const errorDetails = {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
    query: error.query
  };
  
  console.error("Error details:", errorDetails);
  
  if (data) {
    console.error("Data that caused the error:", data);
  }
  
  // Check for specific error types and provide more helpful information
  if (error.code === '42703') {
    console.error("Column does not exist. Check for typos or ensure the column exists in the table.");
  } else if (error.code === '42P01') {
    console.error("Table does not exist. Check for typos or ensure the table exists.");
  } else if (error.code === '23505') {
    console.error("Unique constraint violation. Try updating the record instead of inserting a new one.");
  } else if (error.code === '42702') {
    console.error("Ambiguous column reference. Qualify column names with table names (e.g., 'table_name.column_name').");
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

/**
 * Clean up Supabase auth state to prevent authentication issues
 */
export const cleanupAuthState = () => {
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
  
  console.log("Auth state cleanup completed");
};

/**
 * Helper to debug Supabase queries
 * This will log the SQL that would be executed
 */
export const debugSupabaseQuery = (builder: any) => {
  // Only use in development
  if (process.env.NODE_ENV !== 'production') {
    const query = builder.toSQL();
    console.log('SQL Query:', query.sql);
    console.log('SQL Parameters:', query.parameters);
  }
  return builder;
};

/**
 * Check if database is connected and basic tables are accessible
 */
export const checkDatabaseHealth = async () => {
  try {
    const tables = ['applications', 'business_information', 'owner_information', 'profiles', 'user_roles'];
    const results = {};
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('count(*)', { count: 'exact', head: true });
      
      results[table] = {
        accessible: !error,
        error: error ? error.message : null
      };
      
      if (error) {
        console.error(`Error accessing ${table}:`, error);
      }
    }
    
    console.log('Database health check results:', results);
    return results;
  } catch (error) {
    console.error('Database health check failed:', error);
    return { error: error.message };
  }
};

/**
 * Utility to retry a failed Supabase operation
 */
export const retryOperation = async <T>(
  operation: () => Promise<T>, 
  maxRetries: number = 3, 
  delayMs: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.warn(`Operation failed (attempt ${attempt}/${maxRetries}):`, error);
      lastError = error;
      
      if (attempt < maxRetries) {
        console.log(`Retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        // Increase delay for next retry (exponential backoff)
        delayMs *= 2;
      }
    }
  }
  
  throw lastError;
};
