
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
          id,
          application_type,
          application_status,
          submission_date,
          created_at,
          updated_at,
          applications.user_id,
          admin_notes,
          business_information(*),
          owner_information(*),
          business_operations(*),
          business_lines(*),
          declarations(*)
        `)
        .order('submission_date', { ascending: false });
      
      if (error) {
        logDatabaseError('getAllApplications', error);
        throw error;
      }
      
      console.log('Applications data retrieved:', data?.length || 0, 'records');
      return data;
    } catch (error) {
      console.error('Error fetching all applications:', error);
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
          id,
          application_type,
          application_status,
          submission_date,
          created_at,
          updated_at,
          applications.user_id,
          admin_notes,
          business_information(*),
          owner_information(*),
          business_operations(*),
          business_lines(*),
          declarations(*)
        `)
        .eq('application_status', status)
        .order('submission_date', { ascending: false });
      
      if (error) {
        logDatabaseError('getApplicationsByStatus', error, { status });
        throw error;
      }
      
      console.log(`Applications with status ${status}:`, data?.length || 0, 'records');
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
          id,
          application_type,
          application_status,
          submission_date,
          created_at,
          updated_at,
          applications.user_id,
          admin_notes,
          business_information(*),
          owner_information(*),
          business_operations(*),
          business_lines(*),
          declarations(*)
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        logDatabaseError('getApplicationDetails', error, { id });
        throw error;
      }
      
      if (!data) {
        console.warn(`No application found with ID: ${id}`);
        throw new Error(`Application not found: ${id}`);
      }
      
      console.log('Application details retrieved successfully');
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
        .maybeSingle();
      
      if (error) {
        logDatabaseError('updateApplicationStatus', error, { id, status, adminNotes });
        throw error;
      }
      
      console.log(`Application ${id} status updated to ${status}`);
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
        
      if (totalError) {
        logDatabaseError('getApplicationCounts', totalError, { operation: 'total count' });
        throw totalError;
      }
      
      counts.total = totalCount || 0;
      
      // Get counts for each status
      for (const status of statuses) {
        const { count, error } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('application_status', status);
        
        if (error) {
          logDatabaseError('getApplicationCounts', error, { status });
          throw error;
        }
        
        counts[status] = count || 0;
      }
      
      console.log('Application counts retrieved:', counts);
      return counts;
    } catch (error) {
      console.error('Error getting application counts:', error);
      throw error;
    }
  }
};
