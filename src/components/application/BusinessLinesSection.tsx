
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
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
import { businessLinesService } from "@/services/application";
import { useToast } from "@/components/ui/use-toast";
import { 
  businessSections, 
  getAllBusinessTypes, 
  getProductsForBusinessType,
  getBusinessTypeById 
} from "@/utils/businessCategories";

interface BusinessLine {
  id: number;
  lineOfBusiness: string;
  lineOfBusinessOther?: string;
  psicCode: string;
  productsServices: string[];
  productsServicesOther?: string;
  units: string;
  grossSales: string;
}

const BusinessLinesSection = () => {
  const { applicationId, isLoading, setIsLoading } = useApplication();
  const { toast } = useToast();
  const [businessLines, setBusinessLines] = useState<BusinessLine[]>([
    { 
      id: 1, 
      lineOfBusiness: "", 
      lineOfBusinessOther: "",
      psicCode: "", 
      productsServices: [], 
      productsServicesOther: "",
      units: "", 
      grossSales: "" 
    }
  ]);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Load saved data when component mounts
  useEffect(() => {
    const loadBusinessLines = async () => {
      if (!applicationId) return;
      
      try {
        const data = await businessLinesService.getBusinessLines(applicationId);
        console.log("Loaded business lines:", data);
        if (data && data.length > 0) {
          // Map database format to component format
          const formattedData = data.map((line, index) => {
            // Parse products/services if it's a JSON string, otherwise treat as comma-separated
            let productsArray: string[] = [];
            if (line.products_services) {
              try {
                productsArray = JSON.parse(line.products_services);
              } catch {
                productsArray = line.products_services.split(',').map(p => p.trim()).filter(p => p);
              }
            }

            return {
              id: index + 1,
              lineOfBusiness: line.line_of_business || "",
              lineOfBusinessOther: "",
              psicCode: line.psic_code || "",
              productsServices: productsArray,
              productsServicesOther: "",
              units: line.units || "",
              grossSales: line.gross_sales || ""
            };
          });
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
        const validLines = businessLines.filter(line => {
          const hasLineOfBusiness = line.lineOfBusiness.trim() !== '' || line.lineOfBusinessOther?.trim() !== '';
          const hasProducts = line.productsServices.length > 0 || line.productsServicesOther?.trim() !== '';
          return hasLineOfBusiness && hasProducts;
        });
        
        if (validLines.length === 0) return;
        
        // Map component format to database format
        const dataToSave = validLines.map(line => {
          // Combine selected products with custom "other" products
          let allProducts = [...line.productsServices];
          if (line.productsServicesOther?.trim()) {
            allProducts.push(line.productsServicesOther);
          }
          
          // Use custom business line if "other" is selected
          const businessLineName = line.lineOfBusiness === "other" && line.lineOfBusinessOther 
            ? line.lineOfBusinessOther 
            : getBusinessTypeById(line.lineOfBusiness)?.name || line.lineOfBusiness;

          return {
            application_id: applicationId,
            line_of_business: businessLineName,
            psic_code: line.psicCode || undefined,
            products_services: JSON.stringify(allProducts),
            units: line.units || undefined,
            gross_sales: line.grossSales || undefined
          };
        });
        
        console.log("Saving business lines:", dataToSave);
        const result = await businessLinesService.saveBusinessLines(dataToSave);
        console.log("Save result:", result);
        
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
      lineOfBusinessOther: "",
      psicCode: "", 
      productsServices: [], 
      productsServicesOther: "",
      units: "", 
      grossSales: "" 
    }]);
  };

  const removeBusinessLine = (id: number) => {
    if (businessLines.length > 1) {
      setBusinessLines(businessLines.filter(line => line.id !== id));
      saveBusinessLines();
    }
  };

  const updateBusinessLine = (id: number, field: keyof BusinessLine, value: any) => {
    setBusinessLines(businessLines.map(line => 
      line.id === id ? { ...line, [field]: value } : line
    ));
    saveBusinessLines();
  };

  const handleProductSelection = (id: number, selectedProducts: string[]) => {
    // Filter out "Other - Please Specify" from the selected products array
    const filteredProducts = selectedProducts.filter(product => product !== "Other - Please Specify");
    updateBusinessLine(id, "productsServices", filteredProducts);
  };

  const allBusinessTypes = getAllBusinessTypes();

  return (
    <Card className="mt-6 shadow-sm border">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
        <CardTitle className="text-lg font-medium">Line of Business</CardTitle>
        <CardDescription>
          Select your business lines, products/services, and gross sales information
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="font-medium min-w-[250px]">Line of Business</TableHead>
              <TableHead className="font-medium whitespace-nowrap min-w-[120px]">
                PSIC<br />(if available)
              </TableHead>
              <TableHead className="font-medium min-w-[300px]">Products / Services</TableHead>
              <TableHead className="font-medium min-w-[120px]">No. of Units</TableHead>
              <TableHead className="font-medium whitespace-nowrap min-w-[150px]">Last Year's Gross Sales</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {businessLines.map((line) => (
              <TableRow key={line.id} className="hover:bg-muted/20 transition-colors">
                <TableCell className="space-y-2">
                  <Select 
                    value={line.lineOfBusiness} 
                    onValueChange={(value) => {
                      updateBusinessLine(line.id, "lineOfBusiness", value);
                      // Clear products when business line changes
                      updateBusinessLine(line.id, "productsServices", []);
                      updateBusinessLine(line.id, "productsServicesOther", "");
                    }}
                  >
                    <SelectTrigger className="focus:ring-1 focus:ring-primary">
                      <SelectValue placeholder="Select line of business" />
                    </SelectTrigger>
                    <SelectContent className="bg-white max-h-[300px]">
                      {businessSections.map((section) => (
                        <SelectGroup key={section.id}>
                          <SelectLabel className="text-sm font-semibold text-primary">
                            {section.title}
                          </SelectLabel>
                          {section.categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                      <SelectGroup>
                        <SelectLabel className="text-sm font-semibold text-primary">Custom</SelectLabel>
                        <SelectItem value="other">Other - Please Specify</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  
                  {line.lineOfBusiness === "other" && (
                    <Input 
                      value={line.lineOfBusinessOther || ""} 
                      onChange={(e) => updateBusinessLine(line.id, "lineOfBusinessOther", e.target.value)}
                      placeholder="Please specify your line of business"
                      className="focus:ring-1 focus:ring-primary"
                    />
                  )}
                </TableCell>
                
                <TableCell>
                  <Input 
                    value={line.psicCode} 
                    onChange={(e) => updateBusinessLine(line.id, "psicCode", e.target.value)}
                    placeholder="Enter PSIC code"
                    className="focus:ring-1 focus:ring-primary"
                  />
                </TableCell>
                
                <TableCell className="space-y-2">
                  {line.lineOfBusiness && line.lineOfBusiness !== "other" ? (
                    <>
                      <Select 
                        value={line.productsServices.join(",")} 
                        onValueChange={(value) => {
                          const selectedProducts = value ? value.split(",") : [];
                          handleProductSelection(line.id, selectedProducts);
                        }}
                      >
                        <SelectTrigger className="focus:ring-1 focus:ring-primary">
                          <SelectValue placeholder="Select products/services" />
                        </SelectTrigger>
                        <SelectContent className="bg-white max-h-[200px]">
                          {getProductsForBusinessType(line.lineOfBusiness).map((product) => (
                            <SelectItem key={product} value={product}>
                              {product}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {line.productsServices.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Selected: {line.productsServices.join(", ")}
                        </div>
                      )}
                      
                      <Input 
                        value={line.productsServicesOther || ""} 
                        onChange={(e) => updateBusinessLine(line.id, "productsServicesOther", e.target.value)}
                        placeholder="Add other products/services (optional)"
                        className="focus:ring-1 focus:ring-primary"
                      />
                    </>
                  ) : (
                    <Input 
                      value={line.productsServicesOther || ""} 
                      onChange={(e) => updateBusinessLine(line.id, "productsServicesOther", e.target.value)}
                      placeholder="Enter products/services"
                      className="focus:ring-1 focus:ring-primary"
                    />
                  )}
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
