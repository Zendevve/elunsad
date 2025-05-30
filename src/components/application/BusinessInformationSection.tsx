
import { useState, useEffect } from "react";
import FormSectionWrapper from "./FormSectionWrapper";
import { useApplication } from "@/contexts/ApplicationContext";
import { businessInformationService } from "@/services/application";
import { OwnershipType } from "@/services/application/types";
import { useToast } from "@/hooks/use-toast";
import { useEntityData } from "@/hooks/useEntityData";
import BusinessIdentificationSection from "./BusinessIdentificationSection";
import BusinessRegistrationSection from "./BusinessRegistrationSection";
import BusinessOwnershipSection from "./BusinessOwnershipSection";
import BusinessAddressSection from "./BusinessAddressSection";
import BusinessContactSection from "./BusinessContactSection";

const BusinessInformationSection = () => {
  const { applicationId, isLoading: isAppLoading, setIsLoading } = useApplication();
  const { toast } = useToast();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [hasTouchedFields, setHasTouchedFields] = useState(false);
  
  // Define initial state for business information form with prefilled zip code
  const initialBusinessInfo = {
    application_id: applicationId || '',
    business_name: '',
    trade_name: '',
    registration_number: '',
    tin_number: '',
    sss_number: '',
    ctc_number: '',
    ctc_date_issue: '',
    ctc_place_issue: '',
    ownership_type: 'soleProprietorship' as OwnershipType,
    house_bldg_no: '',
    building_name: '',
    block_no: '',
    lot_no: '',
    street: '',
    subdivision: '',
    barangay: '',
    city_municipality: 'Lucena',
    province: 'Quezon',
    zip_code: '4301', // Prefilled with Lucena City zip code
    telephone_no: '',
    mobile_no: '',
    email_address: ''
  };

  // Use our custom hook for loading, updating, and saving data
  const {
    data: businessInfo,
    updateData,
    saveData,
    isLoading,
    hasUnsavedChanges,
    isInitialized
  } = useEntityData(
    businessInformationService.getBusinessInformation,
    businessInformationService.saveBusinessInformation,
    applicationId,
    initialBusinessInfo,
    () => {
      // This is the success callback
      setValidationErrors({});
    },
    true
  );

  // Update loading state in parent context when our loading state changes
  useEffect(() => {
    // Only set parent loading when we're not initialized yet
    if (!isInitialized) {
      setIsLoading(isLoading || isAppLoading);
    } else {
      // Once initialized, don't block parent navigation with our loading state
      setIsLoading(isAppLoading);
    }
  }, [isLoading, isAppLoading, setIsLoading, isInitialized]);

  // Required fields validation
  useEffect(() => {
    if (!hasTouchedFields) return;

    const errors: Record<string, string> = {};

    if (!businessInfo.business_name) errors.business_name = "Business name is required";
    if (!businessInfo.tin_number) errors.tin_number = "TIN is required";
    if (!businessInfo.street) errors.street = "Street is required";
    if (!businessInfo.barangay) errors.barangay = "Barangay is required";
    if (!businessInfo.zip_code) errors.zip_code = "Zip code is required";
    if (!businessInfo.mobile_no) errors.mobile_no = "Mobile number is required";
    if (!businessInfo.email_address) errors.email_address = "Email address is required";

    setValidationErrors(errors);
  }, [businessInfo, hasTouchedFields]);

  const handleFieldChange = (field: string, value: any) => {
    if (!hasTouchedFields) {
      setHasTouchedFields(true);
    }
    updateData({ [field]: value });
  };

  // This function is still needed for validation checks by the parent component
  const validateAndSave = async () => {
    console.log("BusinessInfo - Validation and save triggered with data:", businessInfo);
    
    // Validate all required fields
    const errors: Record<string, string> = {};
    if (!businessInfo.business_name) errors.business_name = "Business name is required";
    if (!businessInfo.tin_number) errors.tin_number = "TIN is required";
    if (!businessInfo.street) errors.street = "Street is required";
    if (!businessInfo.barangay) errors.barangay = "Barangay is required";
    if (!businessInfo.zip_code) errors.zip_code = "Zip code is required";
    if (!businessInfo.mobile_no) errors.mobile_no = "Mobile number is required";
    if (!businessInfo.email_address) errors.email_address = "Email address is required";
    
    setValidationErrors(errors);
    setHasTouchedFields(true);
    
    // If there are validation errors, show a toast and don't save
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      console.log("BusinessInfo - Silent save during validation, no toast will be shown");
      // Always pass false here to prevent toasts on validation
      const result = await saveData(false);
      return !!result;
    } catch (error) {
      console.error("Error in save:", error);
      return false;
    }
  };

  // Expose the validation function for the parent component
  // The parent will call this before allowing navigation to the next step
  useEffect(() => {
    if (!window.businessInfoHelpers) {
      window.businessInfoHelpers = {
        validateAndSave: validateAndSave
      };
    } else {
      window.businessInfoHelpers.validateAndSave = validateAndSave;
    }
    
    return () => {
      // Cleanup when component unmounts
      if (window.businessInfoHelpers) {
        delete window.businessInfoHelpers.validateAndSave;
      }
    };
  }, [businessInfo, hasUnsavedChanges]);

  return (
    <FormSectionWrapper 
      title="Business Information and Registration"
      description="Enter your business details and registration information"
      stepNumber={2}
    >
      <div className="space-y-8">
        <BusinessIdentificationSection
          businessName={businessInfo.business_name}
          tradeName={businessInfo.trade_name}
          onFieldChange={handleFieldChange}
          validationErrors={validationErrors}
        />

        <BusinessRegistrationSection
          registrationNumber={businessInfo.registration_number}
          tinNumber={businessInfo.tin_number}
          sssNumber={businessInfo.sss_number}
          ctcNumber={businessInfo.ctc_number}
          ctcDateIssue={businessInfo.ctc_date_issue}
          ctcPlaceIssue={businessInfo.ctc_place_issue}
          onFieldChange={handleFieldChange}
          validationErrors={validationErrors}
        />

        <BusinessOwnershipSection
          ownershipType={businessInfo.ownership_type}
          onFieldChange={handleFieldChange}
        />

        <BusinessAddressSection
          houseBldgNo={businessInfo.house_bldg_no}
          buildingName={businessInfo.building_name}
          blockNo={businessInfo.block_no}
          lotNo={businessInfo.lot_no}
          street={businessInfo.street}
          subdivision={businessInfo.subdivision}
          barangay={businessInfo.barangay}
          cityMunicipality={businessInfo.city_municipality}
          province={businessInfo.province}
          zipCode={businessInfo.zip_code}
          onFieldChange={handleFieldChange}
          validationErrors={validationErrors}
        />

        <BusinessContactSection
          telephoneNo={businessInfo.telephone_no}
          mobileNo={businessInfo.mobile_no}
          emailAddress={businessInfo.email_address}
          onFieldChange={handleFieldChange}
          validationErrors={validationErrors}
        />
      </div>
    </FormSectionWrapper>
  );
};

export default BusinessInformationSection;
