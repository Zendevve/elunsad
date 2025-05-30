
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { documentService, REQUIRED_DOCUMENTS } from '@/services/documentService';
import { supabase } from '@/integrations/supabase/client';

interface DocumentUploadProps {
  applicationId: string;
  onUploadComplete: () => void;
  preSelectedDocumentType?: string;
  onDocumentTypeChange?: (documentType: string) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  applicationId, 
  onUploadComplete, 
  preSelectedDocumentType = '',
  onDocumentTypeChange 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>(preSelectedDocumentType);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Update document type when pre-selected type changes
  useEffect(() => {
    if (preSelectedDocumentType) {
      setDocumentType(preSelectedDocumentType);
      // Auto-focus on file input when document type is pre-selected
      if (fileInputRef.current) {
        setTimeout(() => {
          fileInputRef.current?.focus();
        }, 100);
      }
    }
  }, [preSelectedDocumentType]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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

      setSelectedFile(file);
    }
  };

  const handleDocumentTypeChange = (value: string) => {
    setDocumentType(value);
    if (onDocumentTypeChange) {
      onDocumentTypeChange(value);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType) {
      toast({
        title: "Missing information",
        description: "Please select a file and document type.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Upload file to storage
      const fileUrl = await documentService.uploadFile(selectedFile, applicationId, user.id);

      // Create document record
      await documentService.createDocument({
        application_id: applicationId,
        document_type: documentType,
        document_name: selectedFile.name,
        file_url: fileUrl,
        file_size: selectedFile.size,
        file_type: selectedFile.type,
        status: 'pending'
      });

      toast({
        title: "Document uploaded",
        description: `${documentType} has been uploaded successfully.`,
      });

      // Reset form
      setSelectedFile(null);
      setDocumentType('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (onDocumentTypeChange) {
        onDocumentTypeChange('');
      }

      onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearSelection = () => {
    setDocumentType('');
    if (onDocumentTypeChange) {
      onDocumentTypeChange('');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Upload className="mr-2 h-5 w-5" />
            Upload Document
          </div>
          {preSelectedDocumentType && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearSelection}
              className="text-xs"
            >
              Clear Selection
            </Button>
          )}
        </CardTitle>
        {preSelectedDocumentType && (
          <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
            Ready to upload: {preSelectedDocumentType}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="document-type">Document Type</Label>
          <Select value={documentType} onValueChange={handleDocumentTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {REQUIRED_DOCUMENTS.map((doc) => (
                <SelectItem key={doc} value={doc}>
                  {doc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="file-input">File</Label>
          <Input
            ref={fileInputRef}
            id="file-input"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileSelect}
            className="mt-1"
          />
          {selectedFile && (
            <div className="mt-2 flex items-center justify-between p-2 bg-gray-50 rounded-md">
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
                onClick={clearFile}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600">
          Accepted formats: JPG, PNG, PDF (max 10MB)
        </p>

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !documentType || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
