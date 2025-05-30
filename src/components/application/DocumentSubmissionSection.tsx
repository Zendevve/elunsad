
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { useApplication } from '@/contexts/ApplicationContext';
import { documentService, DocumentData } from '@/services/documentService';
import DocumentRequirements from '@/components/documents/DocumentRequirements';

const DocumentSubmissionSection: React.FC = () => {
  const { applicationId } = useApplication();
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completionStatus, setCompletionStatus] = useState({
    allUploaded: false,
    allApproved: false,
    missingDocuments: [],
    pendingDocuments: [],
    rejectedDocuments: []
  });
  const { toast } = useToast();

  useEffect(() => {
    if (applicationId) {
      loadDocuments();
    }
  }, [applicationId]);

  const loadDocuments = async () => {
    if (!applicationId) return;
    
    setIsLoading(true);
    try {
      const [docs, status] = await Promise.all([
        documentService.getApplicationDocuments(applicationId),
        documentService.checkDocumentCompletion(applicationId)
      ]);
      
      setDocuments(docs);
      setCompletionStatus(status);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadComplete = () => {
    loadDocuments();
  };

  // Make validation function available globally for the Applications page
  useEffect(() => {
    if (window) {
      window.documentHelpers = {
        validateDocuments: () => {
          return completionStatus.allUploaded;
        },
        getCompletionStatus: () => completionStatus
      };
    }
  }, [completionStatus]);

  if (!applicationId) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Info className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No application found. Please start a new application.</p>
        </CardContent>
      </Card>
    );
  }

  const uploadedTypes = documents.map(doc => doc.document_type);
  const approvedTypes = documents.filter(doc => doc.status === 'approved').map(doc => doc.document_type);
  const pendingTypes = documents.filter(doc => doc.status === 'pending').map(doc => doc.document_type);
  const rejectedTypes = documents.filter(doc => doc.status === 'rejected').map(doc => doc.document_type);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Submission</CardTitle>
          <p className="text-gray-600">
            Upload all required documents for your business permit application. 
            All documents must be approved before final submission.
          </p>
        </CardHeader>
      </Card>

      {/* Status Alert */}
      {!completionStatus.allUploaded && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You still need to upload {completionStatus.missingDocuments.length} required document(s).
            Please upload all required documents to proceed.
          </AlertDescription>
        </Alert>
      )}

      {completionStatus.allUploaded && !completionStatus.allApproved && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            All documents have been uploaded. They are currently under review by the licensing office.
            You will be notified once the review is complete.
          </AlertDescription>
        </Alert>
      )}

      {completionStatus.allApproved && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            All required documents have been approved! You can now proceed with your application.
          </AlertDescription>
        </Alert>
      )}

      {/* Enhanced Document Requirements with Inline Upload and Document Display */}
      <DocumentRequirements
        uploadedDocuments={uploadedTypes}
        approvedDocuments={approvedTypes}
        pendingDocuments={pendingTypes}
        rejectedDocuments={rejectedTypes}
        applicationId={applicationId}
        onUploadComplete={handleUploadComplete}
        documents={documents}
      />
    </div>
  );
};

export default DocumentSubmissionSection;
