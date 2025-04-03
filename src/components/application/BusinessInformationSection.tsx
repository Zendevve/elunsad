
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormSectionWrapper from "./FormSectionWrapper";

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
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-sm">Business Name <span className="text-red-500">*</span></Label>
              <Input id="businessName" placeholder="Enter official business name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tradeName" className="text-sm">Trade Name / Franchise</Label>
              <Input id="tradeName" placeholder="If different from business name" />
              <p className="text-xs text-muted-foreground mt-1">Leave blank if same as business name</p>
            </div>
          </div>
        </div>

        {/* Registration Numbers */}
        <div>
          <h3 className="font-medium text-base mb-3">Registration Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dtiSecCdaNumber" className="text-sm">DTI/SEC/CDA Registration No. <span className="text-red-500">*</span></Label>
              <Input id="dtiSecCdaNumber" placeholder="Registration number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tinNumber" className="text-sm">Tax Identification Number <span className="text-red-500">*</span></Label>
              <Input id="tinNumber" placeholder="Format: XXX-XXX-XXX-XXX" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sssNumber" className="text-sm">SSS Number</Label>
              <Input id="sssNumber" placeholder="Format: XX-XXXXXXX-X" />
            </div>
          </div>
        </div>

        {/* Kind of Ownership */}
        <div>
          <h3 className="font-medium text-base mb-3">Ownership Type <span className="text-red-500">*</span></h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <div className="relative">
              <input
                type="radio"
                id="soleProprietorship"
                name="ownershipType"
                value="soleProprietorship"
                checked={ownershipType === 'soleProprietorship'}
                onChange={() => setOwnershipType('soleProprietorship')}
                className="peer absolute opacity-0 w-full h-full cursor-pointer"
              />
              <label
                htmlFor="soleProprietorship"
                className="flex flex-col items-center justify-center h-full p-3 border rounded-md peer-checked:border-primary peer-checked:bg-primary/5 cursor-pointer transition-colors"
              >
                <span className="text-center text-sm font-medium">Sole Proprietorship</span>
              </label>
            </div>
            
            <div className="relative">
              <input
                type="radio"
                id="onePersonCorp"
                name="ownershipType"
                value="onePersonCorp"
                checked={ownershipType === 'onePersonCorp'}
                onChange={() => setOwnershipType('onePersonCorp')}
                className="peer absolute opacity-0 w-full h-full cursor-pointer"
              />
              <label
                htmlFor="onePersonCorp"
                className="flex flex-col items-center justify-center h-full p-3 border rounded-md peer-checked:border-primary peer-checked:bg-primary/5 cursor-pointer transition-colors"
              >
                <span className="text-center text-sm font-medium">One Person Corp</span>
              </label>
            </div>
            
            <div className="relative">
              <input
                type="radio"
                id="partnership"
                name="ownershipType"
                value="partnership"
                checked={ownershipType === 'partnership'}
                onChange={() => setOwnershipType('partnership')}
                className="peer absolute opacity-0 w-full h-full cursor-pointer"
              />
              <label
                htmlFor="partnership"
                className="flex flex-col items-center justify-center h-full p-3 border rounded-md peer-checked:border-primary peer-checked:bg-primary/5 cursor-pointer transition-colors"
              >
                <span className="text-center text-sm font-medium">Partnership</span>
              </label>
            </div>
            
            <div className="relative">
              <input
                type="radio"
                id="corporation"
                name="ownershipType"
                value="corporation"
                checked={ownershipType === 'corporation'}
                onChange={() => setOwnershipType('corporation')}
                className="peer absolute opacity-0 w-full h-full cursor-pointer"
              />
              <label
                htmlFor="corporation"
                className="flex flex-col items-center justify-center h-full p-3 border rounded-md peer-checked:border-primary peer-checked:bg-primary/5 cursor-pointer transition-colors"
              >
                <span className="text-center text-sm font-medium">Corporation</span>
              </label>
            </div>
            
            <div className="relative">
              <input
                type="radio"
                id="cooperative"
                name="ownershipType"
                value="cooperative"
                checked={ownershipType === 'cooperative'}
                onChange={() => setOwnershipType('cooperative')}
                className="peer absolute opacity-0 w-full h-full cursor-pointer"
              />
              <label
                htmlFor="cooperative"
                className="flex flex-col items-center justify-center h-full p-3 border rounded-md peer-checked:border-primary peer-checked:bg-primary/5 cursor-pointer transition-colors"
              >
                <span className="text-center text-sm font-medium">Cooperative</span>
              </label>
            </div>
          </div>
        </div>

        {/* Business Address */}
        <div>
          <h3 className="font-medium text-base mb-3">Business Address <span className="text-red-500">*</span></h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="houseBldgNo" className="text-sm">House/Bldg. No.</Label>
              <Input id="houseBldgNo" placeholder="Enter number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buildingName" className="text-sm">Building Name</Label>
              <Input id="buildingName" placeholder="If applicable" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blockNo" className="text-sm">Block No.</Label>
              <Input id="blockNo" placeholder="If applicable" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lotNo" className="text-sm">Lot No.</Label>
              <Input id="lotNo" placeholder="If applicable" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="street" className="text-sm">Street <span className="text-red-500">*</span></Label>
              <Input id="street" placeholder="Enter street name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subdivision" className="text-sm">Subdivision</Label>
              <Input id="subdivision" placeholder="If applicable" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barangay" className="text-sm">Barangay <span className="text-red-500">*</span></Label>
              <Select value={selectedBarangay} onValueChange={setSelectedBarangay}>
                <SelectTrigger id="barangay" className="w-full">
                  <SelectValue placeholder="Select barangay" />
                </SelectTrigger>
                <SelectContent>
                  {barangays.map((barangay) => (
                    <SelectItem key={barangay} value={barangay}>
                      {barangay}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cityMunicipality" className="text-sm">City/Municipality <span className="text-red-500">*</span></Label>
              <Input id="cityMunicipality" placeholder="Enter city/municipality" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province" className="text-sm">Province <span className="text-red-500">*</span></Label>
              <Input id="province" placeholder="Enter province" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-sm">Zip Code <span className="text-red-500">*</span></Label>
              <Input id="zipCode" placeholder="Enter zip code" />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="font-medium text-base mb-3">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telephoneNo" className="text-sm">Telephone No.</Label>
              <Input id="telephoneNo" placeholder="Enter telephone number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobileNo" className="text-sm">Mobile No. <span className="text-red-500">*</span></Label>
              <Input id="mobileNo" placeholder="Enter mobile number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailAddress" className="text-sm">Email Address <span className="text-red-500">*</span></Label>
              <Input id="emailAddress" type="email" placeholder="Enter email address" />
            </div>
          </div>
        </div>
      </div>
    </FormSectionWrapper>
  );
};

export default BusinessInformationSection;
