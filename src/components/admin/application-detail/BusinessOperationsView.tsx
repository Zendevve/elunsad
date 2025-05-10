
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BusinessOperationsProps {
  businessOperations: any;
}

const BusinessOperationsView: React.FC<BusinessOperationsProps> = ({ businessOperations }) => {
  if (!businessOperations) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Operations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Business Area</p>
            <p>{businessOperations.business_area || "N/A"} sqm</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Employees in Lucena</p>
            <p>{businessOperations.employees_in_lucena || "0"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Capitalization</p>
            <p>₱ {businessOperations.capitalization || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Property Status</p>
            <p>{businessOperations.property_owned ? "Owned" : "Rented"}</p>
          </div>
          {!businessOperations.property_owned && (
            <>
              <div>
                <p className="text-sm font-medium text-gray-500">Monthly Rental</p>
                <p>₱ {businessOperations.monthly_rental || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Lessor</p>
                <p>{businessOperations.lessor_full_name || "N/A"}</p>
              </div>
            </>
          )}
          <div>
            <p className="text-sm font-medium text-gray-500">Tax Incentives</p>
            <p>{businessOperations.has_tax_incentives ? "Yes" : "No"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessOperationsView;
