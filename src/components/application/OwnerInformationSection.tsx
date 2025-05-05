import { useState, useEffect } from "react";
import FormSectionWrapper from "./FormSectionWrapper";
import { FormField } from "@/components/ui/form-field";
import { EnhancedRadioGroup } from "@/components/ui/enhanced-radio-group";
import { useApplication } from "@/contexts/ApplicationContext";
import { ownerInformationService } from "@/services/applicationService";
import { useToast } from "@/components/ui/use-toast";

const OwnerInformationSection = () => {
  const { applicationId, isLoading, setIsLoading } = useApplication();
  const { toast } = useToast();
  
  const [civilStatus, setCivilStatus] = useState<string>("single");
  const [sex, setSex] = useState<string>("male");
  const [nationality, setNationality] = useState<string>("filipino");
  
  // Form fields state
  const [surname, setSurname] = useState<string>("");
  const [givenName, setGivenName] = useState<string>("");
  const [middleName, setMiddleName] = useState<string>("");
  const [suffix, setSuffix] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [ownerHouseBldgNo, setOwnerHouseBldgNo] = useState<string>("");
  const [ownerBuildingName, setOwnerBuildingName] = useState<string>("");
  const [ownerBlockNo, setOwnerBlockNo] = useState<string>("");
  const [ownerLotNo, setOwnerLotNo] = useState<string>("");
  const [ownerStreet, setOwnerStreet] = useState<string>("");
  const [ownerSubdivision, setOwnerSubdivision] = useState<string>("");
  const [ownerBarangay, setOwnerBarangay] = useState<string>("");
  const [ownerCityMunicipality, setOwnerCityMunicipality] = useState<string>("Lucena");
  const [ownerProvince, setOwnerProvince] = useState<string>("Quezon");
  const [ownerZipCode, setOwnerZipCode] = useState<string>("");

  // Load saved data when component mounts
  useEffect(() => {
    const loadOwnerInfo = async () => {
      if (!applicationId) return;
      
      try {
        const data = await ownerInformationService.getOwnerInformation(applicationId);
        if (data) {
          // Populate form fields with saved data
          setSurname(data.surname || "");
          setGivenName(data.given_name || "");
          setMiddleName(data.middle_name || "");
          setSuffix(data.suffix || "");
          setCivilStatus(data.civil_status || "single");
          setAge(data.age?.toString() || "");
          setSex(data.sex || "male");
          setNationality(data.nationality || "filipino");
          setOwnerHouseBldgNo(data.owner_house_bldg_no || "");
          setOwnerBuildingName(data.owner_building_name || "");
          setOwnerBlockNo(data.owner_block_no || "");
          setOwnerLotNo(data.owner_lot_no || "");
          setOwnerStreet(data.owner_street || "");
          setOwnerSubdivision(data.owner_subdivision || "");
          setOwnerBarangay(data.owner_barangay || "");
          setOwnerCityMunicipality(data.owner_city_municipality || "Lucena");
          setOwnerProvince(data.owner_province || "Quezon");
          setOwnerZipCode(data.owner_zip_code || "");
        }
      } catch (error) {
        console.error("Error loading owner information:", error);
      }
    };
    
    loadOwnerInfo();
  }, [applicationId]);

  // Save data function
  const saveOwnerInformation = async () => {
    if (!applicationId) return;
    if (!surname || !givenName || !ownerStreet || !ownerBarangay) return;
    
    try {
      setIsLoading(true);
      
      await ownerInformationService.saveOwnerInformation({
        application_id: applicationId,
        surname,
        given_name: givenName,
        middle_name: middleName || undefined,
        suffix: suffix || undefined,
        civil_status: civilStatus as any,
        age: parseInt(age || "0"),
        sex: sex as any,
        nationality,
        owner_house_bldg_no: ownerHouseBldgNo || undefined,
        owner_building_name: ownerBuildingName || undefined,
        owner_block_no: ownerBlockNo || undefined,
        owner_lot_no: ownerLotNo || undefined,
        owner_street: ownerStreet,
        owner_subdivision: ownerSubdivision || undefined,
        owner_barangay: ownerBarangay,
        owner_city_municipality: ownerCityMunicipality,
        owner_province: ownerProvince,
        owner_zip_code: ownerZipCode
      });
      
      toast({
        title: "Information Saved",
        description: "Owner information has been saved successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving owner information:", error);
      toast({
        title: "Save Failed",
        description: "There was an error saving owner information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-save when important fields change
  useEffect(() => {
    // Only save if at least name and required fields are entered
    if (applicationId && surname && givenName && ownerStreet && ownerBarangay) {
      const saveTimeout = setTimeout(() => {
        saveOwnerInformation();
      }, 1500);
      
      return () => clearTimeout(saveTimeout);
    }
  }, [
    surname, givenName, civilStatus, age, 
    sex, nationality, ownerStreet, ownerBarangay,
    ownerCityMunicipality, ownerProvince, ownerZipCode
  ]);

  const civilStatusOptions = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "widowed", label: "Widowed" }
  ];

  const sexOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" }
  ];

  const nationalityOptions = [
    { value: "filipino", label: "Filipino" },
    { value: "foreigner", label: "Other" }
  ];

  return (
    <FormSectionWrapper 
      title="Owner Information" 
      description="Details of the business owner or president/officer in charge"
      stepNumber={3}
    >
      <div className="space-y-8">
        {/* Owner's Full Name */}
        <div>
          <h3 className="font-medium text-base mb-3">Owner's Full Name <span className="text-red-500">*</span></h3>
          <p className="text-sm text-muted-foreground mb-4">
            For Sole Proprietorship: Name of Owner<br/>
            For Corp/Coop/Partnership: President/Officer in Charge
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              id="surname"
              label="Last Name"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
              tooltip="Enter your legal last name"
            />
            <FormField
              id="givenName"
              label="First Name"
              value={givenName}
              onChange={(e) => setGivenName(e.target.value)}
              required
              tooltip="Enter your legal first name"
            />
            <FormField
              id="middleName"
              label="Middle Name"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              tooltip="Enter your middle name"
            />
            <FormField
              id="suffix"
              label="Suffix"
              value={suffix}
              onChange={(e) => setSuffix(e.target.value)}
              tooltip="Jr, Sr, III, etc."
            />
          </div>
        </div>

        {/* Personal Information */}
        <div>
          <h3 className="font-medium text-base mb-3">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Civil Status */}
            <div>
              <label className="text-sm font-medium block mb-2">
                Civil Status <span className="text-red-500">*</span>
              </label>
              <EnhancedRadioGroup
                options={civilStatusOptions}
                value={civilStatus}
                onValueChange={setCivilStatus}
                name="civilStatus"
              />
            </div>
            
            {/* Age */}
            <div>
              <FormField
                id="age"
                type="number"
                label="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                min="18"
                tooltip="Must be at least 18 years old"
              />
            </div>
            
            {/* Sex */}
            <div>
              <label className="text-sm font-medium block mb-2">
                Sex <span className="text-red-500">*</span>
              </label>
              <EnhancedRadioGroup
                options={sexOptions}
                value={sex}
                onValueChange={setSex}
                orientation="horizontal"
                name="sex"
              />
            </div>
            
            {/* Nationality */}
            <div>
              <label className="text-sm font-medium block mb-2">
                Nationality <span className="text-red-500">*</span>
              </label>
              <EnhancedRadioGroup
                options={nationalityOptions}
                value={nationality}
                onValueChange={setNationality}
                orientation="horizontal"
                name="nationality"
              />
            </div>
          </div>
        </div>

        {/* Owner's Residential Address */}
        <div>
          <h3 className="font-medium text-base mb-3">Owner's Residential Address <span className="text-red-500">*</span></h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <FormField 
              id="ownerHouseBldgNo" 
              label="House/Bldg. No."
              value={ownerHouseBldgNo}
              onChange={(e) => setOwnerHouseBldgNo(e.target.value)}
            />
            <FormField 
              id="ownerBuildingName" 
              label="Building Name"
              value={ownerBuildingName}
              onChange={(e) => setOwnerBuildingName(e.target.value)}
              helperText="If applicable"
            />
            <FormField 
              id="ownerBlockNo" 
              label="Block No."
              value={ownerBlockNo}
              onChange={(e) => setOwnerBlockNo(e.target.value)}
              helperText="If applicable"
            />
            <FormField 
              id="ownerLotNo" 
              label="Lot No."
              value={ownerLotNo}
              onChange={(e) => setOwnerLotNo(e.target.value)}
              helperText="If applicable"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <FormField 
              id="ownerStreet" 
              label="Street"
              value={ownerStreet}
              onChange={(e) => setOwnerStreet(e.target.value)}
              required
            />
            <FormField 
              id="ownerSubdivision" 
              label="Subdivision"
              value={ownerSubdivision}
              onChange={(e) => setOwnerSubdivision(e.target.value)}
              helperText="If applicable"
            />
            <FormField 
              id="ownerBarangay" 
              label="Barangay"
              value={ownerBarangay}
              onChange={(e) => setOwnerBarangay(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField 
              id="ownerCityMunicipality" 
              label="City/Municipality"
              value={ownerCityMunicipality}
              onChange={(e) => setOwnerCityMunicipality(e.target.value)}
              required
            />
            <FormField 
              id="ownerProvince" 
              label="Province"
              value={ownerProvince}
              onChange={(e) => setOwnerProvince(e.target.value)}
              required
            />
            <FormField 
              id="ownerZipCode" 
              label="Zip Code"
              value={ownerZipCode}
              onChange={(e) => setOwnerZipCode(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
    </FormSectionWrapper>
  );
};

export default OwnerInformationSection;
