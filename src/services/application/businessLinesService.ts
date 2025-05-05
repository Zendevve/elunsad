
import { supabase } from "@/integrations/supabase/client";
import { BusinessLinesData } from "./types";

// Business Lines service methods
export const businessLinesService = {
  async saveBusinessLines(dataArray: BusinessLinesData[]) {
    try {
      if (dataArray.length === 0) return [];
      
      const applicationId = dataArray[0].application_id;
      
      // Delete existing business lines for this application
      const { error: deleteError } = await supabase
        .from('business_lines')
        .delete()
        .eq('application_id', applicationId);
      
      if (deleteError) throw deleteError;
      
      // Insert all new business lines
      const { data, error: insertError } = await supabase
        .from('business_lines')
        .insert(dataArray)
        .select('*');
      
      if (insertError) throw insertError;
      return data;
    } catch (error) {
      console.error('Error saving business lines:', error);
      throw error;
    }
  },
  
  async getBusinessLines(applicationId: string) {
    try {
      const { data, error } = await supabase
        .from('business_lines')
        .select('*')
        .eq('application_id', applicationId);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching business lines:', error);
      throw error;
    }
  }
};
