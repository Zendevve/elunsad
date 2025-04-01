
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DeclarationSection = () => {
  const [isAgreed, setIsAgreed] = useState(false);
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Declaration and Signature</CardTitle>
        <CardDescription>
          Review your application and sign the declaration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-md border">
          <p className="text-sm">
            I DECLARE UNDER PENALTY OF PERJURY that all information in this application is true and correct based on my personal knowledge and authentic records submitted to the City of Lucena. 
            Any false or misleading information supplied or production of falsified documents shall be grounds for appropriate legal action against me and automatically revoke the permit.
            I hereby agree that all personal data (as defined under the Data Privacy Law of 2012 and its Implementing Rules and Regulations) and account transaction information or records with the 
            city/municipal government may be processed, profiled, or shared with requesting parties or for the purpose of any court, legal process, examination, inquiry, audit, or investigation of any 
            authority.
          </p>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox 
            id="agreementCheck" 
            checked={isAgreed}
            onCheckedChange={(checked) => setIsAgreed(checked === true)}
            className="mt-1"
          />
          <Label htmlFor="agreementCheck" className="text-sm">
            I have read and agree to the declaration above
          </Label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label htmlFor="signature" className="text-base">SIGNATURE OF APPLICANT/ OWNER OVER PRINTED NAME</Label>
            <Input id="signature" placeholder="Type full name to sign" />
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="designation" className="text-base">DESIGNATION / POSITION / TITLE</Label>
            <Input id="designation" placeholder="Enter your designation" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeclarationSection;
