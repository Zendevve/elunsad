
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useApplication } from "@/contexts/ApplicationContext";
import { businessOperationsService } from "@/services/application";
import FormSectionWrapper from "./FormSectionWrapper";

const BusinessOperationSection = () => {
  const { applicationId, isLoading, setIsLoading } = useApplication();
  
  // Business operation state
  const [businessActivity, setBusinessActivity] = useState("");
  const [businessArea, setBusinessArea] = useState<number | null>(null);
  const [capitalization, setCapitalization] = useState<number | null>(null);
  const [professionalMale, setProfessionalMale] = useState<number | null>(null);
  const [professionalFemale, setProfessionalFemale] = useState<number | null>(null);
  const [nonProfessionalMale, setNonProfessionalMale] = useState<number | null>(null);
  const [nonProfessionalFemale, setNonProfessionalFemale] = useState<number | null>(null);
  const [employeesInLucena, setEmployeesInLucena] = useState<number | null>(null);
  const [hasTaxIncentives, setHasTaxIncentives] = useState(false);
  const [propertyOwned, setPropertyOwned] = useState(false);

  // Vehicle counts
  const [vanTruck, setVanTruck] = useState<number | null>(null);
  const [motorcycle, setMotorcycle] = useState<number | null>(null);
  
  // Security features
  const [cctvCameras, setCctvCameras] = useState<number | null>(null);

  useEffect(() => {
    const loadBusinessOperations = async () => {
      if (!applicationId) return;
      
      try {
        const data = await businessOperationsService.getBusinessOperations(applicationId);
        if (data) {
          setBusinessActivity(data.business_activity || "");
          setBusinessArea(data.business_area || null);
          setCapitalization(data.capitalization || null);
          setProfessionalMale(data.professional_male || null);
          setProfessionalFemale(data.professional_female || null);
          setNonProfessionalMale(data.non_professional_male || null);
          setNonProfessionalFemale(data.non_professional_female || null);
          setEmployeesInLucena(data.employees_in_lucena || null);
          setHasTaxIncentives(data.has_tax_incentives || false);
          setPropertyOwned(data.property_owned || false);
          
          // Set vehicle counts
          setVanTruck(data.van_truck || null);
          setMotorcycle(data.motorcycle || null);
          
          // Set security features
          setCctvCameras(data.cctv_cameras || null);
        }
      } catch (error) {
        console.error("Error loading business operations:", error);
      }
    };
    
    loadBusinessOperations();
  }, [applicationId]);

  const handleSaveBusinessOperations = async (showToast = false) => {
    if (!applicationId) return;
    
    try {
      setIsLoading(true);
      
      const businessOperationsData = {
        application_id: applicationId,
        business_activity: businessActivity,
        business_area: businessArea,
        capitalization: capitalization,
        professional_male: professionalMale,
        professional_female: professionalFemale,
        non_professional_male: nonProfessionalMale,
        non_professional_female: nonProfessionalFemale,
        employees_in_lucena: employeesInLucena,
        has_tax_incentives: hasTaxIncentives,
        property_owned: propertyOwned,
        
        // Vehicle counts
        van_truck: vanTruck,
        motorcycle: motorcycle,
        
        // Security features
        cctv_cameras: cctvCameras
      };
      
      await businessOperationsService.saveBusinessOperations(businessOperationsData);
      // NEVER show toasts here - they should only be shown by the parent component when Next button is clicked
    } catch (error) {
      console.error("Error saving business operations:", error);
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

  const handleProfessionalMaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfessionalMale(e.target.value ? Number(e.target.value) : null);
  };

  const handleProfessionalFemaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfessionalFemale(e.target.value ? Number(e.target.value) : null);
  };

  const handleNonProfessionalMaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNonProfessionalMale(e.target.value ? Number(e.target.value) : null);
  };

  const handleNonProfessionalFemaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNonProfessionalFemale(e.target.value ? Number(e.target.value) : null);
  };

  const handleEmployeesInLucenaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeesInLucena(e.target.value ? Number(e.target.value) : null);
  };

  const handleHasTaxIncentivesChange = (checked: boolean) => {
    setHasTaxIncentives(checked);
  };

  const handlePropertyOwnedChange = (checked: boolean) => {
    setPropertyOwned(checked);
  };

  // Update values and save on input blur - NEVER show toast, explicitly set to false
  const handleInputBlur = () => {
    // Force the showToast parameter to false to prevent any toast notifications
    handleSaveBusinessOperations(false);
  };

  // Expose validation/save function for parent component
  useEffect(() => {
    if (!window.businessOperationHelpers) {
      window.businessOperationHelpers = {
        validateAndSave: async () => {
          // Only parent should show toast, never here - we're just providing validation
          await handleSaveBusinessOperations(false);
          return true; // Business operations don't have required fields for now
        }
      };
    } else {
      window.businessOperationHelpers.validateAndSave = async () => {
        // Only parent should show toast, never here - we're just providing validation
        await handleSaveBusinessOperations(false);
        return true;
      };
    }
    
    return () => {
      // Cleanup when component unmounts
      if (window.businessOperationHelpers) {
        delete window.businessOperationHelpers.validateAndSave;
      }
    };
  }, [
    businessActivity, businessArea, capitalization, 
    professionalMale, professionalFemale, nonProfessionalMale, 
    nonProfessionalFemale, employeesInLucena, hasTaxIncentives,
    propertyOwned, vanTruck, motorcycle, cctvCameras
  ]);

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
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="propertyOwned" 
              checked={propertyOwned} 
              onCheckedChange={handlePropertyOwnedChange}
            />
            <Label htmlFor="propertyOwned">Property is Owned</Label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium mb-2">Employee Information</h3>
          
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
              <Label htmlFor="professionalMale">Professional Male</Label>
              <Input 
                id="professionalMale" 
                type="number" 
                value={professionalMale || ''}
                onChange={handleProfessionalMaleChange}
                onBlur={handleInputBlur}
              />
            </div>
            <div>
              <Label htmlFor="professionalFemale">Professional Female</Label>
              <Input 
                id="professionalFemale" 
                type="number" 
                value={professionalFemale || ''}
                onChange={handleProfessionalFemaleChange}
                onBlur={handleInputBlur}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nonProfessionalMale">Non-Professional Male</Label>
              <Input 
                id="nonProfessionalMale" 
                type="number" 
                value={nonProfessionalMale || ''}
                onChange={handleNonProfessionalMaleChange}
                onBlur={handleInputBlur}
              />
            </div>
            <div>
              <Label htmlFor="nonProfessionalFemale">Non-Professional Female</Label>
              <Input 
                id="nonProfessionalFemale" 
                type="number" 
                value={nonProfessionalFemale || ''}
                onChange={handleNonProfessionalFemaleChange}
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
