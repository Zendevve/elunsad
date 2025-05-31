
import { useState, useEffect } from "react";
import { useApplication } from "@/contexts/ApplicationContext";
import { businessOperationsService } from "@/services/application";

export const useBusinessOperations = () => {
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
      console.log("useBusinessOperations - Saving with showToast:", showToast);
      
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
    console.log("useBusinessOperations - Input blur - triggering silent save with NO toast");
    handleSaveBusinessOperations(false);
  };

  return {
    // State
    businessActivity, setBusinessActivity,
    otherActivity, setOtherActivity,
    businessArea, setBusinessArea,
    capitalization, setCapitalization,
    professionalMale, setProfessionalMale,
    professionalFemale, setProfessionalFemale,
    nonProfessionalMale, setNonProfessionalMale,
    nonProfessionalFemale, setNonProfessionalFemale,
    employeesInLucena, setEmployeesInLucena,
    hasTaxIncentives, setHasTaxIncentives,
    propertyOwned, setPropertyOwned,
    monthlyRental, setMonthlyRental,
    vanTruck, setVanTruck,
    motorcycle, setMotorcycle,
    otherVehicles, setOtherVehicles,
    cctvCameras, setCctvCameras,
    taxDeclarationNo, setTaxDeclarationNo,
    mainHouseBldgNo, setMainHouseBldgNo,
    mainBuildingName, setMainBuildingName,
    mainBlockNo, setMainBlockNo,
    mainLotNo, setMainLotNo,
    mainStreet, setMainStreet,
    mainSubdivision, setMainSubdivision,
    mainBarangay, setMainBarangay,
    mainCityMunicipality, setMainCityMunicipality,
    mainProvince, setMainProvince,
    mainZipCode, setMainZipCode,
    lessorFullName, setLessorFullName,
    lessorBusinessName, setLessorBusinessName,
    lessorAddress, setLessorAddress,
    lessorContactNumber, setLessorContactNumber,
    lessorEmailAddress, setLessorEmailAddress,
    
    // Functions
    handleSaveBusinessOperations,
    handleInputBlur
  };
};
