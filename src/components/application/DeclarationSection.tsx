import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SignatureCanvas } from "@/components/ui/signature-canvas";
import { Checkbox } from "@/components/ui/checkbox";
import { useApplication } from "@/contexts/ApplicationContext";
import { declarationService } from "@/services/application";
import FormSectionWrapper from "./FormSectionWrapper";

const DeclarationSection = ({ onAgreementChange }: { onAgreementChange: (agreed: boolean) => void }) => {
  const [declarationText, setDeclarationText] = useState("");
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
            setDeclarationText(declarationData.declaration_text || "");
            setSignature(declarationData.signature || null);
            setIsAgreed(declarationData.is_agreed || false);
          }
        } catch (error) {
          console.error("Failed to fetch declaration:", error);
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
    setDeclarationText(e.target.value);
    if (applicationId) {
      try {
        await declarationService.updateDeclaration(applicationId, { declaration_text: e.target.value });
      } catch (error) {
        console.error("Failed to update declaration text:", error);
      }
    }
  };

  const handleSignatureSave = async (dataUrl: string | null) => {
    setSignature(dataUrl);
    if (applicationId) {
      try {
        await declarationService.updateDeclaration(applicationId, { signature: dataUrl });
      } catch (error) {
        console.error("Failed to update signature:", error);
      }
    }
  };

  const handleAgreementChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreed(e.target.checked);
    if (applicationId) {
      try {
        await declarationService.updateDeclaration(applicationId, { is_agreed: e.target.checked });
      } catch (error) {
        console.error("Failed to update agreement status:", error);
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
                placeholder="I hereby declare that the information provided in this application is true and accurate to the best of my knowledge."
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
              <Checkbox id="terms" checked={isAgreed} onCheckedChange={handleAgreementChange} />
              <Label htmlFor="terms" className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                I agree to the terms and conditions
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </FormSectionWrapper>
  );
};

export default DeclarationSection;
