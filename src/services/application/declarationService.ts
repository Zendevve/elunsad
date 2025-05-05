
import { supabase } from "@/integrations/supabase/client";
import { DeclarationData } from "./types";

// Declaration service methods
export const declarationService = {
  async saveDeclaration(data: DeclarationData) {
    try {
      // Check if declaration already exists for this application
      const { data: existingData, error: checkError } = await supabase
        .from('declarations')
        .select('id')
        .eq('application_id', data.application_id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingData) {
        // Update existing record
        const { data: updatedData, error: updateError } = await supabase
          .from('declarations')
          .update(data)
          .eq('application_id', data.application_id)
          .select('*')
          .single();
        
        if (updateError) throw updateError;
        return updatedData;
      } else {
        // Insert new record
        const { data: insertedData, error: insertError } = await supabase
          .from('declarations')
          .insert(data)
          .select('*')
          .single();
        
        if (insertError) throw insertError;
        return insertedData;
      }
    } catch (error) {
      console.error('Error saving declaration:', error);
      throw error;
    }
  },
  
  async getDeclaration(applicationId: string) {
    try {
      const { data, error } = await supabase
        .from('declarations')
        .select('*')
        .eq('application_id', applicationId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching declaration:', error);
      throw error;
    }
  }
};
