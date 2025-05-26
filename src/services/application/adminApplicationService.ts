
import { supabase } from "@/integrations/supabase/client";
import { ApplicationListItem } from "./adminApplicationTypes";
import { ApplicationStatus } from "./types";

export const adminApplicationService = {
  // Get all applications for admin view
  async getAllApplications(): Promise<ApplicationListItem[]> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          business_information!inner(*),
          owner_information!inner(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching all applications:', error);
        throw error;
      }
      
      console.log('Admin fetched all applications:', data);
      return data || [];
    } catch (error) {
      console.error('Admin service error:', error);
      throw error;
    }
  },

  // Get applications by status
  async getApplicationsByStatus(status: ApplicationStatus): Promise<ApplicationListItem[]> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          business_information!inner(*),
          owner_information!inner(*)
        `)
        .eq('application_status', status)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error(`Error fetching applications with status ${status}:`, error);
        throw error;
      }
      
      console.log(`Admin fetched ${status} applications:`, data);
      return data || [];
    } catch (error) {
      console.error('Admin service error:', error);
      throw error;
    }
  },

  // Get submitted applications specifically
  async getSubmittedApplications(): Promise<ApplicationListItem[]> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          business_information!inner(*),
          owner_information!inner(*)
        `)
        .eq('application_status', 'submitted')
        .order('submission_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching submitted applications:', error);
        throw error;
      }
      
      console.log('Admin fetched submitted applications:', data);
      return data || [];
    } catch (error) {
      console.error('Admin service error:', error);
      throw error;
    }
  },

  // Get application counts by status
  async getApplicationCounts() {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('application_status');
      
      if (error) {
        console.error('Error fetching application counts:', error);
        throw error;
      }
      
      const counts = data?.reduce((acc, app) => {
        const status = app.application_status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};
      
      console.log('Application counts:', counts);
      return counts;
    } catch (error) {
      console.error('Error getting application counts:', error);
      throw error;
    }
  },

  // Update application status
  async updateApplicationStatus(applicationId: string, status: ApplicationStatus): Promise<void> {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          application_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);
      
      if (error) {
        console.error('Error updating application status:', error);
        throw error;
      }
      
      console.log(`Updated application ${applicationId} status to ${status}`);
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }
};
