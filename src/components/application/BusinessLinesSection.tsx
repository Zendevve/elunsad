
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
import BusinessLinesTable from "./BusinessLinesTable";

const BusinessLinesSection = () => {
  const {
    businessLines,
    addBusinessLine,
    removeBusinessLine,
    updateBusinessLine,
    isLoading
  } = useBusinessLines();

  return (
    <Card className="mt-8 shadow-sm border">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b p-8">
        <CardTitle className="text-xl font-medium">Line of Business</CardTitle>
        <CardDescription className="text-base">
          Enter all business lines, products/services, and gross sales
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <BusinessLinesTable
          businessLines={businessLines}
          onUpdate={updateBusinessLine}
          onRemove={removeBusinessLine}
        />
      </CardContent>
      <CardFooter className="bg-muted/20 p-8">
        <Button
          type="button"
          variant="outline"
          size="default"
          className="group"
          onClick={addBusinessLine}
        >
          <PlusCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
          Add Another Line of Business
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BusinessLinesSection;
