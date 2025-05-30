
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';

interface DocumentReviewActionsProps {
  documentId: string;
  isReviewing: boolean;
  feedback: string;
  onStartReview: () => void;
  onApprove: (documentId: string) => void;
  onReject: (documentId: string) => void;
  onCancel: () => void;
}

const DocumentReviewActions: React.FC<DocumentReviewActionsProps> = ({
  documentId,
  isReviewing,
  feedback,
  onStartReview,
  onApprove,
  onReject,
  onCancel,
}) => {
  if (!isReviewing) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={onStartReview}
      >
        <MessageCircle className="h-3 w-3 mr-1" />
        Review Document
      </Button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        size="sm"
        onClick={() => onApprove(documentId)}
        className="bg-green-600 hover:bg-green-700"
      >
        <ThumbsUp className="h-3 w-3 mr-1" />
        Approve
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => onReject(documentId)}
        disabled={!feedback.trim()}
      >
        <ThumbsDown className="h-3 w-3 mr-1" />
        Reject
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </div>
  );
};

export default DocumentReviewActions;
