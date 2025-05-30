
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Clock, AlertCircle, Upload, Loader2, FileText, X } from 'lucide-react';
import { REQUIRED_DOCUMENTS, documentService } from '@/services/documentService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DocumentRequirementsProps {
  uploadedDocuments: string[];
  approvedDocuments: string[];
  pendingDocuments: string[];
  rejectedDocuments: string[];
  applicationId?: string;
  onUploadComplete?: () => void;
}

const DocumentRequirements: React.FC<DocumentRequirementsProps> = ({
  uploadedDocuments,
  approvedDocuments,
  pendingDocuments,
  rejectedDocuments,
  applicationId,
  onUploadComplete
}) => {
  const [uploadingDocs, setUploadingDocs] = useState<Set<string>>(new Set());
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement>>({});
  const { toast } = useToast();

  const getDocumentStatus = (docType: string) => {
    if (approvedDocuments.includes(docType)) {
      return { status: 'approved', icon: CheckCircle, color: 'text-green-500', badge: 'bg-green-500' };
    } else if (rejectedDocuments.includes(docType)) {
      return { status: 'rejected', icon: XCircle, color: 'text-red-500', badge: 'bg-red-500' };
    } else if (pendingDocuments.includes(docType)) {
      return { status: 'pending', icon: Clock, color: 'text-yellow-500', badge: 'bg-yellow-500' };
    } else if (uploadedDocuments.includes(docType)) {
      return { status: 'uploaded', icon: Clock, color: 'text-blue-500', badge: 'bg-blue-500' };
    } else {
      return { status: 'missing', icon: AlertCircle, color: 'text-gray-400', badge: 'bg-gray-400' };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'pending': return 'Pending Review';
      case 'uploaded': return 'Uploaded';
      case 'missing': return 'Not Uploaded';
      default: return 'Unknown';
    }
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
          {REQUIRED_DOCUMENTS.map((docType, index) => {
            const docStatus = getDocumentStatus(docType);
            const StatusIcon = docStatus.icon;
            const isUploading = uploadingDocs.has(docType);
            const selectedFile = selectedFiles[docType];
            
            return (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-start flex-1">
                    <StatusIcon className={`h-5 w-5 mt-0.5 mr-3 ${docStatus.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{docType}</p>
                    </div>
                  </div>
                  <Badge className={docStatus.badge}>
                    {getStatusText(docStatus.status)}
                  </Badge>
                </div>

                {/* File upload section for missing documents */}
                {docStatus.status === 'missing' && applicationId && (
                  <div className="ml-8 space-y-3 bg-gray-50 p-3 rounded-md">
                    <div className="space-y-2">
                      <Input
                        ref={(el) => {
                          if (el) fileInputRefs.current[docType] = el;
                        }}
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => handleFileSelect(docType, e)}
                        className="text-sm"
                        disabled={isUploading}
                      />
                      
                      {selectedFile && (
                        <div className="flex items-center justify-between p-2 bg-white rounded-md border">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm">{selectedFile.name}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => clearFile(docType)}
                            className="h-6 w-6 p-0"
                            disabled={isUploading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600">
                        Accepted: JPG, PNG, PDF (max 10MB)
                      </p>
                      
                      <Button
                        onClick={() => handleUpload(docType)}
                        disabled={!selectedFile || isUploading}
                        size="sm"
                        className="ml-2"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-3 w-3" />
                            Upload
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-green-600">{approvedDocuments.length}</div>
              <div className="text-gray-600">Approved</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-yellow-600">{pendingDocuments.length}</div>
              <div className="text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-600">{rejectedDocuments.length}</div>
              <div className="text-gray-600">Rejected</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-600">
                {REQUIRED_DOCUMENTS.length - uploadedDocuments.length}
              </div>
              <div className="text-gray-600">Missing</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentRequirements;
