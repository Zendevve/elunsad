
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Briefcase } from 'lucide-react';

interface BusinessOperations {
  business_activity?: string;
  business_area?: number;
  capitalization?: number;
  tax_declaration_no?: string;
  cctv_cameras?: number;
  property_owned?: boolean;
  monthly_rental?: number;
  has_tax_incentives?: boolean;
  professional_male?: number;
  professional_female?: number;
  non_professional_male?: number;
  non_professional_female?: number;
  employees_in_lucena?: number;
  van_truck?: number;
  motorcycle?: number;
  other_vehicles?: number;
  main_house_bldg_no?: string;
  main_building_name?: string;
  main_block_no?: string;
  main_lot_no?: string;
  main_street?: string;
  main_subdivision?: string;
  main_barangay?: string;
  main_city_municipality?: string;
  main_province?: string;
  main_zip_code?: string;
  lessor_full_name?: string;
  lessor_business_name?: string;
  lessor_contact_number?: string;
  lessor_email_address?: string;
  lessor_address?: string;
}

interface ApplicationOperationsTabProps {
  businessOperations: BusinessOperations;
}

const ApplicationOperationsTab: React.FC<ApplicationOperationsTabProps> = ({
  businessOperations
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Business Operations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Business Activity</p>
            <p>{businessOperations.business_activity || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Business Area (sq.m)</p>
            <p>{businessOperations.business_area || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Capitalization</p>
            <p>₱{Number(businessOperations.capitalization).toLocaleString() || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tax Declaration No.</p>
            <p>{businessOperations.tax_declaration_no || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">CCTV Cameras</p>
            <p>{businessOperations.cctv_cameras !== null ? businessOperations.cctv_cameras : "N/A"}</p>
          </div>
        </div>
        
        {/* Property Information */}
        <Separator className="my-6" />
        <h4 className="font-medium mb-4">Property Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Property Status</p>
            <p>{businessOperations.property_owned ? 'Owned' : 'Rented'}</p>
          </div>
          {!businessOperations.property_owned && businessOperations.monthly_rental && (
            <div>
              <p className="text-sm font-medium text-gray-500">Monthly Rental</p>
              <p>₱{Number(businessOperations.monthly_rental).toLocaleString()}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-500">Tax Incentives</p>
            <p>{businessOperations.has_tax_incentives ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {/* Employee Information */}
        <Separator className="my-6" />
        <h4 className="font-medium mb-4">Employee Information</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Professional Male</p>
            <p>{businessOperations.professional_male || 0}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Professional Female</p>
            <p>{businessOperations.professional_female || 0}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Non-Professional Male</p>
            <p>{businessOperations.non_professional_male || 0}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Non-Professional Female</p>
            <p>{businessOperations.non_professional_female || 0}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Employees from Lucena</p>
            <p>{businessOperations.employees_in_lucena || 0}</p>
          </div>
        </div>

        {/* Vehicle Information */}
        <Separator className="my-6" />
        <h4 className="font-medium mb-4">Vehicle Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Van/Truck</p>
            <p>{businessOperations.van_truck || 0}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Motorcycle</p>
            <p>{businessOperations.motorcycle || 0}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Other Vehicles</p>
            <p>{businessOperations.other_vehicles || 0}</p>
          </div>
        </div>

        {/* Main Office Address */}
        {(businessOperations.main_street || businessOperations.main_barangay) && (
          <>
            <Separator className="my-6" />
            <h4 className="font-medium mb-4">Main Office Address</h4>
            <div>
              <p className="text-sm">
                {[
                  businessOperations.main_house_bldg_no,
                  businessOperations.main_building_name,
                  businessOperations.main_block_no,
                  businessOperations.main_lot_no,
                  businessOperations.main_street,
                  businessOperations.main_subdivision,
                  businessOperations.main_barangay,
                  businessOperations.main_city_municipality,
                  businessOperations.main_province,
                  businessOperations.main_zip_code
                ].filter(Boolean).join(", ")}
              </p>
            </div>
          </>
        )}

        {/* Lessor Information */}
        {!businessOperations.property_owned && businessOperations.lessor_full_name && (
          <>
            <Separator className="my-6" />
            <h4 className="font-medium mb-4">Lessor Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Lessor Name</p>
                <p>{businessOperations.lessor_full_name}</p>
              </div>
              {businessOperations.lessor_business_name && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Business Name</p>
                  <p>{businessOperations.lessor_business_name}</p>
                </div>
              )}
              {businessOperations.lessor_contact_number && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact Number</p>
                  <p>{businessOperations.lessor_contact_number}</p>
                </div>
              )}
              {businessOperations.lessor_email_address && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p>{businessOperations.lessor_email_address}</p>
                </div>
              )}
              {businessOperations.lessor_address && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Lessor Address</p>
                  <p>{businessOperations.lessor_address}</p>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationOperationsTab;
