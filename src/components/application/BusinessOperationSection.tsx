
import { useEffect } from "react";
import FormSectionWrapper from "./FormSectionWrapper";
import { useBusinessOperations } from "./hooks/useBusinessOperations";
import BusinessActivitySection from "./sections/BusinessActivitySection";
import PropertyInformationSection from "./sections/PropertyInformationSection";
import EmployeeInformationSection from "./sections/EmployeeInformationSection";
import VehicleSecuritySection from "./sections/VehicleSecuritySection";
import AddressInformationSection from "./sections/AddressInformationSection";

const BusinessOperationSection = () => {
  const {
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
  } = useBusinessOperations();

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
        <BusinessActivitySection
          businessActivity={businessActivity}
          setBusinessActivity={setBusinessActivity}
          otherActivity={otherActivity}
          setOtherActivity={setOtherActivity}
          businessArea={businessArea}
          setBusinessArea={setBusinessArea}
          capitalization={capitalization}
          setCapitalization={setCapitalization}
          onInputBlur={handleInputBlur}
        />

        <PropertyInformationSection
          propertyOwned={propertyOwned}
          setPropertyOwned={setPropertyOwned}
          monthlyRental={monthlyRental}
          setMonthlyRental={setMonthlyRental}
          taxDeclarationNo={taxDeclarationNo}
          setTaxDeclarationNo={setTaxDeclarationNo}
          hasTaxIncentives={hasTaxIncentives}
          setHasTaxIncentives={setHasTaxIncentives}
          onInputBlur={handleInputBlur}
          onSaveBusinessOperations={() => handleSaveBusinessOperations(false)}
        />

        <EmployeeInformationSection
          employeesInLucena={employeesInLucena}
          setEmployeesInLucena={setEmployeesInLucena}
          professionalMale={professionalMale}
          setProfessionalMale={setProfessionalMale}
          professionalFemale={professionalFemale}
          setProfessionalFemale={setProfessionalFemale}
          nonProfessionalMale={nonProfessionalMale}
          setNonProfessionalMale={setNonProfessionalMale}
          nonProfessionalFemale={nonProfessionalFemale}
          setNonProfessionalFemale={setNonProfessionalFemale}
          onInputBlur={handleInputBlur}
        />

        <VehicleSecuritySection
          vanTruck={vanTruck}
          setVanTruck={setVanTruck}
          motorcycle={motorcycle}
          setMotorcycle={setMotorcycle}
          otherVehicles={otherVehicles}
          setOtherVehicles={setOtherVehicles}
          cctvCameras={cctvCameras}
          setCctvCameras={setCctvCameras}
          onInputBlur={handleInputBlur}
        />

        <AddressInformationSection
          propertyOwned={propertyOwned}
          mainHouseBldgNo={mainHouseBldgNo}
          setMainHouseBldgNo={setMainHouseBldgNo}
          mainBuildingName={mainBuildingName}
          setMainBuildingName={setMainBuildingName}
          mainBlockNo={mainBlockNo}
          setMainBlockNo={setMainBlockNo}
          mainLotNo={mainLotNo}
          setMainLotNo={setMainLotNo}
          mainStreet={mainStreet}
          setMainStreet={setMainStreet}
          mainSubdivision={mainSubdivision}
          setMainSubdivision={setMainSubdivision}
          mainBarangay={mainBarangay}
          setMainBarangay={setMainBarangay}
          mainCityMunicipality={mainCityMunicipality}
          setMainCityMunicipality={setMainCityMunicipality}
          mainProvince={mainProvince}
          setMainProvince={setMainProvince}
          mainZipCode={mainZipCode}
          setMainZipCode={setMainZipCode}
          lessorFullName={lessorFullName}
          setLessorFullName={setLessorFullName}
          lessorBusinessName={lessorBusinessName}
          setLessorBusinessName={setLessorBusinessName}
          lessorAddress={lessorAddress}
          setLessorAddress={setLessorAddress}
          lessorContactNumber={lessorContactNumber}
          setLessorContactNumber={setLessorContactNumber}
          lessorEmailAddress={lessorEmailAddress}
          setLessorEmailAddress={setLessorEmailAddress}
          onInputBlur={handleInputBlur}
        />
      </div>
    </FormSectionWrapper>
  );
};

export default BusinessOperationSection;
