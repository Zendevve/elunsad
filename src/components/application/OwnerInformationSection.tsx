
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useApplication } from "@/contexts/ApplicationContext";
import { ownerInformationService } from "@/services/application";
import FormSectionWrapper from "./FormSectionWrapper";

const OwnerInformationSection = () => {
  const { toast } = useToast();
  const { applicationId, isLoading, setIsLoading } = useApplication();
  
  // Owner information state
  const [surname, setSurname] = useState("");
  const [givenName, setGivenName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [sex, setSex] = useState<"male" | "female">("male");
  const [civilStatus, setCivilStatus] = useState<"single" | "married" | "widowed" | "divorced" | "separated">("single");
  const [nationality, setNationality] = useState("Filipino");
  
  // Owner address state
  const [ownerStreet, setOwnerStreet] = useState("");
  const [ownerBarangay, setOwnerBarangay] = useState("");
  const [ownerCityMunicipality, setOwnerCityMunicipality] = useState("");
  const [ownerProvince, setOwnerProvince] = useState("");
  const [ownerZipCode, setOwnerZipCode] = useState("");
  const [ownerHouseBldgNo, setOwnerHouseBldgNo] = useState("");
  const [ownerBuildingName, setOwnerBuildingName] = useState("");
  const [ownerBlockNo, setOwnerBlockNo] = useState("");
  const [ownerLotNo, setOwnerLotNo] = useState("");
  const [ownerSubdivision, setOwnerSubdivision] = useState("");
  
  useEffect(() => {
    const loadOwnerInformation = async () => {
      if (!applicationId) return;
      
      try {
        setIsLoading(true);
        const data = await ownerInformationService.getOwnerInformation(applicationId);
        
        if (data) {
          setSurname(data.surname || "");
          setGivenName(data.given_name || "");
          setMiddleName(data.middle_name || "");
          setSuffix(data.suffix || "");
          setAge(data.age || null);
          setSex(data.sex || "male");
          setCivilStatus(data.civil_status || "single");
          setNationality(data.nationality || "Filipino");
          
          setOwnerStreet(data.owner_street || "");
          setOwnerBarangay(data.owner_barangay || "");
          setOwnerCityMunicipality(data.owner_city_municipality || "");
          setOwnerProvince(data.owner_province || "");
          setOwnerZipCode(data.owner_zip_code || "");
          setOwnerHouseBldgNo(data.owner_house_bldg_no || "");
          setOwnerBuildingName(data.owner_building_name || "");
          setOwnerBlockNo(data.owner_block_no || "");
          setOwnerLotNo(data.owner_lot_no || "");
          setOwnerSubdivision(data.owner_subdivision || "");
        }
      } catch (error) {
        console.error("Error loading owner information:", error);
        toast({
          description: "Failed to load owner information. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOwnerInformation();
  }, [applicationId, toast, setIsLoading]);
  
  const validateForm = () => {
    // Required fields check
    if (!surname || !givenName || !age || !sex || !civilStatus || !nationality ||
        !ownerStreet || !ownerBarangay || !ownerCityMunicipality || !ownerProvince || !ownerZipCode) {
      toast({
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const saveOwnerInformation = async (showToast = true) => {
    if (!applicationId) return false;
    
    try {
      setIsLoading(true);
      
      if (!validateForm()) {
        setIsLoading(false);
        return false;
      }
      
      const ownerData = {
        application_id: applicationId,
        surname,
        given_name: givenName,
        middle_name: middleName || undefined,
        suffix: suffix || undefined,
        age: age || 0,
        sex,
        civil_status: civilStatus,
        nationality,
        owner_street: ownerStreet,
        owner_barangay: ownerBarangay,
        owner_city_municipality: ownerCityMunicipality,
        owner_province: ownerProvince,
        owner_zip_code: ownerZipCode,
        owner_house_bldg_no: ownerHouseBldgNo || undefined,
        owner_building_name: ownerBuildingName || undefined,
        owner_block_no: ownerBlockNo || undefined,
        owner_lot_no: ownerLotNo || undefined,
        owner_subdivision: ownerSubdivision || undefined,
      };
      
      await ownerInformationService.saveOwnerInformation(ownerData);
      
      if (showToast) {
        toast({
          description: "Owner information saved successfully.",
        });
      }
      
      return true;
    } catch (error) {
      console.error("Error saving owner information:", error);
      if (showToast) {
        toast({
          description: "Failed to save owner information. Please try again.",
          variant: "destructive",
        });
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Expose validation and save function for parent component
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.ownerInfoHelpers = {
        validateAndSave: async () => {
          const result = await saveOwnerInformation(false);
          return result;
        }
      };
      
      return () => {
        // Cleanup when component unmounts
        if (window.ownerInfoHelpers) {
          delete window.ownerInfoHelpers.validateAndSave;
        }
      };
    }
  }, [
    surname, givenName, middleName, suffix, age, sex, civilStatus, nationality,
    ownerStreet, ownerBarangay, ownerCityMunicipality, ownerProvince, ownerZipCode,
    ownerHouseBldgNo, ownerBuildingName, ownerBlockNo, ownerLotNo, ownerSubdivision
  ]);
  
  const handleInputBlur = () => {
    // Auto-save on blur without showing toast
    saveOwnerInformation(false);
  };
  
  return (
    <FormSectionWrapper
      title="Owner Information"
      description="Provide information about the business owner"
      stepNumber={3}
    >
      <div className="space-y-6">
        {/* Owner's Name Section */}
        <div>
          <h3 className="text-md font-medium mb-4">Name of Owner / President / Officer-in-Charge</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="surname">Surname</Label>
              <Input
                id="surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                onBlur={handleInputBlur}
                placeholder="Enter surname"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="givenName">Given Name</Label>
              <Input
                id="givenName"
                value={givenName}
                onChange={(e) => setGivenName(e.target.value)}
                onBlur={handleInputBlur}
                placeholder="Enter given name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                onBlur={handleInputBlur}
                placeholder="Enter middle name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="suffix">Suffix</Label>
              <Input
                id="suffix"
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                onBlur={handleInputBlur}
                placeholder="Jr., Sr., III, etc."
                className="mt-1"
              />
            </div>
          </div>
        </div>
        
        {/* Personal Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="civilStatus">Civil Status</Label>
            <Select 
              value={civilStatus} 
              onValueChange={(value: any) => {
                setCivilStatus(value);
                handleInputBlur();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select civil status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="separated">Separated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={age || ''}
              onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : null)}
              onBlur={handleInputBlur}
              placeholder="Enter age"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Sex</Label>
            <RadioGroup 
              value={sex} 
              onValueChange={(value: "male" | "female") => {
                setSex(value);
                handleInputBlur();
              }}
              className="flex gap-4 mt-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="cursor-pointer">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="cursor-pointer">Female</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label>Nationality</Label>
            <RadioGroup 
              value={nationality === "Filipino" ? "Filipino" : "Foreigner"} 
              onValueChange={(value) => {
                setNationality(value === "Foreigner" && nationality === "Filipino" ? "" : value);
                handleInputBlur();
              }}
              className="flex gap-4 mt-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Filipino" id="filipino" />
                <Label htmlFor="filipino" className="cursor-pointer">Filipino</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Foreigner" id="foreigner" />
                <Label htmlFor="foreigner" className="cursor-pointer">Foreigner</Label>
              </div>
            </RadioGroup>
            
            {nationality !== "Filipino" && (
              <Input
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                onBlur={handleInputBlur}
                placeholder="Specify nationality"
                className="mt-2"
              />
            )}
          </div>
        </div>
        
        {/* Owner's Residential Address Section */}
        <div>
          <h3 className="text-md font-medium mb-4">Owner's Residential Address</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="ownerBlockNo">Block No.</Label>
              <Input
                id="ownerBlockNo"
                value={ownerBlockNo}
                onChange={(e) => setOwnerBlockNo(e.target.value)}
                onBlur={handleInputBlur}
                placeholder="Enter block number"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="ownerLotNo">Lot No.</Label>
              <Input
                id="ownerLotNo"
                value={ownerLotNo}
                onChange={(e) => setOwnerLotNo(e.target.value)}
                onBlur={handleInputBlur}
                placeholder="Enter lot number"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="ownerHouseBldgNo">House/Bldg. No.</Label>
              <Input
                id="ownerHouseBldgNo"
                value={ownerHouseBldgNo}
                onChange={(e) => setOwnerHouseBldgNo(e.target.value)}
                onBlur={handleInputBlur}
                placeholder="Enter house/bldg number"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="ownerBuildingName">Building Name</Label>
              <Input
                id="ownerBuildingName"
                value={ownerBuildingName}
                onChange={(e) => setOwnerBuildingName(e.target.value)}
                onBlur={handleInputBlur}
                placeholder="Enter building name"
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="ownerStreet">Street</Label>
              <Input
                id="ownerStreet"
                value={ownerStreet}
                onChange={(e) => setOwnerStreet(e.target.value)}
                onBlur={handleInputBlur}
                placeholder="Enter street name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="ownerSubdivision">Subdivision</Label>
              <Input
                id="ownerSubdivision"
                value={ownerSubdivision}
                onChange={(e) => setOwnerSubdivision(e.target.value)}
                onBlur={handleInputBlur}
                placeholder="Enter subdivision"
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <Label htmlFor="ownerBarangay">Barangay</Label>
              <Input
                id="ownerBarangay"
                value={ownerBarangay}
                onChange={(e) => setOwnerBarangay(e.target.value)}
                onBlur={handleInputBlur}
                placeholder="Enter barangay"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="ownerCityMunicipality">City/Municipality</Label>
              <Input
                id="ownerCityMunicipality"
                value={ownerCityMunicipality}
                onChange={(e) => setOwnerCityMunicipality(e.target.value)}
                onBlur={handleInputBlur}
                placeholder="Enter city/municipality"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="ownerProvince">Province</Label>
              <Input
                id="ownerProvince"
                value={ownerProvince}
                onChange={(e) => setOwnerProvince(e.target.value)}
                onBlur={handleInputBlur}
                placeholder="Enter province"
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="mt-4 max-w-xs">
            <Label htmlFor="ownerZipCode">Zip Code</Label>
            <Input
              id="ownerZipCode"
              value={ownerZipCode}
              onChange={(e) => setOwnerZipCode(e.target.value)}
              onBlur={handleInputBlur}
              placeholder="Enter zip code"
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </FormSectionWrapper>
  );
};

export default OwnerInformationSection;
