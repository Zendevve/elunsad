import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, X } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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

  const handleProductToggle = (lineId: number, product: string, checked: boolean) => {
    const line = businessLines.find(l => l.id === lineId);
    if (!line) return;

    let updatedProducts;
    if (checked) {
      updatedProducts = [...line.productsServices, product];
    } else {
      updatedProducts = line.productsServices.filter(p => p !== product);
    }
    
    updateBusinessLine(lineId, "productsServices", updatedProducts);
  };

  const removeProductTag = (lineId: number, product: string) => {
    const line = businessLines.find(l => l.id === lineId);
    if (!line) return;
    
    const updatedProducts = line.productsServices.filter(p => p !== product);
    updateBusinessLine(lineId, "productsServices", updatedProducts);
  };

  // Helper function to get display name for selected business line
  const getBusinessDisplayName = (businessId: string) => {
    if (!businessId) return "Select line of business";
    if (businessId === "other") return "Other - Please Specify";
    
    const businessType = getBusinessTypeById(businessId);
    return businessType?.name || businessId;
  };

  return (
    <Card className="mt-6 shadow-sm border">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
        <CardTitle className="text-lg font-medium">Line of Business</CardTitle>
        <CardDescription>
          Select your business lines, products/services, and gross sales information
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-8">
          {businessLines.map((line, index) => (
            <Card key={line.id} className="border border-gray-200 bg-gray-50/30">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">
                    Business Line {index + 1}
                  </CardTitle>
                  {businessLines.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBusinessLine(line.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Line of Business Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    Line of Business <span className="text-red-500">*</span>
                  </label>
                  <Select 
                    value={line.lineOfBusiness} 
                    onValueChange={(value) => {
                      updateBusinessLine(line.id, "lineOfBusiness", value);
                      // Clear products when business line changes
                      updateBusinessLine(line.id, "productsServices", []);
                      updateBusinessLine(line.id, "productsServicesOther", "");
                    }}
                  >
                    <SelectTrigger className="focus:ring-1 focus:ring-primary h-12">
                      <SelectValue placeholder="Select line of business" />
                    </SelectTrigger>
                    <SelectContent className="bg-white max-h-[400px] border border-gray-200 shadow-lg z-50">
                      {businessSections.map((section) => (
                        <SelectGroup key={section.id}>
                          <SelectLabel className="text-sm font-semibold text-primary px-2 py-2">
                            {section.title}
                          </SelectLabel>
                          {section.categories.map((category) => (
                            <SelectItem key={category.id} value={category.id} className="px-2 py-2">
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                      <SelectGroup>
                        <SelectLabel className="text-sm font-semibold text-primary px-2 py-2">Custom</SelectLabel>
                        <SelectItem value="other" className="px-2 py-2">Other - Please Specify</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  
                  {line.lineOfBusiness === "other" && (
                    <Input 
                      value={line.lineOfBusinessOther || ""} 
                      onChange={(e) => updateBusinessLine(line.id, "lineOfBusinessOther", e.target.value)}
                      placeholder="Please specify your line of business"
                      className="focus:ring-1 focus:ring-primary mt-3"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* PSIC Code */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      PSIC Code (if available)
                    </label>
                    <Input 
                      value={line.psicCode} 
                      onChange={(e) => updateBusinessLine(line.id, "psicCode", e.target.value)}
                      placeholder="Enter PSIC code"
                      className="focus:ring-1 focus:ring-primary h-12"
                    />
                  </div>

                  {/* Units */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      No. of Units
                    </label>
                    <Input 
                      value={line.units} 
                      onChange={(e) => updateBusinessLine(line.id, "units", e.target.value)}
                      placeholder="Enter number of units"
                      className="focus:ring-1 focus:ring-primary h-12"
                    />
                  </div>
                </div>

                {/* Products/Services */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700">
                    Products / Services <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Selected Products Display */}
                  {line.productsServices.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-4 bg-blue-50 border border-blue-200 rounded-md">
                      {line.productsServices.map((product) => (
                        <Badge key={product} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                          {product}
                          <X 
                            className="h-3 w-3 cursor-pointer hover:text-red-600" 
                            onClick={() => removeProductTag(line.id, product)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Products Selection */}
                  {line.lineOfBusiness && line.lineOfBusiness !== "other" ? (
                    <div className="space-y-4">
                      <div className="max-h-48 overflow-y-auto p-4 border border-gray-200 rounded-md bg-white">
                        <div className="grid grid-cols-1 gap-3">
                          {getProductsForBusinessType(line.lineOfBusiness)
                            .filter(product => product !== "Other - Please Specify")
                            .map((product) => (
                            <div key={product} className="flex items-center space-x-3">
                              <Checkbox
                                id={`${line.id}-${product}`}
                                checked={line.productsServices.includes(product)}
                                onCheckedChange={(checked) => 
                                  handleProductToggle(line.id, product, checked as boolean)
                                }
                              />
                              <label 
                                htmlFor={`${line.id}-${product}`} 
                                className="text-sm cursor-pointer hover:text-primary flex-1"
                              >
                                {product}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Input 
                        value={line.productsServicesOther || ""} 
                        onChange={(e) => updateBusinessLine(line.id, "productsServicesOther", e.target.value)}
                        placeholder="Add other products/services (optional)"
                        className="focus:ring-1 focus:ring-primary h-12"
                      />
                    </div>
                  ) : (
                    <Input 
                      value={line.productsServicesOther || ""} 
                      onChange={(e) => updateBusinessLine(line.id, "productsServicesOther", e.target.value)}
                      placeholder="Enter your products/services"
                      className="focus:ring-1 focus:ring-primary h-12"
                    />
                  )}
                </div>

                {/* Gross Sales */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    Last Year's Gross Sales
                  </label>
                  <Input 
                    value={line.grossSales} 
                    onChange={(e) => updateBusinessLine(line.id, "grossSales", e.target.value)}
                    placeholder="Enter gross sales amount"
                    className="focus:ring-1 focus:ring-primary h-12"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/20 p-6">
        <Button
          type="button"
          variant="outline"
          size="sm"
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
