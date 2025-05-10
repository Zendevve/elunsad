
import { supabase } from "@/integrations/supabase/client";

// Application Service methods
export const applicationService = {
  async createApplication(data: any) {
    try {
      const { data: newApplication, error } = await supabase
        .from('applications')
        .insert({
          application_type: data.application_type,
          application_status: 'draft',
          user_id: data.user_id
        })
        .select('*')
        .single();
      
      if (error) {
        console.error("Error creating application:", error);
        return { data: null, error };
      }
      
      return { data: newApplication, error: null };
    } catch (error) {
      console.error("Unexpected error creating application:", error);
      return { data: null, error };
    }
  },
  
  async getApplication(id: string) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single();
      
      return { data, error };
    } catch (error) {
      console.error("Unexpected error fetching application:", error);
      return { data: null, error };
    }
  },
  
  async updateApplicationStatus(id: string, status: string) {
    try {
      const updateData: any = {
        application_status: status
      };
      
      // If submitting, add submission date
      if (status === 'submitted') {
        updateData.submission_date = new Date().toISOString();
      }
      
      const { data, error } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();
      
      return { data, error };
    } catch (error) {
      console.error("Unexpected error updating application status:", error);
      return { data: null, error };
    }
  },
  
  async getUserApplications(userId: string) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      
      return { data: data || [], error };
    } catch (error) {
      console.error("Unexpected error fetching user applications:", error);
      return { data: [], error };
    }
  },
  
  async getAllApplications() {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('updated_at', { ascending: false });
      
      return { data: data || [], error };
    } catch (error) {
      console.error("Unexpected error fetching all applications:", error);
      return { data: [], error };
    }
  }
};

export default applicationService;
