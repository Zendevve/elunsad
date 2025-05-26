
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { REQUIRED_DOCUMENTS } from '@/services/documentService';

interface DocumentRequirementsProps {
  uploadedDocuments: string[];
  approvedDocuments: string[];
  pendingDocuments: string[];
  rejectedDocuments: string[];
}

const DocumentRequirements: React.FC<DocumentRequirementsProps> = ({
  uploadedDocuments,
  approvedDocuments,
  pendingDocuments,
  rejectedDocuments
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Required Documents Checklist</CardTitle>
        <p className="text-sm text-gray-600">
          All documents must be uploaded and approved before final submission.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {REQUIRED_DOCUMENTS.map((docType, index) => {
            const docStatus = getDocumentStatus(docType);
            const StatusIcon = docStatus.icon;
            
            return (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
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
