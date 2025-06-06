
import { supabase } from "@/integrations/supabase/client";
import { ApplicationStatus, ApplicationType } from "./types";
import { activityGenerator } from "@/utils/activityGenerator";

// Core application service methods
export const applicationService = {
  // Create a new application
  async createApplication(applicationType: ApplicationType) {
    try {
      // Get current user
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!authData.user) throw new Error("Not authenticated");
      
      console.log("ApplicationService: Creating application with explicit type:", applicationType);
      
      // Validate application type
      if (!applicationType) {
        console.error("ApplicationService: Missing application type");
        throw new Error("Application type is required");
      }
      
      if (!["newApplication", "renewalApplication", "amendmentApplication"].includes(applicationType)) {
        console.error("ApplicationService: Invalid application type:", applicationType);
        throw new Error("Invalid application type");
      }
      
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
      console.log("ApplicationService: Created application with response:", data);
      
      // Generate activity for application creation
      await activityGenerator.applicationUpdated("New Application", data.id);
      
      return data;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  },

  // Get application by ID
  async getApplicationById(id: string) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
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
      // Get current user
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!authData.user) throw new Error("Not authenticated");
      
      // Query applications table with explicit user_id filter
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', authData.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log('User applications fetched:', data); // Debug log
      return data;
    } catch (error) {
      console.error('Error fetching user applications:', error);
      throw error;
    }
  },

  // Update application status
  async updateApplicationStatus(id: string, status: ApplicationStatus) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({ 
          application_status: status,
          ...(status === 'submitted' ? { submission_date: new Date().toISOString() } : {})
        })
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) throw error;
      
      // Generate activity for status change
      if (status === 'submitted') {
        await activityGenerator.applicationSubmitted("Your Application", id);
      } else {
        await activityGenerator.statusChanged(status, "Your Application", id);
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
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  }
};
