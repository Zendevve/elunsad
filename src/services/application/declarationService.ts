
import { supabase } from "@/integrations/supabase/client";
import { DeclarationData } from "./types";

// Declaration service methods
export const declarationService = {
  async saveDeclaration(data: DeclarationData) {
    try {
      console.log("Saving declaration data:", data);
      if (!data.application_id) {
        console.error("Missing application_id in declaration data");
        throw new Error("Missing application_id in declaration data");
      }

      // Check if declaration already exists for this application
      const { data: existingData, error: checkError } = await supabase
        .from('declarations')
        .select('id')
        .eq('application_id', data.application_id)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking for existing declaration:", checkError);
        throw checkError;
      }
      
      let result;
      
      if (existingData) {
        // Update existing record
        console.log("Updating existing declaration:", existingData.id);
        const { data: updatedData, error: updateError } = await supabase
          .from('declarations')
          .update(data)
          .eq('application_id', data.application_id)
          .select('*')
          .single();
        
        if (updateError) {
          console.error("Error updating declaration:", updateError);
          throw updateError;
        }
        
        console.log("Declaration updated successfully:", updatedData);
        result = updatedData;
      } else {
        // Insert new record
        console.log("Inserting new declaration");
        const { data: insertedData, error: insertError } = await supabase
          .from('declarations')
          .insert(data)
          .select('*')
          .single();
        
        if (insertError) {
          console.error("Error inserting declaration:", insertError);
          throw insertError;
        }
        
        console.log("Declaration inserted successfully:", insertedData);
        result = insertedData;
      }
      
      return result;
    } catch (error) {
      console.error('Error saving declaration:', error);
      throw error;
    }
  },
  
  async getDeclaration(applicationId: string) {
    try {
      console.log("Fetching declaration for application:", applicationId);
      
      const { data, error } = await supabase
        .from('declarations')
        .select('*')
        .eq('application_id', applicationId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching declaration:", error);
        throw error;
      }
      
      console.log("Retrieved declaration:", data);
      return data;
    } catch (error) {
      console.error('Error fetching declaration:', error);
      throw error;
    }
  },

  async deleteSignatureFile(signatureUrl: string) {
    try {
      // Extract the file path from the URL
      // The URL format is typically: https://{project-ref}.supabase.co/storage/v1/object/public/{bucket}/{filePath}
      const url = new URL(signatureUrl);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.indexOf('public') + 1;
      
      if (bucketIndex > 0 && bucketIndex < pathParts.length) {
        const bucket = pathParts[bucketIndex];
        const filePath = pathParts.slice(bucketIndex + 1).join('/');
        
        console.log("Deleting signature file:", { bucket, filePath });
        
        const { error } = await supabase.storage
          .from(bucket)
          .remove([filePath]);
        
        if (error) {
          console.error("Error deleting signature file:", error);
          return false;
        }
        
        console.log("Signature file deleted successfully");
        return true;
      } else {
        console.error("Invalid signature URL format:", signatureUrl);
        return false;
      }
    } catch (error) {
      console.error('Error deleting signature file:', error);
      return false;
    }
  }
};
