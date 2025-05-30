
import { EnhancedRadioGroup } from "@/components/ui/enhanced-radio-group";
import { OwnershipType } from "@/services/application/types";

interface BusinessOwnershipSectionProps {
  ownershipType: OwnershipType;
  onFieldChange: (field: string, value: OwnershipType) => void;
}

const BusinessOwnershipSection = ({
  ownershipType,
  onFieldChange
}: BusinessOwnershipSectionProps) => {
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
    <div>
      <h3 className="font-medium text-base mb-3">
        Ownership Type <span className="text-red-500">*</span>
      </h3>
      <div className="mt-2">
        <EnhancedRadioGroup
          options={ownershipOptions}
          value={ownershipType}
          onValueChange={(value) => onFieldChange('ownership_type', value as OwnershipType)}
          orientation="horizontal"
          name="ownershipType"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        />
      </div>
    </div>
  );
};

export default BusinessOwnershipSection;
