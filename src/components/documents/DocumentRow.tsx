
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, AlertCircle, FileText, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentData } from '@/services/documentService';
import DocumentUploadSection from './DocumentUploadSection';

interface DocumentRowProps {
  docType: string;
  uploadedDocuments: string[];
  approvedDocuments: string[];
  pendingDocuments: string[];
  rejectedDocuments: string[];
  uploadedDoc?: DocumentData;
  applicationId?: string;
  onUploadComplete?: () => void;
  uploadingDocs: Set<string>;
  selectedFiles: Record<string, File>;
  onFileSelect: (docType: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: (docType: string) => void;
  onClearFile: (docType: string) => void;
  fileInputRefs: React.MutableRefObject<Record<string, HTMLInputElement>>;
}

const DocumentRow: React.FC<DocumentRowProps> = ({
  docType,
  uploadedDocuments,
  approvedDocuments,
  pendingDocuments,
  rejectedDocuments,
  uploadedDoc,
  applicationId,
  onUploadComplete,
  uploadingDocs,
  selectedFiles,
  onFileSelect,
  onUpload,
  onClearFile,
  fileInputRefs
}) => {
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

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewDocument = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  const handleDownloadDocument = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const docStatus = getDocumentStatus(docType);
  const StatusIcon = docStatus.icon;
  const isUploading = uploadingDocs.has(docType);
  const selectedFile = selectedFiles[docType];

  return (
    <div className="border rounded-lg p-4 space-y-3">
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

      {/* Show uploaded document details */}
      {uploadedDoc && (
        <div className="ml-8 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">{uploadedDoc.document_name}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  {uploadedDoc.file_size && (
                    <span>{formatFileSize(uploadedDoc.file_size)}</span>
                  )}
                  {uploadedDoc.uploaded_at && (
                    <>
                      <span>•</span>
                      <span>Uploaded: {formatDate(uploadedDoc.uploaded_at)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {uploadedDoc.file_url && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDocument(uploadedDoc.file_url!)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadDocument(uploadedDoc.file_url!, uploadedDoc.document_name)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {/* Show admin feedback for rejected documents */}
          {uploadedDoc.status === 'rejected' && uploadedDoc.admin_feedback && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              <strong>Admin Feedback:</strong> {uploadedDoc.admin_feedback}
            </div>
          )}
        </div>
      )}

      {/* File upload section for missing documents or rejected documents that need re-upload */}
      {(docStatus.status === 'missing' || (docStatus.status === 'rejected' && uploadedDoc)) && applicationId && (
        <DocumentUploadSection
          docType={docType}
          docStatus={docStatus}
          isUploading={isUploading}
          selectedFile={selectedFile}
          onFileSelect={onFileSelect}
          onUpload={onUpload}
          onClearFile={onClearFile}
          fileInputRefs={fileInputRefs}
        />
      )}
    </div>
  );
};

export default DocumentRow;
