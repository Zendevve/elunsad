
import React from "react";
import { useParams } from "react-router-dom";
import ApplicationDetails from "@/components/admin/ApplicationDetails";
import { useQueryClient } from "@tanstack/react-query";

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
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {id && <ApplicationDetails applicationId={id} />}
    </div>
  );
};

export default AdminApplicationDetail;
