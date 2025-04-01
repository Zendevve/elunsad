
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const OwnerInformationSection = () => {
  const [civilStatus, setCivilStatus] = useState<string>("single");
  const [sex, setSex] = useState<string>("male");
  const [nationality, setNationality] = useState<string>("filipino");

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
          {/* Civil Status */}
          <div className="space-y-3">
            <Label>Civil Status</Label>
            <div className="flex flex-col space-y-2">
              <RadioGroup
                value={civilStatus}
                onValueChange={setCivilStatus}
                className="flex flex-wrap gap-x-6 gap-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single" className="cursor-pointer">Single</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="married" id="married" />
                  <Label htmlFor="married" className="cursor-pointer">Married</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="widowed" id="widowed" />
                  <Label htmlFor="widowed" className="cursor-pointer">Widowed</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          {/* Age */}
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" placeholder="Enter age" />
          </div>
          
          {/* Sex */}
          <div className="space-y-3">
            <Label>Sex</Label>
            <div className="flex flex-col space-y-2">
              <RadioGroup
                value={sex}
                onValueChange={setSex}
                className="flex flex-wrap gap-x-6 gap-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="cursor-pointer">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="cursor-pointer">Female</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          {/* Nationality */}
          <div className="space-y-3">
            <Label>Nationality</Label>
            <div className="flex flex-col space-y-2">
              <RadioGroup
                value={nationality}
                onValueChange={setNationality}
                className="flex flex-wrap gap-x-6 gap-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="filipino" id="filipino" />
                  <Label htmlFor="filipino" className="cursor-pointer">Filipino</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="foreigner" id="foreigner" />
                  <Label htmlFor="foreigner" className="cursor-pointer">Foreigner</Label>
                </div>
              </RadioGroup>
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
