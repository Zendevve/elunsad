
import { FormField } from "@/components/ui/form-field";

interface BusinessIdentificationSectionProps {
  businessName: string;
  tradeName: string;
  onFieldChange: (field: string, value: string) => void;
  validationErrors: Record<string, string>;
}

const BusinessIdentificationSection = ({
  businessName,
  tradeName,
  onFieldChange,
  validationErrors
}: BusinessIdentificationSectionProps) => {
  return (
    <div>
      <h3 className="font-medium text-base mb-3">Business Identification</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField 
          id="businessName" 
          label="Business Name"
          value={businessName}
          onChange={(e) => onFieldChange('business_name', e.target.value)}
          required
          tooltip="Enter the official registered business name as it appears on your DTI/SEC registration"
          error={validationErrors.business_name}
        />
        <FormField 
          id="tradeName" 
          label="Trade Name / Franchise"
          value={tradeName}
          onChange={(e) => onFieldChange('trade_name', e.target.value)}
          helperText="Leave blank if same as business name"
          tooltip="Enter the name you use for your business if different from the registered business name"
        />
      </div>
    </div>
  );
};

export default BusinessIdentificationSection;
