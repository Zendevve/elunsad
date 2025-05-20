
import { supabase } from "@/integrations/supabase/client";
import { ApplicationStatus, ApplicationData } from "./types";
import { logDatabaseError } from "@/utils/supabaseUtils";
import { ApplicationListItem } from "./adminApplicationTypes";

export const adminApplicationService = {
  // Get all applications for admin review
  async getAllApplications(): Promise<ApplicationListItem[]> {
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
          user_id,
          admin_notes,
          business_information:business_information!left(business_name),
          owner_information:owner_information!left(surname, given_name)
        `)
        .order('submission_date', { ascending: false });
      
      if (error) {
        console.error('SQL Error fetching applications:', error);
        logDatabaseError('getAllApplications', error);
        throw error;
      }
      
      console.log('Applications data retrieved:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('Sample application data:', data[0].id, data[0].application_status);
      } else {
        console.log('No applications found in database');
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching all applications:', error);
      throw error;
    }
  },

  // Get applications by status
  async getApplicationsByStatus(status: ApplicationStatus): Promise<ApplicationListItem[]> {
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
          user_id,
          admin_notes,
          business_information:business_information!left(business_name),
          owner_information:owner_information!left(surname, given_name)
        `)
        .eq('application_status', status)
        .order('submission_date', { ascending: false });
      
      if (error) {
        console.error(`SQL Error fetching ${status} applications:`, error);
        logDatabaseError(`getApplicationsByStatus:${status}`, error);
        throw error;
      }
      
      console.log(`Retrieved ${data?.length || 0} applications with status ${status}`);
      if (data && data.length > 0) {
        console.log('Sample application data:', data[0].id, data[0].application_status);
      }
      
      return data || [];
    } catch (error) {
      console.error(`Error fetching ${status} applications:`, error);
      throw error;
    }
  },

  // Get submitted applications that need review
  async getSubmittedApplications(): Promise<ApplicationListItem[]> {
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
          user_id,
          admin_notes,
          business_information:business_information!left(*),
          owner_information:owner_information!left(*),
          business_operations:business_operations!left(*),
          business_lines:business_lines!left(*),
          declarations:declarations!left(*)
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        console.error('SQL Error fetching application details:', error);
        logDatabaseError('getApplicationDetails', error);
        throw error;
      }
      
      if (!data) {
        console.error(`No application found with ID: ${id}`);
        throw new Error(`No application found with ID: ${id}`);
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
        console.error('SQL Error updating application status:', error);
        logDatabaseError('updateApplicationStatus', error);
        throw error;
      }
      
      console.log('Application status updated successfully');
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
        console.error('SQL Error getting total count:', totalError);
        logDatabaseError('getApplicationCounts:total', totalError);
        throw totalError;
      }
      
      counts.total = totalCount || 0;
      console.log(`Total applications count: ${counts.total}`);
      
      // Get counts for each status
      for (const status of statuses) {
        const { count, error } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('application_status', status);
        
        if (error) {
          console.error(`SQL Error getting count for ${status}:`, error);
          logDatabaseError(`getApplicationCounts:${status}`, error);
          throw error;
        }
        
        counts[status] = count || 0;
        console.log(`${status} applications count: ${counts[status]}`);
      }
      
      return counts;
    } catch (error) {
      console.error('Error getting application counts:', error);
      throw error;
    }
  }
};
