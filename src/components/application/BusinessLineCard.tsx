
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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

interface BusinessLineCardProps {
  line: BusinessLine;
  onUpdate: (id: number, field: keyof BusinessLine, value: string | string[]) => void;
  onRemove: (id: number) => void;
  canRemove: boolean;
  isCustom: boolean;
  onCustomChange: (lineId: number, isCustom: boolean) => void;
  index: number;
}

const BusinessLineCard = ({
  line,
  onUpdate,
  onRemove,
  canRemove,
  isCustom,
  onCustomChange,
  index
}: BusinessLineCardProps) => {
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
    <Card className="relative border border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-foreground">
            Business Line {index + 1}
          </CardTitle>
          {canRemove && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(line.id)}
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Business Line Selector */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Line of Business *
          </Label>
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
        </div>

        {/* Two-column grid for form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PSIC Code */}
          <div className="space-y-2">
            <Label htmlFor={`psic-${line.id}`} className="text-sm font-medium text-foreground">
              PSIC Code
            </Label>
            <Input
              id={`psic-${line.id}`}
              value={line.psicCode}
              onChange={(e) => onUpdate(line.id, "psicCode", e.target.value)}
              placeholder="Enter PSIC code"
              className="h-10"
            />
          </div>

          {/* Number of Units */}
          <div className="space-y-2">
            <Label htmlFor={`units-${line.id}`} className="text-sm font-medium text-foreground">
              Number of Units
            </Label>
            <Input
              id={`units-${line.id}`}
              value={line.units}
              onChange={(e) => onUpdate(line.id, "units", e.target.value)}
              placeholder="Enter number of units"
              className="h-10"
            />
          </div>
        </div>

        {/* Products/Services - Full width */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Products / Services *
          </Label>
          <ProductsServicesMultiSelect
            availableProducts={getAvailableProducts(line.lineOfBusiness)}
            selectedProducts={line.productsServices}
            onSelectionChange={handleProductsChange}
            placeholder="Select products/services..."
            disabled={!line.lineOfBusiness || line.lineOfBusiness.trim() === ""}
          />
        </div>

        {/* Gross Sales - Full width */}
        <div className="space-y-2">
          <Label htmlFor={`sales-${line.id}`} className="text-sm font-medium text-foreground">
            Last Year's Gross Sales
          </Label>
          <Input
            id={`sales-${line.id}`}
            value={line.grossSales}
            onChange={(e) => onUpdate(line.id, "grossSales", e.target.value)}
            placeholder="Enter gross sales amount"
            className="h-10"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessLineCard;
