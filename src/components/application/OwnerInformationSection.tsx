
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useApplication } from "@/contexts/ApplicationContext";
import { ownerInformationService } from "@/services/application";
import { useToast } from "@/components/ui/use-toast";
import FormSectionWrapper from "./FormSectionWrapper";

const OwnerInformationSection = () => {
  const { applicationId, isLoading, setIsLoading } = useApplication();
  const { toast } = useToast();
  
  // Owner information state
  const [ownerName, setOwnerName] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerNationality, setOwnerNationality] = useState("");
  const [ownerType, setOwnerType] = useState("individual"); // individual, partnership, corporation

  useEffect(() => {
    const loadOwnerInformation = async () => {
      if (!applicationId) return;
      
      try {
        const data = await ownerInformationService.getOwnerInformation(applicationId);
        
        if (data) {
          setOwnerName(data.owner_name || "");
          setOwnerAddress(data.owner_address || "");
          setOwnerPhone(data.owner_phone || "");
          setOwnerEmail(data.owner_email || "");
          setOwnerNationality(data.owner_nationality || "");
          setOwnerType(data.owner_type || "individual");
        }
      } catch (error) {
        console.error("Error loading owner information:", error);
      }
    };
    
    loadOwnerInformation();
  }, [applicationId]);

  const handleSaveOwnerInformation = async () => {
    if (!applicationId) return;
    
    try {
      setIsLoading(true);
      
      const ownerData = {
        application_id: applicationId,
        owner_name: ownerName,
        owner_address: ownerAddress,
        owner_phone: ownerPhone,
        owner_email: ownerEmail,
        owner_nationality: ownerNationality,
        owner_type: ownerType
      };
      
      await ownerInformationService.saveOwnerInformation(ownerData);
      
      toast({
        title: "Owner Information Saved",
        description: "Your owner information has been saved successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving owner information:", error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your owner information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Input change handlers
  const handleOwnerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOwnerName(e.target.value);
  };

  const handleOwnerAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOwnerAddress(e.target.value);
  };

  const handleOwnerPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOwnerPhone(e.target.value);
  };

  const handleOwnerEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOwnerEmail(e.target.value);
  };

  const handleOwnerNationalityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOwnerNationality(e.target.value);
  };

  const handleOwnerTypeChange = (value: string) => {
    setOwnerType(value);
  };

  // Update values and save on input blur
  const handleInputBlur = () => {
    handleSaveOwnerInformation();
  };

  return (
    <FormSectionWrapper
      title="Owner Information"
      description="Provide details about the business owner"
      stepNumber={3}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="ownerType">Type of Ownership</Label>
            <Select 
              value={ownerType} 
              onValueChange={handleOwnerTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select ownership type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual / Sole Proprietorship</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="corporation">Corporation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="ownerName">Owner Name / Business Name</Label>
            <Input 
              id="ownerName" 
              placeholder="Enter full name" 
              value={ownerName}
              onChange={handleOwnerNameChange}
              onBlur={handleInputBlur}
            />
          </div>

          <div>
            <Label htmlFor="ownerAddress">Owner Address</Label>
            <Input 
              id="ownerAddress" 
              placeholder="Enter complete address" 
              value={ownerAddress}
              onChange={handleOwnerAddressChange}
              onBlur={handleInputBlur}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="ownerNationality">Nationality</Label>
            <Input 
              id="ownerNationality" 
              placeholder="Enter nationality" 
              value={ownerNationality}
              onChange={handleOwnerNationalityChange}
              onBlur={handleInputBlur}
            />
          </div>

          <div>
            <Label htmlFor="ownerPhone">Contact Number</Label>
            <Input 
              id="ownerPhone" 
              type="tel" 
              placeholder="Enter contact number" 
              value={ownerPhone}
              onChange={handleOwnerPhoneChange}
              onBlur={handleInputBlur}
            />
          </div>

          <div>
            <Label htmlFor="ownerEmail">Email Address</Label>
            <Input 
              id="ownerEmail" 
              type="email" 
              placeholder="Enter email address" 
              value={ownerEmail}
              onChange={handleOwnerEmailChange}
              onBlur={handleInputBlur}
            />
          </div>
        </div>
      </div>
    </FormSectionWrapper>
  );
};

export default OwnerInformationSection;
