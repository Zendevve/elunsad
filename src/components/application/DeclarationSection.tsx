
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useApplication } from "@/contexts/ApplicationContext";
import { SignatureCanvas } from "./SignatureCanvas";
import { declarationService } from "@/services/application";
import { useToast } from "@/hooks/use-toast";
import FormSectionWrapper from "./FormSectionWrapper";
import { checkSupabaseConnection, logDatabaseError } from "@/utils/supabaseUtils";

interface DeclarationSectionProps {
  onAgreementChange: (agreed: boolean) => void;
}

const DeclarationSection = ({ onAgreementChange }: DeclarationSectionProps) => {
  const { applicationId, isLoading, setIsLoading } = useApplication();
  const { toast } = useToast();
  
  const [signature, setSignature] = useState<string | null>(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const [designation, setDesignation] = useState("");
  const [declarationPlace, setDeclarationPlace] = useState("City of Lucena");
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null);

  // Check Supabase connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await checkSupabaseConnection();
      setConnectionStatus(isConnected);
      
      if (!isConnected) {
        toast({
          title: "Database Connection Issue",
          description: "We're having trouble connecting to the database. Your changes may not be saved.",
          variant: "destructive",
        });
      }
    };
    
    checkConnection();
  }, [toast]);

  useEffect(() => {
    const loadDeclaration = async () => {
      if (!applicationId) return;
      
      try {
        setIsLoading(true);
        console.log("Loading declaration for application ID:", applicationId);
        const data = await declarationService.getDeclaration(applicationId);
        
        if (data) {
          console.log("Declaration data loaded:", data);
          setSignature(data.signature || null);
          setIsAgreed(data.is_agreed || false);
          setDesignation(data.designation || "");
          setDeclarationPlace(data.declaration_place || "City of Lucena");
        } else {
          console.log("No declaration data found for this application");
        }
      } catch (error) {
        console.error("Error loading declaration:", error);
        logDatabaseError("loading declaration", error);
        toast({
          title: "Error Loading Declaration",
          description: "There was a problem loading your declaration. Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDeclaration();
  }, [applicationId, setIsLoading, toast]);

  useEffect(() => {
    onAgreementChange(isAgreed);
  }, [isAgreed, onAgreementChange]);

  const handleSaveSignature = async (newSignature: string) => {
    if (!applicationId) {
      console.error("Cannot save signature: applicationId is null");
      return;
    }
    
    setSignature(newSignature);
    console.log("Saving signature...");
    await saveDeclarationData({ signature: newSignature }, false);
  };

  const handleAgreementChange = async (checked: boolean) => {
    if (!applicationId) {
      console.error("Cannot save agreement: applicationId is null");
      return;
    }
    
    setIsAgreed(checked);
    console.log("Saving agreement state:", checked);
    await saveDeclarationData({ is_agreed: checked }, false);
  };

  const handleDesignationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!applicationId) {
      console.error("Cannot save designation: applicationId is null");
      return;
    }
    
    const newDesignation = e.target.value;
    setDesignation(newDesignation);
    console.log("Designation changed to:", newDesignation);
    await saveDeclarationData({ designation: newDesignation }, false);
  };

  const handleDeclarationPlaceChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!applicationId) {
      console.error("Cannot save declaration place: applicationId is null");
      return;
    }
    
    const newDeclarationPlace = e.target.value;
    setDeclarationPlace(newDeclarationPlace);
    console.log("Declaration place changed to:", newDeclarationPlace);
    await saveDeclarationData({ declaration_place: newDeclarationPlace }, false);
  };

  const saveDeclarationData = async (updatedData: Partial<{
    signature: string | null;
    is_agreed: boolean;
    designation: string;
    declaration_place: string;
  }>, showToast: boolean = false) => {
    if (!applicationId) {
      console.error("Cannot save declaration: applicationId is null");
      return;
    }
    
    try {
      setIsLoading(true);
      console.log("Declaration - Saving with showToast explicitly set to:", showToast);
      
      const declarationData = {
        application_id: applicationId,
        signature: signature || '',
        is_agreed: isAgreed,
        designation: designation || '',
        declaration_place: declarationPlace || 'City of Lucena',
        ...updatedData
      };
      
      console.log("Saving declaration data:", declarationData);
      const result = await declarationService.saveDeclaration(declarationData);
      console.log("Save result:", result);
      
      // ONLY show toast if explicitly requested with showToast=true parameter
      if (showToast === true) {
        console.log("Declaration - Toast will be shown as explicitly requested");
        toast({
          title: "Declaration Saved",
          description: "Your declaration has been saved successfully.",
          variant: "default",
        });
      } else {
        console.log("Declaration - Toast suppressed", { showToast });
      }
    } catch (error) {
      console.error("Error saving declaration:", error);
      logDatabaseError("saving declaration", error, updatedData);
      
      // ONLY show error toast if explicitly requested with showToast=true parameter
      if (showToast === true) {
        toast({
          title: "Save Failed",
          description: "There was an error saving your declaration. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log("Declaration - Error toast suppressed", { showToast });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Add validation and save function for parent component
  useEffect(() => {
    if (!window.declarationHelpers) {
      window.declarationHelpers = {
        validateAndSave: async () => {
          console.log("Declaration - Parent requested validation - performing silent save");
          // Explicitly pass true to ensure save is attempted and any errors are shown
          await saveDeclarationData({}, true);
          
          // Simple validation - signature is required
          const isValid = !!signature;
          console.log("Declaration validation result:", isValid ? "valid" : "invalid");
          return isValid;
        }
      };
    } else {
      window.declarationHelpers.validateAndSave = async () => {
        console.log("Declaration - Parent requested validation - performing silent save");
        // Explicitly pass true to ensure save is attempted and any errors are shown
        await saveDeclarationData({}, true);
        
        // Simple validation - signature is required
        const isValid = !!signature;
        console.log("Declaration validation result:", isValid ? "valid" : "invalid");
        return isValid;
      };
    }
    
    return () => {
      if (window.declarationHelpers) {
        delete window.declarationHelpers.validateAndSave;
      }
    };
  }, [signature, isAgreed, designation, declarationPlace, applicationId]);

  // Component JSX
  return (
    <FormSectionWrapper
      title="Declaration"
      description="Please read the declaration carefully, provide your signature, and agree to the terms."
      stepNumber={5}
    >
      {connectionStatus === false && (
        <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Database Connection Issue</p>
          <p>We're having trouble connecting to our database. Your changes may not be saved.</p>
        </div>
      )}
      
      <div className="space-y-4">
        <p className="text-gray-700">
          I hereby declare that the information provided in this application is true and correct to the best of my knowledge.
          I understand that any false information or misrepresentation may be grounds for rejection of this application or
          revocation of any permit issued.
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
              placeholder="Position/Title" 
              value={designation}
              onChange={handleDesignationChange}
              className="focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div>
            <Input 
              type="text"
              placeholder="Place of Declaration" 
              value={declarationPlace}
              onChange={handleDeclarationPlaceChange}
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
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed"
          >
            I agree to the terms and conditions
          </label>
        </div>
      </div>
    </FormSectionWrapper>
  );
};

export default DeclarationSection;
