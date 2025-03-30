
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BusinessOperationSection = () => {
  const [hasTaxIncentives, setHasTaxIncentives] = useState<string | null>(null);
  const [businessActivity, setBusinessActivity] = useState<string | null>(null);
  const [propertyOwned, setPropertyOwned] = useState<string | null>(null);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>B. BUSINESS OPERATION</CardTitle>
        <CardDescription>
          Enter information about your business operations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Business Area and Employees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="businessArea">Business Area (in sq m)</Label>
            <Input id="businessArea" type="number" placeholder="Enter area in square meters" />
          </div>
          
          <div className="space-y-4">
            <Label>Total No. of Employees in Establishment</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="professionalMale">Professional Male</Label>
                <Input id="professionalMale" type="number" placeholder="Enter number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="professionalFemale">Professional Female</Label>
                <Input id="professionalFemale" type="number" placeholder="Enter number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nonProfessionalMale">Non-Professional Male</Label>
                <Input id="nonProfessionalMale" type="number" placeholder="Enter number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nonProfessionalFemale">Non-Professional Female</Label>
                <Input id="nonProfessionalFemale" type="number" placeholder="Enter number" />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Business Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="employeesInLucena">No. of Employees Residing within Lucena</Label>
            <Input id="employeesInLucena" type="number" placeholder="Enter number" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deliveryVehicles">No. of Delivery Vehicles (if applicable)</Label>
            <div className="grid grid-cols-3 gap-2">
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

        {/* Capitalization and Tax Incentives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="capitalization">Total Capitalization (PHP)</Label>
            <Input id="capitalization" type="number" placeholder="Enter amount in PHP" />
          </div>
          
          <div className="space-y-2">
            <Label>Do you have tax incentives from any Government Entity?</Label>
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="taxYes" 
                  checked={hasTaxIncentives === "yes"}
                  onCheckedChange={() => setHasTaxIncentives("yes")}
                />
                <Label htmlFor="taxYes">Yes (Please attach a copy of your certificate)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="taxNo" 
                  checked={hasTaxIncentives === "no"}
                  onCheckedChange={() => setHasTaxIncentives("no")}
                />
                <Label htmlFor="taxNo">No</Label>
              </div>
            </div>
          </div>
        </div>

        {/* Business Activity */}
        <div className="space-y-2">
          <Label>Business Activity (Please check one)</Label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mainOffice" 
                checked={businessActivity === "mainOffice"}
                onCheckedChange={() => setBusinessActivity("mainOffice")}
              />
              <Label htmlFor="mainOffice">Main Office</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="branchOffice" 
                checked={businessActivity === "branchOffice"}
                onCheckedChange={() => setBusinessActivity("branchOffice")}
              />
              <Label htmlFor="branchOffice">Branch Office</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="adminOffice" 
                checked={businessActivity === "adminOffice"}
                onCheckedChange={() => setBusinessActivity("adminOffice")}
              />
              <Label htmlFor="adminOffice">Admin Office Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="warehouse" 
                checked={businessActivity === "warehouse"}
                onCheckedChange={() => setBusinessActivity("warehouse")}
              />
              <Label htmlFor="warehouse">Warehouse</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="others" 
                checked={businessActivity === "others"}
                onCheckedChange={() => setBusinessActivity("others")}
              />
              <Label htmlFor="others">Others, please specify</Label>
            </div>
          </div>
        </div>

        {/* Main Office Address */}
        <div className="space-y-4">
          <Label className="text-lg font-medium">Main Office/Principal Address (if branch)</Label>
          
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>

        {/* Property Ownership */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 space-y-2">
              <Label>Property Owned?</Label>
              <div className="flex space-x-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="propertyYes" 
                    checked={propertyOwned === "yes"}
                    onCheckedChange={() => setPropertyOwned("yes")}
                  />
                  <Label htmlFor="propertyYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="propertyNo" 
                    checked={propertyOwned === "no"}
                    onCheckedChange={() => setPropertyOwned("no")}
                  />
                  <Label htmlFor="propertyNo">No</Label>
                </div>
              </div>
            </div>
            
            <div className="col-span-2 space-y-2">
              <Label>If Yes, Tax Declaration No.</Label>
              <Input placeholder="Enter tax declaration number" />
            </div>
          </div>
            
          {propertyOwned === "no" && (
            <div className="border p-4 rounded-md space-y-4">
              <p className="text-sm font-medium">If no, please provide lessor's details:</p>
              
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
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessOperationSection;
