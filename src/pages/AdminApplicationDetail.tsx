
import React from "react";
import { useParams, useLocation } from "react-router-dom";
import ApplicationDetails from "@/components/admin/ApplicationDetails";
import { useToast } from "@/hooks/use-toast";

const AdminApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { toast } = useToast();
  
  // Check if the ID is missing
  if (!id) {
    toast({
      variant: "destructive",
      title: "Missing Application ID",
      description: "No application ID was provided in the URL"
    });
  }
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {id && <ApplicationDetails applicationId={id} />}
    </div>
  );
};

export default AdminApplicationDetail;
