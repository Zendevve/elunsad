import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
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
import { useApplication } from "@/contexts/ApplicationContext";
import { businessLinesService } from "@/services/applicationService";
import { useToast } from "@/components/ui/use-toast";

interface BusinessLine {
  id: number;
  lineOfBusiness: string;
  psicCode: string; // Philippine Standard Industrial Code
  productsServices: string;
  units: string;
  grossSales: string;
}

const BusinessLinesSection = () => {
  const { applicationId, isLoading, setIsLoading } = useApplication();
  const { toast } = useToast();
  const [businessLines, setBusinessLines] = useState<BusinessLine[]>([
    { id: 1, lineOfBusiness: "", psicCode: "", productsServices: "", units: "", grossSales: "" }
  ]);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Load saved data when component mounts
  useEffect(() => {
    const loadBusinessLines = async () => {
      if (!applicationId) return;
      
      try {
        const data = await businessLinesService.getBusinessLines(applicationId);
        if (data && data.length > 0) {
          // Map database format to component format
          const formattedData = data.map((line, index) => ({
            id: index + 1,
            lineOfBusiness: line.line_of_business || "",
            psicCode: line.psic_code || "",
            productsServices: line.products_services || "",
            units: line.units || "",
            grossSales: line.gross_sales || ""
          }));
          setBusinessLines(formattedData);
        }
      } catch (error) {
        console.error("Error loading business lines:", error);
      }
    };
    
    loadBusinessLines();
  }, [applicationId]);

  // Save data function with debounce
  const saveBusinessLines = async () => {
    if (!applicationId) return;
    
    // Clear any existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    
    // Set new timeout for debouncing
    const timeout = setTimeout(async () => {
      try {
        setIsLoading(true);
        
        // Filter out empty business lines
        const validLines = businessLines.filter(line => 
          line.lineOfBusiness.trim() !== '' && 
          line.productsServices.trim() !== ''
        );
        
        if (validLines.length === 0) return;
        
        // Map component format to database format
        const dataToSave = validLines.map(line => ({
          application_id: applicationId,
          line_of_business: line.lineOfBusiness,
          psic_code: line.psicCode || undefined,
          products_services: line.productsServices,
          units: line.units || undefined,
          gross_sales: line.grossSales || undefined
        }));
        
        await businessLinesService.saveBusinessLines(dataToSave);
        
        toast({
          title: "Business Lines Saved",
          description: "Your business lines have been saved successfully.",
          variant: "default",
        });
      } catch (error) {
        console.error("Error saving business lines:", error);
        toast({
          title: "Save Failed",
          description: "There was an error saving your business lines.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 1500);
    
    setSaveTimeout(timeout);
  };

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
      
      // Save after removing a line
      saveBusinessLines();
    }
  };

  const updateBusinessLine = (id: number, field: keyof BusinessLine, value: string) => {
    setBusinessLines(businessLines.map(line => 
      line.id === id ? { ...line, [field]: value } : line
    ));
    
    // Auto-save when fields change
    saveBusinessLines();
  };

  return (
    <Card className="mt-6 shadow-sm border">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
        <CardTitle className="text-lg font-medium">Line of Business</CardTitle>
        <CardDescription>
          Enter all business lines, products/services, and gross sales
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
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
              <TableRow key={line.id} className="hover:bg-muted/20 transition-colors">
                <TableCell>
                  <Input 
                    value={line.lineOfBusiness} 
                    onChange={(e) => updateBusinessLine(line.id, "lineOfBusiness", e.target.value)}
                    placeholder="Enter line of business"
                    className="focus:ring-1 focus:ring-primary"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    value={line.psicCode} 
                    onChange={(e) => updateBusinessLine(line.id, "psicCode", e.target.value)}
                    placeholder="Enter PSIC code"
                    className="focus:ring-1 focus:ring-primary"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    value={line.productsServices} 
                    onChange={(e) => updateBusinessLine(line.id, "productsServices", e.target.value)}
                    placeholder="Enter products/services"
                    className="focus:ring-1 focus:ring-primary"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    value={line.units} 
                    onChange={(e) => updateBusinessLine(line.id, "units", e.target.value)}
                    placeholder="Enter units"
                    className="focus:ring-1 focus:ring-primary"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    value={line.grossSales} 
                    onChange={(e) => updateBusinessLine(line.id, "grossSales", e.target.value)}
                    placeholder="Enter amount"
                    className="focus:ring-1 focus:ring-primary"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBusinessLine(line.id)}
                    disabled={businessLines.length === 1}
                    className="hover:bg-rose-100 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="bg-muted/20">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2 group"
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
