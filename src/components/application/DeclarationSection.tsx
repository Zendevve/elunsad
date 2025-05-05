import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useApplication } from "@/contexts/ApplicationContext";
import { SignatureCanvas } from "./SignatureCanvas";
import { declarationService } from "@/services/application";
import { useToast } from "@/components/ui/use-toast";
import FormSectionWrapper from "./FormSectionWrapper";

interface DeclarationSectionProps {
  onAgreementChange: (agreed: boolean) => void;
}

const DeclarationSection: React.FC<DeclarationSectionProps> = ({ onAgreementChange }) => {
  const { applicationId, isLoading, setIsLoading } = useApplication();
  const { toast } = useToast();
  const [signature, setSignature] = useState<string | null>(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    const loadDeclaration = async () => {
      if (!applicationId) return;
      
      try {
        const data = await declarationService.getDeclaration(applicationId);
        if (data) {
          setSignature(data.signature || null);
          setIsAgreed(data.is_agreed || false);
          setName(data.name || "");
          setTitle(data.title || "");
        }
      } catch (error) {
        console.error("Error loading declaration:", error);
      }
    };
    
    loadDeclaration();
  }, [applicationId]);

  useEffect(() => {
    onAgreementChange(isAgreed);
  }, [isAgreed, onAgreementChange]);

  const handleSaveSignature = async (newSignature: string | null) => {
    setSignature(newSignature);
    await saveDeclarationData({ signature: newSignature });
  };

  const handleAgreementChange = async (checked: boolean) => {
    setIsAgreed(checked);
    await saveDeclarationData({ is_agreed: checked });
  };

  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    await saveDeclarationData({ name: newName });
  };

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    await saveDeclarationData({ title: newTitle });
  };

  const saveDeclarationData = async (updatedData: Partial<any>) => {
    if (!applicationId) return;
    
    try {
      setIsLoading(true);
      
      const declarationData = {
        application_id: applicationId,
        signature: signature || null,
        is_agreed: isAgreed || false,
        name: name || "",
        title: title || "",
        ...updatedData,
      };
      
      await declarationService.saveDeclaration(declarationData);
      
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

  return (
    <FormSectionWrapper
      title="Declaration"
      description="Please read the declaration carefully, provide your signature, and agree to the terms."
      stepNumber={5}
    >
      <div className="space-y-4">
        <p className="text-gray-700">
          I hereby declare that the information provided in this application is true and correct to the best of my knowledge. I understand that any false information or misrepresentation may be grounds for rejection of this application or revocation of any permit issued.
        </p>

        <div className="border rounded-md p-4">
          <SignatureCanvas 
            onSave={handleSaveSignature} 
            initialSignature={signature} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input 
              type="text" 
              placeholder="Full Name" 
              value={name}
              onChange={handleNameChange}
              className="focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <Input 
              type="text" 
              placeholder="Title/Position" 
              value={title}
              onChange={handleTitleChange}
              className="focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={isAgreed}
            onCheckedChange={handleAgreementChange}
          />
          <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
            I agree to the terms and conditions
          </label>
        </div>
      </div>
    </FormSectionWrapper>
  );
};

export default DeclarationSection;
