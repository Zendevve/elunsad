
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormSectionWrapper from "./FormSectionWrapper";
import { FormField } from "@/components/ui/form-field";
import { EnhancedRadioGroup } from "@/components/ui/enhanced-radio-group";
import { useApplication } from "@/contexts/ApplicationContext";
import { applicationService } from "@/services/applicationService";
import { useToast } from "@/components/ui/use-toast";

const BusinessInformationSection = () => {
  const { applicationId, isLoading, setIsLoading } = useApplication();
  const { toast } = useToast();
  const [ownershipType, setOwnershipType] = useState<string>("soleProprietorship");
  const [selectedBarangay, setSelectedBarangay] = useState<string>("");
  
  // Form fields state
  const [businessName, setBusinessName] = useState<string>("");
  const [tradeName, setTradeName] = useState<string>("");
  const [registrationNumber, setRegistrationNumber] = useState<string>("");
  const [tinNumber, setTinNumber] = useState<string>("");
  const [sssNumber, setSssNumber] = useState<string>("");
  const [houseBldgNo, setHouseBldgNo] = useState<string>("");
  const [buildingName, setBuildingName] = useState<string>("");
  const [blockNo, setBlockNo] = useState<string>("");
  const [lotNo, setLotNo] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [subdivision, setSubdivision] = useState<string>("");
  const [cityMunicipality, setCityMunicipality] = useState<string>("Lucena");
  const [province, setProvince] = useState<string>("Quezon");
  const [zipCode, setZipCode] = useState<string>("");
  const [telephoneNo, setTelephoneNo] = useState<string>("");
  const [mobileNo, setMobileNo] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");

  // Load saved data when component mounts
  useEffect(() => {
    const loadBusinessInfo = async () => {
      if (!applicationId) return;
      
      try {
        const data = await applicationService.getBusinessInformation(applicationId);
        if (data) {
          // Populate form fields with saved data
          setBusinessName(data.business_name || "");
          setTradeName(data.trade_name || "");
          setRegistrationNumber(data.registration_number || "");
          setTinNumber(data.tin_number || "");
          setSssNumber(data.sss_number || "");
          setOwnershipType(data.ownership_type || "soleProprietorship");
          setHouseBldgNo(data.house_bldg_no || "");
          setBuildingName(data.building_name || "");
          setBlockNo(data.block_no || "");
          setLotNo(data.lot_no || "");
          setStreet(data.street || "");
          setSubdivision(data.subdivision || "");
          setSelectedBarangay(data.barangay || "");
          setCityMunicipality(data.city_municipality || "Lucena");
          setProvince(data.province || "Quezon");
          setZipCode(data.zip_code || "");
          setTelephoneNo(data.telephone_no || "");
          setMobileNo(data.mobile_no || "");
          setEmailAddress(data.email_address || "");
        }
      } catch (error) {
        console.error("Error loading business information:", error);
      }
    };
    
    loadBusinessInfo();
  }, [applicationId]);

  // Save data function
  const saveBusinessInformation = async () => {
    if (!applicationId) return;
    
    try {
      setIsLoading(true);
      
      await applicationService.saveBusinessInformation({
        application_id: applicationId,
        business_name: businessName,
        trade_name: tradeName,
        registration_number: registrationNumber,
        tin_number: tinNumber,
        sss_number: sssNumber,
        ownership_type: ownershipType as any,
        house_bldg_no: houseBldgNo,
        building_name: buildingName,
        block_no: blockNo,
        lot_no: lotNo,
        street: street,
        subdivision: subdivision,
        barangay: selectedBarangay,
        city_municipality: cityMunicipality,
        province: province,
        zip_code: zipCode,
        telephone_no: telephoneNo,
        mobile_no: mobileNo,
        email_address: emailAddress
      });
      
      toast({
        title: "Information Saved",
        description: "Your business information has been saved successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving business information:", error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your business information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-save when important fields change
  useEffect(() => {
    // Only save if at least business name and required fields are entered
    if (applicationId && businessName && tinNumber && street && selectedBarangay) {
      const saveTimeout: ReturnType<typeof setTimeout> = setTimeout(() => {
        saveBusinessInformation();
      }, 1500);
      
      return () => clearTimeout(saveTimeout);
    }
  }, [
    businessName, tinNumber, ownershipType, street, 
    selectedBarangay, cityMunicipality, province, 
    zipCode, mobileNo, emailAddress
  ]);

  // List of barangays in Lucena
  const barangays = [
    "Barangay 1 (Poblacion)",
    "Barangay 2 (Poblacion)",
    "Barangay 3 (Poblacion)",
    "Barangay 4 (Poblacion)",
    "Barangay 5 (Poblacion)",
    "Barangay 6 (Poblacion)",
    "Barangay 7 (Poblacion)",
    "Barangay 8 (Poblacion)",
    "Barangay 9 (Poblacion)",
    "Barangay 10 (Poblacion)",
    "Barangay 11 (Poblacion)",
    "Barra",
    "Bocohan",
    "Cotta",
    "Gulang-Gulang",
    "Dalahican",
    "Domoit",
    "Ibabang Dupay",
    "Ibabang Iyam",
    "Ibabang Talim",
    "Ilayang Dupay",
    "Ilayang Iyam",
    "Ilayang Talim",
    "Isabang",
    "Market View",
    "Mayao Castillo",
    "Mayao Crossing",
    "Mayao Kanluran",
    "Mayao Parada",
    "Mayao Silangan",
    "Ransohan",
    "Salinas",
    "Talao-Talao"
  ];

  const ownershipOptions = [
    {
      value: "soleProprietorship",
      label: "Sole Proprietorship",
      description: "Business owned by one person"
    },
    {
      value: "onePersonCorp",
      label: "One Person Corp",
      description: "Corporation with a single stockholder"
    },
    {
      value: "partnership",
      label: "Partnership",
      description: "Business owned by two or more individuals"
    },
    {
      value: "corporation",
      label: "Corporation",
      description: "Business entity with shareholders"
    },
    {
      value: "cooperative",
      label: "Cooperative",
      description: "Business owned and run by its members"
    }
  ];

  return (
    <FormSectionWrapper 
      title="Business Information and Registration"
      description="Enter your business details and registration information"
      stepNumber={2}
    >
      <div className="space-y-8">
        {/* Business Name and Trade Name */}
        <div>
          <h3 className="font-medium text-base mb-3">Business Identification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField 
              id="businessName" 
              label="Business Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              tooltip="Enter the official registered business name as it appears on your DTI/SEC registration"
            />
            <FormField 
              id="tradeName" 
              label="Trade Name / Franchise"
              value={tradeName}
              onChange={(e) => setTradeName(e.target.value)}
              helperText="Leave blank if same as business name"
              tooltip="Enter the name you use for your business if different from the registered business name"
            />
          </div>
        </div>

        {/* Registration Numbers */}
        <div>
          <h3 className="font-medium text-base mb-3">Registration Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField 
              id="dtiSecCdaNumber" 
              label="DTI/SEC/CDA Registration No."
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              required
              tooltip="Enter your Department of Trade and Industry, Securities and Exchange Commission, or Cooperative Development Authority registration number"
            />
            <FormField 
              id="tinNumber" 
              label="Tax Identification Number"
              value={tinNumber}
              onChange={(e) => setTinNumber(e.target.value)}
              required
              placeholder="XXX-XXX-XXX-XXX"
              tooltip="Enter your 12-digit Tax Identification Number from BIR"
            />
            <FormField 
              id="sssNumber" 
              label="SSS Number"
              value={sssNumber}
              onChange={(e) => setSssNumber(e.target.value)}
              placeholder="XX-XXXXXXX-X"
              tooltip="Enter your Social Security System employer number"
            />
          </div>
        </div>

        {/* Kind of Ownership */}
        <div>
          <h3 className="font-medium text-base mb-3">
            Ownership Type <span className="text-red-500">*</span>
          </h3>
          <div className="mt-2">
            <EnhancedRadioGroup
              options={ownershipOptions}
              value={ownershipType}
              onValueChange={setOwnershipType}
              orientation="horizontal"
              name="ownershipType"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            />
          </div>
        </div>

        {/* Business Address */}
        <div>
          <h3 className="font-medium text-base mb-3">Business Address <span className="text-red-500">*</span></h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <FormField 
              id="houseBldgNo" 
              label="House/Bldg. No."
              value={houseBldgNo}
              onChange={(e) => setHouseBldgNo(e.target.value)}
              tooltip="Enter the house or building number of your business address"
            />
            <FormField 
              id="buildingName" 
              label="Building Name"
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
              helperText="If applicable"
            />
            <FormField 
              id="blockNo" 
              label="Block No."
              value={blockNo}
              onChange={(e) => setBlockNo(e.target.value)}
              helperText="If applicable"
            />
            <FormField 
              id="lotNo" 
              label="Lot No."
              value={lotNo}
              onChange={(e) => setLotNo(e.target.value)}
              helperText="If applicable"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <FormField 
              id="street" 
              label="Street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
              tooltip="Enter the street name of your business location"
            />
            <FormField 
              id="subdivision" 
              label="Subdivision"
              value={subdivision}
              onChange={(e) => setSubdivision(e.target.value)}
              helperText="If applicable"
            />
            <div className="space-y-1.5">
              <div className="relative">
                <Select value={selectedBarangay} onValueChange={setSelectedBarangay}>
                  <SelectTrigger id="barangay" className="h-14 pt-4">
                    <SelectValue placeholder="Select barangay" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {barangays.map((barangay) => (
                      <SelectItem key={barangay} value={barangay}>
                        {barangay}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <label htmlFor="barangay" className="absolute left-3 top-2 text-xs text-primary pointer-events-none">
                  Barangay <span className="text-destructive">*</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField 
              id="cityMunicipality" 
              label="City/Municipality"
              value={cityMunicipality}
              onChange={(e) => setCityMunicipality(e.target.value)}
              required
              tooltip="Enter the city or municipality of your business location"
            />
            <FormField 
              id="province" 
              label="Province"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              required
              tooltip="Enter the province of your business location"
            />
            <FormField 
              id="zipCode" 
              label="Zip Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              tooltip="Enter the postal or zip code of your business location"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="font-medium text-base mb-3">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField 
              id="telephoneNo" 
              label="Telephone No."
              value={telephoneNo}
              onChange={(e) => setTelephoneNo(e.target.value)}
              tooltip="Enter your business landline number"
            />
            <FormField 
              id="mobileNo" 
              label="Mobile No."
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              required
              tooltip="Enter a mobile number where you can be contacted"
            />
            <FormField 
              id="emailAddress" 
              type="email" 
              label="Email Address"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              required
              tooltip="Enter an active email address for communications"
            />
          </div>
        </div>
      </div>
    </FormSectionWrapper>
  );
};

export default BusinessInformationSection;
