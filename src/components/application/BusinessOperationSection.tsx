
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FormSectionWrapper from "@/components/application/FormSectionWrapper";
import { Separator } from "@/components/ui/separator";

const BusinessOperationSection = () => {
  const [hasTaxIncentives, setHasTaxIncentives] = useState<string | null>(null);
  const [businessActivity, setBusinessActivity] = useState<string | null>(null);
  const [propertyOwned, setPropertyOwned] = useState<string | null>(null);

  return (
    <>
      <FormSectionWrapper 
        title="Business Area and Employment" 
        description="Enter details about your business space and employees"
        stepNumber={4}
      >
        <div className="space-y-6">
          {/* Business Area Section */}
          <div className="p-4 bg-white rounded-md border">
            <h3 className="font-medium text-base mb-4">Business Space</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="businessArea" className="text-sm text-gray-600">Business Area (in sq m)</Label>
                  <Input 
                    id="businessArea" 
                    type="number" 
                    placeholder="Enter area in square meters"
                    className="focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cctvCameras" className="text-sm text-gray-600">No. of CCTV camera(s) w/in business premises</Label>
                  <Input 
                    id="cctvCameras" 
                    type="number" 
                    placeholder="Enter number" 
                    className="focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Employees Section */}
          <div className="p-4 bg-white rounded-md border">
            <h3 className="font-medium text-base mb-4">Employee Information</h3>
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="professionalMale" className="text-sm text-gray-600">Professional Male</Label>
                  <Input 
                    id="professionalMale" 
                    type="number" 
                    placeholder="0" 
                    className="focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="professionalFemale" className="text-sm text-gray-600">Professional Female</Label>
                  <Input 
                    id="professionalFemale" 
                    type="number" 
                    placeholder="0" 
                    className="focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nonProfessionalMale" className="text-sm text-gray-600">Non-Professional Male</Label>
                  <Input 
                    id="nonProfessionalMale" 
                    type="number" 
                    placeholder="0" 
                    className="focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nonProfessionalFemale" className="text-sm text-gray-600">Non-Professional Female</Label>
                  <Input 
                    id="nonProfessionalFemale" 
                    type="number" 
                    placeholder="0" 
                    className="focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeesInLucena" className="text-sm text-gray-600">No. of Employees Residing within Lucena</Label>
                <Input 
                  id="employeesInLucena" 
                  type="number" 
                  placeholder="Enter number" 
                  className="max-w-xs focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Delivery Vehicles Section */}
          <div className="p-4 bg-white rounded-md border">
            <h3 className="font-medium text-base mb-4">Delivery Vehicles (if applicable)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vanTruck" className="text-sm text-gray-600">Van/Truck</Label>
                <Input 
                  id="vanTruck" 
                  type="number" 
                  placeholder="0" 
                  className="focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motorcycle" className="text-sm text-gray-600">Motorcycle</Label>
                <Input 
                  id="motorcycle" 
                  type="number" 
                  placeholder="0" 
                  className="focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="other" className="text-sm text-gray-600">Other</Label>
                <Input 
                  id="other" 
                  type="number" 
                  placeholder="0" 
                  className="focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </FormSectionWrapper>

      <FormSectionWrapper 
        title="Business Capitalization" 
        description="Provide financial information about your business"
      >
        <div className="space-y-6">
          <div className="p-4 bg-white rounded-md border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="capitalization" className="text-sm text-gray-600">Total Capitalization (PHP)</Label>
                <Input 
                  id="capitalization" 
                  type="number" 
                  placeholder="Enter amount in PHP" 
                  className="focus:border-primary"
                />
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm text-gray-600 mb-2 block">Do you have tax incentives from any Government Entity?</Label>
                <RadioGroup
                  value={hasTaxIncentives || ""}
                  onValueChange={setHasTaxIncentives}
                  className="flex flex-wrap gap-x-6 gap-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="taxYes" />
                    <Label htmlFor="taxYes" className="cursor-pointer">Yes (Please attach a copy of your certificate)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="taxNo" />
                    <Label htmlFor="taxNo" className="cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>
      </FormSectionWrapper>

      <FormSectionWrapper 
        title="Business Activity" 
        description="Select your main business activity type"
      >
        <div className="p-4 bg-white rounded-md border">
          <RadioGroup
            value={businessActivity || ""}
            onValueChange={setBusinessActivity}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mainOffice" id="mainOffice" />
              <Label htmlFor="mainOffice" className="cursor-pointer">Main Office</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="branchOffice" id="branchOffice" />
              <Label htmlFor="branchOffice" className="cursor-pointer">Branch Office</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="adminOffice" id="adminOffice" />
              <Label htmlFor="adminOffice" className="cursor-pointer">Admin Office Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="warehouse" id="warehouse" />
              <Label htmlFor="warehouse" className="cursor-pointer">Warehouse</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="others" id="others" />
              <Label htmlFor="others" className="cursor-pointer">Others, please specify</Label>
            </div>
          </RadioGroup>
          {businessActivity === "others" && (
            <div className="mt-3 max-w-md">
              <Input placeholder="Please specify business activity" className="focus:border-primary" />
            </div>
          )}
        </div>
      </FormSectionWrapper>

      <FormSectionWrapper 
        title="Main Office Information" 
        description="Enter details about your main office or principal address if branch"
      >
        <div className="p-4 bg-white rounded-md border space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mainBlockNo" className="text-sm text-gray-600">Block No.</Label>
              <Input id="mainBlockNo" placeholder="Enter block number" className="focus:border-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainLotNo" className="text-sm text-gray-600">Lot No.</Label>
              <Input id="mainLotNo" placeholder="Enter lot number" className="focus:border-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainHouseBldgNo" className="text-sm text-gray-600">House/Bldg. No.</Label>
              <Input id="mainHouseBldgNo" placeholder="Enter house/bldg number" className="focus:border-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainBuildingName" className="text-sm text-gray-600">Name of Building</Label>
              <Input id="mainBuildingName" placeholder="Enter building name" className="focus:border-primary" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mainStreet" className="text-sm text-gray-600">Street</Label>
              <Input id="mainStreet" placeholder="Enter street name" className="focus:border-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainSubdivision" className="text-sm text-gray-600">Subdivision</Label>
              <Input id="mainSubdivision" placeholder="Enter subdivision" className="focus:border-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainBarangay" className="text-sm text-gray-600">Barangay</Label>
              <Input id="mainBarangay" placeholder="Enter barangay" className="focus:border-primary" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mainCityMunicipality" className="text-sm text-gray-600">City/Municipality</Label>
              <Input id="mainCityMunicipality" placeholder="Enter city/municipality" className="focus:border-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainProvince" className="text-sm text-gray-600">Province</Label>
              <Input id="mainProvince" placeholder="Enter province" className="focus:border-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainZipCode" className="text-sm text-gray-600">Zip Code</Label>
              <Input id="mainZipCode" placeholder="Enter zip code" className="focus:border-primary" />
            </div>
          </div>
        </div>
      </FormSectionWrapper>

      <FormSectionWrapper 
        title="Property Information" 
        description="Provide details about the property ownership"
      >
        <div className="p-4 bg-white rounded-md border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 space-y-3">
              <Label className="text-sm text-gray-600">Property Owned?</Label>
              <RadioGroup
                value={propertyOwned || ""}
                onValueChange={setPropertyOwned}
                className="flex flex-wrap gap-x-6 gap-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="propertyYes" />
                  <Label htmlFor="propertyYes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="propertyNo" />
                  <Label htmlFor="propertyNo" className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            {propertyOwned === "yes" && (
              <div className="col-span-2 space-y-2">
                <Label className="text-sm text-gray-600">Tax Declaration No.</Label>
                <Input placeholder="Enter tax declaration number" className="focus:border-primary" />
              </div>
            )}
          </div>
          
          {propertyOwned === "no" && (
            <div className="mt-6 space-y-5 p-4 bg-gray-50 rounded-md border-l-4 border-l-primary">
              <div className="flex items-center">
                <h3 className="text-base font-medium">Lessor Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lessorFullName" className="text-sm text-gray-600">Lessor's Full Name</Label>
                  <Input id="lessorFullName" placeholder="Enter lessor's full name" className="focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lessorBusinessName" className="text-sm text-gray-600">Lessor's Business Name/BIN</Label>
                  <Input id="lessorBusinessName" placeholder="Enter lessor's business name" className="focus:border-primary" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lessorAddress" className="text-sm text-gray-600">Lessor's Address</Label>
                  <Input id="lessorAddress" placeholder="Enter lessor's address" className="focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lessorContactNumber" className="text-sm text-gray-600">Lessor's Contact Number</Label>
                  <Input id="lessorContactNumber" placeholder="Enter lessor's contact number" className="focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lessorEmailAddress" className="text-sm text-gray-600">Lessor's Email Address</Label>
                  <Input id="lessorEmailAddress" type="email" placeholder="Enter lessor's email" className="focus:border-primary" />
                </div>
              </div>
              
              <div className="space-y-2 max-w-xs">
                <Label htmlFor="monthlyRental" className="text-sm text-gray-600">Monthly Rental</Label>
                <Input id="monthlyRental" type="number" placeholder="Enter monthly rental amount" className="focus:border-primary" />
              </div>
            </div>
          )}
        </div>
      </FormSectionWrapper>
    </>
  );
};

export default BusinessOperationSection;
