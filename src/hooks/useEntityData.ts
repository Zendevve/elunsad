
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

// Generic hook for loading and saving entity data
export function useEntityData<T extends Record<string, any>>(
  fetchFn: (id: string) => Promise<T | null>, 
  saveFn: (data: T) => Promise<T | null>,
  applicationId: string | null,
  initialState: T,
  onSaveSuccess?: () => void,
  autoSaveEnabled = true
) {
  const [data, setData] = useState<T>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastSavedData, setLastSavedData] = useState<T | null>(null);
  const { toast } = useToast();

  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      if (!applicationId) return;
      
      setIsLoading(true);
      try {
        const result = await fetchFn(applicationId);
        if (result) {
          setData(result as T);
          setLastSavedData(result as T);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Load Failed",
          description: "There was an error loading the data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [applicationId, fetchFn]);

  // Update data and optionally trigger auto save
  const updateData = (updatedValues: Partial<T>) => {
    setData(current => ({ ...current, ...updatedValues }));
  };

  // Save data manually
  const saveData = async () => {
    if (!applicationId) {
      console.error("Cannot save data: applicationId is null");
      return null;
    }
    
    setIsSaving(true);
    try {
      console.log("Saving data:", { ...data, application_id: applicationId });
      const result = await saveFn({ ...data, application_id: applicationId } as T);
      
      if (result) {
        setLastSavedData({ ...data } as T);
        toast({
          title: "Data Saved",
          description: "Your information has been saved successfully.",
        });
        
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      }
      
      return result;
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your information. Please ensure all required fields are filled.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // Check if data has changed since last save
  const hasUnsavedChanges = () => {
    if (!lastSavedData) return true;
    
    return JSON.stringify(data) !== JSON.stringify(lastSavedData);
  };

  // Auto-save effect
  useEffect(() => {
    if (!applicationId || !autoSaveEnabled || !isInitialized || isSaving) return;
    
    const checkRequiredFields = (data: Record<string, any>, type: string): boolean => {
      // For BusinessInformationData
      if (type === 'businessInfo') {
        return !!(
          data.business_name && 
          data.tin_number && 
          data.ownership_type && 
          data.street && 
          data.barangay && 
          data.city_municipality && 
          data.province && 
          data.zip_code && 
          data.mobile_no && 
          data.email_address
        );
      }
      
      // For OwnerInformationData
      if (type === 'ownerInfo') {
        return !!(
          data.surname && 
          data.given_name && 
          data.age && 
          data.sex && 
          data.civil_status && 
          data.nationality && 
          data.owner_street && 
          data.owner_barangay && 
          data.owner_city_municipality && 
          data.owner_province && 
          data.owner_zip_code
        );
      }
      
      // Default check for other entity types
      return Object.values(data).some(value => 
        value !== undefined && 
        value !== null && 
        value !== ''
      );
    };

    // Determine data type based on properties
    let dataType = 'unknown';
    if ('business_name' in data && 'ownership_type' in data) {
      dataType = 'businessInfo';
    } else if ('surname' in data && 'given_name' in data) {
      dataType = 'ownerInfo';
    }
    
    const autoSaveTimeout = setTimeout(() => {
      if (hasUnsavedChanges() && checkRequiredFields(data, dataType)) {
        console.log(`Auto-saving data (${dataType}) because changes detected and required fields present`);
        saveData();
      }
    }, 1500);
    
    return () => clearTimeout(autoSaveTimeout);
  }, [data, applicationId, autoSaveEnabled, isInitialized, isSaving]);

  return {
    data,
    updateData,
    saveData,
    isLoading: isLoading || isSaving,
    isInitialized,
    hasUnsavedChanges
  };
}
