
import { supabase } from "@/integrations/supabase/client";
import { BusinessOperationsData } from "./types";

// Business Operations service methods
export const businessOperationsService = {
  async saveBusinessOperations(data: BusinessOperationsData) {
    try {
      console.log("Saving business operations:", data);
      
      // Check if business operations already exist for this application
      const { data: existingData, error: checkError } = await supabase
        .from('business_operations')
        .select('id')
        .eq('application_id', data.application_id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingData) {
        // Update existing record
        const { data: updatedData, error: updateError } = await supabase
          .from('business_operations')
          .update(data)
          .eq('application_id', data.application_id)
          .select('*')
          .single();
        
        if (updateError) throw updateError;
        console.log("Updated business operations:", updatedData);
        return updatedData;
      } else {
        // Insert new record
        const { data: insertedData, error: insertError } = await supabase
          .from('business_operations')
          .insert(data)
          .select('*')
          .single();
        
        if (insertError) throw insertError;
        console.log("Inserted business operations:", insertedData);
        return insertedData;
      }
    } catch (error) {
      console.error('Error saving business operations:', error);
      throw error;
    }
  },
  
  async getBusinessOperations(applicationId: string) {
    try {
      console.log("Fetching business operations for application:", applicationId);
      
      const { data, error } = await supabase
        .from('business_operations')
        .select('*')
        .eq('application_id', applicationId)
        .maybeSingle();
      
      if (error) throw error;
      console.log("Retrieved business operations:", data);
      return data;
    } catch (error) {
      console.error('Error fetching business operations:', error);
      throw error;
    }
  }
};
