
import { supabase } from "@/integrations/supabase/client";
import { ApplicationStatus, ApplicationData } from "./types";
import { checkSupabaseConnection } from "@/utils/supabaseUtils";

export const adminApplicationService = {
  // Get all applications for admin review
  async getAllApplications() {
    try {
      // Verify connection first
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        throw new Error("Database connection issue. Please try again later.");
      }

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
        throw error;
      }
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
      // Verify connection first
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        throw new Error("Database connection issue. Please try again later.");
      }

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
        .eq('applications.application_status', status) // Explicitly reference the table
        .order('applications.submission_date', { ascending: false }); // Explicitly reference the table
      
      if (error) {
        console.error(`Error fetching ${status} applications:`, error);
        throw error;
      }
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
      // Verify connection first
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        throw new Error("Database connection issue. Please try again later.");
      }

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
        .eq('applications.id', id) // Explicitly reference the table
        .single();
      
      if (error) {
        console.error('Error fetching application details:', error);
        throw error;
      }
      console.log('Application details:', data);
      return data as ApplicationData & {
        business_information?: any;
        owner_information?: any;
        business_operations?: any;
        business_lines?: any[];
        declarations?: any;
      };
    } catch (error) {
      console.error('Error fetching application details:', error);
      throw error;
    }
  },

  // Update application status
  async updateApplicationStatus(id: string, status: ApplicationStatus, adminNotes?: string) {
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
          admin_notes: adminNotes
        })
        .eq('applications.id', id) // Explicitly reference the table
        .select()
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

  // Get application counts by status
  async getApplicationCounts() {
    try {
      // Verify connection first
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        throw new Error("Database connection issue. Please try again later.");
      }

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
          .eq('applications.application_status', status); // Explicitly reference the table
        
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
