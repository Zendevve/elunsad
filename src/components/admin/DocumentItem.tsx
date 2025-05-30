
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, Download, XCircle } from 'lucide-react';
import { DocumentData } from '@/services/documentService';
import DocumentStatusBadges from './DocumentStatusBadges';
import DocumentReviewActions from './DocumentReviewActions';
import RejectionReasonsSelector from './RejectionReasonsSelector';

interface DocumentItemProps {
  docType: string;
  doc: DocumentData | undefined;
  reviewingDoc: string | null;
  selectedReasons: string[];
  feedback: string;
  isReasonDropdownOpen: boolean;
  onStartReview: (docId: string) => void;
  onApprove: (documentId: string, status: 'approved' | 'rejected') => void;
  onCancel: () => void;
  onReasonToggle: (reason: string) => void;
  onFeedbackChange: (feedback: string) => void;
  onDropdownOpenChange: (open: boolean) => void;
  onRemoveReason: (reason: string) => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({
  docType,
  doc,
  reviewingDoc,
  selectedReasons,
  feedback,
  isReasonDropdownOpen,
  onStartReview,
  onApprove,
  onCancel,
  onReasonToggle,
  onFeedbackChange,
  onDropdownOpenChange,
  onRemoveReason,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium">{docType}</h4>
        {doc ? <DocumentStatusBadges status={doc.status} /> : (
          <Badge variant="outline" className="bg-gray-100">
            <XCircle className="h-3 w-3 mr-1" />
            Not Uploaded
          </Badge>
        )}
      </div>
      
      {doc ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{doc.document_name}</p>
              <div className="flex items-center text-xs text-gray-500 space-x-4 mt-1">
                {doc.file_size && <span>{formatFileSize(doc.file_size)}</span>}
                <span>Uploaded: {new Date(doc.uploaded_at || '').toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {doc.file_url && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(doc.file_url, '_blank')}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = doc.file_url!;
                      link.download = doc.document_name;
                      link.click();
                    }}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {doc.status === 'rejected' && doc.admin_feedback && (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Rejection Reason:</strong> {doc.admin_feedback}
              </AlertDescription>
            </Alert>
          )}
          
          {doc.status === 'pending' && (
            <div className="space-y-3 p-3 bg-gray-50 rounded">
              {reviewingDoc === doc.id ? (
                <div className="space-y-3">
                  <RejectionReasonsSelector
                    selectedReasons={selectedReasons}
                    feedback={feedback}
                    isReasonDropdownOpen={isReasonDropdownOpen}
                    onReasonToggle={onReasonToggle}
                    onFeedbackChange={onFeedbackChange}
                    onDropdownOpenChange={onDropdownOpenChange}
                    onRemoveReason={onRemoveReason}
                  />
                  
                  <DocumentReviewActions
                    documentId={doc.id!}
                    isReviewing={true}
                    feedback={feedback}
                    onStartReview={() => {}}
                    onApprove={(documentId) => onApprove(documentId, 'approved')}
                    onReject={(documentId) => onApprove(documentId, 'rejected')}
                    onCancel={onCancel}
                  />
                </div>
              ) : (
                <DocumentReviewActions
                  documentId={doc.id!}
                  isReviewing={false}
                  feedback={feedback}
                  onStartReview={() => onStartReview(doc.id!)}
                  onApprove={() => {}}
                  onReject={() => {}}
                  onCancel={onCancel}
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500">This document has not been uploaded yet.</p>
      )}
    </div>
  );
};

export default DocumentItem;
