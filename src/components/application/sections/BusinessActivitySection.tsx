
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BusinessActivitySectionProps {
  businessActivity: string;
  setBusinessActivity: (value: string) => void;
  otherActivity: string;
  setOtherActivity: (value: string) => void;
  businessArea: number | null;
  setBusinessArea: (value: number | null) => void;
  capitalization: number | null;
  setCapitalization: (value: number | null) => void;
  onInputBlur: () => void;
}

const BusinessActivitySection = ({
  businessActivity,
  setBusinessActivity,
  otherActivity,
  setOtherActivity,
  businessArea,
  setBusinessArea,
  capitalization,
  setCapitalization,
  onInputBlur
}: BusinessActivitySectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Basic Business Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="businessActivity">Business Activity/Description</Label>
            <Input 
              id="businessActivity" 
              placeholder="Describe your business activities" 
              value={businessActivity}
              onChange={(e) => setBusinessActivity(e.target.value)}
              onBlur={onInputBlur}
            />
          </div>

          <div>
            <Label htmlFor="otherActivity">Other Activity</Label>
            <Input 
              id="otherActivity" 
              placeholder="Describe any other activities" 
              value={otherActivity}
              onChange={(e) => setOtherActivity(e.target.value)}
              onBlur={onInputBlur}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="businessArea">Business Area (sqm)</Label>
            <Input 
              id="businessArea" 
              type="number" 
              placeholder="Area in square meters" 
              value={businessArea || ''}
              onChange={(e) => setBusinessArea(e.target.value ? Number(e.target.value) : null)}
              onBlur={onInputBlur}
            />
          </div>

          <div>
            <Label htmlFor="capitalization">Capitalization (PHP)</Label>
            <Input 
              id="capitalization" 
              type="number" 
              placeholder="Amount in Philippine Peso" 
              value={capitalization || ''}
              onChange={(e) => setCapitalization(e.target.value ? Number(e.target.value) : null)}
              onBlur={onInputBlur}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessActivitySection;
