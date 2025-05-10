
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/utils/toastCompat";

interface EntityDataOptions<T> {
  tableName: string;
  entityId?: string | null;
  initialData?: T;
  selectQuery?: string;
}

function useEntityData<T>(options: EntityDataOptions<T>) {
  const { tableName, entityId, initialData, selectQuery = '*' } = options;
  const [data, setData] = useState<T | null>(initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!entityId) {
      setData(initialData || null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Use 'as any' to bypass the type checking for dynamic table names
        const { data: result, error } = await (supabase
          .from(tableName as any)
          .select(selectQuery)
          .eq('id', entityId)
          .single());

        if (error) {
          console.error(`Error fetching ${tableName} data:`, error);
          setError(error);
          toast({
            description: `Failed to fetch ${tableName} data.`
          });
        } else if (result) {
          setData(result as T);
        } else {
          setData(null);
        }
      } catch (err) {
        console.error(`Unexpected error fetching ${tableName} data:`, err);
        setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
        toast({
          description: `An unexpected error occurred while fetching ${tableName} data.`
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, entityId, selectQuery, initialData]);

  const updateData = async (newData: Partial<T>) => {
    setLoading(true);
    setError(null);

    try {
      // Use 'as any' to bypass the type checking for dynamic table names
      const { data: result, error } = await (supabase
        .from(tableName as any)
        .update(newData)
        .eq('id', entityId)
        .select(selectQuery)
        .single());

      if (error) {
        console.error(`Error updating ${tableName} data:`, error);
        setError(error);
        toast({
          description: `Failed to update ${tableName} data.`
        });
      } else if (result) {
        setData(result as T);
        toast({
          description: `Successfully updated ${tableName} data.`
        });
      } else {
        setData(null);
      }
    } catch (err) {
      console.error(`Unexpected error updating ${tableName} data:`, err);
      setError(err instanceof Error ? err : new Error('An unexpected error occurred'));
      toast({
        description: `An unexpected error occurred while updating ${tableName} data.`
      });
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, updateData };
}

export default useEntityData;
