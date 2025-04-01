
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormSectionWrapper from "./FormSectionWrapper";

const OwnerInformationSection = () => {
  const [civilStatus, setCivilStatus] = useState<string>("single");
  const [sex, setSex] = useState<string>("male");
  const [nationality, setNationality] = useState<string>("filipino");

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
            <div className="space-y-2">
              <Label htmlFor="surname" className="text-sm">Last Name</Label>
              <Input id="surname" placeholder="Enter last name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="givenName" className="text-sm">First Name</Label>
              <Input id="givenName" placeholder="Enter first name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName" className="text-sm">Middle Name</Label>
              <Input id="middleName" placeholder="Enter middle name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suffix" className="text-sm">Suffix</Label>
              <Input id="suffix" placeholder="Jr, Sr, III, etc." />
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div>
          <h3 className="font-medium text-base mb-3">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Civil Status */}
            <div>
              <Label className="text-sm block mb-3">Civil Status <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-1 gap-2">
                <div className="relative">
                  <input
                    type="radio"
                    id="single"
                    name="civilStatus"
                    value="single"
                    checked={civilStatus === 'single'}
                    onChange={() => setCivilStatus('single')}
                    className="peer absolute opacity-0 w-full h-full cursor-pointer"
                  />
                  <label
                    htmlFor="single"
                    className="flex items-center p-2 border rounded-md peer-checked:border-primary peer-checked:bg-primary/5 cursor-pointer transition-colors"
                  >
                    <div className="w-4 h-4 border rounded-full mr-2 flex items-center justify-center peer-checked:border-primary">
                      {civilStatus === 'single' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                    </div>
                    <span className="text-sm">Single</span>
                  </label>
                </div>
                
                <div className="relative">
                  <input
                    type="radio"
                    id="married"
                    name="civilStatus"
                    value="married"
                    checked={civilStatus === 'married'}
                    onChange={() => setCivilStatus('married')}
                    className="peer absolute opacity-0 w-full h-full cursor-pointer"
                  />
                  <label
                    htmlFor="married"
                    className="flex items-center p-2 border rounded-md peer-checked:border-primary peer-checked:bg-primary/5 cursor-pointer transition-colors"
                  >
                    <div className="w-4 h-4 border rounded-full mr-2 flex items-center justify-center">
                      {civilStatus === 'married' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                    </div>
                    <span className="text-sm">Married</span>
                  </label>
                </div>
                
                <div className="relative">
                  <input
                    type="radio"
                    id="widowed"
                    name="civilStatus"
                    value="widowed"
                    checked={civilStatus === 'widowed'}
                    onChange={() => setCivilStatus('widowed')}
                    className="peer absolute opacity-0 w-full h-full cursor-pointer"
                  />
                  <label
                    htmlFor="widowed"
                    className="flex items-center p-2 border rounded-md peer-checked:border-primary peer-checked:bg-primary/5 cursor-pointer transition-colors"
                  >
                    <div className="w-4 h-4 border rounded-full mr-2 flex items-center justify-center">
                      {civilStatus === 'widowed' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                    </div>
                    <span className="text-sm">Widowed</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm">Age <span className="text-red-500">*</span></Label>
              <Input id="age" type="number" placeholder="Enter age" min="18" />
            </div>
            
            {/* Sex */}
            <div>
              <Label className="text-sm block mb-3">Sex <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="radio"
                    id="male"
                    name="sex"
                    value="male"
                    checked={sex === 'male'}
                    onChange={() => setSex('male')}
                    className="peer absolute opacity-0 w-full h-full cursor-pointer"
                  />
                  <label
                    htmlFor="male"
                    className="flex items-center justify-center p-2 border rounded-md peer-checked:border-primary peer-checked:bg-primary/5 cursor-pointer transition-colors"
                  >
                    <span className="text-sm">Male</span>
                  </label>
                </div>
                
                <div className="relative">
                  <input
                    type="radio"
                    id="female"
                    name="sex"
                    value="female"
                    checked={sex === 'female'}
                    onChange={() => setSex('female')}
                    className="peer absolute opacity-0 w-full h-full cursor-pointer"
                  />
                  <label
                    htmlFor="female"
                    className="flex items-center justify-center p-2 border rounded-md peer-checked:border-primary peer-checked:bg-primary/5 cursor-pointer transition-colors"
                  >
                    <span className="text-sm">Female</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Nationality */}
            <div>
              <Label className="text-sm block mb-3">Nationality <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="radio"
                    id="filipino"
                    name="nationality"
                    value="filipino"
                    checked={nationality === 'filipino'}
                    onChange={() => setNationality('filipino')}
                    className="peer absolute opacity-0 w-full h-full cursor-pointer"
                  />
                  <label
                    htmlFor="filipino"
                    className="flex items-center justify-center p-2 border rounded-md peer-checked:border-primary peer-checked:bg-primary/5 cursor-pointer transition-colors"
                  >
                    <span className="text-sm">Filipino</span>
                  </label>
                </div>
                
                <div className="relative">
                  <input
                    type="radio"
                    id="foreigner"
                    name="nationality"
                    value="foreigner"
                    checked={nationality === 'foreigner'}
                    onChange={() => setNationality('foreigner')}
                    className="peer absolute opacity-0 w-full h-full cursor-pointer"
                  />
                  <label
                    htmlFor="foreigner"
                    className="flex items-center justify-center p-2 border rounded-md peer-checked:border-primary peer-checked:bg-primary/5 cursor-pointer transition-colors"
                  >
                    <span className="text-sm">Other</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Owner's Residential Address */}
        <div>
          <h3 className="font-medium text-base mb-3">Owner's Residential Address <span className="text-red-500">*</span></h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="ownerHouseBldgNo" className="text-sm">House/Bldg. No.</Label>
              <Input id="ownerHouseBldgNo" placeholder="Enter number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerBuildingName" className="text-sm">Building Name</Label>
              <Input id="ownerBuildingName" placeholder="If applicable" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerBlockNo" className="text-sm">Block No.</Label>
              <Input id="ownerBlockNo" placeholder="If applicable" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerLotNo" className="text-sm">Lot No.</Label>
              <Input id="ownerLotNo" placeholder="If applicable" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="ownerStreet" className="text-sm">Street <span className="text-red-500">*</span></Label>
              <Input id="ownerStreet" placeholder="Enter street name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerSubdivision" className="text-sm">Subdivision</Label>
              <Input id="ownerSubdivision" placeholder="If applicable" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerBarangay" className="text-sm">Barangay <span className="text-red-500">*</span></Label>
              <Input id="ownerBarangay" placeholder="Enter barangay" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerCityMunicipality" className="text-sm">City/Municipality <span className="text-red-500">*</span></Label>
              <Input id="ownerCityMunicipality" placeholder="Enter city/municipality" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerProvince" className="text-sm">Province <span className="text-red-500">*</span></Label>
              <Input id="ownerProvince" placeholder="Enter province" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerZipCode" className="text-sm">Zip Code <span className="text-red-500">*</span></Label>
              <Input id="ownerZipCode" placeholder="Enter zip code" />
            </div>
          </div>
        </div>
      </div>
    </FormSectionWrapper>
  );
};

export default OwnerInformationSection;
