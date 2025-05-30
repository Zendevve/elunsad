
import React from 'react';
import { REQUIRED_DOCUMENTS } from '@/services/documentService';

interface DocumentSummaryProps {
  approvedDocuments: string[];
  pendingDocuments: string[];
  rejectedDocuments: string[];
  uploadedDocuments: string[];
}

const DocumentSummary: React.FC<DocumentSummaryProps> = ({
  approvedDocuments,
  pendingDocuments,
  rejectedDocuments,
  uploadedDocuments
}) => {
  return (
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
  );
};

export default DocumentSummary;
