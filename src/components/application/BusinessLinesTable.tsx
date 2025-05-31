
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
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/40">
          <TableHead className="font-medium">Line of Business</TableHead>
          <TableHead className="font-medium whitespace-nowrap">
            PSIC<br />(if available)
          </TableHead>
          <TableHead className="font-medium">Products / Services</TableHead>
          <TableHead className="font-medium">No. of Units</TableHead>
          <TableHead className="font-medium whitespace-nowrap">Last Year's Gross Sales</TableHead>
          <TableHead className="w-[50px]"></TableHead>
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
  );
};

export default BusinessLinesTable;
