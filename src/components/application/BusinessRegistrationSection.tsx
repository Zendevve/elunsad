
import { FormField } from "@/components/ui/form-field";

interface BusinessRegistrationSectionProps {
  registrationNumber: string;
  tinNumber: string;
  sssNumber: string;
  ctcNumber: string;
  ctcDateIssue: string;
  ctcPlaceIssue: string;
  onFieldChange: (field: string, value: string) => void;
  validationErrors: Record<string, string>;
}

const BusinessRegistrationSection = ({
  registrationNumber,
  tinNumber,
  sssNumber,
  ctcNumber,
  ctcDateIssue,
  ctcPlaceIssue,
  onFieldChange,
  validationErrors
}: BusinessRegistrationSectionProps) => {
  return (
    <div>
      <h3 className="font-medium text-base mb-3">Registration Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <FormField 
          id="dtiSecCdaNumber" 
          label="DTI/SEC/CDA Registration No."
          value={registrationNumber}
          onChange={(e) => onFieldChange('registration_number', e.target.value)}
          tooltip="Enter your Department of Trade and Industry, Securities and Exchange Commission, or Cooperative Development Authority registration number"
        />
        <FormField 
          id="tinNumber" 
          label="Tax Identification Number"
          value={tinNumber}
          onChange={(e) => onFieldChange('tin_number', e.target.value)}
          required
          placeholder="XXX-XXX-XXX-XXX"
          tooltip="Enter your 12-digit Tax Identification Number from BIR"
          error={validationErrors.tin_number}
        />
        <FormField 
          id="sssNumber" 
          label="SSS Number"
          value={sssNumber}
          onChange={(e) => onFieldChange('sss_number', e.target.value)}
          placeholder="XX-XXXXXXX-X"
          tooltip="Enter your Social Security System employer number"
        />
      </div>
      
      {/* CTC Information - New Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField 
          id="ctcNumber" 
          label="CTC Number"
          value={ctcNumber}
          onChange={(e) => onFieldChange('ctc_number', e.target.value)}
          tooltip="Enter your Community Tax Certificate (CTC) number"
        />
        <FormField 
          id="ctcDateIssue" 
          label="CTC Date of Issue"
          value={ctcDateIssue}
          onChange={(e) => onFieldChange('ctc_date_issue', e.target.value)}
          tooltip="Enter the date when your CTC was issued"
          type="date"
        />
        <FormField 
          id="ctcPlaceIssue" 
          label="CTC Place of Issue"
          value={ctcPlaceIssue}
          onChange={(e) => onFieldChange('ctc_place_issue', e.target.value)}
          tooltip="Enter where your CTC was issued"
        />
      </div>
    </div>
  );
};

export default BusinessRegistrationSection;
