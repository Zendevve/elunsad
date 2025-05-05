// Update imports to use the proper service
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ownerInformationService } from "@/services/application";
import { useToast } from "@/components/ui/use-toast";
import { useApplication } from "@/contexts/ApplicationContext";
import FormSectionWrapper from "./FormSectionWrapper";

interface OwnerInformation {
  application_id: string;
  owner_name: string;
  owner_address: string;
  gender: string;
  civil_status: string;
  tin: string;
}

const OwnerInformationSection = () => {
  const { applicationId } = useApplication();
  const { toast } = useToast();
  const [ownerInformation, setOwnerInformation] = useState<OwnerInformation>({
    application_id: applicationId || "",
    owner_name: "",
    owner_address: "",
    gender: "",
    civil_status: "",
    tin: "",
  });
  
  const { data, updateData, saveData, isLoading, isInitialized } = useEntityData<OwnerInformation>(
    ownerInformationService.getOwnerInformation,
    ownerInformationService.saveOwnerInformation,
    applicationId,
    ownerInformation,
    () => {
      toast({
        title: "Owner Information Saved",
        description: "Your owner information has been saved successfully.",
      });
    }
  );

  useEffect(() => {
    if (data && isInitialized) {
      setOwnerInformation(data);
    }
  }, [data, isInitialized]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  const handleRadioChange = (name: string, value: string) => {
    updateData({ [name]: value });
  };

  return (
    <FormSectionWrapper
      title="Owner Information"
      description="Enter information about the business owner"
      stepNumber={3}
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="owner_name">Owner's Full Name</Label>
            <Input
              type="text"
              id="owner_name"
              name="owner_name"
              value={ownerInformation.owner_name || ""}
              onChange={handleInputChange}
              placeholder="Enter owner's full name"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="owner_address">Owner's Address</Label>
            <Input
              type="text"
              id="owner_address"
              name="owner_address"
              value={ownerInformation.owner_address || ""}
              onChange={handleInputChange}
              placeholder="Enter owner's address"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Gender</Label>
            <RadioGroup defaultValue={ownerInformation.gender} onValueChange={(value) => handleRadioChange("gender", value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" className="peer h-4 w-4 border border-gray-300 text-primary shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                <Label htmlFor="male" className="cursor-pointer peer-checked:font-semibold">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" className="peer h-4 w-4 border border-gray-300 text-primary shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                <Label htmlFor="female" className="cursor-pointer peer-checked:font-semibold">Female</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="civil_status">Civil Status</Label>
            <Select value={ownerInformation.civil_status} onValueChange={(value) => handleRadioChange("civil_status", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select civil status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="tin">Tax Identification Number (TIN)</Label>
          <Input
            type="text"
            id="tin"
            name="tin"
            value={ownerInformation.tin || ""}
            onChange={handleInputChange}
            placeholder="Enter TIN"
            disabled={isLoading}
          />
        </div>
      </div>
    </FormSectionWrapper>
  );
};

export default OwnerInformationSection;
