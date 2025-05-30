
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { documentService, DocumentData, REQUIRED_DOCUMENTS } from '@/services/documentService';
import { useToast } from '@/hooks/use-toast';
import { formatSelectedReasons } from '@/utils/rejectionReasons';
import DocumentItem from './DocumentItem';

interface DocumentReviewProps {
  applicationId: string;
}

const DocumentReview: React.FC<DocumentReviewProps> = ({ applicationId }) => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewingDoc, setReviewingDoc] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [isReasonDropdownOpen, setIsReasonDropdownOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDocuments();
  }, [applicationId]);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const docs = await documentService.getApplicationDocuments(applicationId);
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentAction = async (documentId: string, status: 'approved' | 'rejected') => {
    try {
      await documentService.updateDocumentStatus(documentId, status, feedback);
      setReviewingDoc(null);
      setFeedback('');
      setSelectedReasons([]);
      loadDocuments();
      toast({
        title: "Document Updated",
        description: `Document has been ${status}`,
      });
    } catch (error) {
      console.error('Error updating document:', error);
      toast({
        title: "Error",
        description: "Failed to update document status",
        variant: "destructive",
      });
    }
  };

  const handleReasonToggle = (reason: string) => {
    setSelectedReasons(prev => {
      const newReasons = prev.includes(reason)
        ? prev.filter(r => r !== reason)
        : [...prev, reason];
      
      // Update feedback with formatted reasons
      const otherReasons = newReasons.filter(r => r !== "Other (specify in the text area below)");
      const hasOther = newReasons.includes("Other (specify in the text area below)");
      
      if (otherReasons.length > 0) {
        const formattedReasons = formatSelectedReasons(otherReasons);
        if (hasOther) {
          setFeedback(formattedReasons + '\n\n');
        } else {
          setFeedback(formattedReasons);
        }
      } else if (hasOther) {
        setFeedback('');
      } else {
        setFeedback('');
      }
      
      return newReasons;
    });
  };

  const handleRemoveReason = (reason: string) => {
    handleReasonToggle(reason);
  };

  const handleCancelReview = () => {
    setReviewingDoc(null);
    setFeedback('');
    setSelectedReasons([]);
  };

  const getDocumentForType = (type: string) => {
    return documents.find(doc => doc.document_type === type);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Requirements Review</CardTitle>
          <p className="text-sm text-gray-600">
            Review all required documents for this application. Each document must be approved before final application approval.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {REQUIRED_DOCUMENTS.map((docType, index) => {
              const doc = getDocumentForType(docType);
              
              return (
                <DocumentItem
                  key={index}
                  docType={docType}
                  doc={doc}
                  reviewingDoc={reviewingDoc}
                  selectedReasons={selectedReasons}
                  feedback={feedback}
                  isReasonDropdownOpen={isReasonDropdownOpen}
                  onStartReview={setReviewingDoc}
                  onApprove={handleDocumentAction}
                  onCancel={handleCancelReview}
                  onReasonToggle={handleReasonToggle}
                  onFeedbackChange={setFeedback}
                  onDropdownOpenChange={setIsReasonDropdownOpen}
                  onRemoveReason={handleRemoveReason}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentReview;
