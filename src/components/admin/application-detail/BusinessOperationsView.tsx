
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BusinessOperationsProps {
  businessOperations: any;
}

const BusinessOperationsView: React.FC<BusinessOperationsProps> = ({ businessOperations }) => {
  if (!businessOperations) return null;

  // Map business activity types to display text
  const businessActivityMap: Record<string, string> = {
    main_office: "Main Office",
    branch_office: "Branch Office",
    admin_office: "Admin Office Only",
    warehouse: "Warehouse",
    other: "Other"
  };

  const activityDisplay = businessOperations.business_activity ? 
    businessActivityMap[businessOperations.business_activity] || businessOperations.business_activity :
    "N/A";

  // Calculate total employees
  const professionalMale = businessOperations.professional_male || 0;
  const professionalFemale = businessOperations.professional_female || 0;
  const nonProfessionalMale = businessOperations.non_professional_male || 0;
  const nonProfessionalFemale = businessOperations.non_professional_female || 0;
  const totalEmployees = professionalMale + professionalFemale + nonProfessionalMale + nonProfessionalFemale;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Operations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Business Activity</p>
            <p>{activityDisplay} {businessOperations.business_activity === "other" && businessOperations.other_activity ? `(${businessOperations.other_activity})` : ""}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Business Area</p>
            <p>{businessOperations.business_area ? `${businessOperations.business_area} sqm` : "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Capitalization</p>
            <p>{businessOperations.capitalization ? `₱ ${businessOperations.capitalization.toLocaleString()}` : "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Property Status</p>
            <p>{businessOperations.property_owned ? "Owned" : "Rented"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tax Incentives</p>
            <p>{businessOperations.has_tax_incentives ? "Yes" : "No"}</p>
          </div>
          {businessOperations.property_owned && (
            <div>
              <p className="text-sm font-medium text-gray-500">Tax Declaration No.</p>
              <p>{businessOperations.tax_declaration_no || "N/A"}</p>
            </div>
          )}
        </div>

        {/* Main Office Address (if branch) */}
        {["branch_office", "admin_office", "warehouse"].includes(businessOperations.business_activity) && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Main Office/Principal Address</h3>
            <p>
              {[
                businessOperations.main_house_bldg_no && `House/Bldg No: ${businessOperations.main_house_bldg_no}`,
                businessOperations.main_building_name && `Building: ${businessOperations.main_building_name}`,
                businessOperations.main_block_no && `Block: ${businessOperations.main_block_no}`,
                businessOperations.main_lot_no && `Lot: ${businessOperations.main_lot_no}`,
                businessOperations.main_street,
                businessOperations.main_subdivision && `Subdivision: ${businessOperations.main_subdivision}`,
                businessOperations.main_barangay,
                businessOperations.main_city_municipality,
                businessOperations.main_province,
                businessOperations.main_zip_code
              ].filter(Boolean).join(", ") || "N/A"}
            </p>
          </div>
        )}

        {/* Lessor Information (if rented) */}
        {!businessOperations.property_owned && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Lessor Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Lessor's Name</p>
                <p>{businessOperations.lessor_full_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Lessor's Business Name</p>
                <p>{businessOperations.lessor_business_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Monthly Rental</p>
                <p>{businessOperations.monthly_rental ? `₱ ${businessOperations.monthly_rental.toLocaleString()}` : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Contact Number</p>
                <p>{businessOperations.lessor_contact_number || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email Address</p>
                <p>{businessOperations.lessor_email_address || "N/A"}</p>
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p>{businessOperations.lessor_address || "N/A"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Employee Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Employee Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Employees</p>
              <p>{totalEmployees}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Employees in Lucena</p>
              <p>{businessOperations.employees_in_lucena || 0}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Professional (Male/Female)</p>
              <p>{professionalMale} / {professionalFemale}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Non-Professional (Male/Female)</p>
              <p>{nonProfessionalMale} / {nonProfessionalFemale}</p>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Vehicle Information</h3>
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
        </div>

        {/* Security Features */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Security Features</h3>
          <div>
            <p className="text-sm font-medium text-gray-500">CCTV Cameras</p>
            <p>{businessOperations.cctv_cameras || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessOperationsView;
