
import { supabase } from "@/integrations/supabase/client";
import { BusinessInformationData } from "./types";

// Business Information service methods
export const businessInformationService = {
  async saveBusinessInformation(data: BusinessInformationData) {
    try {
      // Check if business information already exists for this application
      const { data: existingData, error: checkError } = await supabase
        .from('business_information')
        .select('id')
        .eq('application_id', data.application_id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingData) {
        // Update existing record
        const { data: updatedData, error: updateError } = await supabase
          .from('business_information')
          .update(data)
          .eq('application_id', data.application_id)
          .select('*')
          .single();
        
        if (updateError) throw updateError;
        return updatedData;
      } else {
        // Insert new record
        const { data: insertedData, error: insertError } = await supabase
          .from('business_information')
          .insert(data)
          .select('*')
          .single();
        
        if (insertError) throw insertError;
        return insertedData;
      }
    } catch (error) {
      console.error('Error saving business information:', error);
      throw error;
    }
  },
  
  async getBusinessInformation(applicationId: string) {
    try {
      const { data, error } = await supabase
        .from('business_information')
        .select('*')
        .eq('application_id', applicationId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching business information:', error);
      throw error;
    }
  }
};
