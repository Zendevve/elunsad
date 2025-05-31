
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PropertyInformationSectionProps {
  propertyOwned: boolean;
  setPropertyOwned: (value: boolean) => void;
  monthlyRental: number | null;
  setMonthlyRental: (value: number | null) => void;
  taxDeclarationNo: string;
  setTaxDeclarationNo: (value: string) => void;
  hasTaxIncentives: boolean;
  setHasTaxIncentives: (value: boolean) => void;
  onInputBlur: () => void;
  onSaveBusinessOperations: () => void;
}

const PropertyInformationSection = ({
  propertyOwned,
  setPropertyOwned,
  monthlyRental,
  setMonthlyRental,
  taxDeclarationNo,
  setTaxDeclarationNo,
  hasTaxIncentives,
  setHasTaxIncentives,
  onInputBlur,
  onSaveBusinessOperations
}: PropertyInformationSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Property Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="propertyOwned" 
              checked={propertyOwned} 
              onCheckedChange={(checked) => {
                setPropertyOwned(checked);
                onSaveBusinessOperations();
              }}
            />
            <Label htmlFor="propertyOwned">Property is Owned</Label>
          </div>

          {!propertyOwned && (
            <div>
              <Label htmlFor="monthlyRental">Monthly Rental (PHP)</Label>
              <Input 
                id="monthlyRental" 
                type="number" 
                placeholder="Monthly rental amount" 
                value={monthlyRental || ''}
                onChange={(e) => setMonthlyRental(e.target.value ? Number(e.target.value) : null)}
                onBlur={onInputBlur}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="taxDeclarationNo">Tax Declaration Number</Label>
            <Input 
              id="taxDeclarationNo" 
              placeholder="Property tax declaration number" 
              value={taxDeclarationNo}
              onChange={(e) => setTaxDeclarationNo(e.target.value)}
              onBlur={onInputBlur}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="taxIncentives" 
              checked={hasTaxIncentives} 
              onCheckedChange={(checked) => {
                setHasTaxIncentives(checked);
                onSaveBusinessOperations();
              }}
            />
            <Label htmlFor="taxIncentives">Has Tax Incentives</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInformationSection;
