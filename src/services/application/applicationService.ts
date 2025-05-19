
import { supabase } from "@/integrations/supabase/client";
import { ApplicationStatus, ApplicationType } from "./types";

// Core application service methods
export const applicationService = {
  // Create a new application
  async createApplication(applicationType: ApplicationType) {
    try {
      // Get current user
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!authData.user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('applications')
        .insert({
          application_type: applicationType,
          application_status: 'draft',
          user_id: authData.user.id
        })
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  },

  // Get application by ID
  async getApplicationById(id: string) {
    try {
      // Get current user first to ensure they only see their own applications
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!authData.user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .eq('user_id', authData.user.id) // Ensure the user can only view their own applications
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
  },

  // Get all applications for the current user
  async getUserApplications() {
    try {
      // Get current user first to ensure they only see their own applications
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!authData.user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', authData.user.id) // Add filter by user_id
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user applications:', error);
      throw error;
    }
  },

  // Update application status
  async updateApplicationStatus(id: string, status: ApplicationStatus) {
    try {
      // Get current user first to ensure they only update their own applications
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!authData.user) throw new Error("Not authenticated");
      
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
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },
  
  // Delete application (only if it's a draft)
  async deleteApplication(id: string) {
    try {
      // Get current user first to ensure they only delete their own applications
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!authData.user) throw new Error("Not authenticated");
      
      // First check if the application is a draft and belongs to the current user
      const { data: checkData, error: checkError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .eq('user_id', authData.user.id) // Ensure the user can only delete their own applications
        .eq('application_status', 'draft') // Only drafts can be deleted
        .single();
      
      if (checkError || !checkData) {
        throw new Error('Application not found or not in draft status');
      }
      
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id)
        .eq('user_id', authData.user.id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  }
};
