
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BusinessInformationProps {
  businessInformation: any;
}

const BusinessInformationView: React.FC<BusinessInformationProps> = ({ businessInformation }) => {
  if (!businessInformation) return null;

  // Map ownership_type to display text
  const ownershipTypeMap: Record<string, string> = {
    soleProprietorship: "Sole Proprietorship",
    partnership: "Partnership",
    corporation: "Corporation",
    cooperative: "Cooperative",
    onePersonCorp: "One Person Corporation"
  };

  const ownershipTypeDisplay = ownershipTypeMap[businessInformation.ownership_type] || businessInformation.ownership_type;

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
            <p className="text-sm font-medium text-gray-500">Registration Number</p>
            <p>{businessInformation.registration_number || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">SSS Number</p>
            <p>{businessInformation.sss_number || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Ownership Type</p>
            <p>{ownershipTypeDisplay}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">CTC Details</p>
            <p>
              {businessInformation.ctc_number ? 
                `${businessInformation.ctc_number} issued on ${businessInformation.ctc_date_issue || 'N/A'} at ${businessInformation.ctc_place_issue || 'N/A'}` : 
                "N/A"}
            </p>
          </div>
          <div className="col-span-3">
            <p className="text-sm font-medium text-gray-500">Address</p>
            <p>
              {[
                businessInformation.house_bldg_no && `House/Bldg No: ${businessInformation.house_bldg_no}`,
                businessInformation.building_name && `Building: ${businessInformation.building_name}`,
                businessInformation.block_no && `Block: ${businessInformation.block_no}`,
                businessInformation.lot_no && `Lot: ${businessInformation.lot_no}`,
                businessInformation.street,
                businessInformation.subdivision && `Subdivision: ${businessInformation.subdivision}`,
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
            <p className="text-sm font-medium text-gray-500">Telephone Number</p>
            <p>{businessInformation.telephone_no || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email Address</p>
            <p>{businessInformation.email_address}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Website URL</p>
            <p>{businessInformation.website_url || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Facebook Page URL</p>
            <p>{businessInformation.fb_page_url || "N/A"}</p>
          </div>
          {businessInformation.business_description && (
            <div className="col-span-3">
              <p className="text-sm font-medium text-gray-500">Business Description</p>
              <p>{businessInformation.business_description}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessInformationView;
