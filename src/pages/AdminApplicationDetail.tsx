
import React from "react";
import { useParams } from "react-router-dom";
import ApplicationDetails from "@/components/admin/ApplicationDetails";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

const AdminApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  
  // Pre-fetch the applications list to ensure it's in the cache when returning
  React.useEffect(() => {
    // Prefetch main applications lists
    queryClient.prefetchQuery({
      queryKey: ['applications', 'all'],
      queryFn: () => Promise.resolve([])
    });
    queryClient.prefetchQuery({
      queryKey: ['applications', 'submitted'],
      queryFn: () => Promise.resolve([])
    });
  }, [queryClient]);
  
  if (!id) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Missing Application ID</h3>
          <p className="text-muted-foreground">No application ID was provided in the URL.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ApplicationDetails applicationId={id} />
    </div>
  );
};

export default AdminApplicationDetail;
