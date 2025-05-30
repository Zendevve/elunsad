
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Check, ChevronsUpDown } from "lucide-react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useApplication } from "@/contexts/ApplicationContext";
import { businessLinesService } from "@/services/application";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { businessLineOptions, businessLineProductsMap } from "./businessLinesData";
import ProductsServicesMultiSelect from "./ProductsServicesMultiSelect";

interface BusinessLine {
  id: number;
  lineOfBusiness: string;
  psicCode: string;
  productsServices: string[];
  units: string;
  grossSales: string;
}

const BusinessLinesSection = () => {
  const { applicationId, isLoading, setIsLoading } = useApplication();
  const { toast } = useToast();
  const [businessLines, setBusinessLines] = useState<BusinessLine[]>([
    { id: 1, lineOfBusiness: "", psicCode: "", productsServices: [], units: "", grossSales: "" }
  ]);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [openPopovers, setOpenPopovers] = useState<{ [key: number]: boolean }>({});
  const [customInputs, setCustomInputs] = useState<{ [key: number]: boolean }>({});

  // Load saved data when component mounts
  useEffect(() => {
    const loadBusinessLines = async () => {
      if (!applicationId) return;
      
      try {
        const data = await businessLinesService.getBusinessLines(applicationId);
        console.log("Loaded business lines:", data);
        if (data && data.length > 0) {
          // Map database format to component format
          const formattedData = data.map((line, index) => ({
            id: index + 1,
            lineOfBusiness: line.line_of_business || "",
            psicCode: line.psic_code || "",
            productsServices: line.products_services ? line.products_services.split(", ").filter(Boolean) : [],
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
          line.productsServices.length > 0
        );
        
        if (validLines.length === 0) return;
        
        // Map component format to database format
        const dataToSave = validLines.map(line => ({
          application_id: applicationId,
          line_of_business: line.lineOfBusiness,
          psic_code: line.psicCode || undefined,
          products_services: line.productsServices.join(", "),
          units: line.units || undefined,
          gross_sales: line.grossSales || undefined
        }));
        
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
      psicCode: "", 
      productsServices: [], 
      units: "", 
      grossSales: "" 
    }]);
  };

  const removeBusinessLine = (id: number) => {
    if (businessLines.length > 1) {
      setBusinessLines(businessLines.filter(line => line.id !== id));
      
      // Clean up state for removed line
      setOpenPopovers(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      setCustomInputs(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      
      // Save after removing a line
      saveBusinessLines();
    }
  };

  const updateBusinessLine = (id: number, field: keyof BusinessLine, value: string | string[]) => {
    setBusinessLines(businessLines.map(line => 
      line.id === id ? { ...line, [field]: value } : line
    ));
    
    // Auto-save when fields change
    saveBusinessLines();
  };

  const handleBusinessLineSelect = (lineId: number, value: string) => {
    if (value === "Others (Custom)") {
      setCustomInputs(prev => ({ ...prev, [lineId]: true }));
      updateBusinessLine(lineId, "lineOfBusiness", "");
      // Clear products when switching to custom
      updateBusinessLine(lineId, "productsServices", []);
    } else {
      setCustomInputs(prev => ({ ...prev, [lineId]: false }));
      updateBusinessLine(lineId, "lineOfBusiness", value);
      // Clear existing products when changing business line
      updateBusinessLine(lineId, "productsServices", []);
    }
    setOpenPopovers(prev => ({ ...prev, [lineId]: false }));
  };

  const handleProductsChange = (lineId: number, products: string[]) => {
    updateBusinessLine(lineId, "productsServices", products);
  };

  const getAvailableProducts = (lineOfBusiness: string): string[] => {
    return businessLineProductsMap[lineOfBusiness] || [];
  };

  const groupedOptions = businessLineOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, typeof businessLineOptions>);

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
                <TableCell className="min-w-[250px]">
                  {customInputs[line.id] ? (
                    <Input 
                      value={line.lineOfBusiness} 
                      onChange={(e) => updateBusinessLine(line.id, "lineOfBusiness", e.target.value)}
                      placeholder="Enter custom line of business"
                      className="focus:ring-1 focus:ring-primary"
                    />
                  ) : (
                    <Popover 
                      open={openPopovers[line.id] || false} 
                      onOpenChange={(open) => setOpenPopovers(prev => ({ ...prev, [line.id]: open }))}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openPopovers[line.id] || false}
                          className="w-full justify-between"
                        >
                          {line.lineOfBusiness || "Select line of business..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search line of business..." />
                          <CommandList>
                            <CommandEmpty>No business line found.</CommandEmpty>
                            {Object.entries(groupedOptions).map(([category, options]) => (
                              <CommandGroup key={category} heading={category}>
                                {options.map((option) => (
                                  <CommandItem
                                    key={option.name}
                                    value={option.name}
                                    onSelect={() => handleBusinessLineSelect(line.id, option.name)}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        line.lineOfBusiness === option.name ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {option.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            ))}
                            <CommandGroup heading="CUSTOM">
                              <CommandItem
                                value="Others (Custom)"
                                onSelect={() => handleBusinessLineSelect(line.id, "Others (Custom)")}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    customInputs[line.id] ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                Others (Custom)
                              </CommandItem>
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
                <TableCell className="min-w-[300px]">
                  <ProductsServicesMultiSelect
                    availableProducts={getAvailableProducts(line.lineOfBusiness)}
                    selectedProducts={line.productsServices}
                    onSelectionChange={(products) => handleProductsChange(line.id, products)}
                    placeholder="Select products/services..."
                    disabled={!line.lineOfBusiness}
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
