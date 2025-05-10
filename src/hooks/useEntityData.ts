
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
  const [saveError, setSaveError] = useState<Error | null>(null);

  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      if (!applicationId) {
        console.log("No applicationId provided, skipping data load");
        setIsInitialized(true);
        return;
      }
      
      setIsLoading(true);
      try {
        console.log(`Loading data for application ID: ${applicationId}`);
        const result = await fetchFn(applicationId);
        if (result) {
          console.log("Data loaded successfully:", result);
          setData(result);
          setLastSavedData(result);
        } else {
          console.log("No data found for this application ID");
        }
        setIsInitialized(true);
      } catch (error) {
        console.error("Error loading data:", error);
        setSaveError(error instanceof Error ? error : new Error(String(error)));
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

  // Save data manually - with EXPLICIT toast control
  const saveData = async (showToast = false) => {
    if (!applicationId) {
      console.error("Cannot save data: applicationId is null");
      if (showToast) {
        toast({
          title: "Save Failed",
          description: "Missing application ID. Please try again or contact support.",
          variant: "destructive",
        });
      }
      return null;
    }
    
    setIsSaving(true);
    setSaveError(null);
    try {
      console.log("Saving data:", { ...data, application_id: applicationId });
      const result = await saveFn({ ...data, application_id: applicationId } as T);
      
      if (result) {
        console.log("Data saved successfully:", result);
        setLastSavedData({ ...data });
        
        // ONLY show toast if explicitly requested with showToast=true parameter
        if (showToast === true) {
          console.log("useEntityData - Toast will be shown as explicitly requested");
          toast({
            title: "Data Saved",
            description: "Your information has been saved successfully.",
          });
        } else {
          console.log("useEntityData - No toast shown: autoSave=false or showToast=false");
        }
        
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      } else {
        console.error("Save result is null or undefined");
        if (showToast) {
          toast({
            title: "Save Incomplete",
            description: "Your data may not have been saved completely. Please try again.",
            variant: "destructive",
          });
        }
      }
      
      return result;
    } catch (error) {
      console.error("Error saving data:", error);
      setSaveError(error instanceof Error ? error : new Error(String(error)));
      
      // ONLY show error toast if explicitly requested with showToast=true parameter
      if (showToast === true) {
        console.log("useEntityData - Error toast will be shown as explicitly requested");
        toast({
          title: "Save Failed",
          description: "There was an error saving your information. Please ensure all required fields are filled.",
          variant: "destructive",
        });
      } else {
        console.log("useEntityData - No error toast shown: autoSave=false or showToast=false");
      }
      
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

  // Auto-save effect - with NO TOASTS
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
        console.log(`useEntityData - Auto-saving ${dataType} silently (showToast=false)`);
        // Auto-save silently without any toast notifications
        saveData(false); // Always pass false to ensure no toasts
      }
    }, 1500);
    
    return () => clearTimeout(autoSaveTimeout);
  }, [data, applicationId, autoSaveEnabled, isInitialized, isSaving]);

  return {
    data,
    updateData,
    saveData,
    isLoading: isLoading || isSaving,
    isSaving,
    isInitialized,
    hasUnsavedChanges,
    saveError
  };
}
