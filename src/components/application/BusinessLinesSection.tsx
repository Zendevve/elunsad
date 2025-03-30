
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BusinessLine {
  id: number;
  lineOfBusiness: string;
  psicCode: string; // Philippine Standard Industrial Code
  productsServices: string;
  units: string;
  grossSales: string;
}

const BusinessLinesSection = () => {
  const [businessLines, setBusinessLines] = useState<BusinessLine[]>([
    { id: 1, lineOfBusiness: "", psicCode: "", productsServices: "", units: "", grossSales: "" }
  ]);

  const addBusinessLine = () => {
    const newId = businessLines.length > 0 ? Math.max(...businessLines.map(line => line.id)) + 1 : 1;
    setBusinessLines([...businessLines, { 
      id: newId, 
      lineOfBusiness: "", 
      psicCode: "", 
      productsServices: "", 
      units: "", 
      grossSales: "" 
    }]);
  };

  const removeBusinessLine = (id: number) => {
    if (businessLines.length > 1) {
      setBusinessLines(businessLines.filter(line => line.id !== id));
    }
  };

  const updateBusinessLine = (id: number, field: keyof BusinessLine, value: string) => {
    setBusinessLines(businessLines.map(line => 
      line.id === id ? { ...line, [field]: value } : line
    ));
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Line of Business</CardTitle>
        <CardDescription>
          Enter all business lines, products/services, and gross sales
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Line of Business</TableHead>
              <TableHead>
                Philippine Standard Industrial Code
                <br />(if available)
              </TableHead>
              <TableHead>Products / Services</TableHead>
              <TableHead>No. of Units</TableHead>
              <TableHead>Last Year's Gross Sales/Receipts</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {businessLines.map((line) => (
              <TableRow key={line.id}>
                <TableCell>
                  <Input 
                    value={line.lineOfBusiness} 
                    onChange={(e) => updateBusinessLine(line.id, "lineOfBusiness", e.target.value)}
                    placeholder="Enter line of business"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    value={line.psicCode} 
                    onChange={(e) => updateBusinessLine(line.id, "psicCode", e.target.value)}
                    placeholder="Enter PSIC code"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    value={line.productsServices} 
                    onChange={(e) => updateBusinessLine(line.id, "productsServices", e.target.value)}
                    placeholder="Enter products/services"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    value={line.units} 
                    onChange={(e) => updateBusinessLine(line.id, "units", e.target.value)}
                    placeholder="Enter units"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    value={line.grossSales} 
                    onChange={(e) => updateBusinessLine(line.id, "grossSales", e.target.value)}
                    placeholder="Enter amount"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBusinessLine(line.id)}
                    disabled={businessLines.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={addBusinessLine}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Another Line of Business
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BusinessLinesSection;
