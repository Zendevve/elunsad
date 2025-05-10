
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useApplication } from "@/contexts/ApplicationContext";
import { businessOperationsService } from "@/services/application";
import FormSectionWrapper from "./FormSectionWrapper";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [taxDeclarationNo, setTaxDeclarationNo] = useState("");

  // Vehicle counts
  const [vanTruck, setVanTruck] = useState<number | null>(null);
  const [motorcycle, setMotorcycle] = useState<number | null>(null);
  const [otherVehicles, setOtherVehicles] = useState<number | null>(null);
  
  // Security features
  const [cctvCameras, setCctvCameras] = useState<number | null>(null);

  // Lessor information
  const [monthlyRental, setMonthlyRental] = useState<number | null>(null);
  const [lessorFullName, setLessorFullName] = useState("");
  const [lessorBusinessName, setLessorBusinessName] = useState("");
  const [lessorAddress, setLessorAddress] = useState("");
  const [lessorContactNumber, setLessorContactNumber] = useState("");
  const [lessorEmailAddress, setLessorEmailAddress] = useState("");

  // Main office information (if branch)
  const [mainBlockNo, setMainBlockNo] = useState("");
  const [mainLotNo, setMainLotNo] = useState("");
  const [mainHouseBldgNo, setMainHouseBldgNo] = useState("");
  const [mainBuildingName, setMainBuildingName] = useState("");
  const [mainStreet, setMainStreet] = useState("");
  const [mainSubdivision, setMainSubdivision] = useState("");
  const [mainBarangay, setMainBarangay] = useState("");
  const [mainCityMunicipality, setMainCityMunicipality] = useState("");
  const [mainProvince, setMainProvince] = useState("");
  const [mainZipCode, setMainZipCode] = useState("");

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
          setTaxDeclarationNo(data.tax_declaration_no || "");
          
          // Set vehicle counts
          setVanTruck(data.van_truck || null);
          setMotorcycle(data.motorcycle || null);
          setOtherVehicles(data.other_vehicles || null);
          
          // Set security features
          setCctvCameras(data.cctv_cameras || null);

          // Set lessor information
          setMonthlyRental(data.monthly_rental || null);
          setLessorFullName(data.lessor_full_name || "");
          setLessorBusinessName(data.lessor_business_name || "");
          setLessorAddress(data.lessor_address || "");
          setLessorContactNumber(data.lessor_contact_number || "");
          setLessorEmailAddress(data.lessor_email_address || "");

          // Set main office information
          setMainBlockNo(data.main_block_no || "");
          setMainLotNo(data.main_lot_no || "");
          setMainHouseBldgNo(data.main_house_bldg_no || "");
          setMainBuildingName(data.main_building_name || "");
          setMainStreet(data.main_street || "");
          setMainSubdivision(data.main_subdivision || "");
          setMainBarangay(data.main_barangay || "");
          setMainCityMunicipality(data.main_city_municipality || "");
          setMainProvince(data.main_province || "");
          setMainZipCode(data.main_zip_code || "");
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
        tax_declaration_no: taxDeclarationNo,
        
        // Vehicle counts
        van_truck: vanTruck,
        motorcycle: motorcycle,
        other_vehicles: otherVehicles,
        
        // Security features
        cctv_cameras: cctvCameras,

        // Lessor information
        monthly_rental: monthlyRental,
        lessor_full_name: lessorFullName,
        lessor_business_name: lessorBusinessName,
        lessor_address: lessorAddress,
        lessor_contact_number: lessorContactNumber,
        lessor_email_address: lessorEmailAddress,

        // Main office information
        main_block_no: mainBlockNo,
        main_lot_no: mainLotNo,
        main_house_bldg_no: mainHouseBldgNo,
        main_building_name: mainBuildingName,
        main_street: mainStreet,
        main_subdivision: mainSubdivision,
        main_barangay: mainBarangay,
        main_city_municipality: mainCityMunicipality,
        main_province: mainProvince,
        main_zip_code: mainZipCode
      };
      
      // Save without showing toasts unless explicitly requested
      await businessOperationsService.saveBusinessOperations(businessOperationsData);
      console.log("Business operations saved", showToast ? "with toast" : "silently");
    } catch (error) {
      console.error("Error saving business operations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Input change handlers
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
          // Silent save - no toasts from this component
          await handleSaveBusinessOperations(false);
          return true; // Business operations don't have required fields for now
        }
      };
    } else {
      window.businessOperationHelpers.validateAndSave = async () => {
        console.log("BusinessOperationSection - Parent requested validation - performing silent save");
        // Silent save - no toasts from this component
        await handleSaveBusinessOperations(false);
        return true;
      };
    }
    
    return () => {
      // Cleanup when component unmounts
      if (window.businessOperationHelpers) {
        delete window.businessOperationHelpers.validateAndSave;
      }
    };
  }, [
    businessActivity, otherActivity, businessArea, capitalization, 
    professionalMale, professionalFemale, nonProfessionalMale, 
    nonProfessionalFemale, employeesInLucena, hasTaxIncentives,
    propertyOwned, taxDeclarationNo, vanTruck, motorcycle, 
    otherVehicles, cctvCameras, monthlyRental, lessorFullName,
    lessorBusinessName, lessorAddress, lessorContactNumber,
    lessorEmailAddress, mainBlockNo, mainLotNo, mainHouseBldgNo,
    mainBuildingName, mainStreet, mainSubdivision, mainBarangay,
    mainCityMunicipality, mainProvince, mainZipCode
  ]);

  // Component JSX
  return (
    <FormSectionWrapper
      title="Business Operation Details"
      description="Provide information about your business operations"
      stepNumber={4}
    >
      <div className="space-y-6">
        {/* Business Activity Section */}
        <div className="space-y-4">
          <div>
            <Label>Business Activity</Label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
              <Select 
                value={businessActivity} 
                onValueChange={(value) => {
                  setBusinessActivity(value);
                  handleInputBlur();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main_office">Main Office</SelectItem>
                  <SelectItem value="branch_office">Branch Office</SelectItem>
                  <SelectItem value="admin_office">Admin Office Only</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="other">Others</SelectItem>
                </SelectContent>
              </Select>
              
              {businessActivity === "other" && (
                <div className="md:col-span-3">
                  <Input 
                    placeholder="Please specify" 
                    value={otherActivity}
                    onChange={(e) => setOtherActivity(e.target.value)}
                    onBlur={handleInputBlur}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Main Office Address (if branch) */}
          {(businessActivity === "branch_office" || businessActivity === "admin_office" || businessActivity === "warehouse") && (
            <div className="border p-4 rounded-md space-y-4">
              <h4 className="font-medium">Main Office/Principal Address</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="mainBlockNo">Block No.</Label>
                  <Input 
                    id="mainBlockNo" 
                    value={mainBlockNo}
                    onChange={(e) => setMainBlockNo(e.target.value)}
                    onBlur={handleInputBlur}
                  />
                </div>

                <div>
                  <Label htmlFor="mainLotNo">Lot No.</Label>
                  <Input 
                    id="mainLotNo" 
                    value={mainLotNo}
                    onChange={(e) => setMainLotNo(e.target.value)}
                    onBlur={handleInputBlur}
                  />
                </div>

                <div>
                  <Label htmlFor="mainHouseBldgNo">House/Bldg. No.</Label>
                  <Input 
                    id="mainHouseBldgNo" 
                    value={mainHouseBldgNo}
                    onChange={(e) => setMainHouseBldgNo(e.target.value)}
                    onBlur={handleInputBlur}
                  />
                </div>

                <div>
                  <Label htmlFor="mainBuildingName">Building Name</Label>
                  <Input 
                    id="mainBuildingName" 
                    value={mainBuildingName}
                    onChange={(e) => setMainBuildingName(e.target.value)}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mainStreet">Street</Label>
                  <Input 
                    id="mainStreet" 
                    value={mainStreet}
                    onChange={(e) => setMainStreet(e.target.value)}
                    onBlur={handleInputBlur}
                  />
                </div>

                <div>
                  <Label htmlFor="mainSubdivision">Subdivision</Label>
                  <Input 
                    id="mainSubdivision" 
                    value={mainSubdivision}
                    onChange={(e) => setMainSubdivision(e.target.value)}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="mainBarangay">Barangay</Label>
                  <Input 
                    id="mainBarangay" 
                    value={mainBarangay}
                    onChange={(e) => setMainBarangay(e.target.value)}
                    onBlur={handleInputBlur}
                  />
                </div>

                <div>
                  <Label htmlFor="mainCityMunicipality">City/Municipality</Label>
                  <Input 
                    id="mainCityMunicipality" 
                    value={mainCityMunicipality}
                    onChange={(e) => setMainCityMunicipality(e.target.value)}
                    onBlur={handleInputBlur}
                  />
                </div>

                <div>
                  <Label htmlFor="mainProvince">Province</Label>
                  <Input 
                    id="mainProvince" 
                    value={mainProvince}
                    onChange={(e) => setMainProvince(e.target.value)}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="mainZipCode">Zip Code</Label>
                <Input 
                  id="mainZipCode"
                  className="max-w-[150px]" 
                  value={mainZipCode}
                  onChange={(e) => setMainZipCode(e.target.value)}
                  onBlur={handleInputBlur}
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
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
              <Label htmlFor="capitalization">Total Capitalization (PHP)</Label>
              <Input 
                id="capitalization" 
                type="number" 
                placeholder="Amount in Philippine Peso" 
                value={capitalization || ''}
                onChange={(e) => setCapitalization(e.target.value ? Number(e.target.value) : null)}
                onBlur={handleInputBlur}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="taxIncentives" 
                checked={hasTaxIncentives} 
                onCheckedChange={(checked) => {
                  setHasTaxIncentives(checked);
                  handleInputBlur();
                }}
              />
              <Label htmlFor="taxIncentives">Has Tax Incentives from Government Entity</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="propertyOwned" 
                checked={propertyOwned} 
                onCheckedChange={(checked) => {
                  setPropertyOwned(checked);
                  handleInputBlur();
                }}
              />
              <Label htmlFor="propertyOwned">Property is Owned</Label>
            </div>

            {propertyOwned && (
              <div>
                <Label htmlFor="taxDeclarationNo">Tax Declaration No.</Label>
                <Input 
                  id="taxDeclarationNo" 
                  placeholder="Enter tax declaration number" 
                  value={taxDeclarationNo}
                  onChange={(e) => setTaxDeclarationNo(e.target.value)}
                  onBlur={handleInputBlur}
                />
              </div>
            )}

            {!propertyOwned && (
              <div className="space-y-4 border p-4 rounded-md">
                <h4 className="font-medium">Lessor Information</h4>
                
                <div>
                  <Label htmlFor="lessorFullName">Lessor's Full Name</Label>
                  <Input 
                    id="lessorFullName" 
                    placeholder="Enter lessor's name" 
                    value={lessorFullName}
                    onChange={(e) => setLessorFullName(e.target.value)}
                    onBlur={handleInputBlur}
                  />
                </div>

                <div>
                  <Label htmlFor="lessorBusinessName">Lessor's Business Name/BIN</Label>
                  <Input 
                    id="lessorBusinessName" 
                    placeholder="Enter lessor's business name" 
                    value={lessorBusinessName}
                    onChange={(e) => setLessorBusinessName(e.target.value)}
                    onBlur={handleInputBlur}
                  />
                </div>

                <div>
                  <Label htmlFor="monthlyRental">Monthly Rental (PHP)</Label>
                  <Input 
                    id="monthlyRental" 
                    type="number" 
                    placeholder="Enter monthly rental amount" 
                    value={monthlyRental || ''}
                    onChange={(e) => setMonthlyRental(e.target.value ? Number(e.target.value) : null)}
                    onBlur={handleInputBlur}
                  />
                </div>

                <div>
                  <Label htmlFor="lessorAddress">Lessor's Address</Label>
                  <Input 
                    id="lessorAddress" 
                    placeholder="Enter lessor's address" 
                    value={lessorAddress}
                    onChange={(e) => setLessorAddress(e.target.value)}
                    onBlur={handleInputBlur}
                  />
                </div>

                <div>
                  <Label htmlFor="lessorContactNumber">Lessor's Contact Number</Label>
                  <Input 
                    id="lessorContactNumber" 
                    placeholder="Enter lessor's contact number" 
                    value={lessorContactNumber}
                    onChange={(e) => setLessorContactNumber(e.target.value)}
                    onBlur={handleInputBlur}
                  />
                </div>

                <div>
                  <Label htmlFor="lessorEmailAddress">Lessor's Email Address</Label>
                  <Input 
                    id="lessorEmailAddress" 
                    placeholder="Enter lessor's email address"
                    type="email" 
                    value={lessorEmailAddress}
                    onChange={(e) => setLessorEmailAddress(e.target.value)}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium mb-2">Employee Information</h3>
            
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

            <div>
              <h4 className="text-sm font-medium mb-2">Professional Employees</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="professionalMale">Male</Label>
                  <Input 
                    id="professionalMale" 
                    type="number" 
                    value={professionalMale || ''}
                    onChange={(e) => setProfessionalMale(e.target.value ? Number(e.target.value) : null)}
                    onBlur={handleInputBlur}
                  />
                </div>
                <div>
                  <Label htmlFor="professionalFemale">Female</Label>
                  <Input 
                    id="professionalFemale" 
                    type="number" 
                    value={professionalFemale || ''}
                    onChange={(e) => setProfessionalFemale(e.target.value ? Number(e.target.value) : null)}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Non-Professional Employees</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nonProfessionalMale">Male</Label>
                  <Input 
                    id="nonProfessionalMale" 
                    type="number" 
                    value={nonProfessionalMale || ''}
                    onChange={(e) => setNonProfessionalMale(e.target.value ? Number(e.target.value) : null)}
                    onBlur={handleInputBlur}
                  />
                </div>
                <div>
                  <Label htmlFor="nonProfessionalFemale">Female</Label>
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

            <div>
              <h4 className="text-sm font-medium mb-2">Delivery Vehicles</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="vanTruck">Van/Truck</Label>
                  <Input 
                    id="vanTruck" 
                    type="number" 
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
                    value={motorcycle || ''}
                    onChange={(e) => setMotorcycle(e.target.value ? Number(e.target.value) : null)}
                    onBlur={handleInputBlur}
                  />
                </div>
                <div>
                  <Label htmlFor="otherVehicles">Others</Label>
                  <Input 
                    id="otherVehicles" 
                    type="number" 
                    value={otherVehicles || ''}
                    onChange={(e) => setOtherVehicles(e.target.value ? Number(e.target.value) : null)}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="cctvCameras">Number of CCTV Camera(s) within business premises</Label>
              <Input 
                id="cctvCameras" 
                type="number"
                className="max-w-[150px]"
                value={cctvCameras || ''}
                onChange={(e) => setCctvCameras(e.target.value ? Number(e.target.value) : null)}
                onBlur={handleInputBlur}
              />
            </div>
          </div>
        </div>
      </div>
    </FormSectionWrapper>
  );
};

export default BusinessOperationSection;
