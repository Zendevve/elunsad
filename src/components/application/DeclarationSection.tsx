
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SignatureCanvas } from "@/components/ui/signature-canvas";
import { Checkbox } from "@/components/ui/checkbox";
import { useApplication } from "@/contexts/ApplicationContext";
import { declarationService } from "@/services/application";
import { toast } from "@/utils/toastCompat";
import FormSectionWrapper from "./FormSectionWrapper";

const DeclarationSection = ({ onAgreementChange }: { onAgreementChange: (agreed: boolean) => void }) => {
  const [declarationText, setDeclarationText] = useState<string>("I hereby declare that the information provided in this application is true and accurate to the best of my knowledge.");
  const [signature, setSignature] = useState<string | null>(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const signatureCanvasRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { applicationId } = useApplication();

  useEffect(() => {
    const fetchDeclaration = async () => {
      if (applicationId) {
        setIsLoading(true);
        try {
          const declarationData = await declarationService.getDeclaration(applicationId);
          if (declarationData) {
            // Set a default declaration text if none is provided
            setSignature(declarationData.signature || null);
            setIsAgreed(declarationData.is_agreed || false);
          }
        } catch (error) {
          console.error("Failed to fetch declaration:", error);
          toast("Failed to fetch declaration", {
            description: "Could not load your declaration data. Please try again."
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDeclaration();
  }, [applicationId]);

  useEffect(() => {
    if (signatureCanvasRef.current && signature) {
      signatureCanvasRef.current.fromDataURL(signature);
    }
  }, [signature, signatureCanvasRef]);

  useEffect(() => {
    if (onAgreementChange) {
      onAgreementChange(isAgreed);
    }
  }, [isAgreed, onAgreementChange]);

  const handleTextChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setDeclarationText(newText);
    
    if (applicationId) {
      try {
        await declarationService.saveDeclaration({
          application_id: applicationId,
          signature: signature || "",
          is_agreed: isAgreed,
          declaration_place: "City of Lucena"
        });
      } catch (error) {
        console.error("Failed to update declaration text:", error);
        toast("Failed to save", {
          description: "Could not save declaration text. Please try again."
        });
      }
    }
  };

  const handleSignatureSave = async (dataUrl: string | null) => {
    setSignature(dataUrl);
    if (applicationId) {
      try {
        await declarationService.saveDeclaration({
          application_id: applicationId,
          signature: dataUrl || "",
          is_agreed: isAgreed,
          declaration_place: "City of Lucena"
        });
      } catch (error) {
        console.error("Failed to update signature:", error);
        toast("Failed to save signature", {
          description: "Could not save signature. Please try again."
        });
      }
    }
  };

  const handleAgreementChange = async (checked: boolean) => {
    setIsAgreed(checked);
    if (applicationId) {
      try {
        await declarationService.saveDeclaration({
          application_id: applicationId,
          signature: signature || "",
          is_agreed: checked,
          declaration_place: "City of Lucena"
        });
      } catch (error) {
        console.error("Failed to update agreement status:", error);
        toast("Failed to save agreement", {
          description: "Could not save your agreement status. Please try again."
        });
      }
    }
  };

  const handleClearSignature = () => {
    if (signatureCanvasRef.current) {
      signatureCanvasRef.current.clear();
      handleSignatureSave(null);
      setSignature(null);
    }
  };

  // Added a function to validate and save all declaration data
  window.declarationHelpers = {
    validateAndSave: async () => {
      if (!signature) {
        toast("Signature Required", {
          description: "Please sign the declaration before proceeding."
        });
        return false;
      }
      
      if (!isAgreed) {
        toast("Agreement Required", {
          description: "You must agree to the declaration before proceeding."
        });
        return false;
      }
      
      return true;
    }
  };

  return (
    <FormSectionWrapper
      title="Declaration"
      description="Please read and sign the declaration below to confirm the accuracy of the information provided."
      stepNumber={5}
    >
      <Card className="shadow-md border border-gray-200/80">
        <CardHeader className="py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
          <CardTitle className="text-lg font-medium">Declaration Statement</CardTitle>
          <CardDescription>Please read and acknowledge the statement below.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="declaration">Declaration Text</Label>
              <Textarea
                id="declaration"
                value={declarationText}
                onChange={handleTextChange}
                className="resize-none h-40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signature">Signature</Label>
              <SignatureCanvas ref={signatureCanvasRef} onSave={handleSignatureSave} onClear={handleClearSignature} />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={isAgreed} 
                  onCheckedChange={handleAgreementChange}
                />
                <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                  I agree to the terms and conditions
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </FormSectionWrapper>
  );
};

export default DeclarationSection;
