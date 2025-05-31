
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useBusinessLines } from "./hooks/useBusinessLines";
import BusinessLineCard from "./BusinessLineCard";
import { useState } from "react";

const BusinessLinesSection = () => {
  const {
    businessLines,
    addBusinessLine,
    removeBusinessLine,
    updateBusinessLine,
    isLoading
  } = useBusinessLines();

  const [customInputs, setCustomInputs] = useState<{ [key: number]: boolean }>({});

  const handleCustomChange = (lineId: number, isCustom: boolean) => {
    setCustomInputs(prev => ({ ...prev, [lineId]: isCustom }));
  };

  return (
    <Card className="mt-6 shadow-sm border">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
        <CardTitle className="text-lg font-medium">Line of Business</CardTitle>
        <CardDescription>
          Enter all business lines, products/services, and gross sales
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          {businessLines.map((line, index) => (
            <BusinessLineCard
              key={line.id}
              line={line}
              onUpdate={updateBusinessLine}
              onRemove={removeBusinessLine}
              canRemove={businessLines.length > 1}
              isCustom={customInputs[line.id] || false}
              onCustomChange={handleCustomChange}
              index={index}
            />
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/20 border-t">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="group hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={addBusinessLine}
          disabled={isLoading}
        >
          <PlusCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
          Add Another Line of Business
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BusinessLinesSection;
