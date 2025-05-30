
import { useState, useEffect } from "react";
import { useApplication } from "@/contexts/ApplicationContext";
import { businessLinesService } from "@/services/application";
import { useToast } from "@/components/ui/use-toast";

interface BusinessLine {
  id: number;
  lineOfBusiness: string;
  psicCode: string;
  productsServices: string[];
  units: string;
  grossSales: string;
}

export const useBusinessLines = () => {
  const { applicationId, isLoading, setIsLoading } = useApplication();
  const { toast } = useToast();
  const [businessLines, setBusinessLines] = useState<BusinessLine[]>([
    { id: 1, lineOfBusiness: "", psicCode: "", productsServices: [], units: "", grossSales: "" }
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
      // Save after removing a line
      saveBusinessLines();
    }
  };

  const updateBusinessLine = (id: number, field: keyof BusinessLine, value: string | string[]) => {
    console.log(`Updating business line ${id}, field: ${field}, value:`, value);
    setBusinessLines(prev => prev.map(line => 
      line.id === id ? { ...line, [field]: value } : line
    ));
    
    // Auto-save when fields change
    saveBusinessLines();
  };

  return {
    businessLines,
    addBusinessLine,
    removeBusinessLine,
    updateBusinessLine,
    isLoading
  };
};
