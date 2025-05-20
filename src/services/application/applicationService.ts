
import { supabase } from "@/integrations/supabase/client";
import { ApplicationStatus, ApplicationType } from "./types";
import { checkSupabaseConnection } from "@/utils/supabaseUtils";

// Core application service methods
export const applicationService = {
  // Create a new application
  async createApplication(applicationType: ApplicationType) {
    try {
      // Verify connection first
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        throw new Error("Database connection issue. Please try again later.");
      }

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
      
      if (error) {
        console.error('Error creating application:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  },

  // Get application by ID
  async getApplicationById(id: string) {
    try {
      // Verify connection first
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        throw new Error("Database connection issue. Please try again later.");
      }

      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching application:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
  },

  // Get all applications for the current user
  async getUserApplications() {
    try {
      // Verify connection first
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        throw new Error("Database connection issue. Please try again later.");
      }

      // Get current user first
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error fetching user applications:', authError);
        throw authError;
      }
      
      if (!authData.user) {
        console.error('No authenticated user found');
        throw new Error("Not authenticated");
      }
      
      console.log('Fetching applications for user ID:', authData.user.id);
      
      // Use explicit table reference to avoid ambiguity
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('applications.user_id', authData.user.id) // Explicitly reference the table
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user applications:', error);
        throw error;
      }
      
      console.log('Retrieved applications:', data ? data.length : 0);
      return data;
    } catch (error) {
      console.error('Error in getUserApplications:', error);
      throw error;
    }
  },

  // Update application status
  async updateApplicationStatus(id: string, status: ApplicationStatus) {
    try {
      // Verify connection first
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        throw new Error("Database connection issue. Please try again later.");
      }

      const { data, error } = await supabase
        .from('applications')
        .update({ 
          application_status: status,
          ...(status === 'submitted' ? { submission_date: new Date().toISOString() } : {})
        })
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error updating application status:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },
  
  // Delete application (only if it's a draft)
  async deleteApplication(id: string) {
    try {
      // Verify connection first
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        throw new Error("Database connection issue. Please try again later.");
      }

      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting application:', error);
        throw error;
      }
      return true;
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  }
};
