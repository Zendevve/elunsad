
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Eye, Download, Clock, CheckCircle, XCircle } from 'lucide-react';
import { DocumentData } from '@/services/documentService';

interface DocumentListProps {
  documents: DocumentData[];
  isLoading?: boolean;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, isLoading }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-500"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleView = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No documents uploaded yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded Documents ({documents.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    <h4 className="font-medium">{doc.document_type}</h4>
                    {getStatusBadge(doc.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{doc.document_name}</p>
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    {doc.file_size && <span>{formatFileSize(doc.file_size)}</span>}
                    <span>Uploaded: {new Date(doc.uploaded_at || '').toLocaleDateString()}</span>
                  </div>
                  {doc.admin_feedback && doc.status === 'rejected' && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                      <p className="text-sm text-red-700">
                        <strong>Feedback:</strong> {doc.admin_feedback}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {doc.file_url && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(doc.file_url!)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(doc.file_url!, doc.document_name)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentList;
