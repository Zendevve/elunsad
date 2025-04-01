
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="businessArea">Business Area (in sq m)</Label>
            <Input id="businessArea" type="number" placeholder="Enter area in square meters" />
          </div>
          
          <div className="space-y-4">
            <Label>Total No. of Employees in Establishment</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="professionalMale" className="text-sm">Professional Male</Label>
                <Input id="professionalMale" type="number" placeholder="Enter number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="professionalFemale" className="text-sm">Professional Female</Label>
                <Input id="professionalFemale" type="number" placeholder="Enter number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nonProfessionalMale" className="text-sm">Non-Professional Male</Label>
                <Input id="nonProfessionalMale" type="number" placeholder="Enter number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nonProfessionalFemale" className="text-sm">Non-Professional Female</Label>
                <Input id="nonProfessionalFemale" type="number" placeholder="Enter number" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="employeesInLucena">No. of Employees Residing within Lucena</Label>
            <Input id="employeesInLucena" type="number" placeholder="Enter number" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deliveryVehicles">No. of Delivery Vehicles (if applicable)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input id="vanTruck" placeholder="Van/Truck" />
              <Input id="motorcycle" placeholder="Motorcycle" />
              <Input id="other" placeholder="Other" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cctvCameras">No. of CCTV camera(s) w/in business premises</Label>
            <Input id="cctvCameras" type="number" placeholder="Enter number" />
          </div>
        </div>
      </FormSectionWrapper>

      <FormSectionWrapper 
        title="Business Capitalization" 
        description="Provide financial information about your business"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="capitalization">Total Capitalization (PHP)</Label>
            <Input id="capitalization" type="number" placeholder="Enter amount in PHP" />
          </div>
          
          <div className="space-y-4">
            <Label className="block mb-2">Do you have tax incentives from any Government Entity?</Label>
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
      </FormSectionWrapper>

      <FormSectionWrapper 
        title="Business Activity" 
        description="Select your main business activity type"
      >
        <RadioGroup
          value={businessActivity || ""}
          onValueChange={setBusinessActivity}
          className="flex flex-wrap gap-x-6 gap-y-3"
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
      </FormSectionWrapper>

      <FormSectionWrapper 
        title="Main Office Information" 
        description="Enter details about your main office or principal address if branch"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mainBlockNo">Block No.</Label>
            <Input id="mainBlockNo" placeholder="Enter block number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mainLotNo">Lot No.</Label>
            <Input id="mainLotNo" placeholder="Enter lot number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mainHouseBldgNo">House/Bldg. No.</Label>
            <Input id="mainHouseBldgNo" placeholder="Enter house/bldg number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mainBuildingName">Name of Building</Label>
            <Input id="mainBuildingName" placeholder="Enter building name" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="mainStreet">Street</Label>
            <Input id="mainStreet" placeholder="Enter street name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mainSubdivision">Subdivision</Label>
            <Input id="mainSubdivision" placeholder="Enter subdivision" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mainBarangay">Barangay</Label>
            <Input id="mainBarangay" placeholder="Enter barangay" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="mainCityMunicipality">City/Municipality</Label>
            <Input id="mainCityMunicipality" placeholder="Enter city/municipality" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mainProvince">Province</Label>
            <Input id="mainProvince" placeholder="Enter province" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mainZipCode">Zip Code</Label>
            <Input id="mainZipCode" placeholder="Enter zip code" />
          </div>
        </div>
      </FormSectionWrapper>

      <FormSectionWrapper 
        title="Property Information" 
        description="Provide details about the property ownership"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 space-y-4">
            <Label>Property Owned?</Label>
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
          
          <div className="col-span-2 space-y-2">
            <Label>If Yes, Tax Declaration No.</Label>
            <Input placeholder="Enter tax declaration number" />
          </div>
        </div>
        
        {propertyOwned === "no" && (
          <div className="border p-5 rounded-md shadow-sm space-y-5 mt-6">
            <div className="flex items-center">
              <div className="h-6 w-1 bg-primary mr-2"></div>
              <p className="text-sm font-medium">Lessor Information</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lessorFullName">Lessor's Full Name</Label>
                <Input id="lessorFullName" placeholder="Enter lessor's full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lessorBusinessName">Lessor's Business Name/BIN</Label>
                <Input id="lessorBusinessName" placeholder="Enter lessor's business name" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lessorAddress">Lessor's Address</Label>
                <Input id="lessorAddress" placeholder="Enter lessor's address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lessorContactNumber">Lessor's Contact Number</Label>
                <Input id="lessorContactNumber" placeholder="Enter lessor's contact number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lessorEmailAddress">Lessor's Email Address</Label>
                <Input id="lessorEmailAddress" type="email" placeholder="Enter lessor's email" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="monthlyRental">Monthly Rental</Label>
              <Input id="monthlyRental" type="number" placeholder="Enter monthly rental amount" />
            </div>
          </div>
        )}
      </FormSectionWrapper>
    </>
  );
};

export default BusinessOperationSection;
