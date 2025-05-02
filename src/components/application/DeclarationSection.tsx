
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { useApplication } from "@/contexts/ApplicationContext";
import { applicationService } from "@/services/applicationService";
import { useToast } from "@/components/ui/use-toast";

interface DeclarationSectionProps {
  onAgreementChange?: (isAgreed: boolean) => void;
}

const DeclarationSection = ({ onAgreementChange }: DeclarationSectionProps) => {
  const { applicationId, isLoading, setIsLoading } = useApplication();
  const { toast } = useToast();
  
  const [isAgreed, setIsAgreed] = useState(false);
  const [signature, setSignature] = useState("");
  const [designation, setDesignation] = useState("");
  
  // Load saved data when component mounts
  useEffect(() => {
    const loadDeclaration = async () => {
      if (!applicationId) return;
      
      try {
        const data = await applicationService.getDeclaration(applicationId);
        if (data) {
          // Populate form fields with saved data
          setIsAgreed(data.is_agreed || false);
          setSignature(data.signature || "");
          setDesignation(data.designation || "");
          
          // Update parent component with agreement state
          if (onAgreementChange) {
            onAgreementChange(data.is_agreed || false);
          }
        }
      } catch (error) {
        console.error("Error loading declaration:", error);
      }
    };
    
    loadDeclaration();
  }, [applicationId, onAgreementChange]);
  
  // Save data function
  const saveDeclaration = async () => {
    if (!applicationId) return;
    if (!signature && isAgreed) return; // Don't save if agreeing without signature
    
    try {
      setIsLoading(true);
      
      await applicationService.saveDeclaration({
        application_id: applicationId,
        is_agreed: isAgreed,
        signature,
        designation
      });
      
      toast({
        title: "Declaration Saved",
        description: "Your declaration has been saved successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving declaration:", error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your declaration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAgreementChange = (checked: boolean) => {
    setIsAgreed(checked);
    
    // Send agreement state up to parent component
    if (onAgreementChange) {
      onAgreementChange(checked);
    }
    
    // Auto-save when agreement changes
    if (signature) {
      const saveTimeout = setTimeout(() => {
        saveDeclaration();
      }, 500);
      
      return () => clearTimeout(saveTimeout);
    }
  };
  
  // Auto-save when important fields change
  useEffect(() => {
    // Only save if signature is provided
    if (applicationId && signature) {
      const saveTimeout = setTimeout(() => {
        saveDeclaration();
      }, 1500);
      
      return () => clearTimeout(saveTimeout);
    }
  }, [signature, designation]);
  
  return (
    <Card className="mt-6 border shadow-sm">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b pb-4">
        <CardTitle className="text-lg font-medium">Declaration and Signature</CardTitle>
        <CardDescription>
          Review your application and sign the declaration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="p-5 bg-gray-50 rounded-md border border-gray-200 text-sm leading-relaxed">
          <p>
            I DECLARE UNDER PENALTY OF PERJURY that all information in this application is true and correct based on my personal knowledge and authentic records submitted to the City of Lucena. 
            Any false or misleading information supplied or production of falsified documents shall be grounds for appropriate legal action against me and automatically revoke the permit.
          </p>
          <p className="mt-3">
            I hereby agree that all personal data (as defined under the Data Privacy Law of 2012 and its Implementing Rules and Regulations) and account transaction information or records with the 
            city/municipal government may be processed, profiled, or shared with requesting parties or for the purpose of any court, legal process, examination, inquiry, audit, or investigation of any 
            authority.
          </p>
        </div>

        <div className="flex items-start space-x-3 p-4 border border-muted rounded-md bg-muted/30">
          <Checkbox 
            id="agreementCheck" 
            checked={isAgreed}
            onCheckedChange={(checked) => handleAgreementChange(checked === true)}
            className="mt-1 h-5 w-5 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <label htmlFor="agreementCheck" className="text-sm cursor-pointer">
            I have read and agree to the declaration above. I understand that submitting false information may result in the rejection of my application or revocation of my business permit.
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <FormField 
            id="signature" 
            label="SIGNATURE OF APPLICANT/ OWNER OVER PRINTED NAME"
            required
            tooltip="Type your full name to sign electronically"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
          />
          
          <FormField 
            id="designation" 
            label="DESIGNATION / POSITION / TITLE"
            tooltip="Enter your position or title in the business"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DeclarationSection;
