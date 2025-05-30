
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, FileText, X } from 'lucide-react';

interface DocumentUploadSectionProps {
  docType: string;
  docStatus: { status: string };
  isUploading: boolean;
  selectedFile?: File;
  onFileSelect: (docType: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: (docType: string) => void;
  onClearFile: (docType: string) => void;
  fileInputRefs: React.MutableRefObject<Record<string, HTMLInputElement>>;
}

const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
  docType,
  docStatus,
  isUploading,
  selectedFile,
  onFileSelect,
  onUpload,
  onClearFile,
  fileInputRefs
}) => {
  return (
    <div className="ml-8 space-y-3 bg-gray-50 p-3 rounded-md">
      <div className="space-y-2">
        {docStatus.status === 'rejected' && (
          <p className="text-sm text-red-600 font-medium">
            Please upload a new document to replace the rejected one.
          </p>
        )}
        <Input
          ref={(el) => {
            if (el) fileInputRefs.current[docType] = el;
          }}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => onFileSelect(docType, e)}
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
              onClick={() => onClearFile(docType)}
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
          onClick={() => onUpload(docType)}
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
              {docStatus.status === 'rejected' ? 'Re-upload' : 'Upload'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DocumentUploadSection;
