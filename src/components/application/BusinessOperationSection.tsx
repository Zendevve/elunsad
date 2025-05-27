
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useApplication } from "@/contexts/ApplicationContext";
import { businessOperationsService } from "@/services/application";
import FormSectionWrapper from "./FormSectionWrapper";

const BusinessOperationSection = () => {
  const { applicationId, isLoading, setIsLoading } = useApplication();
  
  // Business operation state
  const [businessActivity, setBusinessActivity] = useState("");
  const [otherActivity, setOtherActivity] = useState("");
  const [businessArea, setBusinessArea] = useState<number | null>(null);
  const [capitalization, setCapitalization] = useState<number | null>(null);
  const [professionalMale, setProfessionalMale] = useState<number | null>(null);
  const [professionalFemale, setProfessionalFemale] = useState<number | null>(null);
  const [nonProfessionalMale, setNonProfessionalMale] = useState<number | null>(null);
  const [nonProfessionalFemale, setNonProfessionalFemale] = useState<number | null>(null);
  const [employeesInLucena, setEmployeesInLucena] = useState<number | null>(null);
  const [hasTaxIncentives, setHasTaxIncentives] = useState(false);
  const [propertyOwned, setPropertyOwned] = useState(false);
  const [monthlyRental, setMonthlyRental] = useState<number | null>(null);

  // Vehicle counts
  const [vanTruck, setVanTruck] = useState<number | null>(null);
  const [motorcycle, setMotorcycle] = useState<number | null>(null);
  const [otherVehicles, setOtherVehicles] = useState<number | null>(null);
  
  // Security features
  const [cctvCameras, setCctvCameras] = useState<number | null>(null);

  // Property details
  const [taxDeclarationNo, setTaxDeclarationNo] = useState("");

  // Main office address (if different)
  const [mainHouseBldgNo, setMainHouseBldgNo] = useState("");
  const [mainBuildingName, setMainBuildingName] = useState("");
  const [mainBlockNo, setMainBlockNo] = useState("");
  const [mainLotNo, setMainLotNo] = useState("");
  const [mainStreet, setMainStreet] = useState("");
  const [mainSubdivision, setMainSubdivision] = useState("");
  const [mainBarangay, setMainBarangay] = useState("");
  const [mainCityMunicipality, setMainCityMunicipality] = useState("");
  const [mainProvince, setMainProvince] = useState("");
  const [mainZipCode, setMainZipCode] = useState("");

  // Lessor information (if rented)
  const [lessorFullName, setLessorFullName] = useState("");
  const [lessorBusinessName, setLessorBusinessName] = useState("");
  const [lessorAddress, setLessorAddress] = useState("");
  const [lessorContactNumber, setLessorContactNumber] = useState("");
  const [lessorEmailAddress, setLessorEmailAddress] = useState("");

  // Collapsible states
  const [mainOfficeOpen, setMainOfficeOpen] = useState(false);

  useEffect(() => {
    const loadBusinessOperations = async () => {
      if (!applicationId) return;
      
      try {
        const data = await businessOperationsService.getBusinessOperations(applicationId);
        if (data) {
          setBusinessActivity(data.business_activity || "");
          setOtherActivity(data.other_activity || "");
          setBusinessArea(data.business_area || null);
          setCapitalization(data.capitalization || null);
          setProfessionalMale(data.professional_male || null);
          setProfessionalFemale(data.professional_female || null);
          setNonProfessionalMale(data.non_professional_male || null);
          setNonProfessionalFemale(data.non_professional_female || null);
          setEmployeesInLucena(data.employees_in_lucena || null);
          setHasTaxIncentives(data.has_tax_incentives || false);
          setPropertyOwned(data.property_owned || false);
          setMonthlyRental(data.monthly_rental || null);
          
          // Vehicle counts
          setVanTruck(data.van_truck || null);
          setMotorcycle(data.motorcycle || null);
          setOtherVehicles(data.other_vehicles || null);
          
          // Security features
          setCctvCameras(data.cctv_cameras || null);

          // Property details
          setTaxDeclarationNo(data.tax_declaration_no || "");

          // Main office address
          setMainHouseBldgNo(data.main_house_bldg_no || "");
          setMainBuildingName(data.main_building_name || "");
          setMainBlockNo(data.main_block_no || "");
          setMainLotNo(data.main_lot_no || "");
          setMainStreet(data.main_street || "");
          setMainSubdivision(data.main_subdivision || "");
          setMainBarangay(data.main_barangay || "");
          setMainCityMunicipality(data.main_city_municipality || "");
          setMainProvince(data.main_province || "");
          setMainZipCode(data.main_zip_code || "");

          // Lessor information
          setLessorFullName(data.lessor_full_name || "");
          setLessorBusinessName(data.lessor_business_name || "");
          setLessorAddress(data.lessor_address || "");
          setLessorContactNumber(data.lessor_contact_number || "");
          setLessorEmailAddress(data.lessor_email_address || "");
        }
      } catch (error) {
        console.error("Error loading business operations:", error);
      }
    };
    
    loadBusinessOperations();
  }, [applicationId]);

  const handleSaveBusinessOperations = async (showToast = false) => {
    if (!applicationId) return;
    
    try {
      setIsLoading(true);
      console.log("BusinessOperationSection - Saving with showToast:", showToast);
      
      const businessOperationsData = {
        application_id: applicationId,
        business_activity: businessActivity,
        other_activity: otherActivity,
        business_area: businessArea,
        capitalization: capitalization,
        professional_male: professionalMale,
        professional_female: professionalFemale,
        non_professional_male: nonProfessionalMale,
        non_professional_female: nonProfessionalFemale,
        employees_in_lucena: employeesInLucena,
        has_tax_incentives: hasTaxIncentives,
        property_owned: propertyOwned,
        monthly_rental: monthlyRental,
        
        // Vehicle counts
        van_truck: vanTruck,
        motorcycle: motorcycle,
        other_vehicles: otherVehicles,
        
        // Security features
        cctv_cameras: cctvCameras,

        // Property details
        tax_declaration_no: taxDeclarationNo,

        // Main office address
        main_house_bldg_no: mainHouseBldgNo,
        main_building_name: mainBuildingName,
        main_block_no: mainBlockNo,
        main_lot_no: mainLotNo,
        main_street: mainStreet,
        main_subdivision: mainSubdivision,
        main_barangay: mainBarangay,
        main_city_municipality: mainCityMunicipality,
        main_province: mainProvince,
        main_zip_code: mainZipCode,

        // Lessor information
        lessor_full_name: lessorFullName,
        lessor_business_name: lessorBusinessName,
        lessor_address: lessorAddress,
        lessor_contact_number: lessorContactNumber,
        lessor_email_address: lessorEmailAddress
      };
      
      await businessOperationsService.saveBusinessOperations(businessOperationsData);
      console.log("Business operations saved", showToast ? "with toast" : "silently");
    } catch (error) {
      console.error("Error saving business operations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputBlur = () => {
    console.log("BusinessOperationSection - Input blur - triggering silent save with NO toast");
    handleSaveBusinessOperations(false);
  };

  // Expose validation/save function for parent component
  useEffect(() => {
    if (!window.businessOperationHelpers) {
      window.businessOperationHelpers = {
        validateAndSave: async () => {
          console.log("BusinessOperationSection - Parent requested validation - performing silent save");
          await handleSaveBusinessOperations(false);
          return true;
        }
      };
    } else {
      window.businessOperationHelpers.validateAndSave = async () => {
        console.log("BusinessOperationSection - Parent requested validation - performing silent save");
        await handleSaveBusinessOperations(false);
        return true;
      };
    }
    
    return () => {
      if (window.businessOperationHelpers) {
        delete window.businessOperationHelpers.validateAndSave;
      }
    };
  }, [
    businessActivity, otherActivity, businessArea, capitalization, 
    professionalMale, professionalFemale, nonProfessionalMale, 
    nonProfessionalFemale, employeesInLucena, hasTaxIncentives,
    propertyOwned, monthlyRental, vanTruck, motorcycle, otherVehicles,
    cctvCameras, taxDeclarationNo, mainHouseBldgNo, mainBuildingName,
    mainBlockNo, mainLotNo, mainStreet, mainSubdivision, mainBarangay,
    mainCityMunicipality, mainProvince, mainZipCode, lessorFullName,
    lessorBusinessName, lessorAddress, lessorContactNumber, lessorEmailAddress
  ]);

  return (
    <FormSectionWrapper
      title="Business Operation Details"
      description="Provide information about your business operations"
      stepNumber={4}
    >
      <div className="space-y-8">
        {/* Basic Business Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessActivity">Business Activity/Description</Label>
              <Input 
                id="businessActivity" 
                placeholder="Describe your business activities" 
                value={businessActivity}
                onChange={(e) => setBusinessActivity(e.target.value)}
                onBlur={handleInputBlur}
              />
            </div>

            <div>
              <Label htmlFor="otherActivity">Other Activity</Label>
              <Input 
                id="otherActivity" 
                placeholder="Describe any other activities" 
                value={otherActivity}
                onChange={(e) => setOtherActivity(e.target.value)}
                onBlur={handleInputBlur}
              />
            </div>

            <div>
              <Label htmlFor="businessArea">Business Area (sqm)</Label>
              <Input 
                id="businessArea" 
                type="number" 
                placeholder="Area in square meters" 
                value={businessArea || ''}
                onChange={(e) => setBusinessArea(e.target.value ? Number(e.target.value) : null)}
                onBlur={handleInputBlur}
              />
            </div>

            <div>
              <Label htmlFor="capitalization">Capitalization (PHP)</Label>
              <Input 
                id="capitalization" 
                type="number" 
                placeholder="Amount in Philippine Peso" 
                value={capitalization || ''}
                onChange={(e) => setCapitalization(e.target.value ? Number(e.target.value) : null)}
                onBlur={handleInputBlur}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium mb-2">Property Information</h3>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="propertyOwned" 
                checked={propertyOwned} 
                onCheckedChange={(checked) => {
                  setPropertyOwned(checked);
                  handleSaveBusinessOperations(false);
                }}
              />
              <Label htmlFor="propertyOwned">Property is Owned</Label>
            </div>

            {!propertyOwned && (
              <div>
                <Label htmlFor="monthlyRental">Monthly Rental (PHP)</Label>
                <Input 
                  id="monthlyRental" 
                  type="number" 
                  placeholder="Monthly rental amount" 
                  value={monthlyRental || ''}
                  onChange={(e) => setMonthlyRental(e.target.value ? Number(e.target.value) : null)}
                  onBlur={handleInputBlur}
                />
              </div>
            )}

            <div>
              <Label htmlFor="taxDeclarationNo">Tax Declaration Number</Label>
              <Input 
                id="taxDeclarationNo" 
                placeholder="Property tax declaration number" 
                value={taxDeclarationNo}
                onChange={(e) => setTaxDeclarationNo(e.target.value)}
                onBlur={handleInputBlur}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="taxIncentives" 
                checked={hasTaxIncentives} 
                onCheckedChange={(checked) => {
                  setHasTaxIncentives(checked);
                  handleSaveBusinessOperations(false);
                }}
              />
              <Label htmlFor="taxIncentives">Has Tax Incentives</Label>
            </div>
          </div>
        </div>

        {/* Employee Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Employee Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="employeesInLucena">Employees from Lucena</Label>
              <Input 
                id="employeesInLucena" 
                type="number" 
                placeholder="Number of employees from Lucena" 
                value={employeesInLucena || ''}
                onChange={(e) => setEmployeesInLucena(e.target.value ? Number(e.target.value) : null)}
                onBlur={handleInputBlur}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="professionalMale">Professional Male</Label>
              <Input 
                id="professionalMale" 
                type="number" 
                value={professionalMale || ''}
                onChange={(e) => setProfessionalMale(e.target.value ? Number(e.target.value) : null)}
                onBlur={handleInputBlur}
              />
            </div>
            <div>
              <Label htmlFor="professionalFemale">Professional Female</Label>
              <Input 
                id="professionalFemale" 
                type="number" 
                value={professionalFemale || ''}
                onChange={(e) => setProfessionalFemale(e.target.value ? Number(e.target.value) : null)}
                onBlur={handleInputBlur}
              />
            </div>
            <div>
              <Label htmlFor="nonProfessionalMale">Non-Professional Male</Label>
              <Input 
                id="nonProfessionalMale" 
                type="number" 
                value={nonProfessionalMale || ''}
                onChange={(e) => setNonProfessionalMale(e.target.value ? Number(e.target.value) : null)}
                onBlur={handleInputBlur}
              />
            </div>
            <div>
              <Label htmlFor="nonProfessionalFemale">Non-Professional Female</Label>
              <Input 
                id="nonProfessionalFemale" 
                type="number" 
                value={nonProfessionalFemale || ''}
                onChange={(e) => setNonProfessionalFemale(e.target.value ? Number(e.target.value) : null)}
                onBlur={handleInputBlur}
              />
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Vehicle Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="vanTruck">Van/Truck</Label>
              <Input 
                id="vanTruck" 
                type="number" 
                placeholder="Number of vans/trucks" 
                value={vanTruck || ''}
                onChange={(e) => setVanTruck(e.target.value ? Number(e.target.value) : null)}
                onBlur={handleInputBlur}
              />
            </div>
            <div>
              <Label htmlFor="motorcycle">Motorcycle</Label>
              <Input 
                id="motorcycle" 
                type="number" 
                placeholder="Number of motorcycles" 
                value={motorcycle || ''}
                onChange={(e) => setMotorcycle(e.target.value ? Number(e.target.value) : null)}
                onBlur={handleInputBlur}
              />
            </div>
            <div>
              <Label htmlFor="otherVehicles">Other Vehicles</Label>
              <Input 
                id="otherVehicles" 
                type="number" 
                placeholder="Number of other vehicles" 
                value={otherVehicles || ''}
                onChange={(e) => setOtherVehicles(e.target.value ? Number(e.target.value) : null)}
                onBlur={handleInputBlur}
              />
            </div>
          </div>
        </div>

        {/* Security Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Security Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cctvCameras">CCTV Cameras</Label>
              <Input 
                id="cctvCameras" 
                type="number" 
                placeholder="Number of CCTV cameras" 
                value={cctvCameras || ''}
                onChange={(e) => setCctvCameras(e.target.value ? Number(e.target.value) : null)}
                onBlur={handleInputBlur}
              />
            </div>
          </div>
        </div>

        {/* Main Office Address Section */}
        <Collapsible open={mainOfficeOpen} onOpenChange={setMainOfficeOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <h3 className="text-lg font-medium">Main Office Address (if different from business address)</h3>
            <ChevronDown className={`h-4 w-4 transition-transform ${mainOfficeOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mainHouseBldgNo">House/Building No.</Label>
                <Input 
                  id="mainHouseBldgNo" 
                  placeholder="House/Building number" 
                  value={mainHouseBldgNo}
                  onChange={(e) => setMainHouseBldgNo(e.target.value)}
                  onBlur={handleInputBlur}
                />
              </div>
              <div>
                <Label htmlFor="mainBuildingName">Building Name</Label>
                <Input 
                  id="mainBuildingName" 
                  placeholder="Building name" 
                  value={mainBuildingName}
                  onChange={(e) => setMainBuildingName(e.target.value)}
                  onBlur={handleInputBlur}
                />
              </div>
              <div>
                <Label htmlFor="mainBlockNo">Block No.</Label>
                <Input 
                  id="mainBlockNo" 
                  placeholder="Block number" 
                  value={mainBlockNo}
                  onChange={(e) => setMainBlockNo(e.target.value)}
                  onBlur={handleInputBlur}
                />
              </div>
              <div>
                <Label htmlFor="mainLotNo">Lot No.</Label>
                <Input 
                  id="mainLotNo" 
                  placeholder="Lot number" 
                  value={mainLotNo}
                  onChange={(e) => setMainLotNo(e.target.value)}
                  onBlur={handleInputBlur}
                />
              </div>
              <div>
                <Label htmlFor="mainStreet">Street</Label>
                <Input 
                  id="mainStreet" 
                  placeholder="Street name" 
                  value={mainStreet}
                  onChange={(e) => setMainStreet(e.target.value)}
                  onBlur={handleInputBlur}
                />
              </div>
              <div>
                <Label htmlFor="mainSubdivision">Subdivision</Label>
                <Input 
                  id="mainSubdivision" 
                  placeholder="Subdivision name" 
                  value={mainSubdivision}
                  onChange={(e) => setMainSubdivision(e.target.value)}
                  onBlur={handleInputBlur}
                />
              </div>
              <div>
                <Label htmlFor="mainBarangay">Barangay</Label>
                <Input 
                  id="mainBarangay" 
                  placeholder="Barangay name" 
                  value={mainBarangay}
                  onChange={(e) => setMainBarangay(e.target.value)}
                  onBlur={handleInputBlur}
                />
              </div>
              <div>
                <Label htmlFor="mainCityMunicipality">City/Municipality</Label>
                <Input 
                  id="mainCityMunicipality" 
                  placeholder="City or municipality" 
                  value={mainCityMunicipality}
                  onChange={(e) => setMainCityMunicipality(e.target.value)}
                  onBlur={handleInputBlur}
                />
              </div>
              <div>
                <Label htmlFor="mainProvince">Province</Label>
                <Input 
                  id="mainProvince" 
                  placeholder="Province name" 
                  value={mainProvince}
                  onChange={(e) => setMainProvince(e.target.value)}
                  onBlur={handleInputBlur}
                />
              </div>
              <div>
                <Label htmlFor="mainZipCode">ZIP Code</Label>
                <Input 
                  id="mainZipCode" 
                  placeholder="ZIP code" 
                  value={mainZipCode}
                  onChange={(e) => setMainZipCode(e.target.value)}
                  onBlur={handleInputBlur}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Lessor Information (appears only when property is rented) */}
        {!propertyOwned && (
          <div className="space-y-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-medium text-yellow-800">Lessor Information</h3>
            <p className="text-sm text-yellow-700">Please provide information about the property owner/lessor.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lessorFullName">Lessor Full Name</Label>
                <Input 
                  id="lessorFullName" 
                  placeholder="Full name of lessor" 
                  value={lessorFullName}
                  onChange={(e) => setLessorFullName(e.target.value)}
                  onBlur={handleInputBlur}
                />
              </div>
              <div>
                <Label htmlFor="lessorBusinessName">Lessor Business Name</Label>
                <Input 
                  id="lessorBusinessName" 
                  placeholder="Business name (if applicable)" 
                  value={lessorBusinessName}
                  onChange={(e) => setLessorBusinessName(e.target.value)}
                  onBlur={handleInputBlur}
                />
              </div>
              <div>
                <Label htmlFor="lessorContactNumber">Contact Number</Label>
                <Input 
                  id="lessorContactNumber" 
                  placeholder="Lessor contact number" 
                  value={lessorContactNumber}
                  onChange={(e) => setLessorContactNumber(e.target.value)}
                  onBlur={handleInputBlur}
                />
              </div>
              <div>
                <Label htmlFor="lessorEmailAddress">Email Address</Label>
                <Input 
                  id="lessorEmailAddress" 
                  type="email"
                  placeholder="Lessor email address" 
                  value={lessorEmailAddress}
                  onChange={(e) => setLessorEmailAddress(e.target.value)}
                  onBlur={handleInputBlur}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="lessorAddress">Lessor Address</Label>
                <Input 
                  id="lessorAddress" 
                  placeholder="Complete address of lessor" 
                  value={lessorAddress}
                  onChange={(e) => setLessorAddress(e.target.value)}
                  onBlur={handleInputBlur}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </FormSectionWrapper>
  );
};

export default BusinessOperationSection;
