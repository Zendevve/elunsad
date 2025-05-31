
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import BusinessLineSelector from "./BusinessLineSelector";
import ProductsServicesMultiSelect from "./ProductsServicesMultiSelect";
import { businessLineProductsMap } from "./businessLinesData";

interface BusinessLine {
  id: number;
  lineOfBusiness: string;
  psicCode: string;
  productsServices: string[];
  units: string;
  grossSales: string;
}

interface BusinessLineRowProps {
  line: BusinessLine;
  onUpdate: (id: number, field: keyof BusinessLine, value: string | string[]) => void;
  onRemove: (id: number) => void;
  canRemove: boolean;
  isCustom: boolean;
  onCustomChange: (lineId: number, isCustom: boolean) => void;
}

const BusinessLineRow = ({
  line,
  onUpdate,
  onRemove,
  canRemove,
  isCustom,
  onCustomChange
}: BusinessLineRowProps) => {
  const getAvailableProducts = (lineOfBusiness: string): string[] => {
    const products = businessLineProductsMap[lineOfBusiness] || [];
    console.log(`Available products for "${lineOfBusiness}":`, products);
    return products;
  };

  const handleProductsChange = (products: string[]) => {
    console.log(`Products changed for line ${line.id}:`, products);
    onUpdate(line.id, "productsServices", products);
  };

  return (
    <TableRow className="hover:bg-muted/20 transition-colors">
      <TableCell className="p-6">
        <BusinessLineSelector
          lineId={line.id}
          value={line.lineOfBusiness}
          onSelect={(lineId, value) => {
            onUpdate(lineId, "lineOfBusiness", value);
            // Clear existing products when changing business line
            onUpdate(lineId, "productsServices", []);
          }}
          isCustom={isCustom}
          onCustomChange={onCustomChange}
        />
      </TableCell>
      <TableCell className="p-6">
        <Input 
          value={line.psicCode} 
          onChange={(e) => onUpdate(line.id, "psicCode", e.target.value)}
          placeholder="Enter PSIC code"
          className="focus:ring-1 focus:ring-primary"
        />
      </TableCell>
      <TableCell className="p-6">
        <ProductsServicesMultiSelect
          availableProducts={getAvailableProducts(line.lineOfBusiness)}
          selectedProducts={line.productsServices}
          onSelectionChange={handleProductsChange}
          placeholder="Select products/services..."
          disabled={!line.lineOfBusiness || line.lineOfBusiness.trim() === ""}
        />
      </TableCell>
      <TableCell className="p-6">
        <Input 
          value={line.units} 
          onChange={(e) => onUpdate(line.id, "units", e.target.value)}
          placeholder="Enter units"
          className="focus:ring-1 focus:ring-primary"
        />
      </TableCell>
      <TableCell className="p-6">
        <Input 
          value={line.grossSales} 
          onChange={(e) => onUpdate(line.id, "grossSales", e.target.value)}
          placeholder="Enter amount"
          className="focus:ring-1 focus:ring-primary"
        />
      </TableCell>
      <TableCell className="p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(line.id)}
          disabled={!canRemove}
          className="hover:bg-rose-100 hover:text-rose-600 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default BusinessLineRow;
