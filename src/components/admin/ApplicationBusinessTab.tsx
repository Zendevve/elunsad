
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Building } from 'lucide-react';

interface BusinessInformation {
  business_name: string;
  trade_name?: string;
  tin_number: string;
  registration_number?: string;
  sss_number?: string;
  ownership_type: string;
  house_bldg_no?: string;
  building_name?: string;
  street: string;
  subdivision?: string;
  barangay: string;
  city_municipality: string;
  province: string;
  zip_code: string;
  mobile_no: string;
  telephone_no?: string;
  email_address: string;
  ctc_number?: string;
  ctc_date_issue?: string;
  ctc_place_issue?: string;
}

interface ApplicationBusinessTabProps {
  businessInformation: BusinessInformation;
}

const ApplicationBusinessTab: React.FC<ApplicationBusinessTabProps> = ({
  businessInformation
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Business Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Business Name</p>
          <p className="text-lg">{businessInformation.business_name}</p>
        </div>
        {businessInformation.trade_name && (
          <div>
            <p className="text-sm font-medium text-gray-500">Trade Name</p>
            <p>{businessInformation.trade_name}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">TIN Number</p>
            <p>{businessInformation.tin_number}</p>
          </div>
          {businessInformation.registration_number && (
            <div>
              <p className="text-sm font-medium text-gray-500">Registration Number</p>
              <p>{businessInformation.registration_number}</p>
            </div>
          )}
        </div>
        {businessInformation.sss_number && (
          <div>
            <p className="text-sm font-medium text-gray-500">SSS Number</p>
            <p>{businessInformation.sss_number}</p>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-500">Ownership Type</p>
          <p className="capitalize">{businessInformation.ownership_type.replace(/([A-Z])/g, ' $1').trim()}</p>
        </div>
        <Separator />
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">Business Address</p>
          <p className="text-sm">
            {[
              businessInformation.house_bldg_no,
              businessInformation.building_name,
              businessInformation.street,
              businessInformation.subdivision,
              businessInformation.barangay,
              businessInformation.city_municipality,
              businessInformation.province,
              businessInformation.zip_code
            ].filter(Boolean).join(", ")}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Contact Information</p>
          <div className="space-y-1 text-sm">
            <p>Mobile: {businessInformation.mobile_no}</p>
            {businessInformation.telephone_no && <p>Telephone: {businessInformation.telephone_no}</p>}
            <p>Email: {businessInformation.email_address}</p>
          </div>
        </div>
        {(businessInformation.ctc_number || businessInformation.ctc_date_issue || businessInformation.ctc_place_issue) && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">CTC Information</p>
              <div className="space-y-1 text-sm">
                {businessInformation.ctc_number && <p>Number: {businessInformation.ctc_number}</p>}
                {businessInformation.ctc_date_issue && <p>Date Issued: {businessInformation.ctc_date_issue}</p>}
                {businessInformation.ctc_place_issue && <p>Place Issued: {businessInformation.ctc_place_issue}</p>}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationBusinessTab;
