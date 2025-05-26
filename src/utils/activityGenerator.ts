
import { activityService } from "@/services/activityService";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

type ActivityType = Database["public"]["Enums"]["activity_type_enum"];

export const generateActivity = async (
  type: ActivityType,
  title: string,
  description: string,
  relatedEntityId?: string,
  relatedEntityType?: string
) => {
  try {
    console.log("Generating activity:", { type, title, description, relatedEntityId, relatedEntityType });
    
    // Verify user is authenticated
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error("Authentication error in generateActivity:", error);
      throw new Error(`Authentication failed: ${error.message}`);
    }
    
    if (!user) {
      console.error("Cannot create activity - user not authenticated");
      throw new Error("User must be authenticated to create activities");
    }
    
    console.log("User authenticated, creating activity for:", user.id);
    
    const activity = await activityService.createActivity({
      activity_type: type,
      title,
      description,
      related_entity_id: relatedEntityId,
      related_entity_type: relatedEntityType,
    });
    
    console.log("Activity generated successfully:", activity);
    return activity;
  } catch (error) {
    console.error("Failed to generate activity:", error);
    throw error; // Re-throw to let calling code handle it
  }
};

// Helper functions for common activities
export const activityGenerator = {
  documentUploaded: (documentName: string, applicationId?: string) => 
    generateActivity(
      "document_uploaded",
      "Document Uploaded",
      `You uploaded "${documentName}" for review`,
      applicationId,
      "application"
    ),

  documentApproved: (documentName: string, applicationId?: string) =>
    generateActivity(
      "document_approved", 
      "Document Approved",
      `Your document "${documentName}" has been approved`,
      applicationId,
      "application"
    ),

  documentRejected: (documentName: string, reason: string, applicationId?: string) =>
    generateActivity(
      "document_rejected",
      "Document Rejected", 
      `Your document "${documentName}" was rejected: ${reason}`,
      applicationId,
      "application"
    ),

  applicationSubmitted: async (businessName: string, applicationId: string) => {
    console.log("Creating application submitted activity for:", businessName, applicationId);
    return generateActivity(
      "application_submitted",
      "Application Submitted",
      `Your business permit application for "${businessName}" has been submitted successfully`,
      applicationId,
      "application"
    );
  },

  applicationUpdated: (businessName: string, applicationId: string) =>
    generateActivity(
      "application_updated",
      "Application Updated",
      `Your business permit application for "${businessName}" has been updated`,
      applicationId,
      "application"
    ),

  permitExpiring: (businessName: string, daysLeft: number, permitId?: string) =>
    generateActivity(
      "permit_expiring",
      "Permit Expiring Soon",
      `Your permit for "${businessName}" expires in ${daysLeft} days`,
      permitId,
      "permit"
    ),

  statusChanged: async (newStatus: string, businessName: string, applicationId: string) => {
    console.log("Creating status changed activity for:", businessName, newStatus, applicationId);
    return generateActivity(
      "status_changed",
      "Status Changed",
      `Your application for "${businessName}" status changed to ${newStatus.replace('_', ' ')}`,
      applicationId,
      "application"
    );
  }
};
