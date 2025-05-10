import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Upload, Save, FileImage } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SignatureUploadProps {
  onSave: (signatureUrl: string) => void;
  initialSignatureUrl?: string | null;
  applicationId: string;
}

export const SignatureUpload = ({ onSave, initialSignatureUrl, applicationId }: SignatureUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialSignatureUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;
    
    // Validate file type (only accept images)
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      toast('Invalid file type', {
        description: "Please upload an image file (JPG, JPEG, or PNG)"
      });
      return;
    }
    
    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (selectedFile.size > maxSize) {
      toast('File too large', {
        description: "Signature image must be less than 2MB"
      });
      return;
    }
    
    // Create a preview URL and set the file
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    setFile(selectedFile);
  };
  
  // Upload the signature file to Supabase Storage
  const handleUploadSignature = async () => {
    if (!file || !applicationId) return;
    
    try {
      setIsUploading(true);
      
      // Create a unique filename for the signature
      const fileExt = file.name.split('.').pop();
      const fileName = `${applicationId}_${Date.now()}.${fileExt}`;
      const filePath = `${applicationId}/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('signatures')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        console.error("Error uploading signature:", error);
        toast('Upload Failed', {
          description: "There was an error uploading your signature. Please try again."
        });
        setIsUploading(false);
        return;
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('signatures')
        .getPublicUrl(filePath);
      
      console.log("Signature uploaded successfully:", publicUrl);
      
      // Save the signature URL
      onSave(publicUrl);
      
      toast('Signature Saved', {
        description: "Your signature has been uploaded successfully"
      });
    } catch (error) {
      console.error("Error in signature upload process:", error);
      toast('Upload Failed', {
        description: "An unexpected error occurred. Please try again."
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Trigger file input click
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  
  // Clear the selected file
  const handleClearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    // If there was a previous signature, notify parent component
    if (initialSignatureUrl) {
      onSave('');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="border-2 border-gray-200 rounded-md p-4">
        <div className="flex flex-col items-center justify-center">
          {previewUrl ? (
            // Preview of the signature
            <div className="w-full mb-4">
              <div className="bg-gray-50 text-center text-xs uppercase tracking-wider text-gray-500 py-1 mb-2">
                <FileImage className="inline-block h-3 w-3 mr-1" /> Your Signature
              </div>
              <div className="flex justify-center p-2 border bg-white">
                <img 
                  src={previewUrl} 
                  alt="Signature" 
                  className="max-h-[200px] max-w-full object-contain"
                />
              </div>
            </div>
          ) : (
            // Upload area when no signature is selected
            <div 
              className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center w-full h-[200px] bg-gray-50 cursor-pointer"
              onClick={handleBrowseClick}
            >
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-1">Click to upload your signature</p>
              <p className="text-xs text-gray-400">PNG, JPG, JPEG (max 2MB)</p>
            </div>
          )}
          
          {/* Hidden file input */}
          <input 
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
          />
          
          {/* Action buttons */}
          <div className="flex justify-center gap-2 mt-4">
            {previewUrl ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleClearFile}
                  className="space-x-1"
                  type="button"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Remove</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleBrowseClick}
                  className="space-x-1"
                  type="button"
                >
                  <Upload className="h-4 w-4" />
                  <span>Change</span>
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          variant="default" 
          size="sm"
          onClick={handleUploadSignature}
          disabled={!file || isUploading}
          className="space-x-1"
          type="button"
        >
          <Save className="h-4 w-4" />
          <span>{isUploading ? "Uploading..." : "Save Signature"}</span>
        </Button>
      </div>
    </div>
  );
};
