
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface BusinessLinesProps {
  businessLines: any[];
}

const BusinessLinesView: React.FC<BusinessLinesProps> = ({ businessLines }) => {
  if (!businessLines || businessLines.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Lines</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Line of Business</TableHead>
              <TableHead>Products/Services</TableHead>
              <TableHead>PSIC Code</TableHead>
              <TableHead>Gross Sales</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {businessLines.map((line: any) => (
              <TableRow key={line.id}>
                <TableCell>{line.line_of_business}</TableCell>
                <TableCell>{line.products_services}</TableCell>
                <TableCell>{line.psic_code || "N/A"}</TableCell>
                <TableCell>{line.gross_sales || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BusinessLinesView;
