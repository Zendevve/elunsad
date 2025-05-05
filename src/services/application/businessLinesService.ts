
import { supabase } from "@/integrations/supabase/client";
import { BusinessLinesData } from "./types";

// Business Lines service methods
export const businessLinesService = {
  async saveBusinessLines(dataArray: BusinessLinesData[]) {
    try {
      if (dataArray.length === 0) return [];
      
      const applicationId = dataArray[0].application_id;
      
      console.log("Deleting existing business lines for application:", applicationId);
      
      // Delete existing business lines for this application
      const { error: deleteError } = await supabase
        .from('business_lines')
        .delete()
        .eq('application_id', applicationId);
      
      if (deleteError) {
        console.error("Error deleting existing business lines:", deleteError);
        throw deleteError;
      }
      
      console.log("Inserting new business lines:", dataArray);
      
      // Insert all new business lines
      const { data, error: insertError } = await supabase
        .from('business_lines')
        .insert(dataArray)
        .select('*');
      
      if (insertError) {
        console.error("Error inserting new business lines:", insertError);
        throw insertError;
      }
      
      console.log("Successfully saved business lines:", data);
      return data;
    } catch (error) {
      console.error('Error saving business lines:', error);
      throw error;
    }
  },
  
  async getBusinessLines(applicationId: string) {
    try {
      console.log("Fetching business lines for application:", applicationId);
      
      const { data, error } = await supabase
        .from('business_lines')
        .select('*')
        .eq('application_id', applicationId);
      
      if (error) {
        console.error("Error fetching business lines:", error);
        throw error;
      }
      
      console.log("Retrieved business lines:", data);
      return data || [];
    } catch (error) {
      console.error('Error fetching business lines:', error);
      throw error;
    }
  }
};
