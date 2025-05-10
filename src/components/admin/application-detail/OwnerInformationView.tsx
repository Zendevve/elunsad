
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OwnerInformationProps {
  ownerInformation: any;
}

const OwnerInformationView: React.FC<OwnerInformationProps> = ({ ownerInformation }) => {
  if (!ownerInformation) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Owner Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Full Name</p>
            <p>
              {[
                ownerInformation.surname,
                ownerInformation.given_name,
                ownerInformation.middle_name,
                ownerInformation.suffix
              ].filter(Boolean).join(" ")}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Sex</p>
            <p>{ownerInformation.sex}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Age</p>
            <p>{ownerInformation.age}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Civil Status</p>
            <p>{ownerInformation.civil_status}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Nationality</p>
            <p>{ownerInformation.nationality}</p>
          </div>
          <div className="col-span-3">
            <p className="text-sm font-medium text-gray-500">Address</p>
            <p>
              {[
                ownerInformation.owner_street,
                ownerInformation.owner_barangay,
                ownerInformation.owner_city_municipality,
                ownerInformation.owner_province,
                ownerInformation.owner_zip_code
              ].filter(Boolean).join(", ")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OwnerInformationView;
