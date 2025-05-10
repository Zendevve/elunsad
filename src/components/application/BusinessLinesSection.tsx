
import React, { useState, useEffect, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/utils/toastCompat";
import { useApplication } from "@/contexts/ApplicationContext";
import { businessLinesService } from "@/services/application";
import FormSectionWrapper from "@/components/application/FormSectionWrapper";
import { v4 as uuidv4 } from 'uuid';

// Update the interface to match what's available in the service response
interface BusinessLine {
  id: string;
  application_id: string;
  line_of_business: string;
  products_services: string;
  psic_code?: string;
  units?: string;
  gross_sales?: string;
  created_at?: string;
  updated_at?: string;
}

const BusinessLinesSection = () => {
  const [businessLines, setBusinessLines] = useState<BusinessLine[]>([]);
  const { applicationId } = useApplication();
  const [isLoading, setIsLoading] = useState(false);

  // Load business lines on component mount
  useEffect(() => {
    if (applicationId) {
      loadBusinessLines(applicationId);
    }
  }, [applicationId]);

  const loadBusinessLines = async (applicationId: string) => {
    setIsLoading(true);
    try {
      const lines = await businessLinesService.getBusinessLines(applicationId);
      if (lines && lines.length > 0) {
        setBusinessLines(lines);
      } else {
        // If no business lines exist, initialize with an empty array
        setBusinessLines([]);
      }
    } catch (error) {
      console.error("Error loading business lines:", error);
      toast("Error loading business lines", {
        description: "Failed to load business lines. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to add a new business line
  const addBusinessLine = useCallback(() => {
    const newLine: BusinessLine = {
      id: uuidv4(), // Generate a unique ID
      application_id: applicationId || "",
      line_of_business: "",
      products_services: "",
    };
    setBusinessLines((prevLines) => [...prevLines, newLine]);
  }, [applicationId]);

  // Function to remove a business line
  const removeBusinessLine = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      // Optimistically update the UI
      setBusinessLines((prevLines) => prevLines.filter((line) => line.id !== id));
      
      // Delete from the database by saving only the remaining lines
      const remainingLines = businessLines.filter(line => line.id !== id);
      await businessLinesService.saveBusinessLines(remainingLines);
      
      toast("Business Line Removed", {
        description: "The business line has been successfully removed."
      });
    } catch (error) {
      console.error("Error removing business line:", error);
      toast("Error removing business line", {
        description: "Failed to remove the business line. Please try again."
      });
      
      // If there's an error, revert the UI update
      if (applicationId) {
        loadBusinessLines(applicationId);
      }
    } finally {
      setIsLoading(false);
    }
  }, [applicationId, businessLines, loadBusinessLines]);

  // Function to update a business line
  const updateBusinessLine = useCallback(async (id: string, field: string, value: string | number) => {
    setIsLoading(true);
    try {
      // Optimistically update the UI
      const updatedLines = businessLines.map((line) =>
        line.id === id ? { ...line, [field]: value } : line
      );
      setBusinessLines(updatedLines);
      
      // Update in the database with saveBusinessLines
      await businessLinesService.saveBusinessLines(updatedLines);
      
      toast("Business Line Updated", {
        description: "The business line has been successfully updated."
      });
    } catch (error) {
      console.error("Error updating business line:", error);
      toast("Error updating business line", {
        description: "Failed to update the business line. Please try again."
      });
      
      // If there's an error, revert the UI update
      if (applicationId) {
        loadBusinessLines(applicationId);
      }
    } finally {
      setIsLoading(false);
    }
  }, [applicationId, businessLines, loadBusinessLines]);

  return (
    <FormSectionWrapper
      title="Business Lines"
      description="Specify the lines of business your company engages in"
      stepNumber={4}
    >
      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Lines of Business
          </CardTitle>
          <Button variant="outline" size="sm" onClick={addBusinessLine} disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" />
            Add Line
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          {businessLines.map((line, index) => (
            <div key={line.id} className="grid gap-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`line_of_business_${index}`}>
                    Line of Business
                  </Label>
                  <Input
                    id={`line_of_business_${index}`}
                    value={line.line_of_business || ""}
                    onChange={(e) =>
                      updateBusinessLine(line.id, "line_of_business", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor={`products_services_${index}`}>
                    Products/Services
                  </Label>
                  <Input
                    id={`products_services_${index}`}
                    value={line.products_services || ""}
                    onChange={(e) =>
                      updateBusinessLine(line.id, "products_services", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeBusinessLine(line.id)}
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          ))}
          {!businessLines.length && !isLoading && (
            <div className="text-sm text-gray-500">No business lines added yet.</div>
          )}
          {isLoading && (
            <div className="text-sm text-gray-500">Loading business lines...</div>
          )}
        </CardContent>
      </Card>
    </FormSectionWrapper>
  );
};

export default BusinessLinesSection;
