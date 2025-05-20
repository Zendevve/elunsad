
import { supabase } from "@/integrations/supabase/client";
import { ApplicationData, BusinessInformationData, OwnerInformationData, BusinessOperationsData, BusinessLinesData, DeclarationData } from "@/services/application/types";
import { checkSupabaseConnection } from "@/utils/supabaseUtils";

export const getApplicationFullDetails = async (applicationId: string) => {
  try {
    // Verify connection first
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      throw new Error("Database connection issue. Please try again later.");
    }

    console.log("Fetching full application details for:", applicationId);
    
    // Fetch the application record
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('*')
      .eq('applications.id', applicationId) // Explicitly reference the table
      .single();
    
    if (appError) {
      console.error("Error fetching application:", appError);
      throw appError;
    }

    if (!application) {
      console.error("Application not found:", applicationId);
      throw new Error("Application not found");
    }
    
    // Fetch related business information
    const { data: businessInfo, error: bizError } = await supabase
      .from('business_information')
      .select('*')
      .eq('business_information.application_id', applicationId) // Explicitly reference the table
      .maybeSingle();
    
    if (bizError) {
      console.error("Error fetching business information:", bizError);
    }
    
    // Fetch related owner information
    const { data: ownerInfo, error: ownerError } = await supabase
      .from('owner_information')
      .select('*')
      .eq('owner_information.application_id', applicationId) // Explicitly reference the table
      .maybeSingle();
    
    if (ownerError) {
      console.error("Error fetching owner information:", ownerError);
    }
    
    // Fetch related business operations
    const { data: operations, error: opsError } = await supabase
      .from('business_operations')
      .select('*')
      .eq('business_operations.application_id', applicationId) // Explicitly reference the table
      .maybeSingle();
    
    if (opsError) {
      console.error("Error fetching business operations:", opsError);
    }
    
    // Fetch related business lines
    const { data: businessLines, error: linesError } = await supabase
      .from('business_lines')
      .select('*')
      .eq('business_lines.application_id', applicationId); // Explicitly reference the table
    
    if (linesError) {
      console.error("Error fetching business lines:", linesError);
    }
    
    // Fetch declaration
    const { data: declaration, error: declError } = await supabase
      .from('declarations')
      .select('*')
      .eq('declarations.application_id', applicationId) // Explicitly reference the table
      .maybeSingle();
    
    if (declError) {
      console.error("Error fetching declaration:", declError);
    }
    
    // Fetch applicant profile details
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('firstname, lastname, middlename, extension_name')
      .eq('profiles.id', application.user_id) // Explicitly reference the table
      .maybeSingle();
      
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
    }
    
    return {
      application: application as ApplicationData,
      businessInformation: businessInfo as BusinessInformationData,
      ownerInformation: ownerInfo as OwnerInformationData,
      businessOperations: operations as BusinessOperationsData,
      businessLines: businessLines as BusinessLinesData[],
      declaration: declaration as DeclarationData,
      profile: profileData
    };
  } catch (error) {
    console.error("Failed to fetch application details:", error);
    throw error;
  }
};
