
import { supabase } from "@/integrations/supabase/client";
import { BusinessInformationData, OwnershipType } from "./types";
import { toast } from "@/utils/toastCompat";

// Business Information service methods
export const businessInformationService = {
  async saveBusinessInformation(data: BusinessInformationData) {
    try {
      console.log("Attempting to save business information:", data);

      // Validate required fields to ensure we don't save incomplete data
      if (!data.application_id || !data.business_name || !data.tin_number || 
          !data.ownership_type || !data.street || !data.barangay || 
          !data.city_municipality || !data.province || !data.zip_code ||
          !data.mobile_no || !data.email_address) {
        console.error("Missing required fields for business information", data);
        throw new Error("Missing required fields for business information");
      }

      // Ensure the ownership_type is a valid value from our OwnershipType enum
      const mappedOwnershipType: OwnershipType = data.ownership_type;
      
      // Check if business information already exists for this application
      const { data: existingData, error: checkError } = await supabase
        .from('business_information')
        .select('id')
        .eq('application_id', data.application_id)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking existing business information:", checkError);
        throw checkError;
      }
      
      let result;
      
      if (existingData) {
        // Update existing record
        console.log("Updating existing business information record");
        const { data: updatedData, error: updateError } = await supabase
          .from('business_information')
          .update({
            business_name: data.business_name,
            trade_name: data.trade_name,
            registration_number: data.registration_number,
            tin_number: data.tin_number,
            sss_number: data.sss_number,
            ctc_number: data.ctc_number,
            ctc_date_issue: data.ctc_date_issue,
            ctc_place_issue: data.ctc_place_issue,
            ownership_type: mappedOwnershipType,
            house_bldg_no: data.house_bldg_no,
            building_name: data.building_name,
            block_no: data.block_no,
            lot_no: data.lot_no,
            street: data.street,
            subdivision: data.subdivision,
            barangay: data.barangay,
            city_municipality: data.city_municipality,
            province: data.province,
            zip_code: data.zip_code,
            telephone_no: data.telephone_no,
            mobile_no: data.mobile_no,
            email_address: data.email_address
          })
          .eq('application_id', data.application_id)
          .select('*')
          .single();
        
        if (updateError) {
          console.error("Error updating business information:", updateError);
          throw updateError;
        }
        
        result = updatedData;
        console.log("Business information updated successfully:", result);
      } else {
        // Insert new record
        console.log("Inserting new business information record");
        const { data: insertedData, error: insertError } = await supabase
          .from('business_information')
          .insert({
            application_id: data.application_id,
            business_name: data.business_name,
            trade_name: data.trade_name,
            registration_number: data.registration_number,
            tin_number: data.tin_number,
            sss_number: data.sss_number,
            ctc_number: data.ctc_number,
            ctc_date_issue: data.ctc_date_issue,
            ctc_place_issue: data.ctc_place_issue,
            ownership_type: mappedOwnershipType,
            house_bldg_no: data.house_bldg_no,
            building_name: data.building_name,
            block_no: data.block_no,
            lot_no: data.lot_no,
            street: data.street,
            subdivision: data.subdivision,
            barangay: data.barangay,
            city_municipality: data.city_municipality,
            province: data.province,
            zip_code: data.zip_code,
            telephone_no: data.telephone_no,
            mobile_no: data.mobile_no,
            email_address: data.email_address
          })
          .select('*')
          .single();
        
        if (insertError) {
          console.error("Error inserting business information:", insertError);
          throw insertError;
        }
        
        result = insertedData;
        console.log("Business information inserted successfully:", result);
      }
      
      return result;
    } catch (error) {
      console.error('Error saving business information:', error);
      toast({
        description: "There was a problem saving your business information. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  },
  
  async getBusinessInformation(applicationId: string) {
    try {
      console.log("Fetching business information for application:", applicationId);
      const { data, error } = await supabase
        .from('business_information')
        .select('*')
        .eq('application_id', applicationId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching business information:", error);
        throw error;
      }
      
      console.log("Retrieved business information:", data);
      return data;
    } catch (error) {
      console.error('Error fetching business information:', error);
      throw error;
    }
  }
};
