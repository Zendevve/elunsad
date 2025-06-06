import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useApplication } from "@/contexts/ApplicationContext";
import { ownerInformationService } from "@/services/application";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FormSectionWrapper from "./FormSectionWrapper";

const OwnerInformationSection = () => {
  const { applicationId, isLoading, setIsLoading } = useApplication();
  const { toast } = useToast();
  
  // Owner information state
  const [surname, setSurname] = useState("");
  const [givenName, setGivenName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [age, setAge] = useState<number>(0);
  const [sex, setSex] = useState<"male" | "female">("male");
  const [civilStatus, setCivilStatus] = useState<"single" | "married" | "widowed" | "divorced" | "separated">("single");
  const [nationality, setNationality] = useState("Filipino");
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

  // Fetch user profile data for prefilling
  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('firstname, middlename, lastname, extension_name')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      if (profile) {
        // Only prefill if fields are empty (don't overwrite existing data)
        if (!surname && profile.lastname) setSurname(profile.lastname);
        if (!givenName && profile.firstname) setGivenName(profile.firstname);
        if (!middleName && profile.middlename) setMiddleName(profile.middlename);
        if (!suffix && profile.extension_name) setSuffix(profile.extension_name);
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    }
  };

  useEffect(() => {
    const loadOwnerInformation = async () => {
      if (!applicationId) return;
      
      try {
        const data = await ownerInformationService.getOwnerInformation(applicationId);
        
        if (data) {
          setSurname(data.surname || "");
          setGivenName(data.given_name || "");
          setMiddleName(data.middle_name || "");
          setSuffix(data.suffix || "");
          setAge(data.age || 0);
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
        } else {
          // If no saved data exists, prefill with user profile data
          await fetchUserProfile();
        }
      } catch (error) {
        console.error("Error loading owner information:", error);
        // If there's an error loading, still try to prefill with user profile
        await fetchUserProfile();
      }
    };
    
    loadOwnerInformation();
  }, [applicationId]);

  const handleSaveOwnerInformation = async (showToast = false) => {
    if (!applicationId) return;
    
    try {
      setIsLoading(true);
      console.log("OwnerInformationSection - Saving with showToast:", showToast);
      
      const ownerData = {
        application_id: applicationId,
        surname,
        given_name: givenName,
        middle_name: middleName,
        suffix,
        age,
        sex,
        civil_status: civilStatus,
        nationality,
        owner_street: ownerStreet,
        owner_barangay: ownerBarangay,
        owner_city_municipality: ownerCityMunicipality,
        owner_province: ownerProvince,
        owner_zip_code: ownerZipCode,
        owner_house_bldg_no: ownerHouseBldgNo,
        owner_building_name: ownerBuildingName,
        owner_block_no: ownerBlockNo,
        owner_lot_no: ownerLotNo,
        owner_subdivision: ownerSubdivision
      };
      
      await ownerInformationService.saveOwnerInformation(ownerData);
      
      // Only show success toast when explicitly requested
      if (showToast === true) {
        console.log("OwnerInformationSection - Showing success toast as requested");
        toast({
          title: "Owner Information Saved",
          description: "Your owner information has been saved successfully.",
          variant: "default",
        });
      } else {
        console.log("OwnerInformationSection - No toast shown: showToast=false");
      }
    } catch (error) {
      console.error("Error saving owner information:", error);
      
      // Only show error toast when explicitly requested
      if (showToast === true) {
        console.log("OwnerInformationSection - Showing error toast as requested");
        toast({
          title: "Save Failed",
          description: "There was an error saving your owner information.",
          variant: "destructive",
        });
      } else {
        console.log("OwnerInformationSection - No error toast shown: showToast=false");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Input blur handler to save data silently
  const handleInputBlur = () => {
    console.log("OwnerInformationSection - Input blur, saving silently");
    handleSaveOwnerInformation(false);
  };

  // Window helper for parent component
  useEffect(() => {
    if (!window.ownerInfoHelpers) {
      window.ownerInfoHelpers = {
        validateAndSave: async () => {
          console.log("OwnerInformationSection - Parent requested validateAndSave (showToast=false)");
          await handleSaveOwnerInformation(false);
          
          // Validation logic for required fields
          const requiredFields = [
            surname, 
            givenName, 
            age, 
            sex, 
            civilStatus, 
            nationality, 
            ownerStreet, 
            ownerBarangay, 
            ownerCityMunicipality,
            ownerProvince, 
            ownerZipCode
          ];
          
          const isValid = requiredFields.every(field => field !== null && field !== undefined && field !== '');
          return isValid;
        },
        silentSave: async () => {
          console.log("OwnerInformationSection - Parent requested silentSave");
          await handleSaveOwnerInformation(false);
          return true;
        }
      };
    } else {
      window.ownerInfoHelpers.validateAndSave = async () => {
        console.log("OwnerInformationSection - Parent requested validateAndSave (showToast=false)");
        await handleSaveOwnerInformation(false);
        
        // Validation logic for required fields
        const requiredFields = [
          surname, 
          givenName, 
          age, 
          sex, 
          civilStatus, 
          nationality, 
          ownerStreet, 
          ownerBarangay, 
          ownerCityMunicipality,
          ownerProvince, 
          ownerZipCode
        ];
        
        const isValid = requiredFields.every(field => field !== null && field !== undefined && field !== '');
        return isValid;
      };
      
      window.ownerInfoHelpers.silentSave = async () => {
        console.log("OwnerInformationSection - Parent requested silentSave");
        await handleSaveOwnerInformation(false);
        return true;
      };
    }
    
    return () => {
      if (window.ownerInfoHelpers) {
        delete window.ownerInfoHelpers.validateAndSave;
        delete window.ownerInfoHelpers.silentSave;
      }
    };
  }, [
    surname, 
    givenName, 
    middleName, 
    suffix, 
    age, 
    sex, 
    civilStatus, 
    nationality,
    ownerStreet, 
    ownerBarangay, 
    ownerCityMunicipality, 
    ownerProvince, 
    ownerZipCode,
    ownerHouseBldgNo, 
    ownerBuildingName, 
    ownerBlockNo, 
    ownerLotNo, 
    ownerSubdivision
  ]);

  // Rest of the component's JSX
  return (
    <FormSectionWrapper
      title="Owner Information"
      description="Provide details about the business owner"
      stepNumber={3}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="civilStatus">Civil Status</Label>
            <Select 
              value={civilStatus} 
              onValueChange={(value: "single" | "married" | "widowed" | "divorced" | "separated") => {
                setCivilStatus(value);
                setTimeout(handleSaveOwnerInformation, 100);
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
            <Label htmlFor="surname">Surname</Label>
            <Input 
              id="surname" 
              placeholder="Enter surname" 
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              onBlur={handleInputBlur}
            />
          </div>

          <div>
            <Label htmlFor="givenName">Given Name</Label>
            <Input 
              id="givenName" 
              placeholder="Enter given name" 
              value={givenName}
              onChange={(e) => setGivenName(e.target.value)}
              onBlur={handleInputBlur}
            />
          </div>
          
          <div>
            <Label htmlFor="middleName">Middle Name</Label>
            <Input 
              id="middleName" 
              placeholder="Enter middle name" 
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              onBlur={handleInputBlur}
            />
          </div>
          
          <div>
            <Label htmlFor="suffix">Suffix</Label>
            <Input 
              id="suffix" 
              placeholder="Jr., Sr., III, etc." 
              value={suffix}
              onChange={(e) => setSuffix(e.target.value)}
              onBlur={handleInputBlur}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="age">Age</Label>
            <Input 
              id="age" 
              type="number" 
              placeholder="Enter age" 
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              onBlur={handleInputBlur}
            />
          </div>
          
          <div>
            <Label htmlFor="sex">Sex</Label>
            <Select 
              value={sex} 
              onValueChange={(value: "male" | "female") => {
                setSex(value);
                setTimeout(handleSaveOwnerInformation, 100);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="nationality">Nationality</Label>
            <Input 
              id="nationality" 
              placeholder="Enter nationality" 
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              onBlur={handleInputBlur}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-3">Owner Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ownerHouseBldgNo">House/Bldg No.</Label>
            <Input 
              id="ownerHouseBldgNo" 
              placeholder="Enter house/building number" 
              value={ownerHouseBldgNo}
              onChange={(e) => setOwnerHouseBldgNo(e.target.value)}
              onBlur={handleInputBlur}
            />
          </div>
          
          <div>
            <Label htmlFor="ownerBuildingName">Building Name</Label>
            <Input 
              id="ownerBuildingName" 
              placeholder="Enter building name" 
              value={ownerBuildingName}
              onChange={(e) => setOwnerBuildingName(e.target.value)}
              onBlur={handleInputBlur}
            />
          </div>
          
          <div>
            <Label htmlFor="ownerBlockNo">Block No.</Label>
            <Input 
              id="ownerBlockNo" 
              placeholder="Enter block number" 
              value={ownerBlockNo}
              onChange={(e) => setOwnerBlockNo(e.target.value)}
              onBlur={handleInputBlur}
            />
          </div>
          
          <div>
            <Label htmlFor="ownerLotNo">Lot No.</Label>
            <Input 
              id="ownerLotNo" 
              placeholder="Enter lot number" 
              value={ownerLotNo}
              onChange={(e) => setOwnerLotNo(e.target.value)}
              onBlur={handleInputBlur}
            />
          </div>

          <div>
            <Label htmlFor="ownerStreet">Street</Label>
            <Input 
              id="ownerStreet" 
              placeholder="Enter street" 
              value={ownerStreet}
              onChange={(e) => setOwnerStreet(e.target.value)}
              onBlur={handleInputBlur}
            />
          </div>
          
          <div>
            <Label htmlFor="ownerSubdivision">Subdivision</Label>
            <Input 
              id="ownerSubdivision" 
              placeholder="Enter subdivision" 
              value={ownerSubdivision}
              onChange={(e) => setOwnerSubdivision(e.target.value)}
              onBlur={handleInputBlur}
            />
          </div>
          
          <div>
            <Label htmlFor="ownerBarangay">Barangay</Label>
            <Input 
              id="ownerBarangay" 
              placeholder="Enter barangay" 
              value={ownerBarangay}
              onChange={(e) => setOwnerBarangay(e.target.value)}
              onBlur={handleInputBlur}
            />
          </div>
          
          <div>
            <Label htmlFor="ownerCityMunicipality">City/Municipality</Label>
            <Input 
              id="ownerCityMunicipality" 
              placeholder="Enter city/municipality" 
              value={ownerCityMunicipality}
              onChange={(e) => setOwnerCityMunicipality(e.target.value)}
              onBlur={handleInputBlur}
            />
          </div>
          
          <div>
            <Label htmlFor="ownerProvince">Province</Label>
            <Input 
              id="ownerProvince" 
              placeholder="Enter province" 
              value={ownerProvince}
              onChange={(e) => setOwnerProvince(e.target.value)}
              onBlur={handleInputBlur}
            />
          </div>
          
          <div>
            <Label htmlFor="ownerZipCode">Zip Code</Label>
            <Input 
              id="ownerZipCode" 
              placeholder="Enter zip code" 
              value={ownerZipCode}
              onChange={(e) => setOwnerZipCode(e.target.value)}
              onBlur={handleInputBlur}
            />
          </div>
        </div>
      </div>
    </FormSectionWrapper>
  );
};

export default OwnerInformationSection;
