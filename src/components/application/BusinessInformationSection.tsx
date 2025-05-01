
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormSectionWrapper from "./FormSectionWrapper";
import { FormField } from "@/components/ui/form-field";
import { EnhancedRadioGroup } from "@/components/ui/enhanced-radio-group";

const BusinessInformationSection = () => {
  const [ownershipType, setOwnershipType] = useState<string>("soleProprietorship");
  const [selectedBarangay, setSelectedBarangay] = useState<string>("");

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
              required
              tooltip="Enter the official registered business name as it appears on your DTI/SEC registration"
            />
            <FormField 
              id="tradeName" 
              label="Trade Name / Franchise"
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
              required
              tooltip="Enter your Department of Trade and Industry, Securities and Exchange Commission, or Cooperative Development Authority registration number"
            />
            <FormField 
              id="tinNumber" 
              label="Tax Identification Number"
              required
              placeholder="XXX-XXX-XXX-XXX"
              tooltip="Enter your 12-digit Tax Identification Number from BIR"
            />
            <FormField 
              id="sssNumber" 
              label="SSS Number"
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
              tooltip="Enter the house or building number of your business address"
            />
            <FormField 
              id="buildingName" 
              label="Building Name"
              helperText="If applicable"
            />
            <FormField 
              id="blockNo" 
              label="Block No."
              helperText="If applicable"
            />
            <FormField 
              id="lotNo" 
              label="Lot No."
              helperText="If applicable"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <FormField 
              id="street" 
              label="Street"
              required
              tooltip="Enter the street name of your business location"
            />
            <FormField 
              id="subdivision" 
              label="Subdivision"
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
              required
              tooltip="Enter the city or municipality of your business location"
            />
            <FormField 
              id="province" 
              label="Province"
              required
              tooltip="Enter the province of your business location"
            />
            <FormField 
              id="zipCode" 
              label="Zip Code"
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
              tooltip="Enter your business landline number"
            />
            <FormField 
              id="mobileNo" 
              label="Mobile No."
              required
              tooltip="Enter a mobile number where you can be contacted"
            />
            <FormField 
              id="emailAddress" 
              type="email" 
              label="Email Address"
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
