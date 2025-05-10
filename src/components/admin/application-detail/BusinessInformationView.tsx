
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BusinessInformationProps {
  businessInformation: any;
}

const BusinessInformationView: React.FC<BusinessInformationProps> = ({ businessInformation }) => {
  if (!businessInformation) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Business Name</p>
            <p>{businessInformation.business_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Trade Name</p>
            <p>{businessInformation.trade_name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">TIN Number</p>
            <p>{businessInformation.tin_number}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Ownership Type</p>
            <p>{businessInformation.ownership_type}</p>
          </div>
          <div className="col-span-3">
            <p className="text-sm font-medium text-gray-500">Address</p>
            <p>
              {[
                businessInformation.street,
                businessInformation.barangay,
                businessInformation.city_municipality,
                businessInformation.province,
                businessInformation.zip_code
              ].filter(Boolean).join(", ")}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Mobile Number</p>
            <p>{businessInformation.mobile_no}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email Address</p>
            <p>{businessInformation.email_address}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessInformationView;
