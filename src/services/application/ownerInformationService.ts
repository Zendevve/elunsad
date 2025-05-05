
import { supabase } from "@/integrations/supabase/client";
import { OwnerInformationData } from "./types";

// Owner Information service methods
export const ownerInformationService = {
  async saveOwnerInformation(data: OwnerInformationData) {
    try {
      // Check if owner information already exists for this application
      const { data: existingData, error: checkError } = await supabase
        .from('owner_information')
        .select('id')
        .eq('application_id', data.application_id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingData) {
        // Update existing record
        const { data: updatedData, error: updateError } = await supabase
          .from('owner_information')
          .update({
            surname: data.surname,
            given_name: data.given_name,
            middle_name: data.middle_name,
            suffix: data.suffix,
            age: data.age,
            sex: data.sex,
            civil_status: data.civil_status,
            nationality: data.nationality,
            owner_street: data.owner_street,
            owner_barangay: data.owner_barangay,
            owner_city_municipality: data.owner_city_municipality,
            owner_province: data.owner_province,
            owner_zip_code: data.owner_zip_code,
            owner_house_bldg_no: data.owner_house_bldg_no,
            owner_building_name: data.owner_building_name,
            owner_block_no: data.owner_block_no,
            owner_lot_no: data.owner_lot_no,
            owner_subdivision: data.owner_subdivision
          })
          .eq('application_id', data.application_id)
          .select('*')
          .single();
        
        if (updateError) throw updateError;
        return updatedData;
      } else {
        // Insert new record
        const { data: insertedData, error: insertError } = await supabase
          .from('owner_information')
          .insert({
            application_id: data.application_id,
            surname: data.surname,
            given_name: data.given_name,
            middle_name: data.middle_name,
            suffix: data.suffix,
            age: data.age,
            sex: data.sex,
            civil_status: data.civil_status,
            nationality: data.nationality,
            owner_street: data.owner_street,
            owner_barangay: data.owner_barangay,
            owner_city_municipality: data.owner_city_municipality,
            owner_province: data.owner_province,
            owner_zip_code: data.owner_zip_code,
            owner_house_bldg_no: data.owner_house_bldg_no,
            owner_building_name: data.owner_building_name,
            owner_block_no: data.owner_block_no,
            owner_lot_no: data.owner_lot_no,
            owner_subdivision: data.owner_subdivision
          })
          .select('*')
          .single();
        
        if (insertError) throw insertError;
        return insertedData;
      }
    } catch (error) {
      console.error('Error saving owner information:', error);
      throw error;
    }
  },
  
  async getOwnerInformation(applicationId: string) {
    try {
      const { data, error } = await supabase
        .from('owner_information')
        .select('*')
        .eq('application_id', applicationId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching owner information:', error);
      throw error;
    }
  }
};
