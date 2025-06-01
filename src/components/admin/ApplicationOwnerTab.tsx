
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User } from 'lucide-react';

interface OwnerInformation {
  given_name: string;
  middle_name?: string;
  surname: string;
  suffix?: string;
  age: number;
  sex: string;
  civil_status: string;
  nationality: string;
  owner_house_bldg_no?: string;
  owner_building_name?: string;
  owner_street: string;
  owner_subdivision?: string;
  owner_barangay: string;
  owner_city_municipality: string;
  owner_province: string;
  owner_zip_code: string;
}

interface ApplicationOwnerTabProps {
  ownerInformation: OwnerInformation;
}

const ApplicationOwnerTab: React.FC<ApplicationOwnerTabProps> = ({
  ownerInformation
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Owner Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Full Name</p>
          <p className="text-lg">
            {[
              ownerInformation.given_name,
              ownerInformation.middle_name,
              ownerInformation.surname,
              ownerInformation.suffix
            ].filter(Boolean).join(" ")}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Age</p>
            <p>{ownerInformation.age}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Sex</p>
            <p className="capitalize">{ownerInformation.sex}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Civil Status</p>
            <p className="capitalize">{ownerInformation.civil_status}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Nationality</p>
            <p>{ownerInformation.nationality}</p>
          </div>
        </div>
        <Separator />
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">Owner Address</p>
          <p className="text-sm">
            {[
              ownerInformation.owner_house_bldg_no,
              ownerInformation.owner_building_name,
              ownerInformation.owner_street,
              ownerInformation.owner_subdivision,
              ownerInformation.owner_barangay,
              ownerInformation.owner_city_municipality,
              ownerInformation.owner_province,
              ownerInformation.owner_zip_code
            ].filter(Boolean).join(", ")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationOwnerTab;
