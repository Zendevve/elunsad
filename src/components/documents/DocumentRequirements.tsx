
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { REQUIRED_DOCUMENTS, documentService, DocumentData } from '@/services/documentService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DocumentRow from './DocumentRow';
import DocumentSummary from './DocumentSummary';

interface DocumentRequirementsProps {
  uploadedDocuments: string[];
  approvedDocuments: string[];
  pendingDocuments: string[];
  rejectedDocuments: string[];
  applicationId?: string;
  onUploadComplete?: () => void;
  documents: DocumentData[];
}

const DocumentRequirements: React.FC<DocumentRequirementsProps> = ({
  uploadedDocuments,
  approvedDocuments,
  pendingDocuments,
  rejectedDocuments,
  applicationId,
  onUploadComplete,
  documents
}) => {
  const [uploadingDocs, setUploadingDocs] = useState<Set<string>>(new Set());
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement>>({});
  const { toast } = useToast();

  const getDocumentForType = (docType: string) => {
    return documents.find(doc => doc.document_type === docType);
  };

  const handleFileSelect = (docType: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPG, PNG, or PDF file.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFiles(prev => ({ ...prev, [docType]: file }));
  };

  const handleUpload = async (docType: string) => {
    const file = selectedFiles[docType];
    if (!file || !applicationId) return;

    setUploadingDocs(prev => new Set(prev.add(docType)));

    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Upload file to storage
      const fileUrl = await documentService.uploadFile(file, applicationId, user.id);

      // Create document record
      await documentService.createDocument({
        application_id: applicationId,
        document_type: docType,
        document_name: file.name,
        file_url: fileUrl,
        file_size: file.size,
        file_type: file.type,
        status: 'pending'
      });

      toast({
        title: "Document uploaded",
        description: `${docType} has been uploaded successfully.`,
      });

      // Clear the file selection
      setSelectedFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[docType];
        return newFiles;
      });

      // Clear file input
      if (fileInputRefs.current[docType]) {
        fileInputRefs.current[docType].value = '';
      }

      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingDocs(prev => {
        const newSet = new Set(prev);
        newSet.delete(docType);
        return newSet;
      });
    }
  };

  const clearFile = (docType: string) => {
    setSelectedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[docType];
      return newFiles;
    });
    if (fileInputRefs.current[docType]) {
      fileInputRefs.current[docType].value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Required Documents Checklist</CardTitle>
        <p className="text-sm text-gray-600">
          Upload all required documents for your business permit application.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {REQUIRED_DOCUMENTS.map((docType, index) => (
            <DocumentRow
              key={index}
              docType={docType}
              uploadedDocuments={uploadedDocuments}
              approvedDocuments={approvedDocuments}
              pendingDocuments={pendingDocuments}
              rejectedDocuments={rejectedDocuments}
              uploadedDoc={getDocumentForType(docType)}
              applicationId={applicationId}
              onUploadComplete={onUploadComplete}
              uploadingDocs={uploadingDocs}
              selectedFiles={selectedFiles}
              onFileSelect={handleFileSelect}
              onUpload={handleUpload}
              onClearFile={clearFile}
              fileInputRefs={fileInputRefs}
            />
          ))}
        </div>
        
        <DocumentSummary
          approvedDocuments={approvedDocuments}
          pendingDocuments={pendingDocuments}
          rejectedDocuments={rejectedDocuments}
          uploadedDocuments={uploadedDocuments}
        />
      </CardContent>
    </Card>
  );
};

export default DocumentRequirements;
