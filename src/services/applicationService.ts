import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

// Types based on our Supabase schema
export type ApplicationType = 'newApplication' | 'renewalApplication' | 'amendmentApplication';
export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'requires_additional_info';
export type OwnershipType = 'soleProprietorship' | 'onePersonCorp' | 'partnership' | 'corporation' | 'cooperative';
export type CivilStatus = 'single' | 'married' | 'widowed' | 'divorced' | 'separated';
export type Sex = 'male' | 'female';

export interface ApplicationData {
  id?: string;
  application_type: ApplicationType;
}

export interface BusinessInformationData {
  application_id: string;
  business_name: string;
  trade_name?: string;
  registration_number?: string;
  tin_number: string;
  sss_number?: string;
  ctc_number?: string;  // Added CTC number
  ctc_date_issue?: string;  // Added CTC date of issue
  ctc_place_issue?: string;  // Added CTC place of issue
  ownership_type: OwnershipType;
  house_bldg_no?: string;
  building_name?: string;
  block_no?: string;
  lot_no?: string;
  street: string;
  subdivision?: string;
  barangay: string;
  city_municipality: string;
  province: string;
  zip_code: string;
  telephone_no?: string;
  mobile_no: string;
  email_address: string;
}

export interface OwnerInformationData {
  application_id: string;
  surname: string;
  given_name: string;
  middle_name?: string;
  suffix?: string;
  civil_status: CivilStatus;
  age: number;
  sex: Sex;
  nationality: string;
  owner_house_bldg_no?: string;
  owner_building_name?: string;
  owner_block_no?: string;
  owner_lot_no?: string;
  owner_street: string;
  owner_subdivision?: string;
  owner_barangay: string;
  owner_city_municipality: string;
  owner_province: string;
  owner_zip_code: string;
}

export interface BusinessLinesData {
  application_id: string;
  line_of_business: string;
  psic_code?: string;
  products_services: string;
  units?: string;
  gross_sales?: string;
}

export interface BusinessOperationsData {
  application_id: string;
  business_area?: number;
  cctv_cameras?: number;
  professional_male?: number;
  professional_female?: number;
  non_professional_male?: number;
  non_professional_female?: number;
  employees_in_lucena?: number;
  van_truck?: number;
  motorcycle?: number;
  other_vehicles?: number;
  capitalization?: number;
  has_tax_incentives?: boolean;
  property_owned?: boolean;
  tax_declaration_no?: string;
  business_activity?: string;
  other_activity?: string;  // Added to store the "Others" specification
  main_block_no?: string;
  main_lot_no?: string;
  main_house_bldg_no?: string;
  main_building_name?: string;
  main_street?: string;
  main_subdivision?: string;
  main_barangay?: string;
  main_city_municipality?: string;
  main_province?: string;
  main_zip_code?: string;
  lessor_full_name?: string;
  lessor_business_name?: string;
  lessor_address?: string;
  lessor_contact_number?: string;
  lessor_email_address?: string;
  monthly_rental?: number;
}

export interface DeclarationData {
  application_id: string;
  is_agreed: boolean;
  signature: string;
  designation?: string;
  verified_by?: string;  // Added verified by field
  declaration_place?: string;  // Added declaration place field
}

// Service methods for applications
export const applicationService = {
  // Create a new application
  async createApplication(applicationType: ApplicationType) {
    try {
      // Get current user
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!authData.user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('applications')
        .insert({
          application_type: applicationType,
          application_status: 'draft',
          user_id: authData.user.id // Add the user ID from auth
        })
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  },

  // Get application by ID
  async getApplicationById(id: string) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
  },

  // Get all applications for the current user
  async getUserApplications() {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user applications:', error);
      throw error;
    }
  },

  // Update application status
  async updateApplicationStatus(id: string, status: ApplicationStatus) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({ 
          application_status: status,
          ...(status === 'submitted' ? { submission_date: new Date().toISOString() } : {})
        })
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },
  
  // Delete application (only if it's a draft)
  async deleteApplication(id: string) {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  },

  // Business Information methods
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
  },
  
  // Owner Information methods
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
          .update(data)
          .eq('application_id', data.application_id)
          .select('*')
          .single();
        
        if (updateError) throw updateError;
        return updatedData;
      } else {
        // Insert new record
        const { data: insertedData, error: insertError } = await supabase
          .from('owner_information')
          .insert(data)
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
  },
  
  // Business Operations methods
  async saveBusinessOperations(data: BusinessOperationsData) {
    try {
      // Check if business operations already exists for this application
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
        return updatedData;
      } else {
        // Insert new record
        const { data: insertedData, error: insertError } = await supabase
          .from('business_operations')
          .insert(data)
          .select('*')
          .single();
        
        if (insertError) throw insertError;
        return insertedData;
      }
    } catch (error) {
      console.error('Error saving business operations:', error);
      throw error;
    }
  },
  
  async getBusinessOperations(applicationId: string) {
    try {
      const { data, error } = await supabase
        .from('business_operations')
        .select('*')
        .eq('application_id', applicationId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching business operations:', error);
      throw error;
    }
  },
  
  // Business Lines methods
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
  },
  
  // Declaration methods
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
