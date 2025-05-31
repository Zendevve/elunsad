
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface AddressInformationSectionProps {
  propertyOwned: boolean;
  mainHouseBldgNo: string;
  setMainHouseBldgNo: (value: string) => void;
  mainBuildingName: string;
  setMainBuildingName: (value: string) => void;
  mainBlockNo: string;
  setMainBlockNo: (value: string) => void;
  mainLotNo: string;
  setMainLotNo: (value: string) => void;
  mainStreet: string;
  setMainStreet: (value: string) => void;
  mainSubdivision: string;
  setMainSubdivision: (value: string) => void;
  mainBarangay: string;
  setMainBarangay: (value: string) => void;
  mainCityMunicipality: string;
  setMainCityMunicipality: (value: string) => void;
  mainProvince: string;
  setMainProvince: (value: string) => void;
  mainZipCode: string;
  setMainZipCode: (value: string) => void;
  lessorFullName: string;
  setLessorFullName: (value: string) => void;
  lessorBusinessName: string;
  setLessorBusinessName: (value: string) => void;
  lessorAddress: string;
  setLessorAddress: (value: string) => void;
  lessorContactNumber: string;
  setLessorContactNumber: (value: string) => void;
  lessorEmailAddress: string;
  setLessorEmailAddress: (value: string) => void;
  onInputBlur: () => void;
}

const AddressInformationSection = ({
  propertyOwned,
  mainHouseBldgNo,
  setMainHouseBldgNo,
  mainBuildingName,
  setMainBuildingName,
  mainBlockNo,
  setMainBlockNo,
  mainLotNo,
  setMainLotNo,
  mainStreet,
  setMainStreet,
  mainSubdivision,
  setMainSubdivision,
  mainBarangay,
  setMainBarangay,
  mainCityMunicipality,
  setMainCityMunicipality,
  mainProvince,
  setMainProvince,
  mainZipCode,
  setMainZipCode,
  lessorFullName,
  setLessorFullName,
  lessorBusinessName,
  setLessorBusinessName,
  lessorAddress,
  setLessorAddress,
  lessorContactNumber,
  setLessorContactNumber,
  lessorEmailAddress,
  setLessorEmailAddress,
  onInputBlur
}: AddressInformationSectionProps) => {
  const [mainOfficeOpen, setMainOfficeOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Main Office Address Section */}
      <Collapsible open={mainOfficeOpen} onOpenChange={setMainOfficeOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <h3 className="text-lg font-medium">Main Office Address (if different from business address)</h3>
          <ChevronDown className={`h-4 w-4 transition-transform ${mainOfficeOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mainHouseBldgNo">House/Building No.</Label>
              <Input 
                id="mainHouseBldgNo" 
                placeholder="House/Building number" 
                value={mainHouseBldgNo}
                onChange={(e) => setMainHouseBldgNo(e.target.value)}
                onBlur={onInputBlur}
              />
            </div>
            <div>
              <Label htmlFor="mainBuildingName">Building Name</Label>
              <Input 
                id="mainBuildingName" 
                placeholder="Building name" 
                value={mainBuildingName}
                onChange={(e) => setMainBuildingName(e.target.value)}
                onBlur={onInputBlur}
              />
            </div>
            <div>
              <Label htmlFor="mainBlockNo">Block No.</Label>
              <Input 
                id="mainBlockNo" 
                placeholder="Block number" 
                value={mainBlockNo}
                onChange={(e) => setMainBlockNo(e.target.value)}
                onBlur={onInputBlur}
              />
            </div>
            <div>
              <Label htmlFor="mainLotNo">Lot No.</Label>
              <Input 
                id="mainLotNo" 
                placeholder="Lot number" 
                value={mainLotNo}
                onChange={(e) => setMainLotNo(e.target.value)}
                onBlur={onInputBlur}
              />
            </div>
            <div>
              <Label htmlFor="mainStreet">Street</Label>
              <Input 
                id="mainStreet" 
                placeholder="Street name" 
                value={mainStreet}
                onChange={(e) => setMainStreet(e.target.value)}
                onBlur={onInputBlur}
              />
            </div>
            <div>
              <Label htmlFor="mainSubdivision">Subdivision</Label>
              <Input 
                id="mainSubdivision" 
                placeholder="Subdivision name" 
                value={mainSubdivision}
                onChange={(e) => setMainSubdivision(e.target.value)}
                onBlur={onInputBlur}
              />
            </div>
            <div>
              <Label htmlFor="mainBarangay">Barangay</Label>
              <Input 
                id="mainBarangay" 
                placeholder="Barangay name" 
                value={mainBarangay}
                onChange={(e) => setMainBarangay(e.target.value)}
                onBlur={onInputBlur}
              />
            </div>
            <div>
              <Label htmlFor="mainCityMunicipality">City/Municipality</Label>
              <Input 
                id="mainCityMunicipality" 
                placeholder="City or municipality" 
                value={mainCityMunicipality}
                onChange={(e) => setMainCityMunicipality(e.target.value)}
                onBlur={onInputBlur}
              />
            </div>
            <div>
              <Label htmlFor="mainProvince">Province</Label>
              <Input 
                id="mainProvince" 
                placeholder="Province name" 
                value={mainProvince}
                onChange={(e) => setMainProvince(e.target.value)}
                onBlur={onInputBlur}
              />
            </div>
            <div>
              <Label htmlFor="mainZipCode">ZIP Code</Label>
              <Input 
                id="mainZipCode" 
                placeholder="ZIP code" 
                value={mainZipCode}
                onChange={(e) => setMainZipCode(e.target.value)}
                onBlur={onInputBlur}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Lessor Information (appears only when property is rented) */}
      {!propertyOwned && (
        <div className="space-y-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-medium text-yellow-800">Lessor Information</h3>
          <p className="text-sm text-yellow-700">Please provide information about the property owner/lessor.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lessorFullName">Lessor Full Name</Label>
              <Input 
                id="lessorFullName" 
                placeholder="Full name of lessor" 
                value={lessorFullName}
                onChange={(e) => setLessorFullName(e.target.value)}
                onBlur={onInputBlur}
              />
            </div>
            <div>
              <Label htmlFor="lessorBusinessName">Lessor Business Name</Label>
              <Input 
                id="lessorBusinessName" 
                placeholder="Business name (if applicable)" 
                value={lessorBusinessName}
                onChange={(e) => setLessorBusinessName(e.target.value)}
                onBlur={onInputBlur}
              />
            </div>
            <div>
              <Label htmlFor="lessorContactNumber">Contact Number</Label>
              <Input 
                id="lessorContactNumber" 
                placeholder="Lessor contact number" 
                value={lessorContactNumber}
                onChange={(e) => setLessorContactNumber(e.target.value)}
                onBlur={onInputBlur}
              />
            </div>
            <div>
              <Label htmlFor="lessorEmailAddress">Email Address</Label>
              <Input 
                id="lessorEmailAddress" 
                type="email"
                placeholder="Lessor email address" 
                value={lessorEmailAddress}
                onChange={(e) => setLessorEmailAddress(e.target.value)}
                onBlur={onInputBlur}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="lessorAddress">Lessor Address</Label>
              <Input 
                id="lessorAddress" 
                placeholder="Complete address of lessor" 
                value={lessorAddress}
                onChange={(e) => setLessorAddress(e.target.value)}
                onBlur={onInputBlur}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressInformationSection;
