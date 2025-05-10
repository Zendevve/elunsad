import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import FormSectionWrapper from "@/components/application/FormSectionWrapper";
import { useApplication } from "@/contexts/ApplicationContext";
import { ownerInformationService } from "@/services/application";
import { useDebounce } from "@/hooks/useDebounce";

// Define a helper window interface to extend the existing window object
interface HelperWindow extends Window {
  ownerInfoHelpers?: {
    validateAndSave: () => Promise<boolean>;
  };
}

// Declare the window object with the extended interface
declare const window: HelperWindow;

const OwnerInformationSection = () => {
  const { toast } = useToast();
  const { applicationId } = useApplication();
  const [ownerInfo, setOwnerInfo] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const debounce = useDebounce();

  // Fetch owner information on component mount
  useEffect(() => {
    const fetchOwnerInfo = async () => {
      if (applicationId) {
        setIsLoading(true);
        try {
          const data = await ownerInformationService.getOwnerInformation(applicationId);
          setOwnerInfo(data || {});
        } catch (error) {
          console.error("Error fetching owner information:", error);
          toast("Failed to load owner information", {
            description: "There was a problem loading the owner information. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchOwnerInfo();
  }, [applicationId, toast]);

  // Function to handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOwnerInfo(prevInfo => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Function to handle saving the owner information
  const saveOwnerInfo = useCallback(async () => {
    if (!applicationId) {
      toast({
        title: "Application Error",
        description: "Could not find application to save. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await ownerInformationService.updateOwnerInformation(applicationId, ownerInfo);
      toast({
        title: "Owner Information Saved",
        description: "Your owner information has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving owner information:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving owner information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [applicationId, ownerInfo, toast]);

  // Debounced save effect
  useEffect(() => {
    if (!isLoading) {
      debounce(saveOwnerInfo, 500);
    }
  }, [ownerInfo, isLoading, saveOwnerInfo, debounce]);

  // Expose validateAndSave function to the window
  useEffect(() => {
    if (!window.ownerInfoHelpers) {
      window.ownerInfoHelpers = {};
    }

    window.ownerInfoHelpers.validateAndSave = async () => {
      // Validate required fields
      const requiredFields = [
        'surname', 'given_name', 'age', 'sex',
        'civil_status', 'nationality', 'owner_street',
        'owner_barangay', 'owner_city_municipality',
        'owner_province', 'owner_zip_code'
      ];

      const missingFields = requiredFields.filter(field => !ownerInfo[field]);

      if (missingFields.length > 0) {
        toast({
          title: "Incomplete Information",
          description: "Please complete all required owner information fields before proceeding.",
          variant: "destructive",
        });
        return false;
      }

      // Save the information if validation passes
      await saveOwnerInfo();
      return true;
    };

    return () => {
      if (window.ownerInfoHelpers) {
        delete window.ownerInfoHelpers.validateAndSave;
      }
    };
  }, [ownerInfo, saveOwnerInfo, toast]);

  return (
    <FormSectionWrapper
      title="Owner Information"
      description="Provide details about the business owner"
      stepNumber={3}
    >
      <Card className="shadow-md border border-gray-200/80">
        <CardHeader className="py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
          <CardTitle className="text-lg font-medium">Owner Details</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              Loading owner information...
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="surname">Surname</Label>
                  <Input
                    type="text"
                    id="surname"
                    name="surname"
                    value={ownerInfo.surname || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="given_name">Given Name</Label>
                  <Input
                    type="text"
                    id="given_name"
                    name="given_name"
                    value={ownerInfo.given_name || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="middle_name">Middle Name</Label>
                  <Input
                    type="text"
                    id="middle_name"
                    name="middle_name"
                    value={ownerInfo.middle_name || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    type="number"
                    id="age"
                    name="age"
                    value={ownerInfo.age || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="sex">Sex</Label>
                  <Select onValueChange={(value) => handleInputChange({ target: { name: 'sex', value } } as any)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select sex" defaultValue={ownerInfo.sex || ""}/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="civil_status">Civil Status</Label>
                  <Select onValueChange={(value) => handleInputChange({ target: { name: 'civil_status', value } } as any)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" defaultValue={ownerInfo.civil_status || ""}/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    type="text"
                    id="nationality"
                    name="nationality"
                    value={ownerInfo.nationality || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="owner_street">Street</Label>
                  <Input
                    type="text"
                    id="owner_street"
                    name="owner_street"
                    value={ownerInfo.owner_street || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="owner_barangay">Barangay</Label>
                  <Input
                    type="text"
                    id="owner_barangay"
                    name="owner_barangay"
                    value={ownerInfo.owner_barangay || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="owner_city_municipality">City/Municipality</Label>
                  <Input
                    type="text"
                    id="owner_city_municipality"
                    name="owner_city_municipality"
                    value={ownerInfo.owner_city_municipality || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="owner_province">Province</Label>
                  <Input
                    type="text"
                    id="owner_province"
                    name="owner_province"
                    value={ownerInfo.owner_province || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="owner_zip_code">Zip Code</Label>
                  <Input
                    type="text"
                    id="owner_zip_code"
                    name="owner_zip_code"
                    value={ownerInfo.owner_zip_code || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="owner_address_remarks">Address Remarks (Optional)</Label>
                <Textarea
                  id="owner_address_remarks"
                  name="owner_address_remarks"
                  placeholder="e.g., Unit number, Building name"
                  value={ownerInfo.owner_address_remarks || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </FormSectionWrapper>
  );
};

export default OwnerInformationSection;
