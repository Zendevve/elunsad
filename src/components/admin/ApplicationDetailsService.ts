
import { supabase } from "@/integrations/supabase/client";
import { ApplicationData, BusinessInformationData, OwnerInformationData, BusinessOperationsData, BusinessLinesData, DeclarationData } from "@/services/application/types";
import { logDatabaseError } from "@/utils/supabaseUtils";

export const getApplicationFullDetails = async (applicationId: string) => {
  try {
    console.log("Fetching full application details for:", applicationId);
    
    // Fetch the application record
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select(`
        id,
        application_type,
        application_status,
        submission_date,
        created_at,
        updated_at,
        user_id,
        admin_notes
      `)
      .eq('id', applicationId)
      .maybeSingle();
    
    if (appError) {
      logDatabaseError("getApplicationFullDetails", appError, { applicationId, section: "application" });
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
      .eq('application_id', applicationId)
      .maybeSingle();
    
    if (bizError) {
      logDatabaseError("getApplicationFullDetails", bizError, { applicationId, section: "business_information" });
    }
    
    // Fetch related owner information
    const { data: ownerInfo, error: ownerError } = await supabase
      .from('owner_information')
      .select('*')
      .eq('application_id', applicationId)
      .maybeSingle();
    
    if (ownerError) {
      logDatabaseError("getApplicationFullDetails", ownerError, { applicationId, section: "owner_information" });
    }
    
    // Fetch related business operations
    const { data: operations, error: opsError } = await supabase
      .from('business_operations')
      .select('*')
      .eq('application_id', applicationId)
      .maybeSingle();
    
    if (opsError) {
      logDatabaseError("getApplicationFullDetails", opsError, { applicationId, section: "business_operations" });
    }
    
    // Fetch related business lines
    const { data: businessLines, error: linesError } = await supabase
      .from('business_lines')
      .select('*')
      .eq('application_id', applicationId);
    
    if (linesError) {
      logDatabaseError("getApplicationFullDetails", linesError, { applicationId, section: "business_lines" });
    }
    
    // Fetch declaration
    const { data: declaration, error: declError } = await supabase
      .from('declarations')
      .select('*')
      .eq('application_id', applicationId)
      .maybeSingle();
    
    if (declError) {
      logDatabaseError("getApplicationFullDetails", declError, { applicationId, section: "declarations" });
    }
    
    // Fetch applicant profile details
    const { data: profileData, error: profileError } = application ? await supabase
      .from('profiles')
      .select('firstname, lastname, middlename, extension_name')
      .eq('id', application.user_id)
      .maybeSingle() : { data: null, error: null };
      
    if (profileError) {
      logDatabaseError("getApplicationFullDetails", profileError, { userId: application?.user_id, section: "profiles" });
    }
    
    console.log("Successfully fetched all application details for:", applicationId);
    
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
