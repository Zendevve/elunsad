
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useApplication } from "@/contexts/ApplicationContext";
import { businessOperationsService } from "@/services/application";
import { useToast } from "@/components/ui/use-toast";
import FormSectionWrapper from "./FormSectionWrapper";

const BusinessOperationSection = () => {
  const { applicationId, isLoading, setIsLoading } = useApplication();
  const { toast } = useToast();
  
  // Business operation state
  const [businessActivity, setBusinessActivity] = useState("");
  const [businessArea, setBusinessArea] = useState<number | null>(null);
  const [capitalization, setCapitalization] = useState<number | null>(null);
  const [totalEmployees, setTotalEmployees] = useState<number | null>(null);
  const [employeesInLucena, setEmployeesInLucena] = useState<number | null>(null);
  const [employeesMale, setEmployeesMale] = useState<number | null>(null);
  const [employeesFemale, setEmployeesFemale] = useState<number | null>(null);
  const [hasTaxIncentives, setHasTaxIncentives] = useState(false);

  // Vehicle counts
  const [car, setCar] = useState<number | null>(null);
  const [vanTruck, setVanTruck] = useState<number | null>(null);
  const [motorcycle, setMotorcycle] = useState<number | null>(null);
  
  // Security features
  const [cctvCameras, setCctvCameras] = useState<number | null>(null);
  const [securityGuards, setSecurityGuards] = useState<number | null>(null);

  useEffect(() => {
    const loadBusinessOperations = async () => {
      if (!applicationId) return;
      
      try {
        const data = await businessOperationsService.getBusinessOperations(applicationId);
        if (data) {
          setBusinessActivity(data.business_activity || "");
          setBusinessArea(data.business_area || null);
          setCapitalization(data.capitalization || null);
          setTotalEmployees(data.total_employees || null);
          setEmployeesInLucena(data.employees_in_lucena || null);
          setEmployeesMale(data.employees_male || null);
          setEmployeesFemale(data.employees_female || null);
          setHasTaxIncentives(data.has_tax_incentives || false);
          
          // Set vehicle counts
          setCar(data.car || null);
          setVanTruck(data.van_truck || null);
          setMotorcycle(data.motorcycle || null);
          
          // Set security features
          setCctvCameras(data.cctv_cameras || null);
          setSecurityGuards(data.security_guards || null);
        }
      } catch (error) {
        console.error("Error loading business operations:", error);
      }
    };
    
    loadBusinessOperations();
  }, [applicationId]);

  const handleSaveBusinessOperations = async () => {
    if (!applicationId) return;
    
    try {
      setIsLoading(true);
      
      const businessOperationsData = {
        application_id: applicationId,
        business_activity: businessActivity,
        business_area: businessArea,
        capitalization: capitalization,
        total_employees: totalEmployees,
        employees_in_lucena: employeesInLucena,
        employees_male: employeesMale,
        employees_female: employeesFemale,
        has_tax_incentives: hasTaxIncentives,
        
        // Vehicle counts
        car: car,
        van_truck: vanTruck,
        motorcycle: motorcycle,
        
        // Security features
        cctv_cameras: cctvCameras,
        security_guards: securityGuards,
      };
      
      await businessOperationsService.saveBusinessOperations(businessOperationsData);
      
      toast({
        title: "Business Operations Saved",
        description: "Your business operation details have been saved.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving business operations:", error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your business operation details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Input change handlers
  const handleBusinessActivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessActivity(e.target.value);
  };

  const handleBusinessAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessArea(e.target.value ? Number(e.target.value) : null);
  };

  const handleCapitalizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCapitalization(e.target.value ? Number(e.target.value) : null);
  };

  const handleTotalEmployeesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalEmployees(e.target.value ? Number(e.target.value) : null);
  };

  const handleEmployeesInLucenaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeesInLucena(e.target.value ? Number(e.target.value) : null);
  };

  const handleEmployeesMaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeesMale(e.target.value ? Number(e.target.value) : null);
  };

  const handleEmployeesFemaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeesFemale(e.target.value ? Number(e.target.value) : null);
  };

  const handleHasTaxIncentivesChange = (checked: boolean) => {
    setHasTaxIncentives(checked);
  };

  // Update values and save on input blur
  const handleInputBlur = () => {
    handleSaveBusinessOperations();
  };

  return (
    <FormSectionWrapper
      title="Business Operation Details"
      description="Provide information about your business operations"
      stepNumber={4}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="businessActivity">Business Activity/Description</Label>
            <Input 
              id="businessActivity" 
              placeholder="Describe your business activities" 
              value={businessActivity}
              onChange={handleBusinessActivityChange}
              onBlur={handleInputBlur}
            />
          </div>

          <div>
            <Label htmlFor="businessArea">Business Area (sqm)</Label>
            <Input 
              id="businessArea" 
              type="number" 
              placeholder="Area in square meters" 
              value={businessArea || ''}
              onChange={handleBusinessAreaChange}
              onBlur={handleInputBlur}
            />
          </div>

          <div>
            <Label htmlFor="capitalization">Capitalization (PHP)</Label>
            <Input 
              id="capitalization" 
              type="number" 
              placeholder="Amount in Philippine Peso" 
              value={capitalization || ''}
              onChange={handleCapitalizationChange}
              onBlur={handleInputBlur}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="taxIncentives" 
              checked={hasTaxIncentives} 
              onCheckedChange={handleHasTaxIncentivesChange}
            />
            <Label htmlFor="taxIncentives">Has Tax Incentives</Label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium mb-2">Employee Information</h3>
          <div>
            <Label htmlFor="totalEmployees">Total Employees</Label>
            <Input 
              id="totalEmployees" 
              type="number" 
              placeholder="Enter total number of employees" 
              value={totalEmployees || ''}
              onChange={handleTotalEmployeesChange}
              onBlur={handleInputBlur}
            />
          </div>

          <div>
            <Label htmlFor="employeesInLucena">Employees from Lucena</Label>
            <Input 
              id="employeesInLucena" 
              type="number" 
              placeholder="Number of employees from Lucena" 
              value={employeesInLucena || ''}
              onChange={handleEmployeesInLucenaChange}
              onBlur={handleInputBlur}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employeesMale">Male Employees</Label>
              <Input 
                id="employeesMale" 
                type="number" 
                value={employeesMale || ''}
                onChange={handleEmployeesMaleChange}
                onBlur={handleInputBlur}
              />
            </div>
            <div>
              <Label htmlFor="employeesFemale">Female Employees</Label>
              <Input 
                id="employeesFemale" 
                type="number" 
                value={employeesFemale || ''}
                onChange={handleEmployeesFemaleChange}
                onBlur={handleInputBlur}
              />
            </div>
          </div>
        </div>
      </div>
    </FormSectionWrapper>
  );
};

export default BusinessOperationSection;
