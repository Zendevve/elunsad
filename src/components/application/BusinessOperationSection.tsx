import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FormSectionWrapper from "@/components/application/FormSectionWrapper";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useApplication } from "@/contexts/ApplicationContext";
import { businessOperationsService } from "@/services/applicationService";

const BusinessOperationSection = () => {
  const [hasTaxIncentives, setHasTaxIncentives] = useState<string | null>(null);
  const [businessActivity, setBusinessActivity] = useState<string | null>(null);
  const [propertyOwned, setPropertyOwned] = useState<string | null>(null);
  const { toast } = useToast();
  const { applicationId, setIsLoading } = useApplication();
  
  // Form fields state
  const [formData, setFormData] = useState({
    businessArea: "",
    cctvCameras: "",
    professionalMale: "0",
    professionalFemale: "0",
    nonProfessionalMale: "0",
    nonProfessionalFemale: "0",
    employeesInLucena: "0",
    vanTruck: "0",
    motorcycle: "0",
    other: "0",
    capitalization: "",
    mainBlockNo: "",
    mainLotNo: "",
    mainHouseBldgNo: "",
    mainBuildingName: "",
    mainStreet: "",
    mainSubdivision: "",
    mainBarangay: "",
    mainCityMunicipality: "",
    mainProvince: "",
    mainZipCode: "",
    taxDeclarationNo: "",
    lessorFullName: "",
    lessorBusinessName: "",
    lessorAddress: "",
    lessorContactNumber: "",
    lessorEmailAddress: "",
    monthlyRental: "",
    otherActivitySpecification: ""  // Added field for "Others" specification
  });

  // Load existing data if available
  useEffect(() => {
    const loadBusinessOperations = async () => {
      if (!applicationId) return;
      
      try {
        setIsLoading(true);
        const data = await businessOperationsService.getBusinessOperations(applicationId);
        
        if (data) {
          setFormData({
            businessArea: data.business_area?.toString() || "",
            cctvCameras: data.cctv_cameras?.toString() || "",
            professionalMale: data.professional_male?.toString() || "0",
            professionalFemale: data.professional_female?.toString() || "0",
            nonProfessionalMale: data.non_professional_male?.toString() || "0",
            nonProfessionalFemale: data.non_professional_female?.toString() || "0",
            employeesInLucena: data.employees_in_lucena?.toString() || "0",
            vanTruck: data.van_truck?.toString() || "0",
            motorcycle: data.motorcycle?.toString() || "0",
            other: data.other_vehicles?.toString() || "0",
            capitalization: data.capitalization?.toString() || "",
            mainBlockNo: data.main_block_no || "",
            mainLotNo: data.main_lot_no || "",
            mainHouseBldgNo: data.main_house_bldg_no || "",
            mainBuildingName: data.main_building_name || "",
            mainStreet: data.main_street || "",
            mainSubdivision: data.main_subdivision || "",
            mainBarangay: data.main_barangay || "",
            mainCityMunicipality: data.main_city_municipality || "",
            mainProvince: data.main_province || "",
            mainZipCode: data.main_zip_code || "",
            taxDeclarationNo: data.tax_declaration_no || "",
            lessorFullName: data.lessor_full_name || "",
            lessorBusinessName: data.lessor_business_name || "",
            lessorAddress: data.lessor_address || "",
            lessorContactNumber: data.lessor_contact_number || "",
            lessorEmailAddress: data.lessor_email_address || "",
            monthlyRental: data.monthly_rental?.toString() || "",
            otherActivitySpecification: data.other_activity || ""  // Load "Others" specification
          });
          
          setHasTaxIncentives(data.has_tax_incentives === true ? "yes" : (data.has_tax_incentives === false ? "no" : null));
          setPropertyOwned(data.property_owned === true ? "yes" : (data.property_owned === false ? "no" : null));
          setBusinessActivity(data.business_activity || null);
        }
      } catch (error) {
        console.error("Error loading business operations:", error);
        toast({
          title: "Failed to load business operations",
          description: "There was an error loading your business operations data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBusinessOperations();
  }, [applicationId, setIsLoading, toast]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Save data after a short delay
    debounceAutoSave();
  };

  // Auto-save functionality with debounce
  const debounceAutoSave = () => {
    if (window.autoSaveTimeout) {
      clearTimeout(window.autoSaveTimeout);
    }
    
    window.autoSaveTimeout = setTimeout(() => {
      saveBusinessOperations();
    }, 1000); // 1 second debounce
  };

  // Save business operations data
  const saveBusinessOperations = async () => {
    if (!applicationId) return;
    
    try {
      const businessOperationsData = {
        application_id: applicationId,
        business_area: formData.businessArea ? parseFloat(formData.businessArea) : null,
        cctv_cameras: formData.cctvCameras ? parseInt(formData.cctvCameras) : null,
        professional_male: parseInt(formData.professionalMale || "0"),
        professional_female: parseInt(formData.professionalFemale || "0"),
        non_professional_male: parseInt(formData.nonProfessionalMale || "0"),
        non_professional_female: parseInt(formData.nonProfessionalFemale || "0"),
        employees_in_lucena: parseInt(formData.employeesInLucena || "0"),
        van_truck: parseInt(formData.vanTruck || "0"),
        motorcycle: parseInt(formData.motorcycle || "0"),
        other_vehicles: parseInt(formData.other || "0"),
        capitalization: formData.capitalization ? parseFloat(formData.capitalization) : null,
        has_tax_incentives: hasTaxIncentives === "yes" ? true : (hasTaxIncentives === "no" ? false : null),
        property_owned: propertyOwned === "yes" ? true : (propertyOwned === "no" ? false : null),
        business_activity: businessActivity,
        other_activity: businessActivity === "others" ? formData.otherActivitySpecification : null,  // Save "Others" specification
        main_block_no: formData.mainBlockNo || null,
        main_lot_no: formData.mainLotNo || null,
        main_house_bldg_no: formData.mainHouseBldgNo || null,
        main_building_name: formData.mainBuildingName || null,
        main_street: formData.mainStreet || null,
        main_subdivision: formData.mainSubdivision || null,
        main_barangay: formData.mainBarangay || null,
        main_city_municipality: formData.mainCityMunicipality || null,
        main_province: formData.mainProvince || null,
        main_zip_code: formData.mainZipCode || null,
        tax_declaration_no: formData.taxDeclarationNo || null,
        lessor_full_name: formData.lessorFullName || null,
        lessor_business_name: formData.lessorBusinessName || null,
        lessor_address: formData.lessorAddress || null,
        lessor_contact_number: formData.lessorContactNumber || null,
        lessor_email_address: formData.lessorEmailAddress || null,
        monthly_rental: formData.monthlyRental ? parseFloat(formData.monthlyRental) : null
      };
      
      await businessOperationsService.saveBusinessOperations(businessOperationsData);
      console.log("Business operations saved successfully");
    } catch (error) {
      console.error("Error saving business operations:", error);
      toast({
        title: "Error Saving Data",
        description: "There was an error saving your business operations data. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle radio button changes
  const handleTaxIncentivesChange = (value: string) => {
    setHasTaxIncentives(value);
    debounceAutoSave();
  };
  
  const handleBusinessActivityChange = (value: string) => {
    setBusinessActivity(value);
    debounceAutoSave();
  };
  
  const handlePropertyOwnedChange = (value: string) => {
    setPropertyOwned(value);
    debounceAutoSave();
  };

  // Sections rendering remains the same
  return (
    <>
      <FormSectionWrapper 
        title="Business Area and Employment" 
        description="Enter details about your business space and employees"
        stepNumber={4}
      >
        <div className="space-y-6">
          {/* Business Area Section */}
          <div className="p-4 bg-white rounded-md border">
            <h3 className="font-medium text-base mb-4">Business Space</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessArea" className="text-sm text-gray-600">Business Area (in sq m)</Label>
                  <Input 
                    id="businessArea" 
                    type="number" 
                    placeholder="Enter area in square meters"
                    value={formData.businessArea}
                    onChange={handleInputChange}
                    className="focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cctvCameras" className="text-sm text-gray-600">No. of CCTV camera(s) w/in business premises</Label>
                  <Input 
                    id="cctvCameras" 
                    type="number" 
                    placeholder="Enter number" 
                    value={formData.cctvCameras}
                    onChange={handleInputChange}
                    className="focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Employees Section */}
          <div className="p-4 bg-white rounded-md border">
            <h3 className="font-medium text-base mb-4">Employee Information</h3>
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="professionalMale" className="text-sm text-gray-600">Professional Male</Label>
                  <Input 
                    id="professionalMale" 
                    type="number" 
                    placeholder="0" 
                    value={formData.professionalMale}
                    onChange={handleInputChange}
                    className="focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="professionalFemale" className="text-sm text-gray-600">Professional Female</Label>
                  <Input 
                    id="professionalFemale" 
                    type="number" 
                    placeholder="0" 
                    value={formData.professionalFemale}
                    onChange={handleInputChange}
                    className="focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nonProfessionalMale" className="text-sm text-gray-600">Non-Professional Male</Label>
                  <Input 
                    id="nonProfessionalMale" 
                    type="number" 
                    placeholder="0" 
                    value={formData.nonProfessionalMale}
                    onChange={handleInputChange}
                    className="focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nonProfessionalFemale" className="text-sm text-gray-600">Non-Professional Female</Label>
                  <Input 
                    id="nonProfessionalFemale" 
                    type="number" 
                    placeholder="0" 
                    value={formData.nonProfessionalFemale}
                    onChange={handleInputChange}
                    className="focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeesInLucena" className="text-sm text-gray-600">No. of Employees Residing within Lucena</Label>
                <Input 
                  id="employeesInLucena" 
                  type="number" 
                  placeholder="Enter number" 
                  value={formData.employeesInLucena}
                  onChange={handleInputChange}
                  className="max-w-xs focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Delivery Vehicles Section */}
          <div className="p-4 bg-white rounded-md border">
            <h3 className="font-medium text-base mb-4">Delivery Vehicles (if applicable)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vanTruck" className="text-sm text-gray-600">Van/Truck</Label>
                <Input 
                  id="vanTruck" 
                  type="number" 
                  placeholder="0" 
                  value={formData.vanTruck}
                  onChange={handleInputChange}
                  className="focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motorcycle" className="text-sm text-gray-600">Motorcycle</Label>
                <Input 
                  id="motorcycle" 
                  type="number" 
                  placeholder="0" 
                  value={formData.motorcycle}
                  onChange={handleInputChange}
                  className="focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="other" className="text-sm text-gray-600">Other Vehicles</Label>
                <Input 
                  id="other" 
                  type="number" 
                  placeholder="0" 
                  value={formData.other}
                  onChange={handleInputChange}
                  className="focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </FormSectionWrapper>

      <FormSectionWrapper 
        title="Business Capitalization" 
        description="Provide financial information about your business"
      >
        <div className="space-y-6">
          <div className="p-4 bg-white rounded-md border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="capitalization" className="text-sm text-gray-600">Total Capitalization (PHP)</Label>
                <Input 
                  id="capitalization" 
                  type="number" 
                  placeholder="Enter amount in PHP" 
                  value={formData.capitalization}
                  onChange={handleInputChange}
                  className="focus:border-primary"
                />
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm text-gray-600 mb-2 block">Do you have tax incentives from any Government Entity?</Label>
                <RadioGroup
                  value={hasTaxIncentives || ""}
                  onValueChange={handleTaxIncentivesChange}
                  className="flex flex-wrap gap-x-6 gap-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="taxYes" />
                    <Label htmlFor="taxYes" className="cursor-pointer">Yes (Please attach a copy of your certificate)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="taxNo" />
                    <Label htmlFor="taxNo" className="cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>
      </FormSectionWrapper>

      <FormSectionWrapper 
        title="Business Activity" 
        description="Select your main business activity type"
      >
        <div className="p-4 bg-white rounded-md border">
          <RadioGroup
            value={businessActivity || ""}
            onValueChange={handleBusinessActivityChange}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mainOffice" id="mainOffice" />
              <Label htmlFor="mainOffice" className="cursor-pointer">Main Office</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="branchOffice" id="branchOffice" />
              <Label htmlFor="branchOffice" className="cursor-pointer">Branch Office</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="adminOffice" id="adminOffice" />
              <Label htmlFor="adminOffice" className="cursor-pointer">Admin Office Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="warehouse" id="warehouse" />
              <Label htmlFor="warehouse" className="cursor-pointer">Warehouse</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="others" id="others" />
              <Label htmlFor="others" className="cursor-pointer">Others, please specify</Label>
            </div>
          </RadioGroup>
          {businessActivity === "others" && (
            <div className="mt-3 max-w-md">
              <Input 
                id="otherActivitySpecification" 
                placeholder="Please specify business activity"
                value={formData.otherActivitySpecification}
                onChange={handleInputChange} 
                className="focus:border-primary" 
              />
            </div>
          )}
        </div>
      </FormSectionWrapper>

      <FormSectionWrapper 
        title="Main Office Information" 
        description="Enter details about your main office or principal address if branch"
      >
        <div className="p-4 bg-white rounded-md border space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mainBlockNo" className="text-sm text-gray-600">Block No.</Label>
              <Input 
                id="mainBlockNo" 
                placeholder="Enter block number" 
                value={formData.mainBlockNo}
                onChange={handleInputChange}
                className="focus:border-primary" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainLotNo" className="text-sm text-gray-600">Lot No.</Label>
              <Input 
                id="mainLotNo" 
                placeholder="Enter lot number" 
                value={formData.mainLotNo}
                onChange={handleInputChange}
                className="focus:border-primary" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainHouseBldgNo" className="text-sm text-gray-600">House/Bldg. No.</Label>
              <Input 
                id="mainHouseBldgNo" 
                placeholder="Enter house/bldg number" 
                value={formData.mainHouseBldgNo}
                onChange={handleInputChange}
                className="focus:border-primary" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainBuildingName" className="text-sm text-gray-600">Name of Building</Label>
              <Input 
                id="mainBuildingName" 
                placeholder="Enter building name" 
                value={formData.mainBuildingName}
                onChange={handleInputChange}
                className="focus:border-primary" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mainStreet" className="text-sm text-gray-600">Street</Label>
              <Input 
                id="mainStreet" 
                placeholder="Enter street name" 
                value={formData.mainStreet}
                onChange={handleInputChange}
                className="focus:border-primary" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainSubdivision" className="text-sm text-gray-600">Subdivision</Label>
              <Input 
                id="mainSubdivision" 
                placeholder="Enter subdivision" 
                value={formData.mainSubdivision}
                onChange={handleInputChange}
                className="focus:border-primary" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainBarangay" className="text-sm text-gray-600">Barangay</Label>
              <Input 
                id="mainBarangay" 
                placeholder="Enter barangay" 
                value={formData.mainBarangay}
                onChange={handleInputChange}
                className="focus:border-primary" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mainCityMunicipality" className="text-sm text-gray-600">City/Municipality</Label>
              <Input 
                id="mainCityMunicipality" 
                placeholder="Enter city/municipality" 
                value={formData.mainCityMunicipality}
                onChange={handleInputChange}
                className="focus:border-primary" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainProvince" className="text-sm text-gray-600">Province</Label>
              <Input 
                id="mainProvince" 
                placeholder="Enter province" 
                value={formData.mainProvince}
                onChange={handleInputChange}
                className="focus:border-primary" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainZipCode" className="text-sm text-gray-600">Zip Code</Label>
              <Input 
                id="mainZipCode" 
                placeholder="Enter zip code" 
                value={formData.mainZipCode}
                onChange={handleInputChange}
                className="focus:border-primary" 
              />
            </div>
          </div>
        </div>
      </FormSectionWrapper>

      <FormSectionWrapper 
        title="Property Information" 
        description="Provide details about the property ownership"
      >
        <div className="p-4 bg-white rounded-md border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 space-y-3">
              <Label className="text-sm text-gray-600">Property Owned?</Label>
              <RadioGroup
                value={propertyOwned || ""}
                onValueChange={handlePropertyOwnedChange}
                className="flex flex-wrap gap-x-6 gap-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="propertyYes" />
                  <Label htmlFor="propertyYes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="propertyNo" />
                  <Label htmlFor="propertyNo" className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            {propertyOwned === "yes" && (
              <div className="col-span-2 space-y-2">
                <Label className="text-sm text-gray-600">Tax Declaration No.</Label>
                <Input 
                  placeholder="Enter tax declaration number" 
                  id="taxDeclarationNo"
                  value={formData.taxDeclarationNo}
                  onChange={handleInputChange}
                  className="focus:border-primary" 
                />
              </div>
            )}
          </div>
          
          {propertyOwned === "no" && (
            <div className="mt-6 space-y-5 p-4 bg-gray-50 rounded-md border-l-4 border-l-primary">
              <div className="flex items-center">
                <h3 className="text-base font-medium">Lessor Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lessorFullName" className="text-sm text-gray-600">Lessor's Full Name</Label>
                  <Input 
                    id="lessorFullName" 
                    placeholder="Enter lessor's full name" 
                    value={formData.lessorFullName}
                    onChange={handleInputChange}
                    className="focus:border-primary" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lessorBusinessName" className="text-sm text-gray-600">Lessor's Business Name/BIN</Label>
                  <Input 
                    id="lessorBusinessName" 
                    placeholder="Enter lessor's business name" 
                    value={formData.lessorBusinessName}
                    onChange={handleInputChange}
                    className="focus:border-primary" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lessorAddress" className="text-sm text-gray-600">Lessor's Address</Label>
                  <Input 
                    id="lessorAddress" 
                    placeholder="Enter lessor's address" 
                    value={formData.lessorAddress}
                    onChange={handleInputChange}
                    className="focus:border-primary" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lessorContactNumber" className="text-sm text-gray-600">Lessor's Contact Number</Label>
                  <Input 
                    id="lessorContactNumber" 
                    placeholder="Enter lessor's contact number" 
                    value={formData.lessorContactNumber}
                    onChange={handleInputChange}
                    className="focus:border-primary" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lessorEmailAddress" className="text-sm text-gray-600">Lessor's Email Address</Label>
                  <Input 
                    id="lessorEmailAddress" 
                    type="email" 
                    placeholder="Enter lessor's email" 
                    value={formData.lessorEmailAddress}
                    onChange={handleInputChange}
                    className="focus:border-primary" 
                  />
                </div>
              </div>
              
              <div className="space-y-2 max-w-xs">
                <Label htmlFor="monthlyRental" className="text-sm text-gray-600">Monthly Rental</Label>
                <Input 
                  id="monthlyRental" 
                  type="number" 
                  placeholder="Enter monthly rental amount" 
                  value={formData.monthlyRental}
                  onChange={handleInputChange}
                  className="focus:border-primary" 
                />
              </div>
            </div>
          )}
        </div>
      </FormSectionWrapper>
    </>
  );
};

// Fix the type definition for the debounce functionality
declare global {
  interface Window {
    autoSaveTimeout: ReturnType<typeof setTimeout>;
  }
}

export default BusinessOperationSection;
