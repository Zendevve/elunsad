import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  FileText, Eye, Download, CheckCircle, XCircle, Clock, 
  ThumbsUp, ThumbsDown, MessageCircle, ChevronDown, X 
} from 'lucide-react';
import { documentService, DocumentData, REQUIRED_DOCUMENTS } from '@/services/documentService';
import { useToast } from '@/hooks/use-toast';
import { COMMON_REJECTION_REASONS, formatSelectedReasons } from '@/utils/rejectionReasons';

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-500"><Clock className="h-3 w-3 mr-1" /> Pending Review</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{docType}</h4>
                    {doc ? getStatusBadge(doc.status) : (
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
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Select rejection reasons (select multiple if applicable):
                                </label>
                                
                                <Popover open={isReasonDropdownOpen} onOpenChange={setIsReasonDropdownOpen}>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      aria-expanded={isReasonDropdownOpen}
                                      className="w-full justify-between"
                                    >
                                      {selectedReasons.length === 0 
                                        ? "Select rejection reasons..."
                                        : `${selectedReasons.length} reason${selectedReasons.length > 1 ? 's' : ''} selected`
                                      }
                                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-full p-0" align="start">
                                    <Command>
                                      <CommandInput placeholder="Search rejection reasons..." />
                                      <CommandEmpty>No reasons found.</CommandEmpty>
                                      <CommandList>
                                        <CommandGroup>
                                          {COMMON_REJECTION_REASONS.map((reason) => (
                                            <CommandItem
                                              key={reason}
                                              onSelect={() => handleReasonToggle(reason)}
                                              className="cursor-pointer"
                                            >
                                              <Checkbox
                                                checked={selectedReasons.includes(reason)}
                                                onChange={() => handleReasonToggle(reason)}
                                                className="mr-2"
                                              />
                                              <span className="text-sm">{reason}</span>
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>

                                {selectedReasons.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {selectedReasons.map((reason) => (
                                      <Badge key={reason} variant="secondary" className="text-xs">
                                        {reason.length > 50 ? `${reason.substring(0, 47)}...` : reason}
                                        <button
                                          onClick={() => handleRemoveReason(reason)}
                                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                        >
                                          <X className="h-2 w-2" />
                                        </button>
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Additional feedback or custom reason:
                                </label>
                                <Textarea
                                  placeholder={selectedReasons.includes("Other (specify in the text area below)") 
                                    ? "Please specify the rejection reason..." 
                                    : "Add additional feedback (optional for approval, modify/add reasons for rejection)"}
                                  value={feedback}
                                  onChange={(e) => setFeedback(e.target.value)}
                                  rows={4}
                                />
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleDocumentAction(doc.id!, 'approved')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <ThumbsUp className="h-3 w-3 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDocumentAction(doc.id!, 'rejected')}
                                  disabled={!feedback.trim()}
                                >
                                  <ThumbsDown className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelReview}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setReviewingDoc(doc.id!)}
                            >
                              <MessageCircle className="h-3 w-3 mr-1" />
                              Review Document
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">This document has not been uploaded yet.</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentReview;
