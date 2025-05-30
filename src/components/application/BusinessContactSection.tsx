
import { FormField } from "@/components/ui/form-field";

interface BusinessContactSectionProps {
  telephoneNo: string;
  mobileNo: string;
  emailAddress: string;
  onFieldChange: (field: string, value: string) => void;
  validationErrors: Record<string, string>;
}

const BusinessContactSection = ({
  telephoneNo,
  mobileNo,
  emailAddress,
  onFieldChange,
  validationErrors
}: BusinessContactSectionProps) => {
  return (
    <div>
      <h3 className="font-medium text-base mb-3">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField 
          id="telephoneNo" 
          label="Telephone No."
          value={telephoneNo}
          onChange={(e) => onFieldChange('telephone_no', e.target.value)}
          tooltip="Enter your business landline number"
        />
        <FormField 
          id="mobileNo" 
          label="Mobile No."
          value={mobileNo}
          onChange={(e) => onFieldChange('mobile_no', e.target.value)}
          required
          tooltip="Enter a mobile number where you can be contacted"
          error={validationErrors.mobile_no}
        />
        <FormField 
          id="emailAddress" 
          type="email" 
          label="Email Address"
          value={emailAddress}
          onChange={(e) => onFieldChange('email_address', e.target.value)}
          required
          tooltip="Enter an active email address for communications"
          error={validationErrors.email_address}
        />
      </div>
    </div>
  );
};

export default BusinessContactSection;
