
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BusinessInformationSection = () => {
  const [ownershipType, setOwnershipType] = useState<string>("soleProprietorship");

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>A. BUSINESS INFORMATION AND REGISTRATION</CardTitle>
        <CardDescription>
          Enter your business details and registration information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Business Name and Trade Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input id="businessName" placeholder="Enter business name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tradeName">Trade Name / Franchise (if applicable)</Label>
            <Input id="tradeName" placeholder="Enter trade name or franchise" />
          </div>
        </div>

        {/* Registration Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dtiSecCdaNumber">DTI/SEC/CDA Registration Number</Label>
            <Input id="dtiSecCdaNumber" placeholder="Enter registration number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tinNumber">Tax Identification Number (TIN)</Label>
            <Input id="tinNumber" placeholder="Enter TIN" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sssNumber">Social Security System (SSS) Number</Label>
            <Input id="sssNumber" placeholder="Enter SSS number" />
          </div>
        </div>

        {/* Kind of Ownership */}
        <div className="space-y-4">
          <Label className="text-lg font-medium">Kind of Ownership</Label>
          <RadioGroup
            value={ownershipType}
            onValueChange={setOwnershipType}
            className="flex flex-wrap gap-x-6 gap-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="soleProprietorship" id="soleProprietorship" />
              <Label htmlFor="soleProprietorship" className="cursor-pointer">Sole Proprietorship</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="onePersonCorp" id="onePersonCorp" />
              <Label htmlFor="onePersonCorp" className="cursor-pointer">One Person Corp</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="partnership" id="partnership" />
              <Label htmlFor="partnership" className="cursor-pointer">Partnership</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="corporation" id="corporation" />
              <Label htmlFor="corporation" className="cursor-pointer">Corporation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cooperative" id="cooperative" />
              <Label htmlFor="cooperative" className="cursor-pointer">Cooperative</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Business Address */}
        <div className="space-y-4">
          <Label className="text-lg font-medium">Business Address</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="blockNo">Block No.</Label>
              <Input id="blockNo" placeholder="Enter block number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lotNo">Lot No.</Label>
              <Input id="lotNo" placeholder="Enter lot number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="houseBldgNo">House/Bldg. No.</Label>
              <Input id="houseBldgNo" placeholder="Enter house/bldg number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buildingName">Name of Building</Label>
              <Input id="buildingName" placeholder="Enter building name" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street</Label>
              <Input id="street" placeholder="Enter street name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subdivision">Subdivision</Label>
              <Input id="subdivision" placeholder="Enter subdivision" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="barangay">Barangay</Label>
              <Input id="barangay" placeholder="Enter barangay" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cityMunicipality">City/Municipality</Label>
              <Input id="cityMunicipality" placeholder="Enter city/municipality" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              <Input id="province" placeholder="Enter province" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input id="zipCode" placeholder="Enter zip code" />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="telephoneNo">Telephone No.</Label>
            <Input id="telephoneNo" placeholder="Enter telephone number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobileNo">Mobile No.</Label>
            <Input id="mobileNo" placeholder="Enter mobile number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emailAddress">Email Address</Label>
            <Input id="emailAddress" type="email" placeholder="Enter email address" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessInformationSection;
