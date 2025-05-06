
import { supabase } from "@/integrations/supabase/client";
import { ApplicationStatus } from "./types";

export const adminApplicationService = {
  // Get all applications for admin review
  async getAllApplications() {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          business_information(*),
          owner_information(*),
          business_operations(*),
          business_lines(*),
          declarations(*)
        `)
        .order('submission_date', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching all applications:', error);
      throw error;
    }
  },

  // Get applications by status
  async getApplicationsByStatus(status: ApplicationStatus) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          business_information(*),
          owner_information(*),
          business_operations(*),
          business_lines(*),
          declarations(*)
        `)
        .eq('application_status', status)
        .order('submission_date', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching ${status} applications:`, error);
      throw error;
    }
  },

  // Get submitted applications that need review
  async getSubmittedApplications() {
    return this.getApplicationsByStatus('submitted');
  },

  // Get application details by ID with all related data
  async getApplicationDetails(id: string) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          business_information(*),
          owner_information(*),
          business_operations(*),
          business_lines(*),
          declarations(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching application details:', error);
      throw error;
    }
  },

  // Update application status
  async updateApplicationStatus(id: string, status: ApplicationStatus, adminNotes?: string) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({ 
          application_status: status,
          admin_notes: adminNotes
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  // Get application counts by status
  async getApplicationCounts() {
    try {
      const statuses: ApplicationStatus[] = ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'requires_additional_info'];
      const counts: Record<string, number> = {};
      
      // Get total count
      const { count: totalCount, error: totalError } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true });
        
      if (totalError) throw totalError;
      counts.total = totalCount || 0;
      
      // Get counts for each status
      for (const status of statuses) {
        const { count, error } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('application_status', status);
        
        if (error) throw error;
        counts[status] = count || 0;
      }
      
      return counts;
    } catch (error) {
      console.error('Error getting application counts:', error);
      throw error;
    }
  }
};
