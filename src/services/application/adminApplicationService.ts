import { supabase } from "@/integrations/supabase/client";
import { ApplicationStatus, ApplicationData } from "./types";

export const adminApplicationService = {
  // Get all applications for admin review
  async getAllApplications() {
    try {
      console.log('Fetching all applications with full details');
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          submission_date,
          created_at,
          updated_at,
          application_type,
          application_status,
          admin_notes,
          user_id,
          business_information(id, business_name, application_id),
          owner_information(id, surname, given_name, application_id),
          business_operations(id, application_id),
          business_lines(id, application_id, line_of_business),
          declarations(id, application_id)
        `)
        .order('submission_date', { ascending: false });
      
      if (error) throw error;
      console.log('Applications data:', data);
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
          submission_date,
          created_at,
          updated_at,
          application_type,
          application_status,
          admin_notes,
          user_id,
          business_information(id, business_name, application_id),
          owner_information(id, surname, given_name, application_id),
          business_operations(id, application_id),
          business_lines(id, application_id, line_of_business),
          declarations(id, application_id)
        `)
        .eq('application_status', status)
        .order('submission_date', { ascending: false });
      
      if (error) throw error;
      console.log(`Applications with status ${status}:`, data);
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
          submission_date,
          created_at,
          updated_at,
          application_type,
          application_status,
          admin_notes,
          user_id,
          business_information(id, application_id, business_name, trade_name, registration_number, tin_number, ownership_type, email_address, mobile_no),
          owner_information(id, application_id, surname, given_name, middle_name, suffix, nationality),
          business_operations(id, application_id, business_area, capitalization),
          business_lines(id, application_id, line_of_business, products_services, psic_code),
          declarations(id, application_id, is_agreed, signature)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      console.log('Application details:', data);
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
        .select('id', { count: 'exact', head: true });
        
      if (totalError) throw totalError;
      counts.total = totalCount || 0;
      
      // Get counts for each status
      for (const status of statuses) {
        const { count, error } = await supabase
          .from('applications')
          .select('id', { count: 'exact', head: true })
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
