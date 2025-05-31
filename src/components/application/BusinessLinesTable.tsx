
import { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BusinessLineRow from "./BusinessLineRow";

interface BusinessLine {
  id: number;
  lineOfBusiness: string;
  psicCode: string;
  productsServices: string[];
  units: string;
  grossSales: string;
}

interface BusinessLinesTableProps {
  businessLines: BusinessLine[];
  onUpdate: (id: number, field: keyof BusinessLine, value: string | string[]) => void;
  onRemove: (id: number) => void;
}

const BusinessLinesTable = ({
  businessLines,
  onUpdate,
  onRemove
}: BusinessLinesTableProps) => {
  const [customInputs, setCustomInputs] = useState<{ [key: number]: boolean }>({});

  const handleCustomChange = (lineId: number, isCustom: boolean) => {
    setCustomInputs(prev => ({ ...prev, [lineId]: isCustom }));
  };

  return (
    <div className="w-full space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="font-medium p-6 w-1/4">Line of Business</TableHead>
              <TableHead className="font-medium p-6 w-1/6">
                PSIC Code<br />
                <span className="text-xs text-muted-foreground">(if available)</span>
              </TableHead>
              <TableHead className="font-medium p-6 w-1/3">Products / Services</TableHead>
              <TableHead className="font-medium p-6 w-1/6">No. of Units</TableHead>
              <TableHead className="font-medium p-6 w-1/5">Last Year's Gross Sales</TableHead>
              <TableHead className="w-16 p-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {businessLines.map((line) => (
              <BusinessLineRow
                key={line.id}
                line={line}
                onUpdate={onUpdate}
                onRemove={onRemove}
                canRemove={businessLines.length > 1}
                isCustom={customInputs[line.id] || false}
                onCustomChange={handleCustomChange}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BusinessLinesTable;
