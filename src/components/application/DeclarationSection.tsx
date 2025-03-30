
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DeclarationSection = () => {
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
