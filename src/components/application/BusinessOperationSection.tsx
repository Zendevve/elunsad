import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { businessOperationsService } from "@/services/application";
import { useToast } from "@/components/ui/use-toast";
import { useApplication } from "@/contexts/ApplicationContext";
import FormSectionWrapper from "./FormSectionWrapper";

interface BusinessOperationsData {
  id?: string;
  application_id?: string;
  employees_male_count?: number | null;
  employees_female_count?: number | null;
  daily_operation_start?: string | null;
  daily_operation_end?: string | null;
  is_open_24hrs?: boolean | null;
  is_seasonal?: boolean | null;
  seasonal_operation_start?: string | null;
  seasonal_operation_end?: string | null;
}

const BusinessOperationSection = () => {
  const { applicationId } = useApplication();
  const { toast } = useToast();
  const [businessOperations, setBusinessOperations] = useState<BusinessOperationsData>({
    employees_male_count: null,
    employees_female_count: null,
    daily_operation_start: null,
    daily_operation_end: null,
    is_open_24hrs: null,
    is_seasonal: null,
    seasonal_operation_start: null,
    seasonal_operation_end: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadBusinessOperations = async () => {
      if (!applicationId) return;
      setIsLoading(true);
      try {
        const data = await businessOperationsService.getBusinessOperations(applicationId);
        if (data) {
          setBusinessOperations({
            ...data,
            employees_male_count: data.employees_male_count !== null ? data.employees_male_count : null,
            employees_female_count: data.employees_female_count !== null ? data.employees_female_count : null,
          });
        }
      } catch (error) {
        console.error("Error loading business operations:", error);
        toast({
          title: "Load Failed",
          description: "There was an error loading business operations data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBusinessOperations();
  }, [applicationId, toast]);

  const saveBusinessOperations = async (updatedData: Partial<BusinessOperationsData>) => {
    if (!applicationId) return;
    setIsLoading(true);
    try {
      const dataToSave = {
        ...businessOperations,
        ...updatedData,
        application_id: applicationId,
      };
      await businessOperationsService.saveBusinessOperations(dataToSave);
      setBusinessOperations(dataToSave);
      toast({
        title: "Business Operations Saved",
        description: "Your business operations information has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving business operations:", error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your business operations information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const parsedValue = name.includes('count') ? (value === '' ? null : parseInt(value, 10)) : value;
  
    saveBusinessOperations({ [name]: parsedValue });
  };

  const handleSwitchChange = (checked: boolean) => {
    saveBusinessOperations({ is_open_24hrs: checked });
  };

  const handleSeasonalSwitchChange = (checked: boolean) => {
    saveBusinessOperations({ is_seasonal: checked });
  };

  const handleTimeChange = (name: string, value: string) => {
    saveBusinessOperations({ [name]: value });
  };

  const handleSeasonalTimeChange = (name: string, value: string) => {
    saveBusinessOperations({ [name]: value });
  };

  return (
    <FormSectionWrapper
      title="Business Operations"
      description="Provide details about your business operations"
      stepNumber={4}
    >
      <div className="grid md:grid-cols-2 gap-4">
        {/* Number of Employees */}
        <div>
          <Label htmlFor="employees_male_count">Number of Male Employees</Label>
          <Input
            type="number"
            id="employees_male_count"
            name="employees_male_count"
            value={businessOperations.employees_male_count !== null ? businessOperations.employees_male_count.toString() : ''}
            onChange={handleInputChange}
            placeholder="Enter number of male employees"
            className="focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <Label htmlFor="employees_female_count">Number of Female Employees</Label>
          <Input
            type="number"
            id="employees_female_count"
            name="employees_female_count"
            value={businessOperations.employees_female_count !== null ? businessOperations.employees_female_count.toString() : ''}
            onChange={handleInputChange}
            placeholder="Enter number of female employees"
            className="focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Daily Operation Hours */}
        <div>
          <Label htmlFor="daily_operation_start">Daily Operation Start Time</Label>
          <Input
            type="time"
            id="daily_operation_start"
            name="daily_operation_start"
            value={businessOperations.daily_operation_start || ''}
            onChange={(e) => handleTimeChange("daily_operation_start", e.target.value)}
            className="focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <Label htmlFor="daily_operation_end">Daily Operation End Time</Label>
          <Input
            type="time"
            id="daily_operation_end"
            name="daily_operation_end"
            value={businessOperations.daily_operation_end || ''}
            onChange={(e) => handleTimeChange("daily_operation_end", e.target.value)}
            className="focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Open 24 Hours Switch */}
        <div className="flex items-center space-x-2">
          <Label htmlFor="is_open_24hrs">Open 24 Hours</Label>
          <Switch
            id="is_open_24hrs"
            checked={businessOperations.is_open_24hrs || false}
            onCheckedChange={handleSwitchChange}
          />
        </div>

        {/* Seasonal Business Switch */}
        <div className="flex items-center space-x-2">
          <Label htmlFor="is_seasonal">Seasonal Business</Label>
          <Switch
            id="is_seasonal"
            checked={businessOperations.is_seasonal || false}
            onCheckedChange={handleSeasonalSwitchChange}
          />
        </div>

        {/* Seasonal Operation Dates (conditionally rendered) */}
        {businessOperations.is_seasonal && (
          <>
            <div>
              <Label htmlFor="seasonal_operation_start">Seasonal Operation Start Date</Label>
              <Input
                type="date"
                id="seasonal_operation_start"
                name="seasonal_operation_start"
                value={businessOperations.seasonal_operation_start || ''}
                onChange={(e) => handleSeasonalTimeChange("seasonal_operation_start", e.target.value)}
                className="focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <Label htmlFor="seasonal_operation_end">Seasonal Operation End Date</Label>
              <Input
                type="date"
                id="seasonal_operation_end"
                name="seasonal_operation_end"
                value={businessOperations.seasonal_operation_end || ''}
                onChange={(e) => handleSeasonalTimeChange("seasonal_operation_end", e.target.value)}
                className="focus:ring-1 focus:ring-primary"
              />
            </div>
          </>
        )}
      </div>
    </FormSectionWrapper>
  );
};

export default BusinessOperationSection;
