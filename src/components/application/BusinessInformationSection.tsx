
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormSectionWrapper from "./FormSectionWrapper";
import { FormField } from "@/components/form/FormField";
import { EnhancedRadioGroup } from "@/components/ui/enhanced-radio-group";
import { useApplication } from "@/contexts/ApplicationContext";
import { businessInformationService } from "@/services/application";
import { OwnershipType } from "@/services/application/types";
import { useToast } from "@/components/ui/use-toast";
import { useEntityData } from "@/hooks/useEntityData";
import { Button } from "@/components/ui/button";
import { Save, Check } from "lucide-react";

const BusinessInformationSection = () => {
  const { applicationId, isLoading: isAppLoading, setIsLoading } = useApplication();
  const { toast } = useToast();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [hasTouchedFields, setHasTouchedFields] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Define initial state for business information form
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
    zip_code: '',
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
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
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

  const handleFieldChange = (field: string, value: any) => {
    if (!hasTouchedFields) {
      setHasTouchedFields(true);
    }
    updateData({ [field]: value });
  };

  const handleManualSave = async () => {
    console.log("Manual save triggered with data:", businessInfo);
    
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
    
    // If there are validation errors, show a toast and don't save
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields before saving.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await saveData();
    } catch (error) {
      console.error("Error in manual save:", error);
    }
  };

  return (
    <FormSectionWrapper 
      title="Business Information and Registration"
      description="Enter your business details and registration information"
      stepNumber={2}
    >
      <div className="space-y-8">
        {/* Save Button at Top with Success State */}
        <div className="flex justify-end">
          <Button 
            onClick={handleManualSave} 
            className={saveSuccess ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"} 
            disabled={isLoading || (!hasUnsavedChanges() && !saveSuccess)}
          >
            {saveSuccess ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Saved Successfully
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Information
              </>
            )}
          </Button>
        </div>
      
        {/* Business Name and Trade Name */}
        <div>
          <h3 className="font-medium text-base mb-3">Business Identification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField 
              id="businessName" 
              label="Business Name"
              value={businessInfo.business_name}
              onChange={(e) => handleFieldChange('business_name', e.target.value)}
              required
              tooltip="Enter the official registered business name as it appears on your DTI/SEC registration"
              error={validationErrors.business_name}
            />
            <FormField 
              id="tradeName" 
              label="Trade Name / Franchise"
              value={businessInfo.trade_name}
              onChange={(e) => handleFieldChange('trade_name', e.target.value)}
              helperText="Leave blank if same as business name"
              tooltip="Enter the name you use for your business if different from the registered business name"
            />
          </div>
        </div>

        {/* Registration Numbers */}
        <div>
          <h3 className="font-medium text-base mb-3">Registration Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <FormField 
              id="dtiSecCdaNumber" 
              label="DTI/SEC/CDA Registration No."
              value={businessInfo.registration_number}
              onChange={(e) => handleFieldChange('registration_number', e.target.value)}
              tooltip="Enter your Department of Trade and Industry, Securities and Exchange Commission, or Cooperative Development Authority registration number"
            />
            <FormField 
              id="tinNumber" 
              label="Tax Identification Number"
              value={businessInfo.tin_number}
              onChange={(e) => handleFieldChange('tin_number', e.target.value)}
              required
              placeholder="XXX-XXX-XXX-XXX"
              tooltip="Enter your 12-digit Tax Identification Number from BIR"
              error={validationErrors.tin_number}
            />
            <FormField 
              id="sssNumber" 
              label="SSS Number"
              value={businessInfo.sss_number}
              onChange={(e) => handleFieldChange('sss_number', e.target.value)}
              placeholder="XX-XXXXXXX-X"
              tooltip="Enter your Social Security System employer number"
            />
          </div>
          
          {/* CTC Information - New Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField 
              id="ctcNumber" 
              label="CTC Number"
              value={businessInfo.ctc_number}
              onChange={(e) => handleFieldChange('ctc_number', e.target.value)}
              tooltip="Enter your Community Tax Certificate (CTC) number"
            />
            <FormField 
              id="ctcDateIssue" 
              label="CTC Date of Issue"
              value={businessInfo.ctc_date_issue}
              onChange={(e) => handleFieldChange('ctc_date_issue', e.target.value)}
              tooltip="Enter the date when your CTC was issued"
              type="date"
            />
            <FormField 
              id="ctcPlaceIssue" 
              label="CTC Place of Issue"
              value={businessInfo.ctc_place_issue}
              onChange={(e) => handleFieldChange('ctc_place_issue', e.target.value)}
              tooltip="Enter where your CTC was issued"
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
              value={businessInfo.ownership_type}
              onValueChange={(value) => handleFieldChange('ownership_type', value)}
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
              value={businessInfo.house_bldg_no}
              onChange={(e) => handleFieldChange('house_bldg_no', e.target.value)}
              tooltip="Enter the house or building number of your business address"
            />
            <FormField 
              id="buildingName" 
              label="Building Name"
              value={businessInfo.building_name}
              onChange={(e) => handleFieldChange('building_name', e.target.value)}
              helperText="If applicable"
            />
            <FormField 
              id="blockNo" 
              label="Block No."
              value={businessInfo.block_no}
              onChange={(e) => handleFieldChange('block_no', e.target.value)}
              helperText="If applicable"
            />
            <FormField 
              id="lotNo" 
              label="Lot No."
              value={businessInfo.lot_no}
              onChange={(e) => handleFieldChange('lot_no', e.target.value)}
              helperText="If applicable"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <FormField 
              id="street" 
              label="Street"
              value={businessInfo.street}
              onChange={(e) => handleFieldChange('street', e.target.value)}
              required
              tooltip="Enter the street name of your business location"
              error={validationErrors.street}
            />
            <FormField 
              id="subdivision" 
              label="Subdivision"
              value={businessInfo.subdivision}
              onChange={(e) => handleFieldChange('subdivision', e.target.value)}
              helperText="If applicable"
            />
            <div className="space-y-1.5">
              <div className="relative">
                <Select 
                  value={businessInfo.barangay} 
                  onValueChange={(value) => handleFieldChange('barangay', value)}
                >
                  <SelectTrigger id="barangay" className={`h-14 pt-4 ${validationErrors.barangay ? 'border-red-500' : ''}`}>
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
                {validationErrors.barangay && (
                  <p className="text-xs text-red-500 mt-1">Barangay is required</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField 
              id="cityMunicipality" 
              label="City/Municipality"
              value={businessInfo.city_municipality}
              onChange={(e) => handleFieldChange('city_municipality', e.target.value)}
              required
              tooltip="Enter the city or municipality of your business location"
            />
            <FormField 
              id="province" 
              label="Province"
              value={businessInfo.province}
              onChange={(e) => handleFieldChange('province', e.target.value)}
              required
              tooltip="Enter the province of your business location"
            />
            <FormField 
              id="zipCode" 
              label="Zip Code"
              value={businessInfo.zip_code}
              onChange={(e) => handleFieldChange('zip_code', e.target.value)}
              required
              tooltip="Enter the postal or zip code of your business location"
              error={validationErrors.zip_code}
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
              value={businessInfo.telephone_no}
              onChange={(e) => handleFieldChange('telephone_no', e.target.value)}
              tooltip="Enter your business landline number"
            />
            <FormField 
              id="mobileNo" 
              label="Mobile No."
              value={businessInfo.mobile_no}
              onChange={(e) => handleFieldChange('mobile_no', e.target.value)}
              required
              tooltip="Enter a mobile number where you can be contacted"
              error={validationErrors.mobile_no}
            />
            <FormField 
              id="emailAddress" 
              type="email" 
              label="Email Address"
              value={businessInfo.email_address}
              onChange={(e) => handleFieldChange('email_address', e.target.value)}
              required
              tooltip="Enter an active email address for communications"
              error={validationErrors.email_address}
            />
          </div>
        </div>

        {/* Bottom Save Button with Success State */}
        <div className="flex justify-end">
          <Button 
            onClick={handleManualSave} 
            className={saveSuccess ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"} 
            disabled={isLoading || (!hasUnsavedChanges() && !saveSuccess)}
          >
            {saveSuccess ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Saved Successfully
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Information
              </>
            )}
          </Button>
        </div>
      </div>
    </FormSectionWrapper>
  );
};

export default BusinessInformationSection;
