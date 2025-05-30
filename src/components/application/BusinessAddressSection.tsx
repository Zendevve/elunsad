
import { FormField } from "@/components/ui/form-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BusinessAddressSectionProps {
  houseBldgNo: string;
  buildingName: string;
  blockNo: string;
  lotNo: string;
  street: string;
  subdivision: string;
  barangay: string;
  cityMunicipality: string;
  province: string;
  zipCode: string;
  onFieldChange: (field: string, value: string) => void;
  validationErrors: Record<string, string>;
}

const BusinessAddressSection = ({
  houseBldgNo,
  buildingName,
  blockNo,
  lotNo,
  street,
  subdivision,
  barangay,
  cityMunicipality,
  province,
  zipCode,
  onFieldChange,
  validationErrors
}: BusinessAddressSectionProps) => {
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

  return (
    <div>
      <h3 className="font-medium text-base mb-3">Business Address <span className="text-red-500">*</span></h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <FormField 
          id="houseBldgNo" 
          label="House/Bldg. No."
          value={houseBldgNo}
          onChange={(e) => onFieldChange('house_bldg_no', e.target.value)}
          tooltip="Enter the house or building number of your business address"
        />
        <FormField 
          id="buildingName" 
          label="Building Name"
          value={buildingName}
          onChange={(e) => onFieldChange('building_name', e.target.value)}
          helperText="If applicable"
        />
        <FormField 
          id="blockNo" 
          label="Block No."
          value={blockNo}
          onChange={(e) => onFieldChange('block_no', e.target.value)}
          helperText="If applicable"
        />
        <FormField 
          id="lotNo" 
          label="Lot No."
          value={lotNo}
          onChange={(e) => onFieldChange('lot_no', e.target.value)}
          helperText="If applicable"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <FormField 
          id="street" 
          label="Street"
          value={street}
          onChange={(e) => onFieldChange('street', e.target.value)}
          required
          tooltip="Enter the street name of your business location"
          error={validationErrors.street}
        />
        <FormField 
          id="subdivision" 
          label="Subdivision"
          value={subdivision}
          onChange={(e) => onFieldChange('subdivision', e.target.value)}
          helperText="If applicable"
        />
        <div className="space-y-1.5">
          <div className="relative">
            <Select 
              value={barangay} 
              onValueChange={(value) => onFieldChange('barangay', value)}
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
          value={cityMunicipality}
          onChange={(e) => onFieldChange('city_municipality', e.target.value)}
          required
          tooltip="Enter the city or municipality of your business location"
        />
        <FormField 
          id="province" 
          label="Province"
          value={province}
          onChange={(e) => onFieldChange('province', e.target.value)}
          required
          tooltip="Enter the province of your business location"
        />
        <FormField 
          id="zipCode" 
          label="Zip Code"
          value={zipCode}
          onChange={(e) => onFieldChange('zip_code', e.target.value)}
          required
          tooltip="Enter the postal or zip code of your business location"
          error={validationErrors.zip_code}
        />
      </div>
    </div>
  );
};

export default BusinessAddressSection;
