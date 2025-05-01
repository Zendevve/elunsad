
import { useState } from "react";
import FormSectionWrapper from "./FormSectionWrapper";
import { FormField } from "@/components/ui/form-field";
import { EnhancedRadioGroup } from "@/components/ui/enhanced-radio-group";

const OwnerInformationSection = () => {
  const [civilStatus, setCivilStatus] = useState<string>("single");
  const [sex, setSex] = useState<string>("male");
  const [nationality, setNationality] = useState<string>("filipino");

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
              required
              tooltip="Enter your legal last name"
            />
            <FormField
              id="givenName"
              label="First Name"
              required
              tooltip="Enter your legal first name"
            />
            <FormField
              id="middleName"
              label="Middle Name"
              tooltip="Enter your middle name"
            />
            <FormField
              id="suffix"
              label="Suffix"
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
            />
            <FormField 
              id="ownerBuildingName" 
              label="Building Name"
              helperText="If applicable"
            />
            <FormField 
              id="ownerBlockNo" 
              label="Block No."
              helperText="If applicable"
            />
            <FormField 
              id="ownerLotNo" 
              label="Lot No."
              helperText="If applicable"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <FormField 
              id="ownerStreet" 
              label="Street"
              required
            />
            <FormField 
              id="ownerSubdivision" 
              label="Subdivision"
              helperText="If applicable"
            />
            <FormField 
              id="ownerBarangay" 
              label="Barangay"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField 
              id="ownerCityMunicipality" 
              label="City/Municipality"
              required
            />
            <FormField 
              id="ownerProvince" 
              label="Province"
              required
            />
            <FormField 
              id="ownerZipCode" 
              label="Zip Code"
              required
            />
          </div>
        </div>
      </div>
    </FormSectionWrapper>
  );
};

export default OwnerInformationSection;
