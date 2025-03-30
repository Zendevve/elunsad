
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const OwnerInformationSection = () => {
  const [civilStatus, setCivilStatus] = useState<string | null>(null);
  const [sex, setSex] = useState<string | null>(null);
  const [nationality, setNationality] = useState<string | null>(null);

  return (
    <Card className="mt-6">
      <CardContent className="pt-6 space-y-6">
        {/* Owner's Information */}
        <div>
          <Label className="text-lg font-medium">Owner's Information</Label>
          <p className="text-sm text-muted-foreground mb-4">
            Name of Owner (For Sole Proprietorship) or President/Officer in Charge (For Corp/Coop/Partnership)
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="surname">Surname</Label>
              <Input id="surname" placeholder="Enter surname" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="givenName">Given Name</Label>
              <Input id="givenName" placeholder="Enter given name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input id="middleName" placeholder="Enter middle name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suffix">Suffix</Label>
              <Input id="suffix" placeholder="Enter suffix" />
            </div>
          </div>
        </div>

        {/* Civil Status, Age, Sex, Nationality */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label>Civil Status</Label>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="single" 
                  checked={civilStatus === "single"}
                  onCheckedChange={() => setCivilStatus("single")}
                />
                <Label htmlFor="single">Single</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="married" 
                  checked={civilStatus === "married"}
                  onCheckedChange={() => setCivilStatus("married")}
                />
                <Label htmlFor="married">Married</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="widowed" 
                  checked={civilStatus === "widowed"}
                  onCheckedChange={() => setCivilStatus("widowed")}
                />
                <Label htmlFor="widowed">Widowed</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" placeholder="Enter age" />
          </div>
          
          <div className="space-y-2">
            <Label>Sex</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="male" 
                  checked={sex === "male"}
                  onCheckedChange={() => setSex("male")}
                />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="female" 
                  checked={sex === "female"}
                  onCheckedChange={() => setSex("female")}
                />
                <Label htmlFor="female">Female</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Nationality</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="filipino" 
                  checked={nationality === "filipino"}
                  onCheckedChange={() => setNationality("filipino")}
                />
                <Label htmlFor="filipino">Filipino</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="foreigner" 
                  checked={nationality === "foreigner"}
                  onCheckedChange={() => setNationality("foreigner")}
                />
                <Label htmlFor="foreigner">Foreigner</Label>
              </div>
            </div>
          </div>
        </div>

        {/* Owner's Residential Address */}
        <div className="space-y-4">
          <Label className="text-lg font-medium">Owner's Residential Address</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerBlockNo">Block No.</Label>
              <Input id="ownerBlockNo" placeholder="Enter block number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerLotNo">Lot No.</Label>
              <Input id="ownerLotNo" placeholder="Enter lot number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerHouseBldgNo">House/Bldg. No.</Label>
              <Input id="ownerHouseBldgNo" placeholder="Enter house/bldg number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerBuildingName">Name of Building</Label>
              <Input id="ownerBuildingName" placeholder="Enter building name" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerStreet">Street</Label>
              <Input id="ownerStreet" placeholder="Enter street name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerSubdivision">Subdivision</Label>
              <Input id="ownerSubdivision" placeholder="Enter subdivision" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerBarangay">Barangay</Label>
              <Input id="ownerBarangay" placeholder="Enter barangay" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerCityMunicipality">City/Municipality</Label>
              <Input id="ownerCityMunicipality" placeholder="Enter city/municipality" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerProvince">Province</Label>
              <Input id="ownerProvince" placeholder="Enter province" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerZipCode">Zip Code</Label>
              <Input id="ownerZipCode" placeholder="Enter zip code" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OwnerInformationSection;
