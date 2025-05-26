
import { supabase } from "@/integrations/supabase/client";
import { activityGenerator } from "@/utils/activityGenerator";

export interface DocumentData {
  id?: string;
  application_id: string;
  document_type: string;
  document_name: string;
  file_url?: string;
  file_size?: number;
  file_type?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_feedback?: string;
  uploaded_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  created_at?: string;
  updated_at?: string;
}

export const REQUIRED_DOCUMENTS = [
  'Filled-out Business Permit application form',
  'Two (2) passport size ID pictures of the owner',
  'One (1) valid I.D. with signature',
  'Community Tax Certificate (CTC/CEDULA)',
  'DTI/SEC/CDA Registration',
  'Zoning clearance from City Zoning Office',
  'Occupancy Permit or Certificate of OP Exemption',
  'Health Card/Certificate from City Health Office',
  'Real Property Tax Clearance',
  'PESO Clearance from City PESO Office'
];

export const documentService = {
  // Get documents for an application
  async getApplicationDocuments(applicationId: string): Promise<DocumentData[]> {
    try {
      const { data, error } = await supabase
        .from('application_documents')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(doc => ({
        ...doc,
        status: doc.status as 'pending' | 'approved' | 'rejected'
      }));
    } catch (error) {
      console.error('Error fetching application documents:', error);
      throw error;
    }
  },

  // Upload a file to storage
  async uploadFile(file: File, applicationId: string, userId: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${userId}/${applicationId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('application-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('application-documents')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Create document record
  async createDocument(documentData: Omit<DocumentData, 'id' | 'created_at' | 'updated_at'>): Promise<DocumentData> {
    try {
      const { data, error } = await supabase
        .from('application_documents')
        .insert(documentData)
        .select('*')
        .single();
      
      if (error) throw error;

      // Generate activity for document upload
      await activityGenerator.documentUploaded(documentData.document_name, documentData.application_id);
      
      return {
        ...data,
        status: data.status as 'pending' | 'approved' | 'rejected'
      };
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  },

  // Update document status (admin only)
  async updateDocumentStatus(
    documentId: string, 
    status: 'approved' | 'rejected', 
    adminFeedback?: string
  ): Promise<DocumentData> {
    try {
      const { data, error } = await supabase
        .from('application_documents')
        .update({
          status,
          admin_feedback: adminFeedback,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', documentId)
        .select('*')
        .single();
      
      if (error) throw error;

      // Generate activity for document status change
      if (status === 'approved') {
        await activityGenerator.documentApproved(data.document_name, data.application_id);
      } else {
        await activityGenerator.documentRejected(data.document_name, adminFeedback || 'No reason provided', data.application_id);
      }
      
      return {
        ...data,
        status: data.status as 'pending' | 'approved' | 'rejected'
      };
    } catch (error) {
      console.error('Error updating document status:', error);
      throw error;
    }
  },

  // Check if all required documents are uploaded and approved
  async checkDocumentCompletion(applicationId: string): Promise<{
    allUploaded: boolean;
    allApproved: boolean;
    missingDocuments: string[];
    pendingDocuments: string[];
    rejectedDocuments: string[];
  }> {
    try {
      const documents = await this.getApplicationDocuments(applicationId);
      const uploadedTypes = documents.map(doc => doc.document_type);
      const approvedTypes = documents.filter(doc => doc.status === 'approved').map(doc => doc.document_type);
      const pendingTypes = documents.filter(doc => doc.status === 'pending').map(doc => doc.document_type);
      const rejectedTypes = documents.filter(doc => doc.status === 'rejected').map(doc => doc.document_type);

      const missingDocuments = REQUIRED_DOCUMENTS.filter(doc => !uploadedTypes.includes(doc));
      const pendingDocuments = REQUIRED_DOCUMENTS.filter(doc => pendingTypes.includes(doc));
      const rejectedDocuments = REQUIRED_DOCUMENTS.filter(doc => rejectedTypes.includes(doc));

      return {
        allUploaded: missingDocuments.length === 0,
        allApproved: approvedTypes.length === REQUIRED_DOCUMENTS.length,
        missingDocuments,
        pendingDocuments,
        rejectedDocuments
      };
    } catch (error) {
      console.error('Error checking document completion:', error);
      return {
        allUploaded: false,
        allApproved: false,
        missingDocuments: REQUIRED_DOCUMENTS,
        pendingDocuments: [],
        rejectedDocuments: []
      };
    }
  }
};
