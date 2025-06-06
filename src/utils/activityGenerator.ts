
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
    console.log("Generating activity:", { type, title, description, relatedEntityId, relatedEntityType });
    
    const activity = await activityService.createActivity({
      activity_type: type,
      title,
      description,
      related_entity_id: relatedEntityId,
      related_entity_type: relatedEntityType,
    });
    
    if (activity) {
      console.log("Activity generated successfully:", activity);
      return activity;
    } else {
      console.warn("Activity creation returned null - check authentication and RLS policies");
      return null;
    }
  } catch (error) {
    console.error("Failed to generate activity:", error);
    return null;
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
      `Your application for "${businessName}" status changed to ${newStatus}`,
      applicationId,
      "application"
    );
  },

  // Welcome activity for new users
  welcomeActivity: () => 
    generateActivity(
      "application_submitted",
      "Welcome to Business Permit System",
      "Welcome! You can now apply for business permits and track your applications here.",
    ),

  // Document management activities
  documentRequested: (documentType: string, applicationId?: string) =>
    generateActivity(
      "document_uploaded",
      "Document Requested",
      `Additional document required: ${documentType}`,
      applicationId,
      "application"
    ),

  // System notifications
  systemMaintenance: (maintenanceDate: string) =>
    generateActivity(
      "permit_expiring",
      "System Maintenance Notice",
      `System maintenance scheduled for ${maintenanceDate}. Please plan accordingly.`,
    ),

  // Payment activities
  paymentReceived: (amount: string, applicationId?: string) =>
    generateActivity(
      "application_updated",
      "Payment Received",
      `Payment of ${amount} has been received for your application`,
      applicationId,
      "application"
    ),
};
