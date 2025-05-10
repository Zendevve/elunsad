
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DeclarationsProps {
  declarations: any;
}

const DeclarationsView: React.FC<DeclarationsProps> = ({ declarations }) => {
  if (!declarations) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Declaration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Agreed to Terms</p>
            <p>{declarations.is_agreed ? "Yes" : "No"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Designation</p>
            <p>{declarations.designation || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Declaration Place</p>
            <p>{declarations.declaration_place || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Signature</p>
            {declarations.signature && (
              <img 
                src={declarations.signature} 
                alt="Signature" 
                className="max-h-24 border border-gray-200 p-2"
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeclarationsView;
