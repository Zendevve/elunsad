
import { activityService } from "@/services/activityService";
import { Database } from "@/integrations/supabase/types";

type ActivityType = Database["public"]["Enums"]["activity_type_enum"];

export const generateActivity = async (
  type: ActivityType,
  title: string,
  description: string,
  relatedEntityId?: string,
  relatedEntityType?: string
) => {
  try {
    await activityService.createActivity({
      activity_type: type,
      title,
      description,
      related_entity_id: relatedEntityId,
      related_entity_type: relatedEntityType,
    });
  } catch (error) {
    console.error("Failed to generate activity:", error);
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

  applicationSubmitted: (businessName: string, applicationId: string) =>
    generateActivity(
      "application_submitted",
      "Application Submitted",
      `Your business permit application for "${businessName}" has been submitted`,
      applicationId,
      "application"
    ),

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

  statusChanged: (newStatus: string, businessName: string, applicationId: string) =>
    generateActivity(
      "status_changed",
      "Status Changed",
      `Your application for "${businessName}" status changed to ${newStatus}`,
      applicationId,
      "application"
    ),
};
