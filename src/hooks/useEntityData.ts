
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

// Generic hook for loading and saving entity data
export function useEntityData<T>(
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
    if (!applicationId) return;
    
    setIsSaving(true);
    try {
      const result = await saveFn({ ...data, application_id: applicationId } as T);
      
      toast({
        title: "Data Saved",
        description: "Your information has been saved successfully.",
      });
      
      if (onSaveSuccess) {
        onSaveSuccess();
      }
      
      return result;
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your information.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save effect
  useEffect(() => {
    if (!applicationId || !autoSaveEnabled || !isInitialized) return;
    
    const autoSaveTimeout = setTimeout(() => {
      if (!isSaving && checkRequiredFieldsPresent(data)) {
        saveData();
      }
    }, 1500);
    
    return () => clearTimeout(autoSaveTimeout);
  }, [data, applicationId, autoSaveEnabled, isInitialized]);

  return {
    data,
    updateData,
    saveData,
    isLoading: isLoading || isSaving,
    isInitialized
  };
}

// Helper function to check if required fields are present
// This is a simple implementation that checks if there are any values
function checkRequiredFieldsPresent(data: any): boolean {
  // Basic check to ensure there's at least some data
  // In a real implementation, you would validate specific required fields
  return Object.values(data).some(value => 
    value !== undefined && 
    value !== null && 
    value !== ''
  );
}
