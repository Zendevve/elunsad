
import { supabase } from "@/integrations/supabase/client";
import { ApplicationStatus, ApplicationType } from "./types";

// Core application service methods
export const applicationService = {
  // Create a new application
  async createApplication(applicationType: ApplicationType) {
    try {
      console.log("[applicationService] Creating new application of type:", applicationType);
      
      // Get current user with detailed logging
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error("[applicationService] Authentication error when creating application:", authError);
        throw authError;
      }
      
      if (!authData.user) {
        console.error("[applicationService] No authenticated user found when creating application");
        throw new Error("Not authenticated");
      }
      
      console.log("[applicationService] Creating application for user:", authData.user.id);
      
      const { data, error } = await supabase
        .from('applications')
        .insert({
          application_type: applicationType,
          application_status: 'draft',
          user_id: authData.user.id
        })
        .select('*')
        .single();
      
      if (error) {
        console.error("[applicationService] Error inserting application:", error);
        throw error;
      }
      
      console.log("[applicationService] Successfully created application:", data.id);
      return data;
    } catch (error) {
      console.error('[applicationService] Error creating application:', error);
      throw error;
    }
  },

  // Get application by ID with strict user validation
  async getApplicationById(id: string) {
    try {
      console.log("[applicationService] Fetching application by ID:", id);
      
      // Get current user with detailed logging
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error("[applicationService] Authentication error when fetching application:", authError);
        throw authError;
      }
      
      if (!authData.user) {
        console.error("[applicationService] No authenticated user found when fetching application");
        throw new Error("Not authenticated");
      }
      
      console.log("[applicationService] Fetching application for user:", authData.user.id);
      
      // First verify this is the user's own application
      const { data: verifyData, error: verifyError } = await supabase
        .from('applications')
        .select('id')
        .eq('id', id)
        .eq('user_id', authData.user.id)
        .maybeSingle();
        
      if (verifyError) {
        console.error("[applicationService] Error verifying application ownership:", verifyError);
        throw verifyError;
      }
      
      if (!verifyData) {
        console.error("[applicationService] Application not found or not owned by current user");
        throw new Error("Application not found or you don't have permission to access it");
      }
      
      // Now fetch the full application details
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("[applicationService] Error fetching application details:", error);
        throw error;
      }
      
      console.log("[applicationService] Successfully fetched application:", data.id);
      return data;
    } catch (error) {
      console.error('[applicationService] Error fetching application:', error);
      throw error;
    }
  },

  // Get all applications for the current user with enforced authentication
  async getUserApplications() {
    try {
      console.log("[applicationService] Fetching user applications");
      
      // Get current user with detailed logging
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error("[applicationService] Authentication error when fetching user applications:", authError);
        throw authError;
      }
      
      if (!authData.user) {
        console.error("[applicationService] No authenticated user found when fetching applications");
        throw new Error("Not authenticated");
      }
      
      console.log("[applicationService] Fetching applications for user:", authData.user.id);
      
      // Fetch with strict user_id filtering
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', authData.user.id) // Add filter by user_id
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("[applicationService] Error fetching user applications:", error);
        throw error;
      }
      
      console.log("[applicationService] Successfully fetched applications. Count:", data?.length || 0);
      return data;
    } catch (error) {
      console.error('[applicationService] Error fetching user applications:', error);
      throw error;
    }
  },

  // Update application status with strict ownership validation
  async updateApplicationStatus(id: string, status: ApplicationStatus) {
    try {
      console.log("[applicationService] Updating application status:", id, status);
      
      // Get current user with detailed logging
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error("[applicationService] Authentication error when updating application:", authError);
        throw authError;
      }
      
      if (!authData.user) {
        console.error("[applicationService] No authenticated user found when updating application");
        throw new Error("Not authenticated");
      }
      
      console.log("[applicationService] Updating application for user:", authData.user.id);
      
      // First verify this is the user's own application
      const { data: verifyData, error: verifyError } = await supabase
        .from('applications')
        .select('id')
        .eq('id', id)
        .eq('user_id', authData.user.id)
        .maybeSingle();
        
      if (verifyError) {
        console.error("[applicationService] Error verifying application ownership:", verifyError);
        throw verifyError;
      }
      
      if (!verifyData) {
        console.error("[applicationService] Application not found or not owned by current user");
        throw new Error("Application not found or you don't have permission to modify it");
      }
      
      // Now update the application
      const { data, error } = await supabase
        .from('applications')
        .update({ 
          application_status: status,
          ...(status === 'submitted' ? { submission_date: new Date().toISOString() } : {})
        })
        .eq('id', id)
        .eq('user_id', authData.user.id) // Ensure the user can only update their own applications
        .select('*')
        .single();
      
      if (error) {
        console.error("[applicationService] Error updating application status:", error);
        throw error;
      }
      
      console.log("[applicationService] Successfully updated application status:", data.id, data.application_status);
      return data;
    } catch (error) {
      console.error('[applicationService] Error updating application status:', error);
      throw error;
    }
  },
  
  // Delete application (only if it's a draft) with strict ownership validation
  async deleteApplication(id: string) {
    try {
      console.log("[applicationService] Attempting to delete application:", id);
      
      // Get current user with detailed logging
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error("[applicationService] Authentication error when deleting application:", authError);
        throw authError;
      }
      
      if (!authData.user) {
        console.error("[applicationService] No authenticated user found when deleting application");
        throw new Error("Not authenticated");
      }
      
      console.log("[applicationService] Deleting application for user:", authData.user.id);
      
      // First check if the application is a draft and belongs to the current user
      const { data: checkData, error: checkError } = await supabase
        .from('applications')
        .select('application_status')
        .eq('id', id)
        .eq('user_id', authData.user.id) // Strict user ownership check
        .maybeSingle();
      
      if (checkError) {
        console.error("[applicationService] Error checking application before deletion:", checkError);
        throw checkError;
      }
      
      if (!checkData) {
        console.error("[applicationService] Application not found or not owned by current user");
        throw new Error("Application not found or you don't have permission to delete it");
      }
      
      if (checkData.application_status !== 'draft') {
        console.error("[applicationService] Cannot delete application not in draft status");
        throw new Error('Only draft applications can be deleted');
      }
      
      // Now delete the application
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id)
        .eq('user_id', authData.user.id); // Ensure the user can only delete their own applications
      
      if (error) {
        console.error("[applicationService] Error deleting application:", error);
        throw error;
      }
      
      console.log("[applicationService] Successfully deleted application:", id);
      return true;
    } catch (error) {
      console.error('[applicationService] Error deleting application:', error);
      throw error;
    }
  }
};
