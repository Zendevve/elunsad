
import { supabase } from "@/integrations/supabase/client";
import { ApplicationStatus, ApplicationData } from "./types";
import { logDatabaseError } from "@/utils/supabaseUtils";

export const adminApplicationService = {
  // Get all applications for admin review
  async getAllApplications() {
    try {
      console.log('Fetching all applications with full details');
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
      
      if (error) {
        console.error('Error fetching all applications:', error);
        logDatabaseError('getAllApplications', error);
        throw error;
      }
      
      console.log(`Applications data: Found ${data?.length || 0} applications`);
      return data || [];
    } catch (error) {
      console.error('Error in getAllApplications:', error);
      throw error;
    }
  },

  // Get applications by status
  async getApplicationsByStatus(status: ApplicationStatus) {
    try {
      console.log(`Fetching applications with status: ${status}`);
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
      
      if (error) {
        console.error(`Error fetching ${status} applications:`, error);
        logDatabaseError('getApplicationsByStatus', error, { status });
        throw error;
      }
      
      console.log(`Applications with status ${status}: Found ${data?.length || 0} applications`);
      return data || [];
    } catch (error) {
      console.error(`Error in getApplicationsByStatus for ${status}:`, error);
      throw error;
    }
  },

  // Get submitted applications that need review
  async getSubmittedApplications() {
    return this.getApplicationsByStatus('submitted');
  },
  
  // Get application details by ID with all related data
  async getApplicationDetails(id: string): Promise<ApplicationData & {
    business_information?: any;
    owner_information?: any;
    business_operations?: any;
    business_lines?: any[];
    declarations?: any;
  }> {
    try {
      console.log(`Fetching application details for ID: ${id}`);
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
      
      if (error) {
        console.error('Error fetching application details:', error);
        logDatabaseError('getApplicationDetails', error, { id });
        throw error;
      }
      
      console.log('Application details retrieved successfully');
      return data;
    } catch (error) {
      console.error('Error in getApplicationDetails:', error);
      throw error;
    }
  },

  // Update application status
  async updateApplicationStatus(id: string, status: ApplicationStatus, adminNotes?: string) {
    try {
      console.log(`Updating application ${id} status to ${status}`);
      const { data, error } = await supabase
        .from('applications')
        .update({ 
          application_status: status,
          admin_notes: adminNotes
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating application status:', error);
        logDatabaseError('updateApplicationStatus', error, { id, status });
        throw error;
      }
      
      console.log(`Application status updated successfully to: ${status}`);
      return data;
    } catch (error) {
      console.error('Error in updateApplicationStatus:', error);
      throw error;
    }
  },

  // Get application counts by status
  async getApplicationCounts() {
    try {
      console.log('Fetching application counts by status');
      const statuses: ApplicationStatus[] = ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'requires_additional_info'];
      const counts: Record<string, number> = {};
      
      // Get total count
      const { count: totalCount, error: totalError } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true });
        
      if (totalError) {
        console.error('Error getting total application count:', totalError);
        logDatabaseError('getApplicationCounts', totalError);
        throw totalError;
      }
      
      counts.total = totalCount || 0;
      console.log(`Total applications: ${counts.total}`);
      
      // Get counts for each status
      for (const status of statuses) {
        const { count, error } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('application_status', status);
        
        if (error) {
          console.error(`Error getting count for ${status} applications:`, error);
          logDatabaseError('getApplicationCounts', error, { status });
          throw error;
        }
        
        counts[status] = count || 0;
        console.log(`Applications with status ${status}: ${counts[status]}`);
      }
      
      return counts;
    } catch (error) {
      console.error('Error in getApplicationCounts:', error);
      throw error;
    }
  }
};
